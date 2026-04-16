import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { createId } from "@/lib/utils/id";
import { selectNextSeed, scoreSeeds } from "@/lib/blog-agent/scoring";
import { findSeedById } from "@/lib/blog-agent/seeds";
import { generateDraft } from "@/lib/blog-agent/generate";
import { runQualityGates } from "@/lib/blog-agent/quality-gates";
import { getAllBlogIdentifiers } from "@/lib/blog-db";
import type { BlogPost } from "@/lib/content/types";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

export const maxDuration = 120;

/**
 * POST /api/admin/blog-agent/generate
 *
 * Body (optional): { seedId?: string, dryRun?: boolean }
 *
 * 1. Pick (or accept) a topic seed
 * 2. Score it vs. existing content
 * 3. If dryRun, return scoring only
 * 4. Otherwise: generate draft via Claude
 * 5. Run all 12 quality gates
 * 6. Save to blog_drafts as status=draft
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const forcedSeedId = typeof body.seedId === "string" ? body.seedId : null;
  const dryRun = body.dryRun === true;

  const { slugs, titles } = await getAllBlogIdentifiers();

  let selection: { seed: ReturnType<typeof findSeedById>; score: ReturnType<typeof scoreSeeds>[number] } | null = null;

  if (forcedSeedId) {
    const seed = findSeedById(forcedSeedId);
    if (!seed) {
      return NextResponse.json({ error: `Seed not found: ${forcedSeedId}` }, { status: 400 });
    }
    const allScores = scoreSeeds(slugs, titles);
    const score = allScores.find((s) => s.seedId === forcedSeedId);
    if (!score) {
      return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
    }
    selection = { seed, score };
  } else {
    selection = selectNextSeed(slugs, titles);
  }

  if (!selection?.seed) {
    return NextResponse.json(
      { error: "No viable topic seed. All seeds exhausted or deduped." },
      { status: 409 },
    );
  }

  // Dry run — return scoring only
  if (dryRun) {
    const allScores = scoreSeeds(slugs, titles).slice(0, 10);
    return NextResponse.json({
      selected: { seedId: selection.seed.id, score: selection.score },
      top10: allScores,
    });
  }

  // Generate draft
  let result;
  try {
    result = await generateDraft(selection.seed, selection.score);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[blog-agent] generation failed:", message);
    return NextResponse.json(
      { error: "Generation failed", message, seedId: selection.seed.id },
      { status: 500 },
    );
  }

  // Run quality gates
  const gateReport = runQualityGates(result.draft, slugs, titles, selection.seed.titleHint);

  // Build the full BlogPost object (agent output → ready-to-render post)
  const postData: BlogPost = {
    slug: result.draft.slug,
    category: result.draft.category,
    title: result.draft.title,
    description: result.draft.description,
    headline: result.draft.headline,
    subheadline: result.draft.subheadline,
    excerpt: result.draft.excerpt,
    heroImage: {
      // Placeholder — reviewer replaces with real Unsplash URL
      src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2400&auto=format&fit=crop",
      alt: result.draft.heroImage.alt,
      credit: "Unsplash",
      creditUrl: "https://unsplash.com",
    },
    pinterestImage: result.draft.pinterestImage
      ? {
          src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&h=1500&fit=crop",
          alt: result.draft.pinterestImage.alt,
        }
      : undefined,
    author: result.draft.author ?? { name: "The Journal" },
    tags: result.draft.tags,
    canonicalPath: `/blog/${result.draft.slug}`,
    schemaType: "BlogPosting",
    publishStatus: "draft",
    publishedAt: new Date().toISOString().split("T")[0],
    sections: result.draft.sections,
  };

  // Save to DB
  const db = getDb();
  const id = createId();
  await db.insert(blogDrafts).values({
    id,
    status: "draft",
    topicSeedId: selection.seed.id,
    topicTitle: result.draft.title,
    topicScore: selection.score as unknown as Record<string, unknown>,
    topicReason: selection.score.reason,
    postData: postData as unknown as Record<string, unknown>,
    qualityGates: gateReport as unknown as Record<string, unknown>,
    gatesPassed: gateReport.passed,
    gatesTotal: gateReport.total,
    model: result.model,
    tokenUsage: result.tokenUsage as unknown as Record<string, unknown>,
    estimatedCostCents: result.estimatedCostCents,
    durationMs: result.durationMs,
  });

  return NextResponse.json({
    id,
    slug: result.draft.slug,
    title: result.draft.title,
    seedId: selection.seed.id,
    score: selection.score,
    gates: {
      passed: gateReport.passed,
      total: gateReport.total,
      allPassed: gateReport.allPassed,
      results: gateReport.results,
    },
    cost: {
      cents: result.estimatedCostCents,
      tokens: result.tokenUsage,
      durationMs: result.durationMs,
    },
  });
}

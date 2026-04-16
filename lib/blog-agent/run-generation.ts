/**
 * Core blog-agent generation logic, shared between the manual admin
 * trigger and the scheduled cron job.
 *
 * Returns a structured result — callers decide how to format the response.
 * Does NOT publish anything. Every draft lands in `blog_drafts` as
 * status="draft" for manual review.
 */

import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { createId } from "@/lib/utils/id";
import { selectNextSeed, scoreSeeds } from "./scoring";
import { findSeedById } from "./seeds";
import { generateDraft } from "./generate";
import { resolveImages } from "./unsplash";
import { runQualityGates } from "./quality-gates";
import { getAllBlogIdentifiers } from "@/lib/blog-db";
import type { BlogPost } from "@/lib/content/types";

export interface GenerationRunResult {
  success: boolean;
  id?: string;
  slug?: string;
  title?: string;
  seedId?: string;
  gates?: { passed: number; total: number; allPassed: boolean };
  cost?: { cents: number; durationMs: number };
  error?: string;
  source: "manual" | "scheduled";
}

export async function runBlogGeneration(opts: {
  /** Force a specific seed — used by manual trigger. */
  seedId?: string;
  /** Tag in the draft's topicReason so admin can distinguish sources. */
  source: "manual" | "scheduled";
}): Promise<GenerationRunResult> {
  const { source } = opts;

  const { slugs, titles } = await getAllBlogIdentifiers();

  // ── Topic selection ─────────────────────────────────────────────────
  let selection: {
    seed: NonNullable<ReturnType<typeof findSeedById>>;
    score: ReturnType<typeof scoreSeeds>[number];
  } | null = null;

  if (opts.seedId) {
    const seed = findSeedById(opts.seedId);
    if (!seed) return { success: false, error: `Seed not found: ${opts.seedId}`, source };
    const scores = scoreSeeds(slugs, titles);
    const score = scores.find((s) => s.seedId === opts.seedId);
    if (!score) return { success: false, error: "Scoring failed", source };
    selection = { seed, score };
  } else {
    selection = selectNextSeed(slugs, titles);
  }

  if (!selection?.seed) {
    return { success: false, error: "No viable topic seed. All seeds exhausted or deduped.", source };
  }

  // ── Generation ──────────────────────────────────────────────────────
  let result;
  try {
    result = await generateDraft(selection.seed, selection.score);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[blog-agent][${source}] generation failed:`, message);
    return { success: false, error: message, seedId: selection.seed.id, source };
  }

  // ── Quality gates ───────────────────────────────────────────────────
  const gateReport = runQualityGates(result.draft, slugs, titles, selection.seed.titleHint);

  // ── Resolve images from Unsplash ──────────────────────────────────
  // Uses each section's suggestedSearchQuery to fetch a real photo.
  // Falls back to a curated default if UNSPLASH_ACCESS_KEY is not set.
  const images = await resolveImages({
    heroImage: result.draft.heroImage,
    pinterestImage: result.draft.pinterestImage,
    sections: result.draft.sections as unknown as Array<Record<string, unknown>>,
  });

  // ── Build BlogPost object ───────────────────────────────────────────
  const postData: BlogPost = {
    slug: result.draft.slug,
    category: result.draft.category,
    title: result.draft.title,
    description: result.draft.description,
    headline: result.draft.headline,
    subheadline: result.draft.subheadline,
    excerpt: result.draft.excerpt,
    heroImage: images.heroImage,
    pinterestImage: images.pinterestImage,
    author: result.draft.author ?? { name: "The Journal" },
    tags: result.draft.tags,
    canonicalPath: `/blog/${result.draft.slug}`,
    schemaType: "BlogPosting",
    publishStatus: "draft",
    publishedAt: new Date().toISOString().split("T")[0],
    sections: images.sections as unknown as BlogPost["sections"],
  };

  // ── Persist to review queue ─────────────────────────────────────────
  const db = getDb();
  const id = createId();
  const reasonPrefix = source === "scheduled" ? "[scheduled] " : "";

  await db.insert(blogDrafts).values({
    id,
    status: "draft",
    topicSeedId: selection.seed.id,
    topicTitle: result.draft.title,
    topicScore: selection.score as unknown as Record<string, unknown>,
    topicReason: reasonPrefix + selection.score.reason,
    postData: postData as unknown as Record<string, unknown>,
    qualityGates: gateReport as unknown as Record<string, unknown>,
    gatesPassed: gateReport.passed,
    gatesTotal: gateReport.total,
    model: result.model,
    tokenUsage: result.tokenUsage as unknown as Record<string, unknown>,
    estimatedCostCents: result.estimatedCostCents,
    durationMs: result.durationMs,
  });

  console.log(
    JSON.stringify({
      level: "info",
      msg: "blog-agent:draft_saved",
      source,
      id,
      slug: result.draft.slug,
      seedId: selection.seed.id,
      gatesPassed: gateReport.passed,
      gatesTotal: gateReport.total,
      costCents: result.estimatedCostCents,
    }),
  );

  return {
    success: true,
    id,
    slug: result.draft.slug,
    title: result.draft.title,
    seedId: selection.seed.id,
    gates: {
      passed: gateReport.passed,
      total: gateReport.total,
      allPassed: gateReport.allPassed,
    },
    cost: {
      cents: result.estimatedCostCents,
      durationMs: result.durationMs,
    },
    source,
  };
}

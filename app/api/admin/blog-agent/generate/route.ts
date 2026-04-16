import { NextRequest, NextResponse } from "next/server";
import { scoreSeeds, selectNextSeed } from "@/lib/blog-agent/scoring";
import { findSeedById } from "@/lib/blog-agent/seeds";
import { getAllBlogIdentifiers } from "@/lib/blog-db";
import { runBlogGeneration } from "@/lib/blog-agent/run-generation";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

export const maxDuration = 120;

/**
 * POST /api/admin/blog-agent/generate
 *
 * Body (optional): { seedId?: string, dryRun?: boolean }
 *
 * Manual trigger — same generation logic as the cron, but tagged
 * source="manual" so admin can distinguish. Does NOT publish.
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const forcedSeedId = typeof body.seedId === "string" ? body.seedId : null;
  const dryRun = body.dryRun === true;

  // Dry run — return scoring only
  if (dryRun) {
    const { slugs, titles } = await getAllBlogIdentifiers();
    const allScores = scoreSeeds(slugs, titles).slice(0, 10);
    const selection = forcedSeedId
      ? { seed: findSeedById(forcedSeedId), score: allScores.find((s) => s.seedId === forcedSeedId) }
      : selectNextSeed(slugs, titles);
    return NextResponse.json({
      selected: selection ? { seedId: selection.seed?.id, score: selection.score } : null,
      top10: allScores,
    });
  }

  const result = await runBlogGeneration({
    seedId: forcedSeedId ?? undefined,
    source: "manual",
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error, seedId: result.seedId },
      { status: result.error?.includes("No viable") ? 409 : 500 },
    );
  }

  return NextResponse.json(result);
}

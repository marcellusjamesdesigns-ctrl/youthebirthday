/**
 * Growth Operator — top-level daily-move orchestrator.
 *
 * Picks a move (traffic-page or blog) via chooseDailyMove(), then runs the
 * appropriate lane. Both lanes save drafts to the shared `blog_drafts`
 * table (with `kind` discriminating). Nothing auto-publishes — drafts land
 * as status="draft" for admin review.
 *
 * Called from /api/cron/blog-agent and /api/admin/blog-agent/generate.
 */
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { createId } from "@/lib/utils/id";
import { chooseDailyMove, summarizeSelection } from "./select-move";
import { runBlogGeneration, type GenerationRunResult } from "./run-generation";
import { generateTrafficDraft } from "./traffic-generate";
import { runTrafficQualityGates } from "./traffic-quality-gates";
import { findTrafficSeedById } from "./traffic-seeds";
import { getAllContentPages } from "@/lib/content/render";

export interface DailyMoveResult {
  success: boolean;
  kind: "blog" | "traffic-page" | "none";
  id?: string;
  slug?: string;
  title?: string;
  reason: string;
  gates?: { passed: number; total: number; allPassed: boolean };
  cost?: { cents: number; durationMs: number };
  error?: string;
  source: "manual" | "scheduled";
}

/**
 * Decide the next move, run the appropriate lane, save to drafts.
 * Pass `forceBlog: true` to skip traffic-page even if seeds are open.
 * Pass `forceTrafficSeedId` to force a specific traffic seed (for manual
 * admin-triggered runs).
 */
export async function runDailyMove(opts: {
  source: "manual" | "scheduled";
  forceBlog?: boolean;
  forceTrafficSeedId?: string;
}): Promise<DailyMoveResult> {
  const { source } = opts;

  // ── Forced traffic seed (manual override) ─────────────────────────
  if (opts.forceTrafficSeedId) {
    const seed = findTrafficSeedById(opts.forceTrafficSeedId);
    if (!seed) {
      return { success: false, kind: "none", reason: "forced-seed-not-found", error: `Traffic seed not found: ${opts.forceTrafficSeedId}`, source };
    }
    return runTrafficLane(seed, source, `forced:${opts.forceTrafficSeedId}`);
  }

  // ── Normal priority-stack selection ───────────────────────────────
  const move = await chooseDailyMove({ forceBlog: opts.forceBlog });
  console.log(JSON.stringify({ level: "info", msg: "growth-op:selected_move", summary: summarizeSelection(move), source }));

  if (move.kind === "none") {
    return { success: false, kind: "none", reason: move.reason, source };
  }

  if (move.kind === "traffic-page") {
    return runTrafficLane(move.seed, source, move.reason);
  }

  // move.kind === "blog"
  const blogResult = await runBlogGeneration({ source });
  return blogResultToDailyMove(blogResult);
}

// ─── Lanes ────────────────────────────────────────────────────────────

async function runTrafficLane(
  seed: Parameters<typeof runTrafficQualityGates>[1],
  source: "manual" | "scheduled",
  reason: string,
): Promise<DailyMoveResult> {
  let genResult;
  try {
    genResult = await generateTrafficDraft(seed);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[growth-op][${source}] traffic generation failed:`, message);
    return { success: false, kind: "traffic-page", reason, error: message, source };
  }

  // Existing static slugs in this category — used for uniqueness gate.
  const allStatic = getAllContentPages();
  const existingSlugsInCategory = new Set(
    allStatic.filter((p) => p.category === seed.category).map((p) => p.slug),
  );

  const gateReport = runTrafficQualityGates(genResult.page, seed, existingSlugsInCategory);

  const db = getDb();
  const id = createId();
  const reasonPrefix = source === "scheduled" ? "[scheduled] " : "";

  await db.insert(blogDrafts).values({
    id,
    status: "draft",
    kind: "traffic-page",
    targetCategory: seed.category,
    targetSlug: seed.slug,
    topicSeedId: seed.id,
    topicTitle: genResult.page.title,
    topicScore: { priority: seed.priority, kind: "traffic-page" } as unknown as Record<string, unknown>,
    topicReason: reasonPrefix + reason,
    postData: genResult.page as unknown as Record<string, unknown>,
    qualityGates: gateReport as unknown as Record<string, unknown>,
    gatesPassed: gateReport.passed,
    gatesTotal: gateReport.total,
    model: genResult.model,
    tokenUsage: genResult.tokenUsage as unknown as Record<string, unknown>,
    estimatedCostCents: genResult.estimatedCostCents,
    durationMs: genResult.durationMs,
  });

  console.log(JSON.stringify({
    level: "info",
    msg: "growth-op:traffic_draft_saved",
    source,
    id,
    slug: seed.slug,
    category: seed.category,
    seedId: seed.id,
    gatesPassed: gateReport.passed,
    gatesTotal: gateReport.total,
    costCents: genResult.estimatedCostCents,
  }));

  return {
    success: true,
    kind: "traffic-page",
    id,
    slug: seed.slug,
    title: genResult.page.title,
    reason,
    gates: { passed: gateReport.passed, total: gateReport.total, allPassed: gateReport.allPassed },
    cost: { cents: genResult.estimatedCostCents, durationMs: genResult.durationMs },
    source,
  };
}

function blogResultToDailyMove(r: GenerationRunResult): DailyMoveResult {
  return {
    success: r.success,
    kind: "blog",
    id: r.id,
    slug: r.slug,
    title: r.title,
    reason: r.seedId ? `blog:${r.seedId}` : "blog",
    gates: r.gates,
    cost: r.cost,
    error: r.error,
    source: r.source,
  };
}

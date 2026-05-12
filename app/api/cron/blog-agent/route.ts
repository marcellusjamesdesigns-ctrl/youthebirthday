import { NextRequest, NextResponse } from "next/server";
import { runDailyMove } from "@/lib/blog-agent/run-daily-move";
import { runCronGuard } from "@/lib/blog-agent/cron-guard";

export const maxDuration = 120;

/**
 * GET /api/cron/blog-agent — Growth Operator BLOG lane.
 *
 * Always generates a full blog post (forceBlog: true). Runs through the
 * same 15-gate quality system as the manual admin trigger, so cron
 * output scores like manual output. The traffic-pages lane runs on its
 * own cron at `/api/cron/traffic-pages`.
 *
 * Settings (Redis):
 *   - blog-agent:schedule:paused
 *   - blog-agent:schedule:min-hours-between-runs (default 48, blog-only cadence)
 *   - blog-agent:schedule:max-per-day (default 1)
 *
 * To pause / adjust:
 *   POST /api/admin/blog-agent/schedule { paused, maxPerDay, minHoursBetweenRuns }
 */
export async function GET(request: NextRequest) {
  const guard = await runCronGuard(request, {
    redisNamespace: "blog-agent:schedule",
    cadenceKinds: ["blog"],
    defaultMinHours: 48,
    defaultMaxPerDay: 1,
    laneLabel: "blog",
  });

  if (!guard.ok) {
    return NextResponse.json(guard.body, { status: guard.status });
  }

  // ── Run blog lane ─────────────────────────────────────────────────
  const result = await runDailyMove({ source: "scheduled", forceBlog: true });

  if (!result.success) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "growth-op:blog_cron_failed",
        kind: result.kind,
        error: result.error,
        reason: result.reason,
      }),
    );
    return NextResponse.json({
      success: false,
      error: result.error,
      reason: result.reason,
    });
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "growth-op:blog_cron_success",
      kind: result.kind,
      id: result.id,
      slug: result.slug,
      reason: result.reason,
      gates: result.gates,
      costCents: result.cost?.cents,
    }),
  );

  return NextResponse.json(result);
}

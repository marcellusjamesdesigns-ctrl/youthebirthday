import { NextRequest, NextResponse } from "next/server";
import { chooseDailyMove } from "@/lib/blog-agent/select-move";
import { runDailyMove } from "@/lib/blog-agent/run-daily-move";
import { runCronGuard } from "@/lib/blog-agent/cron-guard";

export const maxDuration = 120;

/**
 * GET /api/cron/traffic-pages — Growth Operator TRAFFIC-PAGE lane.
 *
 * Generates a hub-category content page when there's an open traffic
 * seed. If all traffic seeds are filled, this lane skips silently
 * (the blog lane handles topic-driven content separately).
 *
 * Splitting the lanes lets you tune blog cadence and traffic-page
 * cadence independently, and means the blog cron always runs through
 * the 15-gate blog system instead of getting redirected to the
 * 9-gate traffic-page system.
 *
 * Settings (Redis, scoped to this lane):
 *   - traffic-agent:schedule:paused
 *   - traffic-agent:schedule:min-hours-between-runs (default 48)
 *   - traffic-agent:schedule:max-per-day (default 1)
 */
export async function GET(request: NextRequest) {
  const guard = await runCronGuard(request, {
    redisNamespace: "traffic-agent:schedule",
    cadenceKinds: ["traffic-page"],
    defaultMinHours: 48,
    defaultMaxPerDay: 1,
    laneLabel: "traffic",
  });

  if (!guard.ok) {
    return NextResponse.json(guard.body, { status: guard.status });
  }

  // ── Verify there's actually a traffic seed open ───────────────────
  // We peek via chooseDailyMove without forceBlog. If it returns "blog"
  // it means there are no open traffic seeds — skip this run rather
  // than fall through to the blog lane (the blog cron handles that).
  const move = await chooseDailyMove();
  if (move.kind !== "traffic-page") {
    console.log(
      JSON.stringify({
        level: "info",
        msg: "growth-op:traffic_cron_skipped",
        reason: "no_open_traffic_seeds",
        nextChoice: move.kind,
        choiceReason: move.reason,
      }),
    );
    return NextResponse.json({
      skipped: true,
      reason: "no_open_traffic_seeds",
      nextChoice: move.kind,
    });
  }

  // ── Run traffic lane ──────────────────────────────────────────────
  // runDailyMove will re-run chooseDailyMove internally; small redundant
  // cost but keeps the orchestration logic in one place.
  const result = await runDailyMove({ source: "scheduled" });

  if (!result.success) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "growth-op:traffic_cron_failed",
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

  // Belt-and-suspenders: if a race condition swapped the lane between
  // our peek and the actual run, log it. Output is still valid.
  if (result.kind !== "traffic-page") {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "growth-op:traffic_cron_lane_swap",
        expectedKind: "traffic-page",
        actualKind: result.kind,
        id: result.id,
      }),
    );
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "growth-op:traffic_cron_success",
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

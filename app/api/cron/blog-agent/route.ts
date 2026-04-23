import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { runDailyMove } from "@/lib/blog-agent/run-daily-move";

export const maxDuration = 120;

/**
 * GET /api/cron/blog-agent — Growth Operator daily run.
 *
 * Picks the highest-priority content move (traffic-page gap or blog),
 * generates a draft, saves to the review queue. NEVER auto-publishes.
 *
 * Guardrails (in order):
 *   1. Auth: Bearer CRON_SECRET
 *   2. Paused? (Redis `blog-agent:schedule:paused`) → skip
 *   3. Cadence gate: min hours since last draft (Redis
 *      `blog-agent:schedule:min-hours-between-runs`, default 48) → skip if
 *      we generated anything more recently than that.
 *   4. Daily limit (Redis `blog-agent:schedule:max-per-day`, default 1) → skip
 *   5. runDailyMove() — picks lane + saves draft
 *   6. On failure: log + return 200 (no retry storms)
 *
 * To pause / adjust:
 *   POST /api/admin/blog-agent/schedule { paused, maxPerDay, minHoursBetweenRuns }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();

  // ── Pause check ───────────────────────────────────────────────────
  const paused = await redis.get("blog-agent:schedule:paused");
  if (paused === true || paused === "true" || paused === 1 || paused === "1") {
    console.log(JSON.stringify({ level: "info", msg: "growth-op:cron_skipped", reason: "paused" }));
    return NextResponse.json({ skipped: true, reason: "paused" });
  }

  // ── Cadence gate ──────────────────────────────────────────────────
  // Default 48h. Set Redis `blog-agent:schedule:min-hours-between-runs` to
  // tune. Compared against the most recent draft's createdAt, regardless
  // of kind. Caps publishing velocity while a new domain earns crawl auth.
  const minHoursRaw = await redis.get<number>("blog-agent:schedule:min-hours-between-runs");
  const minHours = typeof minHoursRaw === "number" && minHoursRaw >= 0 ? minHoursRaw : 48;

  const db = getDb();
  const [latest] = await db
    .select({ createdAt: blogDrafts.createdAt })
    .from(blogDrafts)
    .orderBy(sql`${blogDrafts.createdAt} desc`)
    .limit(1);

  if (latest && minHours > 0) {
    const hoursSince = (Date.now() - latest.createdAt.getTime()) / 3_600_000;
    if (hoursSince < minHours) {
      console.log(
        JSON.stringify({
          level: "info",
          msg: "growth-op:cron_skipped",
          reason: "cadence_gate",
          hoursSince: Number(hoursSince.toFixed(2)),
          minHours,
        }),
      );
      return NextResponse.json({
        skipped: true,
        reason: "cadence_gate",
        hoursSinceLastDraft: Number(hoursSince.toFixed(2)),
        minHoursBetweenRuns: minHours,
      });
    }
  }

  // ── Daily limit (kept for belt-and-suspenders with the cadence gate) ──
  const maxPerDayRaw = await redis.get<number>("blog-agent:schedule:max-per-day");
  const maxPerDay = typeof maxPerDayRaw === "number" ? maxPerDayRaw : 1;

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [{ count: todayCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogDrafts)
    .where(sql`${blogDrafts.createdAt} >= ${todayStart}`);

  if (todayCount >= maxPerDay) {
    console.log(
      JSON.stringify({
        level: "info",
        msg: "growth-op:cron_skipped",
        reason: "daily_limit",
        todayCount,
        maxPerDay,
      }),
    );
    return NextResponse.json({ skipped: true, reason: "daily_limit", todayCount, maxPerDay });
  }

  // ── Run ───────────────────────────────────────────────────────────
  const result = await runDailyMove({ source: "scheduled" });

  if (!result.success) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "growth-op:cron_failed",
        kind: result.kind,
        error: result.error,
        reason: result.reason,
      }),
    );
    return NextResponse.json({ success: false, error: result.error, reason: result.reason });
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "growth-op:cron_success",
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

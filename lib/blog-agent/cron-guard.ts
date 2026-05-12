/**
 * Shared cron guard for the Growth Operator lanes.
 *
 * Originally inlined inside `/api/cron/blog-agent`. Extracted so that
 * the blog lane and the traffic-pages lane can each run on independent
 * schedules with their own pause / cadence / daily-limit settings, all
 * scoped under a Redis-key namespace.
 *
 * Cadence comparison uses the most recent `blog_drafts` row whose
 * `kind` is in `cadenceKinds`. That way the blog lane only counts
 * blog drafts toward its cadence (it doesn't get throttled when the
 * traffic lane just ran), and vice versa.
 */
import { NextRequest } from "next/server";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { sql, inArray } from "drizzle-orm";

export type DraftKind = "blog" | "traffic-page";

export interface CronGuardSkip {
  ok: false;
  status: number;
  body: Record<string, unknown>;
}

export interface CronGuardPass {
  ok: true;
}

export type CronGuardResult = CronGuardSkip | CronGuardPass;

interface GuardOpts {
  /**
   * Redis key prefix. The blog lane uses `blog-agent:schedule` (existing
   * keys, preserved for backward compatibility). The traffic lane uses
   * `traffic-agent:schedule`.
   */
  redisNamespace: string;
  /**
   * Which draft kinds count toward this lane's cadence. The blog lane
   * passes `["blog"]`; the traffic lane passes `["traffic-page"]`.
   */
  cadenceKinds: DraftKind[];
  /** Default min hours between runs of THIS lane if Redis has no override. */
  defaultMinHours: number;
  /** Default max per day for THIS lane. */
  defaultMaxPerDay: number;
  /** Lane label, used in log messages. */
  laneLabel: string;
}

/**
 * Run auth + pause + cadence + daily-limit checks. Caller forwards the
 * `Authorization: Bearer CRON_SECRET` header; this helper validates it.
 */
export async function runCronGuard(
  request: NextRequest,
  opts: GuardOpts,
): Promise<CronGuardResult> {
  // ── Auth ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return { ok: false, status: 401, body: { error: "Unauthorized" } };
  }

  const redis = getRedis();
  const db = getDb();

  // ── Pause check ───────────────────────────────────────────────────
  const paused = await redis.get(`${opts.redisNamespace}:paused`);
  if (paused === true || paused === "true" || paused === 1 || paused === "1") {
    console.log(
      JSON.stringify({
        level: "info",
        msg: `growth-op:${opts.laneLabel}_cron_skipped`,
        reason: "paused",
      }),
    );
    return { ok: false, status: 200, body: { skipped: true, reason: "paused" } };
  }

  // ── Cadence gate (lane-scoped) ────────────────────────────────────
  const minHoursRaw = await redis.get<number>(
    `${opts.redisNamespace}:min-hours-between-runs`,
  );
  const minHours =
    typeof minHoursRaw === "number" && minHoursRaw >= 0
      ? minHoursRaw
      : opts.defaultMinHours;

  const [latest] = await db
    .select({ createdAt: blogDrafts.createdAt })
    .from(blogDrafts)
    .where(inArray(blogDrafts.kind, opts.cadenceKinds))
    .orderBy(sql`${blogDrafts.createdAt} desc`)
    .limit(1);

  if (latest && minHours > 0) {
    const hoursSince = (Date.now() - latest.createdAt.getTime()) / 3_600_000;
    if (hoursSince < minHours) {
      console.log(
        JSON.stringify({
          level: "info",
          msg: `growth-op:${opts.laneLabel}_cron_skipped`,
          reason: "cadence_gate",
          hoursSince: Number(hoursSince.toFixed(2)),
          minHours,
        }),
      );
      return {
        ok: false,
        status: 200,
        body: {
          skipped: true,
          reason: "cadence_gate",
          hoursSinceLastDraft: Number(hoursSince.toFixed(2)),
          minHoursBetweenRuns: minHours,
        },
      };
    }
  }

  // ── Daily limit (lane-scoped) ─────────────────────────────────────
  const maxPerDayRaw = await redis.get<number>(
    `${opts.redisNamespace}:max-per-day`,
  );
  const maxPerDay =
    typeof maxPerDayRaw === "number" ? maxPerDayRaw : opts.defaultMaxPerDay;

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [{ count: todayCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogDrafts)
    .where(
      sql`${blogDrafts.createdAt} >= ${todayStart} AND ${blogDrafts.kind} = ANY(${opts.cadenceKinds})`,
    );

  if (todayCount >= maxPerDay) {
    console.log(
      JSON.stringify({
        level: "info",
        msg: `growth-op:${opts.laneLabel}_cron_skipped`,
        reason: "daily_limit",
        todayCount,
        maxPerDay,
      }),
    );
    return {
      ok: false,
      status: 200,
      body: {
        skipped: true,
        reason: "daily_limit",
        todayCount,
        maxPerDay,
      },
    };
  }

  return { ok: true };
}

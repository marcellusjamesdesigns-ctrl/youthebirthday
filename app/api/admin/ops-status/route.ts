import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

/**
 * GET /api/admin/ops-status
 *
 * Read-only status for the Automation panel on /admin:
 *   - Ops Watcher last-run summary (from Redis `ops-watcher:last-run`)
 *   - Growth Operator schedule + cadence countdown
 *   - Draft counts by kind/status
 *   - 10 most recent drafts across all lanes
 *
 * Safe for the dashboard to poll every ~30s — all reads, tiny payload.
 */
export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  const db = getDb();

  // ── Ops Watcher: last run ─────────────────────────────────────────
  let lastRun:
    | {
        ranAt: string;
        durationMs: number;
        totalChecks: number;
        passed: number;
        warnings: number;
        errors: number;
        errorList: Array<{ check: string; details: string }>;
        warningList: Array<{ check: string; details: string }>;
      }
    | null = null;

  try {
    const raw = await redis.get("ops-watcher:last-run");
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      lastRun = parsed?.summary ?? null;
    } else if (raw && typeof raw === "object") {
      // Upstash may auto-deserialize JSON
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lastRun = (raw as any)?.summary ?? null;
    }
  } catch {
    lastRun = null;
  }

  const hoursSinceOpsRun =
    lastRun?.ranAt
      ? Number(((Date.now() - new Date(lastRun.ranAt).getTime()) / 3_600_000).toFixed(2))
      : null;

  // ── Growth Operator: schedule ─────────────────────────────────────
  const [pausedRaw, maxPerDayRaw, minHoursRaw] = await Promise.all([
    redis.get("blog-agent:schedule:paused"),
    redis.get<number>("blog-agent:schedule:max-per-day"),
    redis.get<number>("blog-agent:schedule:min-hours-between-runs"),
  ]);

  const paused =
    pausedRaw === true ||
    pausedRaw === "true" ||
    pausedRaw === 1 ||
    pausedRaw === "1";
  const maxPerDay = typeof maxPerDayRaw === "number" ? maxPerDayRaw : 1;
  const minHoursBetweenRuns =
    typeof minHoursRaw === "number" && minHoursRaw >= 0 ? minHoursRaw : 48;

  // ── Growth Operator: cadence countdown ───────────────────────────
  const [latest] = await db
    .select({ createdAt: blogDrafts.createdAt })
    .from(blogDrafts)
    .orderBy(desc(blogDrafts.createdAt))
    .limit(1);

  let hoursSinceLastDraft: number | null = null;
  let nextEligibleAt: string | null = null;
  if (latest?.createdAt) {
    const ms = Date.now() - latest.createdAt.getTime();
    hoursSinceLastDraft = Number((ms / 3_600_000).toFixed(2));
    if (minHoursBetweenRuns > 0) {
      const nextMs = latest.createdAt.getTime() + minHoursBetweenRuns * 3_600_000;
      nextEligibleAt = new Date(nextMs).toISOString();
    }
  }

  // ── Today's draft count (kept for parity with /schedule) ─────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [{ count: todayCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogDrafts)
    .where(sql`${blogDrafts.createdAt} >= ${todayStart}`);

  // ── Draft counts: by kind and by status ──────────────────────────
  const kindRows = await db
    .select({
      kind: blogDrafts.kind,
      status: blogDrafts.status,
      count: sql<number>`count(*)::int`,
    })
    .from(blogDrafts)
    .groupBy(blogDrafts.kind, blogDrafts.status);

  const byKind: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byKindStatus: Record<string, Record<string, number>> = {};
  for (const row of kindRows) {
    const k = row.kind ?? "blog";
    const s = row.status;
    byKind[k] = (byKind[k] ?? 0) + row.count;
    byStatus[s] = (byStatus[s] ?? 0) + row.count;
    byKindStatus[k] ??= {};
    byKindStatus[k][s] = row.count;
  }

  // ── Recent drafts (10, all lanes) ────────────────────────────────
  const recentDrafts = await db
    .select({
      id: blogDrafts.id,
      kind: blogDrafts.kind,
      status: blogDrafts.status,
      title: blogDrafts.topicTitle,
      targetCategory: blogDrafts.targetCategory,
      targetSlug: blogDrafts.targetSlug,
      reason: blogDrafts.topicReason,
      gatesPassed: blogDrafts.gatesPassed,
      gatesTotal: blogDrafts.gatesTotal,
      costCents: blogDrafts.estimatedCostCents,
      createdAt: blogDrafts.createdAt,
    })
    .from(blogDrafts)
    .orderBy(desc(blogDrafts.createdAt))
    .limit(10);

  return NextResponse.json({
    opsWatcher: {
      lastRun,
      hoursSinceLastRun: hoursSinceOpsRun,
      cronExpression: "0 15 * * *",
      cronDescription: "Every day at 3:00 PM UTC",
    },
    growthOp: {
      schedule: {
        paused,
        maxPerDay,
        minHoursBetweenRuns,
        todayCount,
        remainingToday: Math.max(0, maxPerDay - todayCount),
        cronExpression: "0 14 * * 1-5",
        cronDescription: "Weekdays at 2:00 PM UTC (9:00 AM EST)",
      },
      lastDraftAt: latest?.createdAt?.toISOString() ?? null,
      hoursSinceLastDraft,
      nextEligibleAt,
      cadenceGateOpen:
        hoursSinceLastDraft === null || hoursSinceLastDraft >= minHoursBetweenRuns,
      draftCounts: { byKind, byStatus, byKindStatus },
      recentDrafts,
    },
  });
}

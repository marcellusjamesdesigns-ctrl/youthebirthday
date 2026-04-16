import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

/**
 * GET /api/admin/blog-agent/schedule
 *
 * Returns the current schedule configuration + recent generation history.
 * Used by the admin dashboard to show schedule status.
 */
export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();

  const [pausedRaw, maxPerDayRaw] = await Promise.all([
    redis.get("blog-agent:schedule:paused"),
    redis.get<number>("blog-agent:schedule:max-per-day"),
  ]);

  const paused =
    pausedRaw === true ||
    pausedRaw === "true" ||
    pausedRaw === 1 ||
    pausedRaw === "1";
  const maxPerDay = typeof maxPerDayRaw === "number" ? maxPerDayRaw : 1;

  // Today's draft count
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const db = getDb();

  const [{ count: todayCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogDrafts)
    .where(sql`${blogDrafts.createdAt} >= ${todayStart}`);

  // Last 10 drafts (any source) for recent history
  const recentDrafts = await db
    .select({
      id: blogDrafts.id,
      status: blogDrafts.status,
      title: blogDrafts.topicTitle,
      seedId: blogDrafts.topicSeedId,
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
    schedule: {
      paused,
      maxPerDay,
      todayCount,
      remainingToday: Math.max(0, maxPerDay - todayCount),
      cronExpression: "0 14 * * 1-5",
      cronDescription: "Weekdays at 2:00 PM UTC (9:00 AM EST)",
    },
    recentDrafts,
  });
}

/**
 * POST /api/admin/blog-agent/schedule
 *
 * Update schedule configuration.
 *
 * Body: { paused?: boolean, maxPerDay?: number }
 *
 * Examples:
 *   Pause:          { "paused": true }
 *   Resume:         { "paused": false }
 *   Change cadence: { "maxPerDay": 2 }
 *   Both:           { "paused": false, "maxPerDay": 1 }
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const redis = getRedis();
  const changes: string[] = [];

  if (typeof body.paused === "boolean") {
    if (body.paused) {
      await redis.set("blog-agent:schedule:paused", "true");
      changes.push("schedule paused");
    } else {
      await redis.del("blog-agent:schedule:paused");
      changes.push("schedule resumed");
    }
  }

  if (typeof body.maxPerDay === "number" && body.maxPerDay >= 0) {
    await redis.set("blog-agent:schedule:max-per-day", body.maxPerDay);
    changes.push(`maxPerDay set to ${body.maxPerDay}`);
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "blog-agent:schedule_updated",
      changes,
    }),
  );

  return NextResponse.json({ updated: true, changes });
}

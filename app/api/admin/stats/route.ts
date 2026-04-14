import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations, userWaitlist } from "@/lib/db/schema";
import { sql, eq, count, avg, sum, desc } from "drizzle-orm";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "ytb-admin-2026";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();

  // Run all queries in parallel
  const [
    totalSessions,
    totalGenerations,
    completedGenerations,
    errorGenerations,
    totalUsers,
    premiumUsers,
    avgCostResult,
    totalCostResult,
    recentSessions,
    dailyVolume,
    modeBreakdown,
    vibeBreakdown,
  ] = await Promise.all([
    // Total sessions
    db.select({ count: count() }).from(birthdaySessions),

    // Total generations
    db.select({ count: count() }).from(birthdayGenerations),

    // Completed generations
    db
      .select({ count: count() })
      .from(birthdayGenerations)
      .where(eq(birthdayGenerations.status, "complete")),

    // Error generations
    db
      .select({ count: count() })
      .from(birthdayGenerations)
      .where(eq(birthdayGenerations.status, "error")),

    // Total users (email captures)
    db.select({ count: count() }).from(userWaitlist),

    // Premium users
    db
      .select({ count: count() })
      .from(userWaitlist)
      .where(eq(userWaitlist.tier, "premium")),

    // Average cost per generation (cents)
    db
      .select({ avg: avg(birthdayGenerations.estimatedCostCents) })
      .from(birthdayGenerations)
      .where(eq(birthdayGenerations.status, "complete")),

    // Total cost (cents)
    db
      .select({ total: sum(birthdayGenerations.estimatedCostCents) })
      .from(birthdayGenerations)
      .where(eq(birthdayGenerations.status, "complete")),

    // Recent 10 sessions
    db
      .select({
        id: birthdaySessions.id,
        name: birthdaySessions.name,
        city: birthdaySessions.currentCity,
        vibe: birthdaySessions.celebrationVibe,
        mode: birthdaySessions.mode,
        status: birthdaySessions.status,
        createdAt: birthdaySessions.createdAt,
      })
      .from(birthdaySessions)
      .orderBy(desc(birthdaySessions.createdAt))
      .limit(10),

    // Daily volume (last 14 days)
    db.execute(sql`
      SELECT
        DATE(created_at) as day,
        COUNT(*) as sessions
      FROM birthday_sessions
      WHERE created_at > NOW() - INTERVAL '14 days'
      GROUP BY DATE(created_at)
      ORDER BY day DESC
    `),

    // Mode breakdown
    db
      .select({
        mode: birthdaySessions.mode,
        count: count(),
      })
      .from(birthdaySessions)
      .groupBy(birthdaySessions.mode),

    // Vibe breakdown (top 10)
    db
      .select({
        vibe: birthdaySessions.celebrationVibe,
        count: count(),
      })
      .from(birthdaySessions)
      .groupBy(birthdaySessions.celebrationVibe)
      .orderBy(desc(count()))
      .limit(10),
  ]);

  const stats = {
    overview: {
      totalSessions: totalSessions[0]?.count ?? 0,
      totalGenerations: totalGenerations[0]?.count ?? 0,
      completedGenerations: completedGenerations[0]?.count ?? 0,
      errorGenerations: errorGenerations[0]?.count ?? 0,
      completionRate:
        totalGenerations[0]?.count
          ? ((completedGenerations[0]?.count ?? 0) /
              (totalGenerations[0]?.count ?? 1)) *
            100
          : 0,
    },
    users: {
      totalEmailCaptures: totalUsers[0]?.count ?? 0,
      premiumUsers: premiumUsers[0]?.count ?? 0,
      conversionRate:
        totalUsers[0]?.count
          ? ((premiumUsers[0]?.count ?? 0) / (totalUsers[0]?.count ?? 1)) * 100
          : 0,
    },
    economics: {
      avgCostPerGenerationCents: Number(avgCostResult[0]?.avg ?? 0),
      totalCostCents: Number(totalCostResult[0]?.total ?? 0),
      totalCostDollars: (Number(totalCostResult[0]?.total ?? 0) / 100).toFixed(2),
    },
    recentSessions,
    dailyVolume,
    modeBreakdown,
    vibeBreakdown,
  };

  return NextResponse.json(stats);
}

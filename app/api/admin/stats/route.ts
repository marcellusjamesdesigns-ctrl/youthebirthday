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
    costLast24h,
    costLast7d,
  ] = await Promise.all([
    db.select({ count: count() }).from(birthdaySessions),
    db.select({ count: count() }).from(birthdayGenerations),
    db.select({ count: count() }).from(birthdayGenerations).where(eq(birthdayGenerations.status, "complete")),
    db.select({ count: count() }).from(birthdayGenerations).where(eq(birthdayGenerations.status, "error")),
    db.select({ count: count() }).from(userWaitlist),
    db.select({ count: count() }).from(userWaitlist).where(eq(userWaitlist.tier, "premium")),
    db.select({ avg: avg(birthdayGenerations.estimatedCostCents) }).from(birthdayGenerations).where(eq(birthdayGenerations.status, "complete")),
    db.select({ total: sum(birthdayGenerations.estimatedCostCents) }).from(birthdayGenerations).where(eq(birthdayGenerations.status, "complete")),
    db.select({
      id: birthdaySessions.id, name: birthdaySessions.name, city: birthdaySessions.currentCity,
      vibe: birthdaySessions.celebrationVibe, mode: birthdaySessions.mode,
      status: birthdaySessions.status, createdAt: birthdaySessions.createdAt,
    }).from(birthdaySessions).orderBy(desc(birthdaySessions.createdAt)).limit(10),
    db.execute(sql`
      SELECT DATE(created_at) as day, COUNT(*) as sessions
      FROM birthday_sessions WHERE created_at > NOW() - INTERVAL '14 days'
      GROUP BY DATE(created_at) ORDER BY day DESC
    `),
    db.select({ mode: birthdaySessions.mode, count: count() }).from(birthdaySessions).groupBy(birthdaySessions.mode),
    db.select({ vibe: birthdaySessions.celebrationVibe, count: count() }).from(birthdaySessions).groupBy(birthdaySessions.celebrationVibe).orderBy(desc(count())).limit(10),
    db.execute(sql`
      SELECT COALESCE(SUM(estimated_cost_cents), 0) as cost_cents, COUNT(*) as gen_count
      FROM birthday_generations WHERE created_at > NOW() - INTERVAL '24 hours' AND status = 'complete'
    `),
    db.execute(sql`
      SELECT COALESCE(SUM(estimated_cost_cents), 0) as cost_cents, COUNT(*) as gen_count
      FROM birthday_generations WHERE created_at > NOW() - INTERVAL '7 days' AND status = 'complete'
    `),
  ]);

  const totalCostCents = Number(totalCostResult[0]?.total ?? 0);
  const cost24hCents = Number((costLast24h as any)?.[0]?.cost_cents ?? 0);
  const cost7dCents = Number((costLast7d as any)?.[0]?.cost_cents ?? 0);
  const dailyAvgCents = cost7dCents / 7;

  const errorRate = totalGenerations[0]?.count
    ? ((errorGenerations[0]?.count ?? 0) / (totalGenerations[0]?.count ?? 1)) * 100
    : 0;

  const warnings: string[] = [];
  if (cost24hCents > 500) warnings.push(`AI spend last 24h: $${(cost24hCents / 100).toFixed(2)} — check Anthropic balance`);
  if (dailyAvgCents > 300) warnings.push(`Avg daily AI cost: $${(dailyAvgCents / 100).toFixed(2)} — projected $${((dailyAvgCents * 30) / 100).toFixed(2)}/month`);
  if (errorRate > 20) warnings.push(`Error rate is ${errorRate.toFixed(0)}% — check AI pipeline logs`);

  return NextResponse.json({
    overview: {
      totalSessions: totalSessions[0]?.count ?? 0,
      totalGenerations: totalGenerations[0]?.count ?? 0,
      completedGenerations: completedGenerations[0]?.count ?? 0,
      errorGenerations: errorGenerations[0]?.count ?? 0,
      completionRate: totalGenerations[0]?.count
        ? ((completedGenerations[0]?.count ?? 0) / (totalGenerations[0]?.count ?? 1)) * 100
        : 0,
    },
    users: {
      totalEmailCaptures: totalUsers[0]?.count ?? 0,
      premiumUsers: premiumUsers[0]?.count ?? 0,
      conversionRate: totalUsers[0]?.count
        ? ((premiumUsers[0]?.count ?? 0) / (totalUsers[0]?.count ?? 1)) * 100
        : 0,
    },
    economics: {
      avgCostPerGenerationCents: Number(avgCostResult[0]?.avg ?? 0),
      totalCostCents,
      totalCostDollars: (totalCostCents / 100).toFixed(2),
      cost24hCents,
      cost24hDollars: (cost24hCents / 100).toFixed(2),
      cost7dCents,
      cost7dDollars: (cost7dCents / 100).toFixed(2),
      projectedMonthlyCostDollars: ((dailyAvgCents * 30) / 100).toFixed(2),
    },
    services: [
      { name: "Anthropic (Claude AI)", note: "Check console.anthropic.com for balance", critical: true },
      { name: "Neon Postgres", note: "Vercel Marketplace — auto-billed", critical: true },
      { name: "Upstash Redis", note: "Vercel Marketplace — auto-billed", critical: true },
      { name: "Stripe", note: "Takes % of revenue — no prepaid balance needed", critical: false },
      { name: "Resend (Email)", note: "100 free emails/day — check resend.com/overview", critical: false },
      { name: "PostHog", note: "1M events free/mo — check us.posthog.com", critical: false },
      { name: "Vercel (Hosting)", note: "Check vercel.com/usage for bandwidth", critical: true },
      { name: "Google AdSense", note: "Google pays you — check adsense.google.com", critical: false },
    ],
    warnings,
    recentSessions,
    dailyVolume,
    modeBreakdown,
    vibeBreakdown,
  });
}

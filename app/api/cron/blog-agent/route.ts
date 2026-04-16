import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { runBlogGeneration } from "@/lib/blog-agent/run-generation";

export const maxDuration = 120;

/**
 * GET /api/cron/blog-agent
 *
 * Called by Vercel Cron on a daily schedule. Generates ONE draft and
 * saves it to the review queue. NEVER publishes.
 *
 * Guardrails:
 *   1. Authenticated via CRON_SECRET (Vercel auto-sets this)
 *   2. Checks Redis `blog-agent:schedule:paused` — skip if paused
 *   3. Checks Redis `blog-agent:schedule:max-per-day` (default 1)
 *   4. Counts today's drafts — skip if at limit
 *   5. On failure: logs clearly, returns 200 (so Vercel doesn't retry endlessly)
 *
 * To pause:   POST /api/admin/blog-agent/schedule { "paused": true }
 * To resume:  POST /api/admin/blog-agent/schedule { "paused": false }
 * To change:  POST /api/admin/blog-agent/schedule { "maxPerDay": 2 }
 */
export async function GET(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();

  // ── Pause check ───────────────────────────────────────────────────
  const paused = await redis.get("blog-agent:schedule:paused");
  if (paused === true || paused === "true" || paused === 1 || paused === "1") {
    console.log(
      JSON.stringify({ level: "info", msg: "blog-agent:cron_skipped", reason: "paused" }),
    );
    return NextResponse.json({ skipped: true, reason: "paused" });
  }

  // ── Daily limit check ─────────────────────────────────────────────
  const maxPerDayRaw = await redis.get<number>("blog-agent:schedule:max-per-day");
  const maxPerDay = typeof maxPerDayRaw === "number" ? maxPerDayRaw : 1;

  const db = getDb();
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
        msg: "blog-agent:cron_skipped",
        reason: "daily_limit",
        todayCount,
        maxPerDay,
      }),
    );
    return NextResponse.json({
      skipped: true,
      reason: "daily_limit",
      todayCount,
      maxPerDay,
    });
  }

  // ── Generate ──────────────────────────────────────────────────────
  const result = await runBlogGeneration({ source: "scheduled" });

  if (!result.success) {
    // Return 200 even on failure — Vercel retries non-200 cron responses,
    // and we don't want duplicate generation attempts. The failure is
    // logged for admin visibility.
    console.error(
      JSON.stringify({
        level: "error",
        msg: "blog-agent:cron_failed",
        error: result.error,
        seedId: result.seedId,
      }),
    );
    return NextResponse.json({ success: false, error: result.error });
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "blog-agent:cron_success",
      id: result.id,
      slug: result.slug,
      seedId: result.seedId,
      gates: result.gates,
      costCents: result.cost?.cents,
    }),
  );

  return NextResponse.json(result);
}

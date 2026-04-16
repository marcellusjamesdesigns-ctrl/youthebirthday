import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { isPremiumFlag } from "@/lib/limits/generation-limits";

const PREMIUM_REDIS_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * GET /api/user/tier
 *
 * Resolves the caller's tier using the same fallback chain as
 * generation-limits.ts:
 *   Redis(device) → Redis(ip) → DB(user_waitlist by deviceToken or ipHash)
 *
 * This is deliberately redundant with checkGenerationLimit() so the UI
 * and the generation route can never disagree on "is this user paid?"
 */
export async function GET(request: NextRequest) {
  const deviceToken = request.headers.get("x-device-token");

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  const redis = getRedis();

  if (deviceToken) {
    const hit = await redis.get(`gen:device:${deviceToken}:premium`);
    if (isPremiumFlag(hit)) return NextResponse.json({ tier: "premium" });
  }

  const ipHit = await redis.get(`gen:ip:${ipHash}:premium`);
  if (isPremiumFlag(ipHit)) return NextResponse.json({ tier: "premium" });

  // DB fallback
  try {
    const db = getDb();
    const clauses = [eq(userWaitlist.ipHash, ipHash)];
    if (deviceToken) clauses.push(eq(userWaitlist.deviceToken, deviceToken));
    const row = await db
      .select({ tier: userWaitlist.tier })
      .from(userWaitlist)
      .where(or(...clauses))
      .limit(1)
      .then((r) => r[0] ?? null);

    if (row?.tier === "premium") {
      // Rehydrate Redis so the fast path works next time.
      await Promise.all([
        deviceToken
          ? redis.set(`gen:device:${deviceToken}:premium`, "true", {
              ex: PREMIUM_REDIS_TTL_SECONDS,
            })
          : Promise.resolve(),
        redis.set(`gen:ip:${ipHash}:premium`, "true", {
          ex: PREMIUM_REDIS_TTL_SECONDS,
        }),
      ]);
      return NextResponse.json({ tier: "premium" });
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "warn",
        msg: "tier_db_lookup_failed",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  return NextResponse.json({ tier: "free" });
}

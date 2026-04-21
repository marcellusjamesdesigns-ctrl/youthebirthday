import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getRedis } from "@/lib/cache/redis";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { isPremiumFlag, isSessionPaid } from "@/lib/limits/generation-limits";

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
  const sessionId = new URL(request.url).searchParams.get("sessionId");

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  const redis = getRedis();

  // Session-scoped paid check first — if the caller names a specific
  // birthday session, we want to report whether THAT session is unlocked,
  // independent of whether they have a subscription.
  const isPaidForSession = sessionId ? await isSessionPaid(sessionId) : false;

  if (deviceToken) {
    const hit = await redis.get(`gen:device:${deviceToken}:premium`);
    if (isPremiumFlag(hit)) {
      const pt = await redis.get<string>(`gen:device:${deviceToken}:purchase_type`);
      return NextResponse.json({
        tier: "premium",
        purchaseType: pt ?? "unknown",
        isPaidForSession: true, // subscriptions cover all sessions
      });
    }
  }

  const ipHit = await redis.get(`gen:ip:${ipHash}:premium`);
  if (isPremiumFlag(ipHit)) {
    const pt = await redis.get<string>(`gen:ip:${ipHash}:purchase_type`);
    return NextResponse.json({
      tier: "premium",
      purchaseType: pt ?? "unknown",
      isPaidForSession: true,
    });
  }

  // DB fallback — note we only rehydrate the subscription-level Redis
  // flags when the DB says tier === "premium" (subscription). A
  // tier === "one_time" row does NOT grant device/ip-level access;
  // that row is informational only.
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
      return NextResponse.json({
        tier: "premium",
        purchaseType: "subscription",
        isPaidForSession: true,
      });
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

  // Not a subscriber. Return session-paid status so the UI can still
  // treat this session as unlocked for a one-time buyer.
  return NextResponse.json({
    tier: "free",
    purchaseType: isPaidForSession ? "one_time" : "none",
    isPaidForSession,
  });
}

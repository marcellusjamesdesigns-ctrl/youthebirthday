import { getRedis } from "@/lib/cache/redis";
import { FREE_GENERATION_LIMIT, EMAIL_BONUS_GENERATIONS } from "@/lib/premium/features";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
// Premium flags in Redis are rehydrated from DB on miss, so a short-ish TTL
// is fine — if Redis evicts, we re-fill from the DB on next check.
const PREMIUM_REDIS_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Normalize a Redis "is this flag set" check.
 *
 * CRITICAL: Upstash Redis auto-`JSON.parse()`s on read. A value written as
 * the string "true" comes back as the boolean `true`. A naïve
 * `=== "true"` check against boolean `true` is always false — which was
 * the silent root cause of the "paid users still paywalled" bug.
 */
export function isPremiumFlag(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

interface LimitResult {
  allowed: boolean;
  remaining: number;
  reason?: "ip_limit" | "device_limit";
}

/**
 * Resolve premium status for this caller.
 *
 * Checks, in order:
 *   1. `gen:device:<token>:premium` in Redis
 *   2. `gen:ip:<ipHash>:premium`   in Redis
 *   3. `user_waitlist.tier = "premium"` by deviceToken OR ipHash in Postgres
 *
 * If the DB says premium but Redis doesn't, we rehydrate both Redis keys so
 * the fast path works next time. This defends against:
 *   - Redis eviction
 *   - Device-token drift between pre- and post-checkout
 *   - Stripe webhook races (DB written, Redis write dropped)
 */
async function isPremium(
  ipHash: string,
  deviceToken: string | null,
): Promise<boolean> {
  const redis = getRedis();

  if (deviceToken) {
    const devKey = `gen:device:${deviceToken}:premium`;
    if (isPremiumFlag(await redis.get(devKey))) return true;
  }

  const ipKey = `gen:ip:${ipHash}:premium`;
  if (isPremiumFlag(await redis.get(ipKey))) return true;

  // Redis miss — fall through to DB so a working payment isn't lost to
  // a cache eviction or a webhook that never wrote Redis.
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
      // Rehydrate Redis so the hot path works next time.
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
      return true;
    }
  } catch (err) {
    // DB hiccup — do NOT accidentally grant free access. Fall back to
    // treating as non-premium and let the IP/device limit decide.
    console.error(
      JSON.stringify({
        level: "warn",
        msg: "premium_db_lookup_failed",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  return false;
}

export async function checkGenerationLimit(
  ipHash: string,
  deviceToken: string | null,
  tierLimit: number = FREE_GENERATION_LIMIT,
): Promise<LimitResult> {
  if (tierLimit === Infinity) return { allowed: true, remaining: Infinity };

  if (await isPremium(ipHash, deviceToken)) {
    return { allowed: true, remaining: Infinity };
  }

  const redis = getRedis();
  const ipKey = `gen:ip:${ipHash}:count`;
  const bonusKey = `gen:ip:${ipHash}:bonus`;

  const [ipCount, bonus] = await Promise.all([
    redis.get<number>(ipKey).then((v) => v ?? 0),
    redis.get<number>(bonusKey).then((v) => v ?? 0),
  ]);

  const effectiveLimit = tierLimit + bonus;
  const remaining = Math.max(0, effectiveLimit - ipCount);

  if (ipCount >= effectiveLimit) {
    return { allowed: false, remaining: 0, reason: "ip_limit" };
  }

  return { allowed: true, remaining: remaining - 1 };
}

export async function incrementGenerationCount(
  ipHash: string,
  _deviceToken: string | null,
): Promise<void> {
  const redis = getRedis();
  const ipKey = `gen:ip:${ipHash}:count`;
  await redis.incr(ipKey);
  await redis.expire(ipKey, TTL_SECONDS);
}

export async function grantEmailBonus(ipHash: string): Promise<void> {
  const redis = getRedis();
  const bonusKey = `gen:ip:${ipHash}:bonus`;
  await redis.set(bonusKey, EMAIL_BONUS_GENERATIONS);
}

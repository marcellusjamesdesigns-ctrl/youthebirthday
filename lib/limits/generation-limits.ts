import { getRedis } from "@/lib/cache/redis";
import { FREE_GENERATION_LIMIT, EMAIL_BONUS_GENERATIONS } from "@/lib/premium/features";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
// Premium flags in Redis are rehydrated from DB on miss, so a short-ish TTL
// is fine — if Redis evicts, we re-fill from the DB on next check.
const PREMIUM_REDIS_TTL_SECONDS = 7 * 24 * 60 * 60;
// Session-scoped "paid" flags (single-report purchases) live longer since
// we won't re-derive them from the DB. One year is plenty for a report.
export const SESSION_PAID_TTL_SECONDS = 365 * 24 * 60 * 60;
// Birthday Pass credit TTL. Long-lived since a pass is a prepaid pack.
export const PASS_CREDITS_TTL_SECONDS = 365 * 24 * 60 * 60;

/**
 * The number of full-report unlocks a Birthday Pass grants.
 * This is a cap to keep AI costs sustainable. Stacks if purchased
 * multiple times (credits accumulate).
 */
export const BIRTHDAY_PASS_CREDITS_PER_PURCHASE = 10;

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

/**
 * Check whether a specific birthday session was unlocked via a one-time
 * purchase OR via a Birthday Pass auto-unlock. Per-session state —
 * independent of subscription/pass status at the caller level.
 */
export async function isSessionPaid(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;
  const redis = getRedis();
  return isPremiumFlag(await redis.get(`gen:session:${sessionId}:paid`));
}

/**
 * Mark a session as paid (unlocked). Used by the webhook on single-report
 * checkout and by the generation endpoint when a Birthday Pass user
 * starts a new session.
 */
export async function markSessionPaid(
  sessionId: string,
  unlockType: "single_report" | "birthday_pass",
): Promise<void> {
  const redis = getRedis();
  await redis.set(`gen:session:${sessionId}:paid`, "true", {
    ex: SESSION_PAID_TTL_SECONDS,
  });
  await redis.set(`gen:session:${sessionId}:unlock_type`, unlockType, {
    ex: SESSION_PAID_TTL_SECONDS,
  });
}

// ─── Birthday Pass credit tracking ──────────────────────────────────────
// Credits live in Redis keyed by both deviceToken and ipHash so the pass
// survives device drift (different browser after checkout).

interface PassCredits {
  total: number;
  used: number;
  remaining: number;
}

async function readPassCreditsFromKey(
  prefix: "device" | "ip",
  key: string,
): Promise<PassCredits | null> {
  const redis = getRedis();
  const [totalRaw, usedRaw] = await Promise.all([
    redis.get<number | string>(`pass:${prefix}:${key}:credits_total`),
    redis.get<number | string>(`pass:${prefix}:${key}:credits_used`),
  ]);
  if (totalRaw === null || totalRaw === undefined) return null;
  const total = typeof totalRaw === "number" ? totalRaw : parseInt(totalRaw, 10) || 0;
  const used = typeof usedRaw === "number" ? usedRaw : usedRaw ? parseInt(usedRaw, 10) || 0 : 0;
  return { total, used, remaining: Math.max(0, total - used) };
}

/**
 * Look up the caller's Birthday Pass credit balance. Returns null if the
 * caller has no active pass on either device or ip.
 */
export async function getPassCredits(
  ipHash: string,
  deviceToken: string | null,
): Promise<PassCredits | null> {
  if (deviceToken) {
    const dev = await readPassCreditsFromKey("device", deviceToken);
    if (dev) return dev;
  }
  if (ipHash) {
    const ip = await readPassCreditsFromKey("ip", ipHash);
    if (ip) return ip;
  }
  return null;
}

/**
 * Grant a new Birthday Pass (or stack onto an existing one).
 * Increments total credits by BIRTHDAY_PASS_CREDITS_PER_PURCHASE on both
 * the device and IP keys.
 */
export async function grantBirthdayPass(
  ipHash: string | null,
  deviceToken: string | null,
  credits: number = BIRTHDAY_PASS_CREDITS_PER_PURCHASE,
): Promise<void> {
  const redis = getRedis();
  const ops: Promise<unknown>[] = [];
  if (deviceToken) {
    ops.push(
      redis.incrby(`pass:device:${deviceToken}:credits_total`, credits),
      redis.expire(`pass:device:${deviceToken}:credits_total`, PASS_CREDITS_TTL_SECONDS),
    );
  }
  if (ipHash) {
    ops.push(
      redis.incrby(`pass:ip:${ipHash}:credits_total`, credits),
      redis.expire(`pass:ip:${ipHash}:credits_total`, PASS_CREDITS_TTL_SECONDS),
    );
  }
  await Promise.all(ops);
}

/**
 * Consume one Birthday Pass credit for a new session unlock.
 * Increments the used counter on both the device and IP keys (idempotent
 * across keys — we want them to stay in sync).
 *
 * Returns the updated credit balance so callers can tell the user what
 * they have left.
 */
export async function consumePassCredit(
  ipHash: string | null,
  deviceToken: string | null,
): Promise<PassCredits | null> {
  const redis = getRedis();
  const ops: Promise<unknown>[] = [];
  if (deviceToken) {
    ops.push(
      redis.incr(`pass:device:${deviceToken}:credits_used`),
      redis.expire(`pass:device:${deviceToken}:credits_used`, PASS_CREDITS_TTL_SECONDS),
    );
  }
  if (ipHash) {
    ops.push(
      redis.incr(`pass:ip:${ipHash}:credits_used`),
      redis.expire(`pass:ip:${ipHash}:credits_used`, PASS_CREDITS_TTL_SECONDS),
    );
  }
  await Promise.all(ops);
  return getPassCredits(ipHash ?? "", deviceToken);
}

/**
 * Resolve premium status for this caller (subscription-level only).
 * Birthday Pass users are NOT considered premium here — they're handled
 * separately via credit consumption.
 *
 * Kept for backward compatibility. Once all call sites are updated to
 * use the new preview-first model, this can be retired.
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
      return true;
    }
  } catch (err) {
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

interface LimitResult {
  allowed: boolean;
  remaining: number;
  reason?: "ip_limit" | "device_limit";
}

/**
 * NEW MODEL (preview-first): generation is always allowed. Reports
 * generate a free preview for everyone; premium sections inside the
 * report are gated separately.
 *
 * This function is retained for backward-compat with any caller that
 * still wants to enforce a hard free-tier cap. Pass `enforceFreeLimit`
 * explicitly if you want the old behavior. The generation endpoint no
 * longer enforces it.
 */
export async function checkGenerationLimit(
  ipHash: string,
  deviceToken: string | null,
  tierLimit: number = FREE_GENERATION_LIMIT,
  sessionId: string | null = null,
  enforceFreeLimit: boolean = false,
): Promise<LimitResult> {
  if (tierLimit === Infinity) return { allowed: true, remaining: Infinity };

  if (sessionId && (await isSessionPaid(sessionId))) {
    return { allowed: true, remaining: Infinity };
  }

  if (await isPremium(ipHash, deviceToken)) {
    return { allowed: true, remaining: Infinity };
  }

  if (!enforceFreeLimit) {
    // Preview-first model: allow generation for everyone. The report
    // renders a locked preview; the paywall lives inside the report.
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

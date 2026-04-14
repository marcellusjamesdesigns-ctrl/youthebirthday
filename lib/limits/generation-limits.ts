import { getRedis } from "@/lib/cache/redis";
import { FREE_GENERATION_LIMIT, EMAIL_BONUS_GENERATIONS } from "@/lib/premium/features";

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

interface LimitResult {
  allowed: boolean;
  remaining: number;
  reason?: "ip_limit" | "device_limit";
}

export async function checkGenerationLimit(
  ipHash: string,
  deviceToken: string | null,
  tierLimit: number = FREE_GENERATION_LIMIT
): Promise<LimitResult> {
  if (tierLimit === Infinity) return { allowed: true, remaining: Infinity };

  const redis = getRedis();

  // Check if this device has premium status (set by Stripe webhook)
  if (deviceToken) {
    const premiumKey = `gen:device:${deviceToken}:premium`;
    const isPremium = await redis.get<string>(premiumKey);
    if (isPremium === "true") {
      return { allowed: true, remaining: Infinity };
    }
  }

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
  _deviceToken: string | null
): Promise<void> {
  const redis = getRedis();
  const ipKey = `gen:ip:${ipHash}:count`;
  await redis.incr(ipKey);
  await redis.expire(ipKey, TTL_SECONDS);
}

export async function grantEmailBonus(
  ipHash: string,
): Promise<void> {
  const redis = getRedis();
  const bonusKey = `gen:ip:${ipHash}:bonus`;
  await redis.set(bonusKey, EMAIL_BONUS_GENERATIONS);
}

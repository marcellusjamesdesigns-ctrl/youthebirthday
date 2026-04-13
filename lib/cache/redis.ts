import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let _redis: Redis | null = null;

export function getRedis() {
  if (!_redis) {
    // Vercel Marketplace provisions KV_REST_API_* env vars
    // Upstash SDK expects UPSTASH_REDIS_REST_* — handle both
    const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    if (url && token) {
      _redis = new Redis({ url, token });
    } else {
      _redis = Redis.fromEnv();
    }
  }
  return _redis;
}

let _ratelimit: Ratelimit | null = null;

export function getRatelimit() {
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(3, "1h"), // 3 generations per IP per hour
    });
  }
  return _ratelimit;
}

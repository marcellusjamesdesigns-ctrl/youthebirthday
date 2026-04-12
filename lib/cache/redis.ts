import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let _redis: Redis | null = null;

export function getRedis() {
  if (!_redis) _redis = Redis.fromEnv();
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

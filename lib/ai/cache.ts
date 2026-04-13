import { getRedis } from "@/lib/cache/redis";
import { hashPromptInputs } from "@/lib/utils/hash";

const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

interface CacheResult<T> {
  hit: boolean;
  data: T | null;
}

export async function getStepCache<T>(
  step: string,
  cacheKeyInputs: Record<string, string | number | string[]>
): Promise<CacheResult<T>> {
  try {
    const redis = getRedis();
    const hash = hashPromptInputs(cacheKeyInputs);
    const key = `gen:step:${step}:${hash}`;
    const cached = await redis.get<T>(key);
    if (cached) {
      return { hit: true, data: cached };
    }
  } catch {
    // cache miss on error is fine
  }
  return { hit: false, data: null };
}

export async function setStepCache<T>(
  step: string,
  cacheKeyInputs: Record<string, string | number | string[]>,
  data: T
): Promise<void> {
  try {
    const redis = getRedis();
    const hash = hashPromptInputs(cacheKeyInputs);
    const key = `gen:step:${step}:${hash}`;
    await redis.set(key, data, { ex: CACHE_TTL_SECONDS });
  } catch {
    // cache write failure is non-fatal
  }
}

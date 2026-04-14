export type Tier = "free" | "premium";

export const FREE_GENERATION_LIMIT = 1;
export const EMAIL_BONUS_GENERATIONS = 2;

export function generationLimitForTier(tier: Tier): number {
  return tier === "premium" ? Infinity : FREE_GENERATION_LIMIT;
}

export function paletteGatedForTier(tier: Tier): boolean {
  return tier === "free";
}

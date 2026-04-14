import type { TopicSeed } from "./seeds";
import { TOPIC_SEEDS } from "./seeds";

export interface TopicScore {
  seedId: string;
  total: number;
  searchOpportunity: number;
  clusterFit: number;
  affiliateFit: number;
  freshness: number;
  dedupRisk: number; // HIGHER is worse; subtracted at the end
  reason: string;
}

/**
 * Score all topic seeds against existing content and the current date.
 * Returns seeds sorted best-first.
 */
export function scoreSeeds(
  existingSlugs: Set<string>,
  existingTitles: string[],
  now: Date = new Date(),
): TopicScore[] {
  const currentSeason = getSeason(now);

  return TOPIC_SEEDS.map((seed) => {
    const searchOpportunity = estimateSearchOpportunity(seed);
    const clusterFit = estimateClusterFit(seed);
    const affiliateFit = seed.hasShoppingIntent ? 2 : 0.5;
    const freshness = estimateFreshness(seed, currentSeason);
    const dedupRisk = estimateDedupRisk(seed, existingSlugs, existingTitles);

    const biasMultiplier = seed.bias ?? 1;
    const total =
      (searchOpportunity + clusterFit + affiliateFit + freshness) * biasMultiplier -
      dedupRisk;

    const reason = buildReason({
      searchOpportunity,
      clusterFit,
      affiliateFit,
      freshness,
      dedupRisk,
      seed,
    });

    return {
      seedId: seed.id,
      total: Number(total.toFixed(2)),
      searchOpportunity,
      clusterFit,
      affiliateFit,
      freshness,
      dedupRisk,
      reason,
    };
  }).sort((a, b) => b.total - a.total);
}

/** Pick the best unscored seed. */
export function selectNextSeed(
  existingSlugs: Set<string>,
  existingTitles: string[],
): { seed: TopicSeed; score: TopicScore } | null {
  const scores = scoreSeeds(existingSlugs, existingTitles);
  const best = scores.find((s) => s.dedupRisk < 10); // filter out near-duplicates
  if (!best) return null;

  const seed = TOPIC_SEEDS.find((s) => s.id === best.seedId);
  if (!seed) return null;
  return { seed, score: best };
}

// ─── Heuristics ────────────────────────────────────────────────────────

function estimateSearchOpportunity(seed: TopicSeed): number {
  // Rough rule-of-thumb based on topic type. Later: replace with real
  // search volume data from Google Trends / SerpAPI.
  let score = 2;
  if (seed.titleHint.includes("Ideas")) score += 1.5;
  if (seed.titleHint.match(/\b\d+(st|nd|rd|th)\b/)) score += 1; // age-specific
  if (seed.titleHint.toLowerCase().includes("gift")) score += 1;
  if (seed.titleHint.toLowerCase().includes("how to")) score += 0.5;
  if (seed.titleHint.toLowerCase().includes("what to")) score += 0.5;
  return score;
}

function estimateClusterFit(seed: TopicSeed): number {
  // More cluster tags = more existing content to link to = stronger cluster fit.
  return Math.min(2, seed.clusterTags.length * 0.5);
}

function estimateFreshness(seed: TopicSeed, currentSeason: string): number {
  if (!seed.seasonalityWindow || seed.seasonalityWindow.length === 0) {
    return 0.5; // evergreen = modest positive
  }
  if (seed.seasonalityWindow.includes("any" as any)) return 0.5;
  return seed.seasonalityWindow.includes(currentSeason as any) ? 3 : -2;
}

function estimateDedupRisk(
  seed: TopicSeed,
  existingSlugs: Set<string>,
  existingTitles: string[],
): number {
  if (existingSlugs.has(seed.slugHint)) return 100; // exact slug collision = hard skip

  // Soft title-overlap risk
  const seedTitleWords = new Set(
    seed.titleHint.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  );
  let worstOverlap = 0;
  for (const existing of existingTitles) {
    const existingWords = new Set(
      existing.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
    );
    const overlap = [...seedTitleWords].filter((w) => existingWords.has(w)).length;
    const ratio = overlap / Math.max(1, seedTitleWords.size);
    worstOverlap = Math.max(worstOverlap, ratio);
  }
  if (worstOverlap > 0.7) return 20;
  if (worstOverlap > 0.5) return 8;
  if (worstOverlap > 0.35) return 3;
  return 0;
}

function getSeason(date: Date): "spring" | "summer" | "fall" | "winter" {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
}

function buildReason(inputs: {
  searchOpportunity: number;
  clusterFit: number;
  affiliateFit: number;
  freshness: number;
  dedupRisk: number;
  seed: TopicSeed;
}): string {
  const parts: string[] = [];
  if (inputs.freshness >= 2) parts.push("in-season seasonal match");
  if (inputs.freshness < 0) parts.push("out of season");
  if (inputs.affiliateFit >= 2) parts.push("strong affiliate fit");
  if (inputs.clusterFit >= 1.5) parts.push("expands multiple clusters");
  if (inputs.dedupRisk >= 10) parts.push("high dedup risk");
  if (inputs.searchOpportunity >= 4) parts.push("high search opportunity shape");
  if (parts.length === 0) parts.push("evergreen candidate");
  return parts.join(", ");
}

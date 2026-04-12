import type { TokenUsage } from "@/lib/db/schema";

// Cost per million tokens (in cents) — Claude Sonnet 4.6 pricing
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "anthropic/claude-sonnet-4.6": { input: 300, output: 1500 },
  "anthropic/claude-haiku-4.5": { input: 80, output: 400 },
};

export function estimateCostCents(model: string, usage: TokenUsage): number {
  const pricing = MODEL_PRICING[model] ?? MODEL_PRICING["anthropic/claude-sonnet-4.6"];
  const inputCost = (usage.inputTokens / 1_000_000) * pricing.input;
  const outputCost = (usage.outputTokens / 1_000_000) * pricing.output;
  return Math.ceil(inputCost + outputCost);
}

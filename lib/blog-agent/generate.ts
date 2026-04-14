import { generateText, Output } from "ai";
import { DEFAULT_MODEL, DEFAULT_MODEL_ID } from "@/lib/ai/client";
import { estimateCostCents } from "@/lib/utils/cost";
import { BlogDraftSchema, type BlogDraft } from "./schemas";
import { buildDraftPrompt } from "./prompt";
import type { TopicSeed } from "./seeds";
import type { TopicScore } from "./scoring";

export interface DraftGenerationResult {
  draft: BlogDraft;
  model: string;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  estimatedCostCents: number;
  durationMs: number;
}

export async function generateDraft(
  seed: TopicSeed,
  score: TopicScore,
): Promise<DraftGenerationResult> {
  const startTime = Date.now();
  const prompt = buildDraftPrompt(seed, score);

  const result = await generateText({
    model: DEFAULT_MODEL,
    system: prompt.system,
    prompt: prompt.user,
    output: Output.object({ schema: BlogDraftSchema }),
  });

  const draft = result.output as BlogDraft;
  const tokenUsage = {
    inputTokens: result.usage?.inputTokens ?? 0,
    outputTokens: result.usage?.outputTokens ?? 0,
    totalTokens: result.usage?.totalTokens ?? 0,
  };

  const estimatedCostCents = estimateCostCents(DEFAULT_MODEL_ID, tokenUsage);

  return {
    draft,
    model: DEFAULT_MODEL_ID,
    tokenUsage,
    estimatedCostCents,
    durationMs: Date.now() - startTime,
  };
}

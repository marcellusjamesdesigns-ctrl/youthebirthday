import { generateText, Output } from "ai";
import { DEFAULT_MODEL, DEFAULT_MODEL_ID } from "@/lib/ai/client";
import { estimateCostCents } from "@/lib/utils/cost";
import {
  BlogDraftSchema,
  cleanupDraft,
  type BlogDraft,
  type CleanBlogDraft,
} from "./schemas";
import { buildDraftPrompt } from "./prompt";
import type { TopicSeed } from "./seeds";
import type { TopicScore } from "./scoring";

export interface DraftGenerationResult {
  draft: CleanBlogDraft;
  model: string;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  estimatedCostCents: number;
  durationMs: number;
}

// ─── Retry configuration ─────────────────────────────────────────────────
// Gateway / rate-limit errors are transient. Without retry they tank 1 in 3
// runs in a batch, which makes scheduled generation unacceptable.
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [2_000, 5_000]; // delays before 2nd and 3rd attempt

function isTransientError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("gateway") ||
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("timeout") ||
    msg.includes("econnreset") ||
    msg.includes("socket hang up")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateDraft(
  seed: TopicSeed,
  score: TopicScore,
): Promise<DraftGenerationResult> {
  const startTime = Date.now();
  const prompt = buildDraftPrompt(seed, score);

  let result;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      result = await generateText({
        model: DEFAULT_MODEL,
        system:
          attempt === 1
            ? prompt.system
            : prompt.system +
              "\n\nIMPORTANT: Return ONLY a valid JSON object that matches the schema. " +
              "No markdown. No code fences. No preamble. Every field must be the correct type.",
        prompt: prompt.user,
        output: Output.object({ schema: BlogDraftSchema }),
      });
      break; // success
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);

      if (attempt < MAX_ATTEMPTS && isTransientError(err)) {
        const delayMs = RETRY_DELAYS_MS[attempt - 1] ?? 5_000;
        console.warn(
          `[blog-agent] attempt ${attempt}/${MAX_ATTEMPTS} failed (transient), retrying in ${delayMs}ms: ${message}`,
        );
        await sleep(delayMs);
        continue;
      }

      // Non-transient or final attempt — one more structured-output-explicit try
      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `[blog-agent] attempt ${attempt}/${MAX_ATTEMPTS} failed, retrying: ${message}`,
        );
        const delayMs = RETRY_DELAYS_MS[attempt - 1] ?? 2_000;
        await sleep(delayMs);
        continue;
      }

      // Exhausted all attempts
      console.error(
        `[blog-agent] all ${MAX_ATTEMPTS} attempts exhausted: ${message}`,
      );
      throw err;
    }
  }

  if (!result) {
    throw lastError ?? new Error("generateDraft: no result after retries");
  }

  const rawDraft = result.output as BlogDraft | undefined;
  if (!rawDraft) {
    throw new Error("Model returned no output object");
  }

  // Clean up: drop unknown section types, coerce nulls → undefined, clamp counts.
  const draft = cleanupDraft(rawDraft);

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

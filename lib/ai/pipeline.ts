import { generateText, Output } from "ai";
import { getDb } from "@/lib/db";
import {
  birthdayGenerations,
  birthdaySessions,
  generationEvents,
  type StepStatusMap,
  type TokenUsage,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@/lib/utils/id";
import { estimateCostCents } from "@/lib/utils/cost";
import { DEFAULT_MODEL, DEFAULT_MODEL_ID } from "./client";
import { normalizeInput, inputToCacheKey, type NormalizedInput } from "./normalize-input";
import { getStepCache, setStepCache } from "./cache";
import {
  PROMPT_VERSION,
  buildIdentityPrompt,
  buildPalettePrompt,
  buildCaptionPrompt,
  buildDestinationPrompt,
  buildCelebrationPrompt,
  buildRestaurantPrompt,
  buildCosmicPrompt,
} from "./prompts";
import {
  BirthdayIdentitySchema,
  ColorPaletteSchema,
  CaptionPackSchema,
  DestinationSchema,
  CelebrationStyleSchema,
  RestaurantSchema,
  CosmicProfileSchema,
} from "./schemas";
import type { InferSelectModel } from "drizzle-orm";
import type { z } from "zod";

type Session = InferSelectModel<typeof birthdaySessions>;

// ─── Pipeline Runner ─────────────────────────────────────────────────────────

export async function runBirthdayPipeline(
  session: Session,
  generationId: string
) {
  const db = getDb();
  console.log(JSON.stringify({ level: "info", msg: "pipeline:start", sessionId: session.id, generationId }));
  const input = normalizeInput(session);
  console.log(JSON.stringify({ level: "info", msg: "pipeline:normalized", zodiac: input.zodiacSign, mode: input.mode }));
  let totalTokens: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };

  async function updateStepStatus(
    step: keyof StepStatusMap,
    status: StepStatusMap[keyof StepStatusMap]
  ) {
    const gen = await db
      .select({ stepStatus: birthdayGenerations.stepStatus })
      .from(birthdayGenerations)
      .where(eq(birthdayGenerations.id, generationId))
      .limit(1)
      .then((r) => r[0]);

    const current = (gen?.stepStatus as StepStatusMap) ?? {};
    await db
      .update(birthdayGenerations)
      .set({ stepStatus: { ...current, [step]: status } })
      .where(eq(birthdayGenerations.id, generationId));
  }

  async function recordEvent(
    step: string,
    status: "complete" | "error",
    durationMs: number,
    usage: TokenUsage | null,
    cacheHit: boolean,
    errorMessage?: string
  ) {
    await db.insert(generationEvents).values({
      id: createId(),
      generationId,
      step,
      status,
      durationMs,
      tokenUsage: usage,
      createdAt: new Date(),
    });

    if (usage) {
      totalTokens.inputTokens += usage.inputTokens;
      totalTokens.outputTokens += usage.outputTokens;
      totalTokens.totalTokens += usage.totalTokens;
    }

    // Log for observability
    console.log(
      JSON.stringify({
        level: "info",
        msg: `pipeline:${step}`,
        status,
        durationMs,
        cacheHit,
        ...(errorMessage && { error: errorMessage }),
      })
    );
  }

  async function runAIStep<T>(
    stepName: keyof StepStatusMap,
    schema: z.ZodType<T>,
    promptBuilder: (inp: NormalizedInput) => { system: string; user: string }
  ): Promise<T | null> {
    await updateStepStatus(stepName, "running");
    const startTime = Date.now();

    // Check cache
    const cacheKeyInputs = inputToCacheKey(input, stepName, PROMPT_VERSION);
    const cached = await getStepCache<T>(stepName, cacheKeyInputs);
    if (cached.hit && cached.data) {
      const durationMs = Date.now() - startTime;
      await recordEvent(stepName, "complete", durationMs, null, true);
      await updateStepStatus(stepName, "complete");
      return cached.data;
    }

    try {
      const prompt = promptBuilder(input);
      const result = await generateText({
        model: DEFAULT_MODEL,
        system: prompt.system,
        prompt: prompt.user,
        output: Output.object({ schema }),
      });

      const output = result.output;
      const usage: TokenUsage = {
        inputTokens: result.usage?.inputTokens ?? 0,
        outputTokens: result.usage?.outputTokens ?? 0,
        totalTokens: result.usage?.totalTokens ?? 0,
      };

      const durationMs = Date.now() - startTime;
      await recordEvent(stepName, "complete", durationMs, usage, false);
      await updateStepStatus(stepName, "complete");

      // Cache for reuse
      if (output) {
        await setStepCache(stepName, cacheKeyInputs, output);
      }

      return output;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      const errorMessage =
        err instanceof Error ? err.message : String(err);
      await recordEvent(stepName, "error", durationMs, null, false, errorMessage);
      await updateStepStatus(stepName, "error");
      console.error(
        JSON.stringify({
          level: "error",
          msg: `pipeline:${stepName}:failed`,
          error: errorMessage,
        })
      );
      return null;
    }
  }

  try {
    // ─── Step 1: Identity (first visible result) ───────────────────────
    const identity = await runAIStep(
      "identity",
      BirthdayIdentitySchema,
      buildIdentityPrompt
    );

    if (identity) {
      await db
        .update(birthdayGenerations)
        .set({
          birthdayTitle: identity.birthdayTitle,
          birthdayArchetype: identity.birthdayArchetype,
          birthdayEra: identity.birthdayEra,
          celebrationNarrative: identity.celebrationNarrative,
        })
        .where(eq(birthdayGenerations.id, generationId));
    }

    // ─── Step 2: Palettes + Captions + Cosmic (parallel) ──────────────
    // Cosmic runs early so astrocartography can feed into destinations
    const cosmicPromise = input.mode === "cosmic"
      ? runAIStep("cosmic", CosmicProfileSchema, buildCosmicPrompt)
      : Promise.resolve(null);

    const [paletteResult, captionResult, cosmicResult] = await Promise.all([
      runAIStep("palettes", ColorPaletteSchema, buildPalettePrompt),
      runAIStep("captions", CaptionPackSchema, buildCaptionPrompt),
      cosmicPromise,
    ]);

    if (paletteResult || captionResult) {
      await db
        .update(birthdayGenerations)
        .set({
          ...(paletteResult && { colorPalettes: paletteResult.palettes }),
          ...(captionResult && { captionPack: captionResult.categories }),
        })
        .where(eq(birthdayGenerations.id, generationId));
    }

    // Merge cosmic data (computed chart overrides AI for sign data)
    let astrocartographyCities: string[] = [];
    if (cosmicResult) {
      const chart = input.chart;
      const mergedCosmic = {
        ...cosmicResult,
        sunSign: chart?.sunSign ?? cosmicResult.sunSign,
        moonSign: chart?.moonSign ?? cosmicResult.moonSign,
        risingSign: chart?.risingSign ?? cosmicResult.risingSign,
        dominantElement: chart?.dominantElement ?? cosmicResult.dominantElement,
        birthdayMessage: cosmicResult.birthdayMessage,
        astrocartographyHighlights: cosmicResult.astrocartographyHighlights,
      };

      await db
        .update(birthdayGenerations)
        .set({ cosmicProfile: mergedCosmic })
        .where(eq(birthdayGenerations.id, generationId));

      // Extract city names to seed the destination prompt
      if (cosmicResult.astrocartographyHighlights) {
        astrocartographyCities = cosmicResult.astrocartographyHighlights
          .map((h: { city: string }) => h.city);
      }
    }

    // ─── Step 3: Celebration Style + Destinations (parallel) ──────────
    // Destinations now receive astrocartography seeds if cosmic mode
    const destinationPromptBuilder = (inp: NormalizedInput) =>
      buildDestinationPrompt(inp, astrocartographyCities);

    const [celebrationResult, destinationResult] = await Promise.all([
      runAIStep(
        "celebrationStyle",
        CelebrationStyleSchema,
        buildCelebrationPrompt
      ),
      runAIStep("destinations", DestinationSchema, destinationPromptBuilder),
    ]);

    if (celebrationResult || destinationResult) {
      await db
        .update(birthdayGenerations)
        .set({
          ...(celebrationResult && { celebrationStyle: celebrationResult }),
          ...(destinationResult && {
            destinations: destinationResult.destinations,
          }),
        })
        .where(eq(birthdayGenerations.id, generationId));
    }

    // ─── Step 4: Restaurants (AI-generated local recs) ───────────────
    const restaurantResult = await runAIStep(
      "restaurants",
      RestaurantSchema,
      buildRestaurantPrompt
    );

    if (restaurantResult) {
      const restaurants = restaurantResult.restaurants.map((r) => ({
        name: r.name,
        cuisine: r.cuisine,
        priceRange: r.priceRange as "$" | "$$" | "$$$" | "$$$$",
        address: r.address,
        whyItFitsYou: r.whyItFitsYou,
        rating: r.rating ?? undefined,
        venueType: r.venueType,
      }));

      await db
        .update(birthdayGenerations)
        .set({ restaurants })
        .where(eq(birthdayGenerations.id, generationId));
    }

    // ─── Finalize ─────────────────────────────────────────────────────
    await db
      .update(birthdayGenerations)
      .set({
        status: "complete",
        tokenUsage: totalTokens,
        estimatedCostCents: estimateCostCents(DEFAULT_MODEL_ID, totalTokens),
        generationCompletedAt: new Date(),
      })
      .where(eq(birthdayGenerations.id, generationId));

    await db
      .update(birthdaySessions)
      .set({ status: "complete", updatedAt: new Date() })
      .where(eq(birthdaySessions.id, session.id));

    console.log(
      JSON.stringify({
        level: "info",
        msg: "pipeline:complete",
        generationId,
        totalTokens: totalTokens.totalTokens,
        estimatedCostCents: estimateCostCents(DEFAULT_MODEL_ID, totalTokens),
      })
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : String(err);

    await db
      .update(birthdayGenerations)
      .set({
        status: "error",
        errorMessage,
        tokenUsage: totalTokens,
        estimatedCostCents: estimateCostCents(DEFAULT_MODEL_ID, totalTokens),
      })
      .where(eq(birthdayGenerations.id, generationId));

    await db
      .update(birthdaySessions)
      .set({ status: "error", updatedAt: new Date() })
      .where(eq(birthdaySessions.id, session.id));

    console.error(
      JSON.stringify({
        level: "error",
        msg: "pipeline:fatal",
        generationId,
        error: errorMessage,
      })
    );
  }
}

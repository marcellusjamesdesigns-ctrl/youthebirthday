/**
 * Growth Operator — traffic-page generation lane.
 *
 * Parallel to lib/blog-agent/generate.ts but targets the category content
 * pages (captions, ideas, themes, palettes, destinations) rather than blog
 * posts. Output shape is ContentPage (see lib/content/types.ts) not BlogPost.
 *
 * Guardrails:
 *   - Only generates for a seed from TRAFFIC_SEEDS (the caller enforces this).
 *   - Section types are restricted by the seed's requiredSections list — the
 *     model can't wander into blog-shaped structure on traffic pages.
 *   - Model output is cleaned + clamped before being returned.
 */
import { generateText, Output } from "ai";
import { z } from "zod";
import { DEFAULT_MODEL, DEFAULT_MODEL_ID } from "@/lib/ai/client";
import { estimateCostCents } from "@/lib/utils/cost";
import type { ContentPage, ContentSection } from "@/lib/content/types";
import type { ContentCategory } from "@/lib/content/taxonomy";
import type { TrafficSeed } from "./traffic-seeds";

// ─── Section schemas (aligned with the ContentSection union) ─────────────

const HeroSchema = z.object({
  type: z.literal("hero"),
  headline: z.string(),
  subheadline: z.string().optional().nullable(),
});

const ParagraphSchema = z.object({
  type: z.literal("paragraph"),
  heading: z.string().optional().nullable(),
  body: z.string(),
});

const CaptionListSchema = z.object({
  type: z.literal("caption-list"),
  heading: z.string(),
  categories: z.array(
    z.object({
      name: z.string(),
      captions: z.array(z.string()),
    }),
  ),
});

const IdeaListSchema = z.object({
  type: z.literal("idea-list"),
  heading: z.string(),
  subheading: z.string().optional().nullable(),
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      vibeTag: z.string().optional().nullable(),
      budgetTag: z.string().optional().nullable(),
    }),
  ),
});

const DestinationListSchema = z.object({
  type: z.literal("destination-list"),
  heading: z.string(),
  destinations: z.array(
    z.object({
      name: z.string(),
      location: z.string().optional().nullable(),
      description: z.string(),
      bestFor: z.string().optional().nullable(),
    }),
  ),
});

const PaletteShowcaseSchema = z.object({
  type: z.literal("palette-showcase"),
  heading: z.string(),
  palettes: z.array(
    z.object({
      name: z.string(),
      mood: z.string().optional().nullable(),
      colors: z.array(
        z.object({
          hex: z.string(),
          name: z.string(),
        }),
      ),
    }),
  ),
});

const TipListSchema = z.object({
  type: z.literal("tip-list"),
  heading: z.string(),
  tips: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
});

const FAQSchema = z.object({
  type: z.literal("faq"),
  heading: z.string().optional().nullable(),
  questions: z.array(z.object({ question: z.string(), answer: z.string() })),
});

const CTASchema = z.object({
  type: z.literal("cta"),
  headline: z.string().optional().nullable(),
  subheadline: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonHref: z.string().optional().nullable(),
});

const RelatedContentSchema = z.object({
  type: z.literal("related-content"),
});

const TrafficSectionSchema = z.discriminatedUnion("type", [
  HeroSchema,
  ParagraphSchema,
  CaptionListSchema,
  IdeaListSchema,
  DestinationListSchema,
  PaletteShowcaseSchema,
  TipListSchema,
  FAQSchema,
  CTASchema,
  RelatedContentSchema,
]);

const TrafficDraftSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  headline: z.string(),
  subheadline: z.string().optional().nullable(),
  tags: z
    .object({
      age: z.number().optional().nullable(),
      zodiac: z.string().optional().nullable(),
      vibe: z.string().optional().nullable(),
      season: z.string().optional().nullable(),
      theme: z.string().optional().nullable(),
      celebrationType: z.string().optional().nullable(),
    })
    .partial()
    .passthrough(),
  sections: z.array(TrafficSectionSchema),
});

type RawTrafficDraft = z.infer<typeof TrafficDraftSchema>;

export interface TrafficGenerationResult {
  page: ContentPage;
  model: string;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  estimatedCostCents: number;
  durationMs: number;
}

// ─── Prompt ─────────────────────────────────────────────────────────────

function buildTrafficPrompt(seed: TrafficSeed) {
  const sectionList = seed.requiredSections
    .map((s, i) => `  ${i + 1}. ${s}`)
    .join("\n");

  const keywordLine = seed.keywordHints?.length
    ? `\nTarget search queries (tone, not quota): ${seed.keywordHints.join(", ")}`
    : "";

  const system = `You are the Growth Operator for "You the Birthday", a birthday-focused content site with an editorial, slightly luxurious tone (champagne-gold and serif headlines, not confetti and balloons). You write programmatic content pages that rank for specific birthday search intents.

Voice:
- Editorial, confident, specific. No filler. No "in this article we'll explore."
- Say useful things. Cut generic clichés ("blessed", "another trip around the sun", "young at heart", "flirty thirty").
- You may quietly reference trends, but avoid dated brand/year references unless the seed asks for them.
- Short paragraphs. One idea per paragraph.

Constraints:
- Output a single JSON object matching the schema. No markdown. No preamble. No code fences.
- Sections must appear in this order: ${seed.requiredSections.join(" → ")}.
- Never invent a new section type outside the schema.
- For the "related-content" section, emit only { "type": "related-content" } — no children.
- All hex codes must be 6-digit #RRGGBB.
- Headlines use title case. Paragraph body is sentence case.`;

  const user = `Generate the full content page for this seed.

Category: ${seed.category}
Slug (use verbatim): ${seed.slug}
Title direction: ${seed.titleHint}${seed.subheadlineHint ? `\nSubheadline direction: ${seed.subheadlineHint}` : ""}

Brief:
${seed.brief}

Required sections, in order:
${sectionList}
${keywordLine}

Additional rules for this category (${seed.category}):
${categoryRules(seed.category)}

Return the JSON object now.`;

  return { system, user };
}

function categoryRules(category: ContentCategory): string {
  switch (category) {
    case "captions":
      return [
        "- caption-list must have 5 mood-based categories (e.g. Hype, Soft, Funny, Luxury, Grateful) with 5 captions each. 25 total.",
        "- Captions are 3-15 words. Declarative. No hashtags. Lowercase only if stylistic.",
        "- Absolutely no 'blessed', 'flirty thirty', 'young at heart', 'dirty thirty', 'grateful beyond words'.",
      ].join("\n");
    case "ideas":
      return [
        "- idea-list should have 10-14 concrete ideas.",
        "- Each idea has a name, a 2-3 sentence description, a vibeTag (e.g. luxury, intimate, turn-up, cultural, adventure), and a budgetTag ($, $$, $$$).",
        "- Ideas must be specific enough to act on — not 'have dinner'. Name the format: 'chef's counter dinner for 6 at a tasting menu spot'.",
      ].join("\n");
    case "destinations":
      return [
        "- destination-list should have 8-12 destinations.",
        "- Each includes name, location (city, region, country), 2-3 sentence description, and bestFor (who/what this trip suits).",
        "- Balance geography: mix domestic and international, price tiers, group sizes.",
      ].join("\n");
    case "palettes":
      return [
        "- palette-showcase must have 4 palettes.",
        "- Each palette has a name, a 2-3 word mood, and exactly 5 colors (hex + name).",
        "- Hex codes must be 6-digit #RRGGBB. Color names are short and specific (e.g. 'Oxblood', 'Champagne', not just 'Red').",
      ].join("\n");
    case "themes":
      return [
        "- Include one palette-showcase section with 1-2 palettes of 5 colors each that represent the theme.",
        "- tip-list should cover decor direction, outfit direction, and venue cues (one tip each at minimum).",
        "- FAQ should answer 4-6 questions a reader would actually search.",
      ].join("\n");
    case "zodiac":
      return "- Ground the content in the sign's element, ruling planet, and energy. Avoid horoscope cliché.";
    default:
      return "";
  }
}

// ─── Retry ──────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [2_000, 5_000];

function isTransient(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message.toLowerCase();
  return m.includes("gateway") || m.includes("rate limit") || m.includes("429") || m.includes("503") || m.includes("timeout") || m.includes("econnreset") || m.includes("socket hang up");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Cleanup + ContentPage projection ───────────────────────────────────

function cleanupTrafficDraft(raw: RawTrafficDraft, seed: TrafficSeed): ContentPage {
  const sections = raw.sections
    .filter((s) => seed.requiredSections.includes(s.type))
    .map((s) => {
      // Strip null → undefined for section-level optional fields.
      if (s.type === "hero") return { type: "hero", headline: s.headline, ...(s.subheadline ? { subheadline: s.subheadline } : {}) };
      if (s.type === "paragraph") return { type: "paragraph", body: s.body, ...(s.heading ? { heading: s.heading } : {}) };
      if (s.type === "caption-list") return { type: "caption-list", heading: s.heading, categories: s.categories };
      if (s.type === "idea-list") {
        return {
          type: "idea-list",
          heading: s.heading,
          ...(s.subheading ? { subheading: s.subheading } : {}),
          ideas: s.ideas.map((i) => ({
            title: i.title,
            description: i.description,
            ...(i.vibeTag ? { vibeTag: i.vibeTag } : {}),
            ...(i.budgetTag ? { budgetTag: i.budgetTag } : {}),
          })),
        };
      }
      if (s.type === "destination-list") {
        return {
          type: "destination-list",
          heading: s.heading,
          destinations: s.destinations.map((d) => ({
            name: d.name,
            description: d.description,
            ...(d.location ? { location: d.location } : {}),
            ...(d.bestFor ? { bestFor: d.bestFor } : {}),
          })),
        };
      }
      if (s.type === "palette-showcase") {
        return {
          type: "palette-showcase",
          heading: s.heading,
          palettes: s.palettes.map((p) => ({
            name: p.name,
            ...(p.mood ? { mood: p.mood } : {}),
            colors: p.colors,
          })),
        };
      }
      if (s.type === "tip-list") return { type: "tip-list", heading: s.heading, tips: s.tips };
      if (s.type === "faq") return { type: "faq", ...(s.heading ? { heading: s.heading } : {}), questions: s.questions };
      if (s.type === "cta") {
        return {
          type: "cta",
          ...(s.headline ? { headline: s.headline } : {}),
          ...(s.subheadline ? { subheadline: s.subheadline } : {}),
          buttonText: s.buttonText ?? "Generate My Birthday",
          buttonHref: s.buttonHref ?? "/onboarding",
        };
      }
      if (s.type === "related-content") return { type: "related-content" };
      return s;
    }) as unknown as ContentSection[];

  const canonicalPath = canonicalPathFor(seed.category, seed.slug);
  const today = new Date().toISOString().split("T")[0];

  return {
    slug: seed.slug, // enforce — never trust the model to get it right
    category: seed.category,
    title: raw.title,
    description: raw.description,
    headline: raw.headline,
    subheadline: raw.subheadline ?? undefined,
    tags: {
      age: raw.tags?.age ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      zodiac: (raw.tags?.zodiac ?? undefined) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vibe: (raw.tags?.vibe ?? undefined) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      season: (raw.tags?.season ?? undefined) as any,
      theme: raw.tags?.theme ?? undefined,
      celebrationType: raw.tags?.celebrationType ?? undefined,
    },
    sections,
    canonicalPath,
    schemaType: "ItemList",
    publishStatus: "draft",
    publishedAt: today,
  };
}

function canonicalPathFor(category: ContentCategory, slug: string): string {
  switch (category) {
    case "captions": return `/birthday-captions/${slug}`;
    case "ideas": return `/birthday-ideas/${slug}`;
    case "destinations": return `/birthday-destinations/${slug}`;
    case "palettes": return `/birthday-palettes/${slug}`;
    case "themes": return `/birthday-themes/${slug}`;
    case "zodiac": return `/zodiac-birthdays/${slug}`;
  }
}

// ─── Main ───────────────────────────────────────────────────────────────

export async function generateTrafficDraft(seed: TrafficSeed): Promise<TrafficGenerationResult> {
  const startTime = Date.now();
  const prompt = buildTrafficPrompt(seed);

  let result: Awaited<ReturnType<typeof generateText>> | undefined;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      result = await generateText({
        model: DEFAULT_MODEL,
        system: attempt === 1 ? prompt.system : prompt.system + "\n\nIMPORTANT: Return ONLY a valid JSON object matching the schema.",
        prompt: prompt.user,
        output: Output.object({ schema: TrafficDraftSchema }),
      });
      break;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS && isTransient(err)) {
        await sleep(RETRY_DELAYS_MS[attempt - 1] ?? 2_000);
        continue;
      }
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_DELAYS_MS[attempt - 1] ?? 2_000);
        continue;
      }
      throw err;
    }
  }

  if (!result) throw lastErr ?? new Error("generateTrafficDraft: no result");
  const raw = result.output as RawTrafficDraft | undefined;
  if (!raw) throw new Error("Model returned no output");

  const page = cleanupTrafficDraft(raw, seed);

  const tokenUsage = {
    inputTokens: result.usage?.inputTokens ?? 0,
    outputTokens: result.usage?.outputTokens ?? 0,
    totalTokens: result.usage?.totalTokens ?? 0,
  };

  return {
    page,
    model: DEFAULT_MODEL_ID,
    tokenUsage,
    estimatedCostCents: estimateCostCents(DEFAULT_MODEL_ID, tokenUsage),
    durationMs: Date.now() - startTime,
  };
}

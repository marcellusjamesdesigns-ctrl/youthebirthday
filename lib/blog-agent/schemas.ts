import { z } from "zod";
import type { BlogCategory, ContentSection } from "@/lib/content/types";

/**
 * Zod schemas for blog agent draft output.
 *
 * Design principle — "content required, length flexible":
 *
 *   Every section type REQUIRES its critical content fields (body, headline,
 *   questions[], items[], quote, text, etc.) so the model can't emit empty
 *   stubs like `{ "type": "paragraph" }`. We learned the hard way that a
 *   fully-loose `passthrough()` schema lets the model phone it in.
 *
 *   We do NOT enforce min/max string lengths or array size minimums at the
 *   Zod layer — those are what caused earlier schema-rejection loops. Counts
 *   are enforced post-hoc in quality-gates.ts where they can be surfaced as
 *   reviewer warnings without blocking the draft.
 *
 * - URLs use plain z.string() (reviewers replace image URLs anyway).
 * - Optional fields are `.optional().nullable()` because different model
 *   builds serialize absent values differently.
 */

const HeroSectionSchema = z.object({
  type: z.literal("hero"),
  headline: z.string(),
  subheadline: z.string().optional().nullable(),
});

const ParagraphSectionSchema = z.object({
  type: z.literal("paragraph"),
  heading: z.string().optional().nullable(),
  body: z.string(), // may contain <a href="/..."> inline internal links
});

const TipListSectionSchema = z.object({
  type: z.literal("tip-list"),
  heading: z.string(),
  tips: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
});

const IdeaListSectionSchema = z.object({
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

const PullQuoteSectionSchema = z.object({
  type: z.literal("pull-quote"),
  quote: z.string(),
  attribution: z.string().optional().nullable(),
});

const ImageSectionSchema = z.object({
  type: z.literal("image"),
  // src is a placeholder the reviewer replaces — just require SOMETHING.
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional().nullable(),
  credit: z.string().optional().nullable(),
  creditUrl: z.string().optional().nullable(),
  ratio: z.string().optional().nullable(),
  suggestedSearchQuery: z.string().optional().nullable(),
});

const MidArticleCTASectionSchema = z.object({
  type: z.literal("mid-article-cta"),
  eyebrow: z.string().optional().nullable(),
  headline: z.string(),
  description: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonHref: z.string().optional().nullable(),
});

const InlineCTASectionSchema = z.object({
  type: z.literal("inline-cta"),
  text: z.string(),
  href: z.string().optional().nullable(),
});

const FAQSectionSchema = z.object({
  type: z.literal("faq"),
  heading: z.string().optional().nullable(),
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

const AmazonShopSectionSchema = z.object({
  type: z.literal("amazon-shop"),
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  placement: z.string(),
  format: z.string().optional().nullable(),
  items: z.array(
    z.object({
      query: z.string(),
      label: z.string(),
      description: z.string().optional().nullable(),
      icon: z.string().optional().nullable(),
    }),
  ),
});

const CTASectionSchema = z.object({
  type: z.literal("cta"),
  headline: z.string().optional().nullable(),
  subheadline: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonHref: z.string().optional().nullable(),
});

export const BlogSectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  ParagraphSectionSchema,
  TipListSectionSchema,
  IdeaListSectionSchema,
  PullQuoteSectionSchema,
  ImageSectionSchema,
  MidArticleCTASectionSchema,
  InlineCTASectionSchema,
  FAQSectionSchema,
  AmazonShopSectionSchema,
  CTASectionSchema,
]);

export const BlogDraftSchema = z.object({
  slug: z.string(),
  category: z.string(), // validated post-hoc to one of 5 allowed categories
  title: z.string(),
  description: z.string(),
  headline: z.string(),
  subheadline: z.string().optional().nullable(),
  excerpt: z.string(),
  heroImage: z.object({
    suggestedSearchQuery: z.string(),
    alt: z.string(),
  }),
  pinterestImage: z
    .object({
      suggestedSearchQuery: z.string(),
      alt: z.string(),
    })
    .optional()
    .nullable(),
  author: z
    .object({
      name: z.string(),
    })
    .optional()
    .nullable(),
  tags: z
    .object({
      vibe: z.string().optional().nullable(),
      season: z.string().optional().nullable(),
      zodiac: z.string().optional().nullable(),
      age: z.number().optional().nullable(),
      theme: z.string().optional().nullable(),
    })
    .passthrough(),
  sections: z.array(BlogSectionSchema),
  internalLinkTargets: z.array(z.string()).optional().nullable(),
});

export type BlogDraft = z.infer<typeof BlogDraftSchema>;

/** Allowed section types. Used by the cleanup pass to filter out junk. */
export const ALLOWED_SECTION_TYPES = new Set([
  "hero",
  "paragraph",
  "tip-list",
  "idea-list",
  "pull-quote",
  "image",
  "mid-article-cta",
  "inline-cta",
  "faq",
  "amazon-shop",
  "cta",
]);

export const ALLOWED_CATEGORIES: ReadonlySet<BlogCategory> = new Set<BlogCategory>([
  "planning",
  "style",
  "seasonal",
  "gifts",
  "milestones",
]);

/**
 * A cleaned, narrowed draft that's directly assignable to BlogPost fields.
 * `cleanupDraft` is the bridge between the raw model output and the
 * `BlogPost` shape the renderer expects.
 */
export interface CleanBlogDraft {
  slug: string;
  category: BlogCategory;
  title: string;
  description: string;
  headline: string;
  subheadline?: string;
  excerpt: string;
  heroImage: { suggestedSearchQuery: string; alt: string };
  pinterestImage?: { suggestedSearchQuery: string; alt: string };
  author?: { name: string };
  tags: {
    vibe?: string;
    season?: string;
    zodiac?: string;
    age?: number;
    theme?: string;
  };
  sections: ContentSection[];
  internalLinkTargets?: string[];
}

function isBlogCategory(v: string): v is BlogCategory {
  return (ALLOWED_CATEGORIES as ReadonlySet<string>).has(v);
}

/**
 * Post-process a raw model output:
 *  - drop sections with unknown types (defensive — discriminated union
 *    already restricts this)
 *  - coerce null → undefined for optional fields
 *  - ensure category is one of the five blog categories
 *  - clamp Amazon item counts to the 8-max hard cap
 */
export function cleanupDraft(raw: BlogDraft): CleanBlogDraft {
  const category: BlogCategory = isBlogCategory(raw.category)
    ? raw.category
    : "planning";

  const sections = raw.sections
    .filter((s) => ALLOWED_SECTION_TYPES.has(s.type))
    .map((s) => {
      // Hard cap Amazon items at 8 so a too-long list never ships.
      if (s.type === "amazon-shop" && s.items.length > 8) {
        return { ...s, items: s.items.slice(0, 8) };
      }
      return s;
    }) as unknown as ContentSection[];

  return {
    slug: raw.slug,
    category,
    title: raw.title,
    description: raw.description,
    headline: raw.headline,
    subheadline: raw.subheadline ?? undefined,
    excerpt: raw.excerpt,
    heroImage: raw.heroImage,
    pinterestImage: raw.pinterestImage ?? undefined,
    author: raw.author ?? { name: "The Journal" },
    tags: {
      vibe: raw.tags?.vibe ?? undefined,
      season: raw.tags?.season ?? undefined,
      zodiac: raw.tags?.zodiac ?? undefined,
      age: raw.tags?.age ?? undefined,
      theme: raw.tags?.theme ?? undefined,
    },
    sections,
    internalLinkTargets: raw.internalLinkTargets ?? undefined,
  };
}

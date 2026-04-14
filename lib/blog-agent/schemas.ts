import { z } from "zod";

/**
 * Zod schemas for blog agent draft output.
 *
 * These intentionally support a SUBSET of ContentSection types —
 * enough to match the 3 golden examples, not the full registry.
 *
 * The agent must emit ONLY these types. Any other type will be
 * stripped by the enrichment step.
 */

const HeroSectionSchema = z.object({
  type: z.literal("hero"),
  headline: z.string(),
  subheadline: z.string().optional(),
});

const ParagraphSectionSchema = z.object({
  type: z.literal("paragraph"),
  heading: z.string().optional(),
  body: z.string(), // may contain <a href="..."> inline links
});

const TipListSectionSchema = z.object({
  type: z.literal("tip-list"),
  heading: z.string(),
  tips: z
    .array(z.object({ title: z.string(), body: z.string() }))
    .min(3)
    .max(8),
});

const IdeaListSectionSchema = z.object({
  type: z.literal("idea-list"),
  heading: z.string(),
  subheading: z.string().optional(),
  ideas: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        vibeTag: z.string().optional(),
        budgetTag: z.string().optional(),
      }),
    )
    .min(3)
    .max(10),
});

const PullQuoteSectionSchema = z.object({
  type: z.literal("pull-quote"),
  quote: z.string(),
  attribution: z.string().optional(),
});

const ImageSectionSchema = z.object({
  type: z.literal("image"),
  src: z.string().url(), // reviewer will replace; agent emits placeholder URL
  alt: z.string(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  creditUrl: z.string().url().optional(),
  ratio: z.enum(["hero", "wide", "square", "portrait"]).optional(),
  // The agent ALSO emits a search query the reviewer can use to pick the final image:
  suggestedSearchQuery: z.string().optional(),
});

const MidArticleCTASectionSchema = z.object({
  type: z.literal("mid-article-cta"),
  eyebrow: z.string().optional(),
  headline: z.string(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonHref: z.string().optional(),
});

const InlineCTASectionSchema = z.object({
  type: z.literal("inline-cta"),
  text: z.string(),
  href: z.string().optional(),
});

const FAQSectionSchema = z.object({
  type: z.literal("faq"),
  heading: z.string().optional(),
  questions: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .min(3)
    .max(6),
});

const AmazonShopSectionSchema = z.object({
  type: z.literal("amazon-shop"),
  title: z.string(),
  subtitle: z.string().optional(),
  placement: z.string(),
  format: z.enum(["grid", "list", "checklist"]).optional(),
  items: z
    .array(
      z.object({
        query: z.string(),
        label: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      }),
    )
    .min(4)
    .max(8), // Quality gate: cap at 8
});

const CTASectionSchema = z.object({
  type: z.literal("cta"),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  buttonText: z.string().optional(),
  buttonHref: z.string().optional(),
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
  slug: z.string().min(5).max(80),
  category: z.enum(["planning", "style", "seasonal", "gifts", "milestones"]),
  title: z.string().min(10).max(120), // SEO meta title
  description: z.string().min(100).max(180), // SEO meta description
  headline: z.string().min(10).max(100), // on-page H1
  subheadline: z.string().optional(),
  excerpt: z.string().min(40).max(200),
  heroImage: z.object({
    suggestedSearchQuery: z.string(),
    alt: z.string(),
  }),
  pinterestImage: z
    .object({
      suggestedSearchQuery: z.string(),
      alt: z.string(),
    })
    .optional(),
  author: z
    .object({
      name: z.string(),
    })
    .optional(),
  tags: z.object({
    vibe: z.string().optional(),
    season: z.string().optional(),
    zodiac: z.string().optional(),
    age: z.number().optional(),
    theme: z.string().optional(),
  }),
  sections: z.array(BlogSectionSchema).min(8).max(20),
  // Internal link targets the agent thinks should be referenced
  internalLinkTargets: z.array(z.string()).min(4).max(8),
});

export type BlogDraft = z.infer<typeof BlogDraftSchema>;

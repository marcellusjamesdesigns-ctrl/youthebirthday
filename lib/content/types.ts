import type { ContentCategory, ZodiacSign, Vibe, Season } from "./taxonomy";

// ─── Content Page Definition ─────────────────────────────────────────────────
// Every indexable content page is defined by this structure, whether
// it comes from a config file (programmatic) or MDX (editorial).

export interface ContentPage {
  slug: string;
  category: ContentCategory;
  title: string;
  description: string; // meta description, 155 chars max
  headline: string; // H1 on the page
  subheadline?: string;

  // Taxonomy tags — used for related content, filtering, internal linking
  tags: {
    age?: number;
    zodiac?: ZodiacSign;
    vibe?: Vibe;
    season?: Season;
    destinationType?: string;
    paletteMood?: string;
    celebrationType?: string;
    theme?: string; // theme-level grouping (e.g. "dark-feminine", "y2k")
  };

  // Structured content sections
  sections: ContentSection[];

  // SEO
  canonicalPath: string; // e.g. /birthday-captions/30th-birthday-captions
  ogImage?: string;
  schemaType?: "Article" | "ItemList" | "HowTo";
  publishStatus: "draft" | "published";
  publishedAt?: string; // ISO date
  updatedAt?: string;
}

// ─── Blog Post Definition ────────────────────────────────────────────────────
// Blog posts are a separate surface from evergreen content pages.
// They live at /blog/[slug] and build topical authority over time.

export type BlogCategory =
  | "planning"       // how-to, checklists, decoration, logistics
  | "style"          // outfits, aesthetics, decor aesthetics
  | "seasonal"       // month-based, zodiac season, seasonal ideas
  | "gifts"          // gift guides
  | "milestones";    // age-specific editorial

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  title: string;
  description: string;            // meta description
  headline: string;               // H1
  subheadline?: string;
  excerpt: string;                // 1-2 sentence hook for hub cards

  // Hero / social image
  heroImage: {
    src: string;
    alt: string;
    credit?: string;
    creditUrl?: string;
  };
  ogImage?: string;               // falls back to heroImage.src
  pinterestImage?: {              // 2:3 vertical optimized for Pinterest
    src: string;
    alt: string;
  };

  // Reading experience — optional, computed at render if omitted
  readingTimeMinutes?: number;

  // Topical tags (used for related-post surfacing)
  tags: {
    vibe?: string;
    season?: string;
    zodiac?: string;
    age?: number;
    theme?: string;
  };

  // Content
  sections: ContentSection[];

  // SEO
  canonicalPath: string;
  schemaType?: "Article" | "BlogPosting";
  publishStatus: "draft" | "published";
  publishedAt: string;            // ISO
  updatedAt?: string;

  // Optional author
  author?: {
    name: string;
    bio?: string;
  };
}

// ─── Content Sections ────────────────────────────────────────────────────────
// Reusable section types that the page renderer knows how to display.

export type ContentSection =
  | HeroSection
  | CaptionListSection
  | IdeaListSection
  | DestinationListSection
  | PaletteShowcaseSection
  | ParagraphSection
  | TipListSection
  | FAQSection
  | RelatedContentSection
  | CTASection
  | InlineCTASection
  | MidArticleCTASection
  | ElementSignsSection
  | AmazonShopSection
  | ImageSection
  | PullQuoteSection;

export interface HeroSection {
  type: "hero";
  headline: string;
  subheadline?: string;
  backgroundGradient?: string; // CSS gradient
}

export interface CaptionListSection {
  type: "caption-list";
  heading: string;
  subheading?: string;
  categories: {
    name: string; // "Hype", "Soft Girl", "Funny", etc.
    captions: string[];
  }[];
}

export interface IdeaListSection {
  type: "idea-list";
  heading: string;
  subheading?: string;
  ideas: {
    title: string;
    description: string;
    vibeTag?: string;
    budgetTag?: string;
  }[];
}

export interface DestinationListSection {
  type: "destination-list";
  heading: string;
  subheading?: string;
  destinations: {
    city: string;
    country: string;
    description: string;
    bestFor: string[];
    season?: string;
  }[];
}

export interface PaletteShowcaseSection {
  type: "palette-showcase";
  heading: string;
  subheading?: string;
  palettes: {
    name: string;
    mood: string;
    colors: { hex: string; name: string }[];
  }[];
}

export interface ParagraphSection {
  type: "paragraph";
  heading?: string;
  body: string; // markdown-safe text
}

export interface TipListSection {
  type: "tip-list";
  heading: string;
  tips: { title: string; body: string }[];
}

export interface FAQSection {
  type: "faq";
  heading?: string;
  questions: { question: string; answer: string }[];
}

export interface RelatedContentSection {
  type: "related-content";
  heading?: string;
  // Resolved at render time from taxonomy tags
}

export interface CTASection {
  type: "cta";
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonHref?: string;
}

export interface InlineCTASection {
  type: "inline-cta";
  text: string;
  href?: string;
}

export interface MidArticleCTASection {
  type: "mid-article-cta";
  eyebrow?: string;
  headline: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export interface ElementSignsSection {
  type: "element-signs";
  element: string;       // "Fire", "Earth", "Air", "Water"
  signs: string[];       // fellow element signs (excluding current)
  currentSign: string;   // display label of the current sign
}

export interface AmazonShopSection {
  type: "amazon-shop";
  title: string;              // "Set the Soft Life Mood"
  subtitle?: string;          // optional editorial context
  placement: string;          // analytics tag, e.g. "soft-life-theme"
  format?: "grid" | "list" | "checklist";
  items: {
    query: string;            // Amazon search term
    label: string;            // display name
    description?: string;
    icon?: string;
  }[];
}

export interface ImageSection {
  type: "image";
  src: string;                // full URL (Unsplash, AI-generated, own)
  alt: string;                // required for a11y + SEO
  caption?: string;           // visible below image
  credit?: string;            // attribution (e.g. "Photo by X on Unsplash")
  creditUrl?: string;         // link for the credit
  ratio?: "hero" | "wide" | "square" | "portrait"; // aspect ratio preset
}

export interface PullQuoteSection {
  type: "pull-quote";
  quote: string;
  attribution?: string;
}

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
  | ElementSignsSection
  | AmazonShopSection;

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

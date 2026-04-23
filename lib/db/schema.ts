import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const generationStatusEnum = pgEnum("generation_status", [
  "pending",
  "processing",
  "complete",
  "error",
]);

export const birthdayModeEnum = pgEnum("birthday_mode", ["quick", "cosmic"]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const birthdaySessions = pgTable("birthday_sessions", {
  id: text("id").primaryKey(), // nanoid(32) — long enough for private-by-obscurity
  name: text("name").notNull(),
  pronoun: text("pronoun"), // optional
  customPronoun: text("custom_pronoun"),
  birthdate: text("birthdate").notNull(), // "MM-DD"
  birthYear: integer("birth_year").notNull(),
  currentCity: text("current_city").notNull(),
  currentLat: text("current_lat"),
  currentLng: text("current_lng"),
  celebrationCity: text("celebration_city"), // where they're celebrating (defaults to currentCity)
  celebrationVibe: text("celebration_vibe").notNull(),
  birthdayGoals: jsonb("birthday_goals").$type<string[]>(),
  mode: birthdayModeEnum("mode").notNull().default("quick"),
  // Cosmic mode fields
  birthTime: text("birth_time"), // "HH:MM" 24h
  birthCity: text("birth_city"),
  birthLat: text("birth_lat"),
  birthLng: text("birth_lng"),
  birthTimezoneOffset: text("birth_timezone_offset"), // UTC offset in hours (e.g., "-5", "5.5")
  // Budget & preferences
  budget: text("budget"), // "budget" | "mid" | "luxury"
  groupSize: text("group_size"), // "solo" | "partner" | "small" | "large"
  foodVibe: text("food_vibe"),
  aestheticPreference: text("aesthetic_preference"),
  // Gift mode — when birthdayFor === "other"
  birthdayFor: text("birthday_for").notNull().default("self"), // "self" | "other"
  recipientRelationship: text("recipient_relationship"), // "best friend" | "partner" | "parent" | "sibling" | "coworker" | "other"
  giftBudget: text("gift_budget"), // "under-50" | "50-150" | "150-500" | "500+"
  giftInterests: jsonb("gift_interests").$type<string[]>(), // ["wellness", "books", "travel", ...]
  // Meta
  status: generationStatusEnum("status").notNull().default("pending"),
  ipHash: text("ip_hash"), // hashed IP for rate limiting, not PII
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const birthdayGenerations = pgTable("birthday_generations", {
  id: text("id").primaryKey(), // nanoid()
  sessionId: text("session_id")
    .notNull()
    .references(() => birthdaySessions.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  // Step-level status tracking
  stepStatus: jsonb("step_status").$type<StepStatusMap>(),
  // Generated content (structured JSON per section)
  birthdayTitle: text("birthday_title"),
  birthdayArchetype: text("birthday_archetype"),
  birthdayEra: text("birthday_era"),
  celebrationNarrative: text("celebration_narrative"),
  colorPalettes: jsonb("color_palettes").$type<ColorPalette[]>(),
  captionPack: jsonb("caption_pack").$type<CaptionCategory[]>(),
  destinations: jsonb("destinations").$type<Destination[]>(),
  celebrationStyle: jsonb("celebration_style").$type<CelebrationStyle>(),
  cosmicProfile: jsonb("cosmic_profile").$type<CosmicProfile>(),
  // Gift recommendations (only when birthdayFor === "other")
  gifts: jsonb("gifts").$type<Gift[]>(),
  // External data (fetched, not AI-generated)
  restaurants: jsonb("restaurants").$type<Restaurant[]>(),
  activities: jsonb("activities").$type<Activity[]>(),
  // Share assets
  shareCardUrl: text("share_card_url"), // Vercel Blob URL
  shareCardThumbnailUrl: text("share_card_thumbnail_url"),
  // Cost tracking
  model: text("model").notNull().default("anthropic/claude-sonnet-4.6"),
  tokenUsage: jsonb("token_usage").$type<TokenUsage>(),
  estimatedCostCents: integer("estimated_cost_cents"),
  // Status & timing
  status: generationStatusEnum("status").notNull().default("pending"),
  errorMessage: text("error_message"),
  generationStartedAt: timestamp("generation_started_at"),
  generationCompletedAt: timestamp("generation_completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generationEvents = pgTable("generation_events", {
  id: text("id").primaryKey(),
  generationId: text("generation_id")
    .notNull()
    .references(() => birthdayGenerations.id, { onDelete: "cascade" }),
  step: text("step").notNull(), // "identity" | "palettes" | "captions" | etc.
  status: generationStatusEnum("status").notNull(),
  durationMs: integer("duration_ms"),
  tokenUsage: jsonb("token_usage").$type<TokenUsage>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promptCache = pgTable("prompt_cache", {
  promptHash: text("prompt_hash").primaryKey(),
  sessionId: text("session_id").notNull(), // which session first generated this
  generationId: text("generation_id").notNull(),
  step: text("step").notNull(), // which pipeline step
  cachedOutput: jsonb("cached_output"), // the reusable AI fragment
  hitCount: integer("hit_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastHitAt: timestamp("last_hit_at"),
});

export const shareEvents = pgTable("share_events", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => birthdaySessions.id),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── User / Waitlist ────────────────────────────────────────────────────────

export const userWaitlist = pgTable("user_waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  ipHash: text("ip_hash"),
  deviceToken: text("device_token"),
  tier: text("tier").notNull().default("free"), // "free" | "premium"
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Blog Agent Drafts ──────────────────────────────────────────────────────

export const blogDrafts = pgTable("blog_drafts", {
  id: text("id").primaryKey(),
  // Lifecycle
  status: text("status").notNull().default("draft"), // "draft" | "approved" | "rejected" | "published"
  // Lane discriminator — added by the Growth Operator extension.
  kind: text("kind").notNull().default("blog"), // "blog" | "traffic-page"
  targetCategory: text("target_category"), // for kind='traffic-page' only
  targetSlug: text("target_slug"), // seed's proposed slug for kind='traffic-page'
  // Topic research
  topicSeedId: text("topic_seed_id"),
  topicTitle: text("topic_title").notNull(),
  topicScore: jsonb("topic_score"), // { total, searchOpportunity, clusterFit, affiliateFit, freshness, dedupRisk }
  topicReason: text("topic_reason"), // why this topic was chosen
  // Draft content (full BlogPost OR ContentPage object depending on kind)
  postData: jsonb("post_data").notNull(),
  // QA
  qualityGates: jsonb("quality_gates"), // { [gateName]: { passed, details } }
  gatesPassed: integer("gates_passed").notNull().default(0),
  gatesTotal: integer("gates_total").notNull().default(12),
  // Generation metadata
  model: text("model"),
  tokenUsage: jsonb("token_usage"),
  estimatedCostCents: integer("estimated_cost_cents"),
  durationMs: integer("duration_ms"),
  // Review
  reviewNotes: text("review_notes"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  publishedAt: timestamp("published_at"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── JSON Column Types ───────────────────────────────────────────────────────

export type StepStatus = "queued" | "running" | "complete" | "error" | "skipped";

export type StepStatusMap = {
  identity: StepStatus;
  palettes: StepStatus;
  captions: StepStatus;
  destinations: StepStatus;
  celebrationStyle: StepStatus;
  restaurants: StepStatus;
  activities: StepStatus;
  cosmic: StepStatus;
  gifts?: StepStatus;
};

export interface ColorPalette {
  name: string;
  mood: string;
  colors: { hex: string; name: string; role: string }[];
}

export interface CaptionCategory {
  category: string;
  captions: string[];
}

export interface Destination {
  city: string;
  country: string;
  whyItFitsYou: string;
  bestMonths: string[]; // e.g. ["March", "April"]
  timingFit: "perfect" | "good" | "workable" | "off-season";
  timingNote: string; // e.g. "Great around your birthday" or "Best as a birthday-year trip"
  vibeMatch: string[];
  estimatedBudget: "budget" | "mid" | "luxury";
  section: "season" | "dream" | "chosen"; // "chosen" = user's pre-selected celebration city
}

export interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  address: string;
  whyItFitsYou: string;
  googlePlaceId?: string;
  rating?: number;
  venueType?: "dinner" | "drinks" | "wildcard";
}

export interface Activity {
  name: string;
  /** Business/venue name, separate from the descriptive `name`. Used
   *  for Google Maps query building so links route to the actual place
   *  instead of searching the full descriptive phrase. */
  venueName?: string;
  category: "experience" | "attraction" | "outdoor" | "nightlife" | "wellness" | "culture";
  description: string;
  whyItFitsYou: string;
  neighborhood: string;
  priceRange: "free" | "$" | "$$" | "$$$";
  bestTimeOfDay: "morning" | "afternoon" | "evening" | "anytime";
  bookingTip?: string;
}

export interface CelebrationStyle {
  primaryStyle: string;
  description: string;
  rituals: string[];
  aesthetic: string;
  outfit: string;
  playlist: string;
}

export interface Gift {
  label: string; // display name e.g. "A Cashmere Throw They Didn't Buy Themselves"
  description: string; // 1-2 sentence why-this-fits explanation
  amazonQuery: string; // search term to feed Amazon affiliate link
  category: string; // "wellness" | "books" | "home" | "fashion" | "travel" | "tech" | "experience" | "food" | "beauty"
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  whyThemSpecifically?: string; // optional extra "this is for THIS person" line
}

export interface AstrocartographyHighlight {
  city: string;
  country: string;
  reason: string;
}

export interface CosmicProfile {
  sunSign: string;
  risingSign?: string;
  moonSign?: string;
  dominantElement: string;
  astrocartographyHighlights?: AstrocartographyHighlight[];
  birthdayMessage: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

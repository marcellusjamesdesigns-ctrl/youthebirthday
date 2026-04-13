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
  section: "season" | "dream"; // which section this belongs in
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

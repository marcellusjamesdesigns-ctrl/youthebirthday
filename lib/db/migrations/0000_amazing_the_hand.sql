CREATE TYPE "public"."birthday_mode" AS ENUM('quick', 'cosmic');--> statement-breakpoint
CREATE TYPE "public"."generation_status" AS ENUM('pending', 'processing', 'complete', 'error');--> statement-breakpoint
CREATE TABLE "birthday_generations" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"step_status" jsonb,
	"birthday_title" text,
	"birthday_archetype" text,
	"birthday_era" text,
	"celebration_narrative" text,
	"color_palettes" jsonb,
	"caption_pack" jsonb,
	"destinations" jsonb,
	"celebration_style" jsonb,
	"cosmic_profile" jsonb,
	"restaurants" jsonb,
	"activities" jsonb,
	"share_card_url" text,
	"share_card_thumbnail_url" text,
	"model" text DEFAULT 'anthropic/claude-sonnet-4.6' NOT NULL,
	"token_usage" jsonb,
	"estimated_cost_cents" integer,
	"status" "generation_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"generation_started_at" timestamp,
	"generation_completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "birthday_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pronoun" text,
	"custom_pronoun" text,
	"birthdate" text NOT NULL,
	"birth_year" integer NOT NULL,
	"current_city" text NOT NULL,
	"current_lat" text,
	"current_lng" text,
	"celebration_city" text,
	"celebration_vibe" text NOT NULL,
	"birthday_goals" jsonb,
	"mode" "birthday_mode" DEFAULT 'quick' NOT NULL,
	"birth_time" text,
	"birth_city" text,
	"birth_lat" text,
	"birth_lng" text,
	"birth_timezone_offset" text,
	"budget" text,
	"group_size" text,
	"food_vibe" text,
	"aesthetic_preference" text,
	"status" "generation_status" DEFAULT 'pending' NOT NULL,
	"ip_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"topic_seed_id" text,
	"topic_title" text NOT NULL,
	"topic_score" jsonb,
	"topic_reason" text,
	"post_data" jsonb NOT NULL,
	"quality_gates" jsonb,
	"gates_passed" integer DEFAULT 0 NOT NULL,
	"gates_total" integer DEFAULT 12 NOT NULL,
	"model" text,
	"token_usage" jsonb,
	"estimated_cost_cents" integer,
	"duration_ms" integer,
	"review_notes" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_events" (
	"id" text PRIMARY KEY NOT NULL,
	"generation_id" text NOT NULL,
	"step" text NOT NULL,
	"status" "generation_status" NOT NULL,
	"duration_ms" integer,
	"token_usage" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt_cache" (
	"prompt_hash" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"generation_id" text NOT NULL,
	"step" text NOT NULL,
	"cached_output" jsonb,
	"hit_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_hit_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "share_events" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"referrer" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"ip_hash" text,
	"device_token" text,
	"tier" text DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "birthday_generations" ADD CONSTRAINT "birthday_generations_session_id_birthday_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."birthday_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_events" ADD CONSTRAINT "generation_events_generation_id_birthday_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."birthday_generations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_events" ADD CONSTRAINT "share_events_session_id_birthday_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."birthday_sessions"("id") ON DELETE no action ON UPDATE no action;
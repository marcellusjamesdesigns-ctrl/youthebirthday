-- Growth Operator: extend blog_drafts to also hold traffic-page drafts.
--
-- `kind` distinguishes what's in `post_data`:
--   blog          — existing blog-post draft (default, preserves history)
--   traffic-page  — new programmatic content page under a hub
--
-- `target_category` is set for kind='traffic-page' and names the hub the
-- page belongs to (captions, ideas, themes, palettes, destinations,
-- milestones, zodiac). Nullable for blog kind.
--
-- `target_slug` is set for kind='traffic-page' and carries the seed's
-- proposed slug; nullable otherwise. We do NOT store the final published
-- slug here — that lives in post_data alongside the rest of the content.

ALTER TABLE "blog_drafts"
  ADD COLUMN IF NOT EXISTS "kind" text NOT NULL DEFAULT 'blog',
  ADD COLUMN IF NOT EXISTS "target_category" text,
  ADD COLUMN IF NOT EXISTS "target_slug" text;

-- Index for the runtime merge bridge: quickly find published traffic
-- pages for a given category hub.
CREATE INDEX IF NOT EXISTS "blog_drafts_kind_status_category_idx"
  ON "blog_drafts" ("kind", "status", "target_category");

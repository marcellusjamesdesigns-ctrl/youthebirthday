-- Gift mode fields on birthday_sessions
ALTER TABLE "birthday_sessions"
  ADD COLUMN "birthday_for" text NOT NULL DEFAULT 'self',
  ADD COLUMN "recipient_relationship" text,
  ADD COLUMN "gift_budget" text,
  ADD COLUMN "gift_interests" jsonb;

-- Gifts column on birthday_generations
ALTER TABLE "birthday_generations"
  ADD COLUMN "gifts" jsonb;

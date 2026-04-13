-- Add celebration_city column to birthday_sessions
-- This is where the user is celebrating (may differ from current_city)
-- NULL means "same as current_city" — resolved at runtime in normalize-input.ts
ALTER TABLE birthday_sessions ADD COLUMN IF NOT EXISTS celebration_city text;

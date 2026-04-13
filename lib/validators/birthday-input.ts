import { z } from "zod";

export const celebrationVibes = [
  "Luxury & Indulgence",
  "Adventure & Travel",
  "Intimate & Cozy",
  "Wild & Social",
  "Self-Care & Restoration",
  "Cultural & Intellectual",
  "Romantic & Dreamy",
  "Spiritual & Intentional",
] as const;

export const birthdayGoalOptions = [
  "Feel glamorous",
  "Make memories",
  "Travel somewhere new",
  "Spend time with loved ones",
  "Treat myself",
  "Keep it low key",
  "Do something I've never done",
  "Celebrate my growth",
] as const;

export const budgetOptions = ["budget", "mid", "luxury"] as const;
export const groupSizeOptions = ["solo", "partner", "small", "large"] as const;

export const BirthdayInputSchema = z.object({
  // Step 1 — Basics
  name: z.string().min(1).max(50),
  birthdate: z.string().regex(/^\d{2}-\d{2}$/, "Must be MM-DD format"),
  birthYear: z.number().int().min(1920).max(new Date().getFullYear()),
  currentCity: z.string().min(1).max(200),
  currentLat: z.string().optional(),
  currentLng: z.string().optional(),
  celebrationCity: z.string().max(200).optional(), // where they're celebrating (defaults to currentCity)

  // Step 2 — Vibe
  celebrationVibe: z.enum(celebrationVibes),
  birthdayGoals: z.array(z.enum(birthdayGoalOptions)).min(1).max(5),

  // Step 3 — Preferences (optional)
  pronoun: z.string().max(20).optional(),
  budget: z.enum(budgetOptions).optional(),
  groupSize: z.enum(groupSizeOptions).optional(),
  foodVibe: z.string().max(100).optional(),
  aestheticPreference: z.string().max(100).optional(),

  // Step 4 — Cosmic (optional)
  mode: z.enum(["quick", "cosmic"]).default("quick"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  birthCity: z.string().max(200).optional(),
  birthLat: z.string().optional(),
  birthLng: z.string().optional(),
});

export type BirthdayInput = z.infer<typeof BirthdayInputSchema>;

import { z } from "zod";

// Step 1: Identity generation
export const BirthdayIdentitySchema = z.object({
  birthdayTitle: z
    .string()
    .describe("A punchy, personalized birthday title, max 8 words"),
  birthdayArchetype: z
    .string()
    .describe("A 2-3 word archetype e.g. 'Solar Eclipse Queen'"),
  birthdayEra: z
    .string()
    .describe("A cultural era reference e.g. 'Your Soft Launch Era'"),
  celebrationNarrative: z
    .string()
    .describe("2-3 sentence personalized birthday narrative"),
});

// Step 2a: Color palettes
export const ColorPaletteSchema = z.object({
  palettes: z.array(
    z.object({
      name: z.string().describe("Palette name e.g. 'Midnight Luxe'"),
      mood: z.string().describe("2-3 word mood descriptor"),
      colors: z.array(
        z.object({
          hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
          name: z.string(),
          role: z.string().describe("e.g. 'primary', 'accent', 'background'"),
        })
      ).length(5),
    })
  ).min(4).max(6),
});

// Step 2b: Caption pack
export const CaptionPackSchema = z.object({
  categories: z.array(
    z.object({
      category: z
        .string()
        .describe("Category name e.g. 'Hype', 'Soft Girl', 'Petty', 'Mystical', 'Reflective'"),
      captions: z.array(z.string()).min(2).max(3),
    })
  ).min(5),
});

// Step 2c: Destination recommendations
export const DestinationSchema = z.object({
  destinations: z.array(
    z.object({
      city: z.string(),
      country: z.string(),
      whyItFitsYou: z.string().describe("Personalized 2-3 sentence explanation of why THIS person should go THERE"),
      bestMonths: z.array(z.string()).min(1).max(4).describe("Best months to visit, e.g. ['March', 'April']"),
      timingFit: z.enum(["perfect", "good", "workable", "off-season"]).describe("How well this destination fits the user's birthday month"),
      timingNote: z.string().describe("Human-readable timing note, e.g. 'Great around your birthday' or 'Best as a birthday-year trip later on'"),
      vibeMatch: z.array(z.string()).min(2).max(4),
      estimatedBudget: z.enum(["budget", "mid", "luxury"]),
      section: z.enum(["season", "dream"]).describe("'season' = fits their birthday window, 'dream' = great vibe match but better in another season"),
    })
  ).min(5).max(7),
});

// Step 3: Celebration style
export const CelebrationStyleSchema = z.object({
  primaryStyle: z.string().describe("e.g. 'Intimate Dinner Goddess'"),
  description: z.string().describe("2-3 sentence description"),
  rituals: z.array(z.string()).min(3).max(5),
  aesthetic: z.string(),
  outfit: z.string().describe("Outfit direction, not a specific product"),
  playlist: z.string().describe("Genre/vibe descriptor for a birthday playlist"),
});

// Step 4: Restaurant / venue recommendations (AI-generated)
export const RestaurantSchema = z.object({
  restaurants: z.array(
    z.object({
      name: z.string().describe("Real name of the venue"),
      cuisine: z.string().describe("Cuisine type or venue type"),
      priceRange: z.enum(["$", "$$", "$$$", "$$$$"]),
      address: z.string().describe("Real address or neighborhood"),
      whyItFitsYou: z.string().describe("1-2 sentence personalized explanation"),
      rating: z.number().min(1).max(5).nullable().describe("Rating out of 5, null if unsure"),
      venueType: z.enum(["dinner", "drinks", "wildcard"]).describe("Category of venue"),
    })
  ).min(4).max(6),
});

// Step 5: Cosmic profile (conditional)
export const CosmicProfileSchema = z.object({
  sunSign: z.string(),
  risingSign: z.string().optional(),
  moonSign: z.string().optional(),
  dominantElement: z.string(),
  astrocartographyHighlights: z.array(z.string()).optional(),
  birthdayMessage: z
    .string()
    .describe("Personalized cosmic birthday message, 2-3 sentences"),
});

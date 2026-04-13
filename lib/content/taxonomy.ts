// ─── Content Taxonomies ──────────────────────────────────────────────────────
// These define the tagging dimensions for all content pages.
// Used for: programmatic page generation, filtering, internal linking, related content.

export const ageMilestones = [
  18, 21, 25, 27, 30, 33, 35, 40, 45, 50, 55, 60, 65, 70, 75,
] as const;

export const zodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;

export const zodiacLabels: Record<string, string> = {
  aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer",
  leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio",
  sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius", pisces: "Pisces",
};

export const zodiacDateRanges: Record<string, string> = {
  aries: "March 21 – April 19", taurus: "April 20 – May 20",
  gemini: "May 21 – June 20", cancer: "June 21 – July 22",
  leo: "July 23 – August 22", virgo: "August 23 – September 22",
  libra: "September 23 – October 22", scorpio: "October 23 – November 21",
  sagittarius: "November 22 – December 21", capricorn: "December 22 – January 19",
  aquarius: "January 20 – February 18", pisces: "February 19 – March 20",
};

export const vibes = [
  "luxury", "soft-life", "turn-up", "intimate", "solo",
  "adventure", "romantic", "healing", "cultural", "spiritual",
] as const;

export const vibeLabels: Record<string, string> = {
  luxury: "Luxury", "soft-life": "Soft Life", "turn-up": "Turn Up",
  intimate: "Intimate", solo: "Solo", adventure: "Adventure",
  romantic: "Romantic", healing: "Healing & Reset",
  cultural: "Cultural", spiritual: "Spiritual",
};

export const seasons = ["spring", "summer", "fall", "winter"] as const;

export const seasonLabels: Record<string, string> = {
  spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter",
};

export const destinationTypes = [
  "beach", "city", "mountain", "island", "wellness",
  "nightlife", "cultural", "nature", "tropical",
] as const;

export const paletteMoods = [
  "warm", "cool", "earthy", "pastel", "bold",
  "moody", "luxe", "minimal", "tropical", "romantic",
] as const;

export const contentCategories = [
  "captions", "ideas", "destinations", "palettes", "themes", "zodiac",
] as const;

export type ContentCategory = (typeof contentCategories)[number];
export type ZodiacSign = (typeof zodiacSigns)[number];
export type Vibe = (typeof vibes)[number];
export type Season = (typeof seasons)[number];

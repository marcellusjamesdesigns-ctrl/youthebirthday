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

export const zodiacRulingPlanets: Record<string, string> = {
  aries: "Mars", taurus: "Venus", gemini: "Mercury", cancer: "Moon",
  leo: "Sun", virgo: "Mercury", libra: "Venus", scorpio: "Pluto & Mars",
  sagittarius: "Jupiter", capricorn: "Saturn", aquarius: "Uranus & Saturn", pisces: "Neptune & Jupiter",
};

export const zodiacElements: Record<string, string> = {
  aries: "Fire", taurus: "Earth", gemini: "Air", cancer: "Water",
  leo: "Fire", virgo: "Earth", libra: "Air", scorpio: "Water",
  sagittarius: "Fire", capricorn: "Earth", aquarius: "Air", pisces: "Water",
};

export const zodiacModalities: Record<string, string> = {
  aries: "Cardinal", taurus: "Fixed", gemini: "Mutable", cancer: "Cardinal",
  leo: "Fixed", virgo: "Mutable", libra: "Cardinal", scorpio: "Fixed",
  sagittarius: "Mutable", capricorn: "Cardinal", aquarius: "Fixed", pisces: "Mutable",
};

export const zodiacCompatible: Record<string, string[]> = {
  aries:       ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  taurus:      ["Virgo", "Capricorn", "Cancer", "Pisces"],
  gemini:      ["Libra", "Aquarius", "Aries", "Leo"],
  cancer:      ["Scorpio", "Pisces", "Taurus", "Virgo"],
  leo:         ["Aries", "Sagittarius", "Gemini", "Libra"],
  virgo:       ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  libra:       ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  scorpio:     ["Cancer", "Pisces", "Virgo", "Capricorn"],
  sagittarius: ["Aries", "Leo", "Libra", "Aquarius"],
  capricorn:   ["Taurus", "Virgo", "Scorpio", "Pisces"],
  aquarius:    ["Gemini", "Libra", "Aries", "Sagittarius"],
  pisces:      ["Cancer", "Scorpio", "Taurus", "Capricorn"],
};

export const zodiacElementGroups: Record<string, string[]> = {
  Fire:  ["Aries", "Leo", "Sagittarius"],
  Earth: ["Taurus", "Virgo", "Capricorn"],
  Air:   ["Gemini", "Libra", "Aquarius"],
  Water: ["Cancer", "Scorpio", "Pisces"],
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

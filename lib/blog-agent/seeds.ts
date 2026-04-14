import type { BlogCategory } from "@/lib/content/types";

/**
 * Candidate topic seeds for the blog agent.
 *
 * Each seed is a structured instruction for what the agent should draft —
 * not a title, but a brief. The agent is free to word the final title.
 *
 * Seeds are rotated through a scoring pass each run. The top-scoring
 * seed that is not yet covered gets drafted.
 *
 * To add new topics, append to this list. Keep briefs tight.
 */

export type Season = "spring" | "summer" | "fall" | "winter" | "any";

export interface TopicSeed {
  id: string;                           // stable, unique ID — never reused
  brief: string;                        // what the post is about
  slugHint: string;                     // expected slug shape
  titleHint: string;                    // loose title direction
  category: BlogCategory;               // category the post should fit
  clusterTags: string[];                // what clusters this expands
  hasShoppingIntent: boolean;           // should include Amazon module
  seasonalityWindow?: Season[];         // when it's best to publish (empty = always)
  affiliateHint?: string;               // what Amazon module direction to push
  /** Manual bias — raise for known high-search topics, lower for niche */
  bias?: number;
}

export const TOPIC_SEEDS: TopicSeed[] = [
  // ── Shopping / planning (highest affiliate fit) ──────────────────────
  {
    id: "decorations-dark-feminine",
    brief: "Decoration guide for a dark feminine birthday — velvet, candles, dramatic florals, structured tablescape.",
    slugHint: "best-birthday-decorations-dark-feminine-party",
    titleHint: "Best Birthday Decorations for a Dark Feminine Party",
    category: "planning",
    clusterTags: ["theme:dark-feminine", "vibe:intimate"],
    hasShoppingIntent: true,
    affiliateHint: "black candles, velvet textiles, dark florals, brass and oxblood accents",
    bias: 1.1,
  },
  {
    id: "decorations-old-money",
    brief: "Decoration guide for an old money birthday — quiet luxury, monograms, tailored linens, heritage touches.",
    slugHint: "best-birthday-decorations-old-money-party",
    titleHint: "Best Birthday Decorations for an Old Money Birthday",
    category: "planning",
    clusterTags: ["theme:old-money", "vibe:luxury"],
    hasShoppingIntent: true,
    affiliateHint: "monogrammed napkins, crystal, silver trays, heirloom-style glassware",
  },
  {
    id: "checklist-birthday-party-planning",
    brief: "A complete birthday party planning checklist by week — 4 weeks, 2 weeks, 1 week, day-of.",
    slugHint: "birthday-party-planning-checklist",
    titleHint: "Birthday Party Planning Checklist: Week-by-Week",
    category: "planning",
    clusterTags: ["type:checklist"],
    hasShoppingIntent: true,
    affiliateHint: "invitations, decor essentials, table basics, lighting",
    bias: 1.2,
  },
  {
    id: "gift-ideas-30th-birthday-woman",
    brief: "Thoughtful 30th birthday gift ideas for a woman — personal, not generic, across price tiers.",
    slugHint: "30th-birthday-gift-ideas-for-her",
    titleHint: "30th Birthday Gift Ideas for Her",
    category: "gifts",
    clusterTags: ["age:30", "audience:her"],
    hasShoppingIntent: true,
    affiliateHint: "personalized jewelry, luxury home, journals, photography books",
    bias: 1.2,
  },
  {
    id: "gift-ideas-30th-birthday-man",
    brief: "Thoughtful 30th birthday gift ideas for a man — useful, beautiful, not cliched.",
    slugHint: "30th-birthday-gift-ideas-for-him",
    titleHint: "30th Birthday Gift Ideas for Him",
    category: "gifts",
    clusterTags: ["age:30", "audience:him"],
    hasShoppingIntent: true,
    affiliateHint: "leather, watches, grooming, cocktail kits, books",
    bias: 1.1,
  },
  {
    id: "gift-ideas-40th-birthday-woman",
    brief: "Thoughtful 40th birthday gift ideas for a woman — sophisticated, meaningful, thoughtful.",
    slugHint: "40th-birthday-gift-ideas-for-her",
    titleHint: "40th Birthday Gift Ideas for Her",
    category: "gifts",
    clusterTags: ["age:40", "audience:her"],
    hasShoppingIntent: true,
    affiliateHint: "fine jewelry, spa kits, heirloom pieces, wine",
  },
  {
    id: "gift-ideas-50th-birthday",
    brief: "50th birthday gift ideas that feel celebratory and genuinely useful, not patronizing about age.",
    slugHint: "50th-birthday-gift-ideas",
    titleHint: "50th Birthday Gift Ideas That Actually Land",
    category: "gifts",
    clusterTags: ["age:50"],
    hasShoppingIntent: true,
    affiliateHint: "wine, travel accessories, fine leather, engraved keepsakes",
  },
  {
    id: "gift-ideas-best-friend",
    brief: "Birthday gift ideas for a best friend that show attention without trying too hard.",
    slugHint: "best-friend-birthday-gift-ideas",
    titleHint: "Best Friend Birthday Gift Ideas She'll Actually Use",
    category: "gifts",
    clusterTags: ["audience:best-friend"],
    hasShoppingIntent: true,
    affiliateHint: "matching pieces, signature scents, photo books, thoughtful home",
    bias: 1.1,
  },

  // ── Style ───────────────────────────────────────────────────────────
  {
    id: "birthday-outfit-30th",
    brief: "What to wear to your 30th birthday — outfit ideas by vibe (luxury, soft life, dark feminine, romantic, turn up).",
    slugHint: "what-to-wear-30th-birthday-outfit-ideas",
    titleHint: "What to Wear to Your 30th Birthday",
    category: "style",
    clusterTags: ["age:30", "type:outfit"],
    hasShoppingIntent: true,
    affiliateHint: "clutches, jewelry, heels, scent",
  },
  {
    id: "birthday-outfit-21st",
    brief: "What to wear to your 21st birthday — outfit ideas that feel grown, not costumed.",
    slugHint: "what-to-wear-21st-birthday-outfit-ideas",
    titleHint: "What to Wear to Your 21st Birthday",
    category: "style",
    clusterTags: ["age:21", "type:outfit"],
    hasShoppingIntent: true,
    affiliateHint: "mini dresses, statement jewelry, heels, going-out clutches",
  },
  {
    id: "birthday-outfit-trip",
    brief: "What to pack and wear for a birthday trip — resort, city, and cooler-climate variations.",
    slugHint: "what-to-pack-birthday-trip-outfit-ideas",
    titleHint: "What to Pack (and Wear) on Your Birthday Trip",
    category: "style",
    clusterTags: ["type:trip", "type:outfit"],
    hasShoppingIntent: true,
    affiliateHint: "packable linen, sunglasses, swim, weekender bag, travel jewelry",
  },

  // ── Seasonal / zodiac ────────────────────────────────────────────────
  {
    id: "june-birthday-gemini",
    brief: "June birthday ideas during Gemini season — social, conversational, variety-seeking celebrations.",
    slugHint: "june-birthday-ideas-gemini-season",
    titleHint: "June Birthday Ideas for Gemini Season",
    category: "seasonal",
    clusterTags: ["season:spring", "zodiac:gemini", "month:june"],
    hasShoppingIntent: false,
    seasonalityWindow: ["spring"],
    bias: 1.3,
  },
  {
    id: "july-birthday-cancer",
    brief: "July birthday ideas during Cancer season — cozy, sentimental, water-adjacent celebrations.",
    slugHint: "july-birthday-ideas-cancer-season",
    titleHint: "July Birthday Ideas for Cancer Season",
    category: "seasonal",
    clusterTags: ["season:summer", "zodiac:cancer", "month:july"],
    hasShoppingIntent: false,
    seasonalityWindow: ["summer"],
  },
  {
    id: "august-birthday-leo",
    brief: "August birthday ideas during Leo season — bold, performative, celebrated loudly.",
    slugHint: "august-birthday-ideas-leo-season",
    titleHint: "August Birthday Ideas for Leo Season",
    category: "seasonal",
    clusterTags: ["season:summer", "zodiac:leo", "month:august"],
    hasShoppingIntent: false,
    seasonalityWindow: ["summer"],
  },
  {
    id: "september-birthday-virgo",
    brief: "September birthday ideas during Virgo season — intentional, organized, quietly excellent.",
    slugHint: "september-birthday-ideas-virgo-season",
    titleHint: "September Birthday Ideas for Virgo Season",
    category: "seasonal",
    clusterTags: ["season:fall", "zodiac:virgo", "month:september"],
    hasShoppingIntent: false,
    seasonalityWindow: ["fall"],
  },
  {
    id: "october-birthday-libra",
    brief: "October birthday ideas during Libra season — beautiful, balanced, socially gracious.",
    slugHint: "october-birthday-ideas-libra-season",
    titleHint: "October Birthday Ideas for Libra Season",
    category: "seasonal",
    clusterTags: ["season:fall", "zodiac:libra", "month:october"],
    hasShoppingIntent: false,
    seasonalityWindow: ["fall"],
  },
  {
    id: "november-birthday-scorpio",
    brief: "November birthday ideas during Scorpio season — private, intense, ritual-inspired.",
    slugHint: "november-birthday-ideas-scorpio-season",
    titleHint: "November Birthday Ideas for Scorpio Season",
    category: "seasonal",
    clusterTags: ["season:fall", "zodiac:scorpio", "month:november"],
    hasShoppingIntent: false,
    seasonalityWindow: ["fall"],
  },
  {
    id: "december-birthday-sagittarius",
    brief: "December birthday ideas for Sagittarius season — how to celebrate when it overlaps the holidays.",
    slugHint: "december-birthday-ideas-sagittarius-season",
    titleHint: "December Birthday Ideas When Your Day Shares the Holidays",
    category: "seasonal",
    clusterTags: ["season:winter", "zodiac:sagittarius", "month:december"],
    hasShoppingIntent: false,
    seasonalityWindow: ["winter"],
    bias: 1.2,
  },
  {
    id: "january-birthday-capricorn",
    brief: "January birthday ideas for Capricorn season — intentional, disciplined, new-year aligned.",
    slugHint: "january-birthday-ideas-capricorn-season",
    titleHint: "January Birthday Ideas for Capricorn Season",
    category: "seasonal",
    clusterTags: ["season:winter", "zodiac:capricorn", "month:january"],
    hasShoppingIntent: false,
    seasonalityWindow: ["winter"],
  },
  {
    id: "february-birthday-aquarius",
    brief: "February birthday ideas for Aquarius season — unconventional, thoughtful, independent.",
    slugHint: "february-birthday-ideas-aquarius-season",
    titleHint: "February Birthday Ideas for Aquarius Season",
    category: "seasonal",
    clusterTags: ["season:winter", "zodiac:aquarius", "month:february"],
    hasShoppingIntent: false,
    seasonalityWindow: ["winter"],
  },
  {
    id: "march-birthday-pisces",
    brief: "March birthday ideas during Pisces season — dreamy, creative, water-inspired.",
    slugHint: "march-birthday-ideas-pisces-season",
    titleHint: "March Birthday Ideas for Pisces Season",
    category: "seasonal",
    clusterTags: ["season:spring", "zodiac:pisces", "month:march"],
    hasShoppingIntent: false,
    seasonalityWindow: ["winter", "spring"],
  },
  {
    id: "april-birthday-aries",
    brief: "April birthday ideas during Aries season — energetic, adventurous, leading the spring.",
    slugHint: "april-birthday-ideas-aries-season",
    titleHint: "April Birthday Ideas for Aries Season",
    category: "seasonal",
    clusterTags: ["season:spring", "zodiac:aries", "month:april"],
    hasShoppingIntent: false,
    seasonalityWindow: ["spring"],
  },

  // ── Milestones / life-stage planning ─────────────────────────────────
  {
    id: "30th-birthday-bucket-list",
    brief: "30 things to do before you turn 30 — a bucket list post that doubles as a life-audit.",
    slugHint: "30-things-to-do-before-30-birthday-bucket-list",
    titleHint: "30 Things to Do Before You Turn 30",
    category: "milestones",
    clusterTags: ["age:30"],
    hasShoppingIntent: false,
  },
  {
    id: "birthday-alone-ideas",
    brief: "How to celebrate your birthday alone and actually enjoy it — framings and concrete plans.",
    slugHint: "how-to-celebrate-your-birthday-alone",
    titleHint: "How to Celebrate Your Birthday Alone (And Love It)",
    category: "milestones",
    clusterTags: ["vibe:solo"],
    hasShoppingIntent: true,
    affiliateHint: "spa products, journaling, self-care, solo dinner essentials",
    bias: 1.2,
  },
  {
    id: "birthday-during-sad-time",
    brief: "How to approach a birthday during a hard year — grief, transition, burnout — without forcing celebration.",
    slugHint: "how-to-handle-birthday-during-hard-year",
    titleHint: "How to Handle Your Birthday During a Hard Year",
    category: "milestones",
    clusterTags: ["type:emotional"],
    hasShoppingIntent: false,
  },
  {
    id: "milestone-birthday-traditions",
    brief: "Birthday traditions worth starting at each major milestone — 21, 25, 30, 40, 50.",
    slugHint: "milestone-birthday-traditions-worth-starting",
    titleHint: "Birthday Traditions Worth Starting at Every Milestone",
    category: "milestones",
    clusterTags: ["type:tradition"],
    hasShoppingIntent: false,
  },

  // ── Planning — venue / logistics ─────────────────────────────────────
  {
    id: "host-birthday-at-home",
    brief: "How to host a birthday at home that doesn't feel like a party at your house — setting, flow, food, exit strategy.",
    slugHint: "how-to-host-birthday-at-home",
    titleHint: "How to Host a Birthday at Home (Without It Feeling Like Your House)",
    category: "planning",
    clusterTags: ["type:hosting"],
    hasShoppingIntent: true,
    affiliateHint: "table basics, candles, glassware, bar tools",
  },
  {
    id: "restaurant-vs-home-birthday",
    brief: "Restaurant birthday vs home birthday — which to choose based on guest count, budget, and energy.",
    slugHint: "restaurant-vs-home-birthday-dinner",
    titleHint: "Restaurant or Home Birthday Dinner: How to Choose",
    category: "planning",
    clusterTags: ["type:dinner"],
    hasShoppingIntent: false,
  },
  {
    id: "budget-birthday-ideas-under-100",
    brief: "Birthday ideas under $100 that don't feel cheap — how to make a small budget look intentional.",
    slugHint: "birthday-ideas-under-100-dollars",
    titleHint: "Birthday Ideas Under $100 That Don't Feel Cheap",
    category: "planning",
    clusterTags: ["type:budget"],
    hasShoppingIntent: true,
    affiliateHint: "affordable decor, thoughtful small gifts, lighting",
    bias: 1.2,
  },

  // ── Style / aesthetic expansions ─────────────────────────────────────
  {
    id: "birthday-cake-trends",
    brief: "Birthday cake aesthetics worth stealing — editorial, vintage, minimalist, lambeth, single-tier.",
    slugHint: "birthday-cake-aesthetic-ideas",
    titleHint: "Birthday Cake Aesthetics Worth Stealing",
    category: "style",
    clusterTags: ["type:cake"],
    hasShoppingIntent: false,
  },
  {
    id: "birthday-flower-arrangements",
    brief: "Birthday flower arrangement ideas by vibe — soft life, dark feminine, maximalist, minimalist.",
    slugHint: "birthday-flower-arrangement-ideas",
    titleHint: "Birthday Flower Arrangements by Vibe",
    category: "style",
    clusterTags: ["type:florals"],
    hasShoppingIntent: true,
    affiliateHint: "vases, dried stems, floral shears, arrangement books",
  },

  // ── Milestones — caption adjacents ───────────────────────────────────
  {
    id: "captions-birthday-month",
    brief: "Birthday month captions — for the people who celebrate the whole month, with Instagram-ready lines.",
    slugHint: "birthday-month-captions-instagram",
    titleHint: "Birthday Month Captions That Aren't Tired",
    category: "planning",
    clusterTags: ["type:captions"],
    hasShoppingIntent: false,
  },
  {
    id: "captions-birthday-dinner",
    brief: "Birthday dinner Instagram captions — vibe-specific, sophisticated, copy-ready.",
    slugHint: "birthday-dinner-captions-instagram",
    titleHint: "Birthday Dinner Captions Your Friends Will Screenshot",
    category: "planning",
    clusterTags: ["type:captions", "type:dinner"],
    hasShoppingIntent: false,
  },
];

export function findSeedById(id: string): TopicSeed | undefined {
  return TOPIC_SEEDS.find((s) => s.id === id);
}

/**
 * Curated traffic-page seed list for the Growth Operator's traffic-page lane.
 *
 * V1 GUARDRAIL — the agent may ONLY publish into a seed listed here. This
 * prevents taxonomy drift and one-off oddball pages. Adding a new seed is
 * a deliberate act (code review, commit). The cron selector picks the
 * highest-priority unfilled seed each run.
 *
 * Each seed is a tight brief for a specific gap we've identified across
 * the existing content hubs. Seeds name a category, slug, title direction,
 * and which ContentSection types the page should lead with — so the
 * generator doesn't guess at structure.
 */
import type { ContentCategory } from "@/lib/content/taxonomy";

/** ContentSection type keys the traffic-page generator is allowed to emit. */
export type TrafficSectionType =
  | "hero"
  | "paragraph"
  | "quick-take"
  | "caption-list"
  | "idea-list"
  | "destination-list"
  | "palette-showcase"
  | "tip-list"
  | "faq"
  | "itinerary"
  | "travel-inquiry-cta"
  | "cta"
  | "related-content";

export interface TrafficSeed {
  /** Stable ID — never reuse once a draft has been generated against it. */
  id: string;
  /** The hub this page belongs under. */
  category: ContentCategory;
  /** Final URL slug under /{category-route}/{slug}. */
  slug: string;
  /** Loose title direction — the model may refine wording. */
  titleHint: string;
  /** Loose subheadline direction. */
  subheadlineHint?: string;
  /** 1-2 sentence brief describing the page's intent + expected shape. */
  brief: string;
  /** Priority tag — higher numbers run first when unfilled. */
  priority: number;
  /** Required structural sections the model must produce. */
  requiredSections: TrafficSectionType[];
  /** Optional keyword hints for the generator (SEO tone). */
  keywordHints?: string[];
}

export const TRAFFIC_SEEDS: TrafficSeed[] = [
  // ── Captions gaps ──────────────────────────────────────────────────
  {
    id: "captions-35th",
    category: "captions",
    slug: "35th-birthday-captions",
    titleHint: "35th Birthday Captions for Instagram",
    subheadlineHint: "Thirty-five. The quiet flex.",
    brief:
      "Instagram captions for 35th birthdays. Tone: grown, not desperate to seem young, not performatively reflective. 25-30 captions across 5 moods (confident, soft, funny, luxury, grateful). Hub peer to 21st/25th/30th/40th/50th. Avoid clichés like 'flirty thirty-five' and 'vintage year' — those don't exist in real feeds.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "caption-list", "tip-list", "cta", "related-content"],
    keywordHints: ["35th birthday captions", "35th birthday instagram", "turning 35 captions"],
  },
  {
    id: "captions-60th",
    category: "captions",
    slug: "60th-birthday-captions",
    titleHint: "60th Birthday Captions for Instagram",
    subheadlineHint: "Sixty is the new vantage point.",
    brief:
      "Instagram captions for 60th birthdays. Tone: dignified, warmly celebratory, not mawkish. 25-30 captions across moods (reflective, grateful, playful, family-focused, luxury). Avoid 'young at heart', 'sixty is the new forty', and any kid-card clichés.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "caption-list", "tip-list", "cta", "related-content"],
    keywordHints: ["60th birthday captions", "60th birthday instagram"],
  },
  {
    id: "captions-for-sister",
    category: "captions",
    slug: "birthday-captions-for-sister",
    titleHint: "Birthday Captions for Your Sister",
    subheadlineHint: "The one who raised you while you raised her.",
    brief:
      "Instagram captions you'd actually post about your sister on her birthday. 25-30 captions across moods (younger sister, older sister, sister-in-law, best-friend-sister, twin). Avoid Pinterest-tier 'sisters by blood, friends by choice' — give real, specific lines.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "caption-list", "tip-list", "cta", "related-content"],
    keywordHints: ["birthday captions for sister", "sister birthday instagram"],
  },
  {
    id: "captions-for-boyfriend",
    category: "captions",
    slug: "birthday-captions-for-boyfriend",
    titleHint: "Birthday Captions for Your Boyfriend",
    subheadlineHint: "For the birthday post that doesn't feel generic.",
    brief:
      "Instagram captions for your boyfriend's birthday. 25-30 captions across moods (romantic, playful, soft, long-term relationship, new relationship, funny). Write like a real person in a relationship, not a Hallmark card.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "caption-list", "tip-list", "cta", "related-content"],
    keywordHints: ["birthday captions for boyfriend", "boyfriend birthday instagram"],
  },

  // ── Ideas gaps ──────────────────────────────────────────────────────
  {
    id: "ideas-35th",
    category: "ideas",
    slug: "35th-birthday-ideas",
    titleHint: "35th Birthday Ideas — Celebration Plans for Turning 35",
    subheadlineHint: "Thirty-five deserves a real plan, not a recycled thirtieth.",
    brief:
      "Celebration plan ideas for 35th birthdays. 10-15 concrete ideas across formats (dinner party, weekend trip, solo reset, with partner, with friend group). For each: format, why it suits 35, price tier, vibe tag. Peer to existing 30th-birthday-ideas.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "idea-list", "tip-list", "cta", "related-content"],
    keywordHints: ["35th birthday ideas", "things to do for 35th birthday"],
  },
  {
    id: "ideas-adult-slumber-party",
    category: "ideas",
    slug: "adult-birthday-slumber-party-ideas",
    titleHint: "Adult Birthday Slumber Party Ideas",
    subheadlineHint: "A grown-up sleepover that doesn't feel childish.",
    brief:
      "Ideas for adult slumber-party birthdays — a legitimately trending format. 10-12 ideas covering setup (matching pajamas, breakfast-for-dinner, face masks as activity), venues (Airbnb, private room, home), group size (4-8 works best), and activities. Tone: grown, aesthetic, not ironic.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "idea-list", "tip-list", "cta", "related-content"],
    keywordHints: ["adult slumber party", "grown up sleepover birthday"],
  },
  {
    id: "ideas-last-minute",
    category: "ideas",
    slug: "last-minute-birthday-ideas",
    titleHint: "Last-Minute Birthday Ideas That Still Feel Considered",
    subheadlineHint: "Three days out, no plan, still want it to feel special.",
    brief:
      "Celebration ideas that can be executed in 1-5 days. 10-12 ideas with realistic prep time. For each: hours-needed, price tier, number of people, vibe. Emphasis on simple-but-intentional over scrambled.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "idea-list", "tip-list", "cta", "related-content"],
    keywordHints: ["last minute birthday ideas", "birthday ideas short notice"],
  },

  // ── Themes gaps ─────────────────────────────────────────────────────
  {
    id: "themes-dark-feminine",
    category: "themes",
    slug: "dark-feminine-birthday-theme",
    titleHint: "Dark Feminine Birthday Theme — Moody, Intentional, Candlelit",
    subheadlineHint: "Velvet, oxblood, tapered candles. The birthday they'll screenshot.",
    brief:
      "Full dark feminine birthday theme guide — decor, florals, outfit, color palette, playlist direction, venue type, photography cue. Not goth, not vamp — grown-woman dark feminine (Rosalía, Hailey Bieber dinner energy). Include 3-5 color palette hex codes.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "palette-showcase", "tip-list", "faq", "cta", "related-content"],
    keywordHints: ["dark feminine birthday", "dark feminine party theme"],
  },
  {
    id: "themes-y2k",
    category: "themes",
    slug: "y2k-birthday-theme",
    titleHint: "Y2K Birthday Theme — Butterflies, Lip Gloss, and Early-2000s Energy",
    subheadlineHint: "Low-rise optional, disposable camera required.",
    brief:
      "Full Y2K birthday theme guide — decor, outfit, palette, playlist, invitation style, activities. Emphasize specific references (MSN Messenger blue, Paris Hilton pink, butterfly clips, Motorola Razr, disposable cameras). Include 3-5 palette colors.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "palette-showcase", "tip-list", "faq", "cta", "related-content"],
    keywordHints: ["y2k birthday theme", "early 2000s party theme"],
  },
  {
    id: "themes-quiet-luxury",
    category: "themes",
    slug: "quiet-luxury-birthday-theme",
    titleHint: "Quiet Luxury Birthday Theme — Ivory, Tobacco, Considered",
    subheadlineHint: "The birthday that doesn't announce itself and somehow still wins.",
    brief:
      "Full quiet luxury birthday theme guide — decor (linen, real flowers, taper candles), palette (ivory, champagne, tobacco, olive), outfit direction, venue cues, playlist. Anti-logo, anti-balloon, pro-considered. Hex codes for 3-5 palette colors.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "palette-showcase", "tip-list", "faq", "cta", "related-content"],
    keywordHints: ["quiet luxury birthday", "old money birthday theme"],
  },

  // ── Destinations gaps ──────────────────────────────────────────────
  {
    id: "destinations-30th",
    category: "destinations",
    slug: "30th-birthday-destinations",
    titleHint: "30th Birthday Destinations — Where to Celebrate Turning 30",
    subheadlineHint: "The birthday trip that actually marks the chapter change.",
    brief:
      "Destination picks specifically framed for 30th birthdays. 8-12 destinations across categories (city weekend, beach reset, alpine escape, abroad-first-time, group-friendly). For each: why-30, length, group size, price tier.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "destination-list", "tip-list", "faq", "cta", "related-content"],
    keywordHints: ["30th birthday trip", "best 30th birthday destinations"],
  },
  {
    id: "destinations-beach",
    category: "destinations",
    slug: "beach-birthday-destinations",
    titleHint: "Beach Birthday Destinations — Where to Spend a Birthday by the Water",
    subheadlineHint: "From Positano to Tulum to the Florida Keys.",
    brief:
      "Beach-focused birthday destinations. 10-12 spots across price tiers (luxe, mid, budget) and distances (domestic, Caribbean, Europe, Asia). For each: beach quality, where to stay, what makes it good for a birthday specifically (photo spots, dinner options, not-overly-touristy).",
    priority: 7,
    requiredSections: ["hero", "paragraph", "destination-list", "tip-list", "faq", "cta", "related-content"],
    keywordHints: ["beach birthday destinations", "birthday beach trip"],
  },
  {
    id: "destinations-weekend",
    category: "destinations",
    slug: "weekend-birthday-destinations",
    titleHint: "Weekend Birthday Trip Destinations — 2 or 3 Nights, Well Spent",
    subheadlineHint: "Short trip, real story.",
    brief:
      "Destinations that work as a 2-3 night birthday trip (Friday afternoon through Sunday). 10-12 picks, emphasis on short travel time + high-density experience. For each: how to sequence Friday/Saturday/Sunday.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "destination-list", "tip-list", "faq", "cta", "related-content"],
    keywordHints: ["weekend birthday trip", "2 night birthday getaway"],
  },

  // ── Destination categories (editorial template, not stop-gap) ────
  {
    id: "destinations-romantic",
    category: "destinations",
    slug: "romantic-birthday-destinations",
    titleHint: "Romantic Birthday Destinations — Trips for Two",
    subheadlineHint: "Cliffside dinners, private villas, slow mornings.",
    brief:
      "Category page for romantic (couple-first) birthday destinations. Full editorial template: hero, thesis, quick-take, destination-list with 8-12 picks (Positano, Kyoto, Santorini, Marrakech, Paris, Tulum, Napa, Prague, Banff, Florence, Quebec City, Cartagena), 'who this is for', 'how to choose', budget note, travel-inquiry-cta, generator CTA.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "quick-take", "destination-list", "tip-list", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["romantic birthday trip", "birthday destinations for couples"],
  },
  {
    id: "destinations-girls-trip",
    category: "destinations",
    slug: "girls-trip-birthday-destinations",
    titleHint: "Girls Trip Birthday Destinations — Group-Friendly Picks",
    subheadlineHint: "Cabo, Nashville, Miami, Ibiza — the birthdays with the group text that never stops.",
    brief:
      "Category page for group-of-women birthday trips. Full editorial template. Destinations: Nashville, Miami, Cabo, Ibiza, Tulum, Charleston, Scottsdale, Napa, Mexico City, Lisbon, Mykonos, New Orleans. Include group sizing notes (5-10 ideal) + who-pays-for-what section.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "quick-take", "destination-list", "tip-list", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["girls trip birthday", "best girls trip destinations"],
  },
  {
    id: "destinations-party",
    category: "destinations",
    slug: "party-birthday-destinations",
    titleHint: "Party Birthday Destinations — Where to Go to Actually Go Out",
    subheadlineHint: "Ibiza, Vegas, Mykonos, Medellín. Nights that don't end at 11.",
    brief:
      "Category page for nightlife-forward birthday trips. 8-12 destinations: Ibiza, Mykonos, Vegas, Miami, Medellín, Tulum, Berlin, Bangkok, Rio, Dubai, Tel Aviv. Include notes on which venues actually deliver, how to build a 48h party trip, and which destinations are overrated for nightlife.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "quick-take", "destination-list", "tip-list", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["party birthday destinations", "best birthday party trips"],
  },
  {
    id: "destinations-wellness",
    category: "destinations",
    slug: "wellness-birthday-destinations",
    titleHint: "Wellness Birthday Destinations — Retreats, Resets, Spa Trips",
    subheadlineHint: "For the birthday that needs to feel like a rebuild, not a performance.",
    brief:
      "Category page for wellness-first birthday trips. 8-12 destinations: Tulum, Bali, Sedona, Ojai, Costa Rica, Big Sur, Iceland, Kyoto, Napa, Joshua Tree, Cabo, Amalfi. Include 'solo-friendly or partnered' flag, retreat vs hotel guidance, and what to book 3-6 months out.",
    priority: 8,
    requiredSections: ["hero", "paragraph", "quick-take", "destination-list", "tip-list", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["wellness birthday trip", "birthday retreat destinations"],
  },
  {
    id: "destinations-foodie",
    category: "destinations",
    slug: "foodie-birthday-destinations",
    titleHint: "Foodie Birthday Destinations — Where the Meal Is the Trip",
    subheadlineHint: "Tokyo, Lyon, Oaxaca, San Sebastián — trips built around the reservations.",
    brief:
      "Category page for food-forward birthday trips. 8-12 destinations: Tokyo, Paris, Lyon, San Sebastián, Oaxaca, Mexico City, Bologna, Copenhagen, Napa, Charleston, Lima, Bangkok. Include must-book-ahead windows (Noma is 6 months) and markets to hit on arrival.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "quick-take", "destination-list", "tip-list", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["foodie birthday trip", "best culinary birthday destinations"],
  },
  {
    id: "destinations-winter",
    category: "destinations",
    slug: "winter-birthday-destinations",
    titleHint: "Winter Birthday Destinations — Where to Go November–February",
    subheadlineHint: "Cabins, ski lodges, sun escapes, quiet cities in off-season.",
    brief:
      "Category page for winter-month birthday destinations. Split into two buckets: snow/cozy (Banff, Zermatt, Aspen, Lake Tahoe, Reykjavik, Kyoto, Quebec City) and sun-escape (Cabo, Tulum, Caribbean, Dubai, Cartagena, Medellín). 10-12 total with notes on flight windows and peak-week pricing.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "quick-take", "destination-list", "tip-list", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["winter birthday trip", "december january february birthday destinations"],
  },

  // ── City pages (10 top cities) ─────────────────────────────────────
  {
    id: "city-miami",
    category: "destinations",
    slug: "miami-birthday-trip",
    titleHint: "Miami Birthday Trip — Complete Guide & Itinerary",
    subheadlineHint: "Beach clubs, Cuban breakfasts, night-1 energy for days.",
    brief:
      "Full city-page for a Miami birthday. Hero, 2-3 paragraph thesis (Wynwood vs South Beach vs Brickell energy), quick-take, why-it-works, where-to-stay (3-4 neighborhoods: South Beach, Brickell, Wynwood, Coconut Grove), what-to-do (beach clubs, Wynwood walls, Key Biscayne, boat days), where-to-eat (5 specific places), style direction, 3-day itinerary, travel-inquiry-cta.",
    priority: 10,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["miami birthday trip", "miami birthday itinerary"],
  },
  {
    id: "city-vegas",
    category: "destinations",
    slug: "vegas-birthday-trip",
    titleHint: "Las Vegas Birthday Trip — Complete Guide",
    subheadlineHint: "Pool days, steak dinners, one show, a memory that gets retold.",
    brief:
      "Full city-page for a Vegas birthday. Neighborhoods: Strip vs downtown. What to do: pool parties, shows, day trip to Red Rock. Where to eat: 5 dinner picks beyond Gordon Ramsay cliches. Style direction. 3-day itinerary. Include 'how to not waste money on bottle service unless it's actually your thing.'",
    priority: 10,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["las vegas birthday", "vegas birthday trip"],
  },
  {
    id: "city-tulum",
    category: "destinations",
    slug: "tulum-birthday-trip",
    titleHint: "Tulum Birthday Trip — Complete Guide",
    subheadlineHint: "Jungle hotels, cenote swims, beachfront omakase, mezcal sunsets.",
    brief:
      "Full city-page for a Tulum birthday. Neighborhoods: beach road vs downtown. Hotel recommendations by vibe (jungle, beachfront, wellness). What to do: cenotes, Sian Ka'an, ruins, yoga. Where to eat: 5 picks from tulum-hype to locals'. Style direction. 4-day itinerary. Address Tulum's 2024-2026 price creep honestly.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["tulum birthday trip", "tulum birthday itinerary"],
  },
  {
    id: "city-nyc",
    category: "destinations",
    slug: "nyc-birthday-trip",
    titleHint: "NYC Birthday Trip — Complete Guide",
    subheadlineHint: "The density play — 72 hours that feel like a week.",
    brief:
      "Full city-page for an NYC birthday. Neighborhoods: Soho vs West Village vs LES vs UWS. What to do: signature experiences (rooftop, Broadway, museum hour, park walk). Where to eat: 6 picks across price tiers. Style direction. 3-day itinerary. Include 'how to not over-schedule.'",
    priority: 9,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["nyc birthday trip", "new york city birthday itinerary"],
  },
  {
    id: "city-paris",
    category: "destinations",
    slug: "paris-birthday-trip",
    titleHint: "Paris Birthday Trip — Complete Guide",
    subheadlineHint: "Long lunches, neighborhood walks, the birthday that earns itself.",
    brief:
      "Full city-page for a Paris birthday. Neighborhoods: Marais, Saint-Germain, 11th arr, Canal Saint-Martin. Best for which vibe. What to do beyond obvious (Louvre is crowded; Musée Marmottan isn't). Where to eat: 6 picks. Style direction. 4-day itinerary. Season guide.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["paris birthday trip", "paris birthday itinerary"],
  },
  {
    id: "city-bali",
    category: "destinations",
    slug: "bali-birthday-trip",
    titleHint: "Bali Birthday Trip — Complete Guide",
    subheadlineHint: "Two bases: jungle (Ubud) + beach (Uluwatu or Canggu). How to do both.",
    brief:
      "Full city-page for a Bali birthday. Base split: Ubud for wellness + Uluwatu/Canggu for beach. Villa vs resort guidance. What to do: sunrise hike, temple, rice terrace walk, surf. Where to eat: 5 picks across both bases. Style direction. 6-day itinerary including travel between bases.",
    priority: 9,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["bali birthday trip", "bali birthday itinerary"],
  },
  {
    id: "city-tokyo",
    category: "destinations",
    slug: "tokyo-birthday-trip",
    titleHint: "Tokyo Birthday Trip — Complete Guide",
    subheadlineHint: "Omakase, Shibuya at night, cherry blossom if you time it.",
    brief:
      "Full city-page for a Tokyo birthday. Neighborhoods: Ginza vs Shibuya vs Aoyama vs Ebisu. Best hotels by vibe. What to do: reservations-required (Golden Gai, Jiro-level omakase, teamLab). Where to eat: 6 across price tiers. Style direction. 5-day itinerary. Season guide (cherry blossom vs fall foliage vs off-season).",
    priority: 8,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["tokyo birthday trip", "tokyo birthday itinerary"],
  },
  {
    id: "city-dubai",
    category: "destinations",
    slug: "dubai-birthday-trip",
    titleHint: "Dubai Birthday Trip — Complete Guide",
    subheadlineHint: "The maximalist birthday city — infinity pools, desert nights, Michelin tables.",
    brief:
      "Full city-page for a Dubai birthday. Neighborhoods: Palm Jumeirah vs Downtown vs Business Bay. Hotels by budget tier. What to do: desert safari, Burj Khalifa lounge, beach club, souk. Where to eat: 5 picks. Style direction. 4-day itinerary. When to go (October-March only, honestly).",
    priority: 8,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["dubai birthday trip", "dubai birthday itinerary"],
  },
  {
    id: "city-cape-town",
    category: "destinations",
    slug: "cape-town-birthday-trip",
    titleHint: "Cape Town Birthday Trip — Complete Guide",
    subheadlineHint: "Winelands, Table Mountain, ocean suites — luxury that costs half of Europe.",
    brief:
      "Full city-page for a Cape Town birthday. Neighborhoods: V&A Waterfront vs Camps Bay vs Constantia. What to do: Table Mountain, Cape Point, Stellenbosch day trip, shark cage diving (if brave). Where to eat: 5 picks including La Colombe. Style direction. 5-day itinerary including wine country. Season (Nov-March).",
    priority: 7,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["cape town birthday trip", "cape town birthday itinerary"],
  },
  {
    id: "city-cartagena",
    category: "destinations",
    slug: "cartagena-birthday-trip",
    titleHint: "Cartagena Birthday Trip — Complete Guide",
    subheadlineHint: "Colonial-walled, Caribbean-warm, still-not-overrun.",
    brief:
      "Full city-page for a Cartagena birthday. Neighborhoods: Old City (Walled) vs Getsemaní vs Bocagrande. What to do: Old City evening walk, Rosario Islands boat day, salsa lesson, Palenque day trip. Where to eat: 5 picks. Style direction. 4-day itinerary. Best for groups of 4-8 on $3k/person.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "quick-take", "tip-list", "itinerary", "travel-inquiry-cta", "cta", "related-content"],
    keywordHints: ["cartagena birthday trip", "cartagena colombia birthday"],
  },

  // ── Palettes gaps (we just shipped 5 new ones, so only filling remaining holes) ──
  {
    id: "palettes-black-and-gold",
    category: "palettes",
    slug: "black-and-gold-birthday-palettes",
    titleHint: "Black and Gold Birthday Palettes — Hex Codes for the Classic Combo",
    subheadlineHint: "The highest-contrast luxury palette, four ways.",
    brief:
      "Focused entry on black-and-gold specifically (goes deeper than the general gold palettes page already on the site). 4 black-and-gold variations: classic jet + rich gold, matte black + champagne, black + rose gold, black + antique gold. 5 hex codes each. Styling notes for each.",
    priority: 7,
    requiredSections: ["hero", "paragraph", "palette-showcase", "tip-list", "cta", "related-content"],
    keywordHints: ["black and gold birthday", "black gold party colors"],
  },

  // Note: /milestone-birthdays uses a bespoke structure (not HubCards-driven),
  // so we don't expose it as a traffic-page seed target in V1. Milestone pages
  // will be added by hand until the milestones hub supports the sub-page pattern.
];

/** Pick the highest-priority seed whose slug is not already taken in the
 * given category. Returns null if every seed for every category is filled. */
export function findNextUnfilledSeed(
  takenSlugsByCategory: Record<string, Set<string>>,
): TrafficSeed | null {
  const sorted = [...TRAFFIC_SEEDS].sort((a, b) => b.priority - a.priority);
  for (const seed of sorted) {
    const taken = takenSlugsByCategory[seed.category] ?? new Set<string>();
    if (!taken.has(seed.slug)) return seed;
  }
  return null;
}

export function findTrafficSeedById(id: string): TrafficSeed | undefined {
  return TRAFFIC_SEEDS.find((s) => s.id === id);
}

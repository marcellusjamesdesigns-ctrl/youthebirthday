import type { NormalizedInput } from "./normalize-input";

export const PROMPT_VERSION = "v4";

function vibeContext(input: NormalizedInput): string {
  const parts = [
    `Name: ${input.name}`,
    `Turning: ${input.ageTurning}`,
    `Zodiac: ${input.zodiacSign}`,
    `Home city: ${input.currentCity}`,
    `Celebrating in: ${input.celebrationCity}`,
    `Vibe: ${input.celebrationVibe}`,
    `Goals: ${input.birthdayGoals.join(", ")}`,
  ];
  if (input.pronoun) parts.push(`Pronouns: ${input.pronoun}`);
  if (input.budget) parts.push(`Budget: ${input.budget}`);
  if (input.groupSize) parts.push(`Group size: ${input.groupSize}`);
  if (input.aestheticPreference) parts.push(`Aesthetic: ${input.aestheticPreference}`);
  if (input.foodVibe) parts.push(`Food vibe: ${input.foodVibe}`);
  return parts.join("\n");
}

export function buildIdentityPrompt(input: NormalizedInput) {
  return {
    system: `You are the creative engine behind "You The Birthday" — a culturally sharp birthday experience platform. You write like someone who understands internet culture, astrology vibes, luxury aesthetics, and real life. Your outputs should feel personal, specific, and screenshot-worthy. Never generic. Never corny. Never "wishing you the best on your special day" energy.`,
    user: `Create a birthday identity for this person:

${vibeContext(input)}

Generate:
- birthdayTitle: A punchy, personalized birthday headline (max 8 words). This is the hero text on their dashboard. It should feel like a thesis statement for their year. Examples of the energy: "Thirty and Threatening", "The Unbothered Era Begins", "Quarter Century, Full Volume". Make it specific to their age, vibe, and energy.
- birthdayArchetype: A 2-3 word archetype that captures their birthday energy. Think tarot-meets-pop-culture. Examples: "Solar Eclipse Queen", "Velvet Reckoning", "Main Character Ascending". This should feel like a title card.
- birthdayEra: A short era declaration. Think cultural moment meets personal chapter. Examples: "Your Soft Launch Era", "Chapter ${input.ageTurning}: The Reclamation", "The Luxury Rewrite". Make it feel like they'd put this in their bio.
- celebrationNarrative: 2-3 sentences that read like someone who knows them wrote it. Reference their age, vibe, and goals. Don't be preachy. Be real. This should feel like the opening monologue of their birthday documentary.`,
  };
}

export function buildPalettePrompt(input: NormalizedInput) {
  const seasonalDirection = getSeasonalColorDirection(input.birthMonth);
  const aestheticDirection = getAestheticColorDirection(input.aestheticPreference, input.celebrationVibe);
  // Entropy seed forces LLM to produce different output even for identical inputs
  const seed = Math.floor(Math.random() * 9000) + 1000;

  return {
    system: `You are a color director for "You The Birthday." You design birthday color palettes that feel intentional, premium, and aesthetically coherent. Every palette should be usable for: invitations, outfits, nails, decor, and Instagram grids.

CRITICAL DIFFERENTIATION RULES:
- The user's MOOD, VIBE, and AESTHETIC are the primary drivers. A "Wild & Social" vibe should look RADICALLY different from a "Self-Care & Restoration" vibe. Do not average them out.
- NEVER produce two palettes with the same dominant color family. If palette 1 has warm golds, palette 2 must not. If palette 3 has blues, palette 4 must not also be blue-forward.
- Do NOT default to the "luxury editorial" color family (champagne/mauve/navy) unless the user explicitly chose old-money or luxury aesthetics. Push beyond it.
- Palette names must be hyper-specific to THIS person — reference their age, city, vibe, or cultural moment. Never use names like "Midnight Luxe", "Golden Hour", "Soft Bloom", or "Earth & Stone".
- Each palette must feel like it was designed for a completely different shoot, mood board, or editorial — not variations of the same theme.`,
    user: `Design 6 birthday color palettes for:

${vibeContext(input)}
Birthday season: ${input.birthMonthName} (${seasonalDirection.season})

SEASONAL COLOR DIRECTION: ${seasonalDirection.direction}
AESTHETIC COLOR DIRECTION: ${aestheticDirection}

Generation seed: ${seed} (use this to introduce variation — don't produce the same palettes you'd generate for seed 0000)

Each palette needs:
- A UNIQUE name that could only apply to this person (reference their age, city, vibe, or a specific cultural moment)
- A 2-3 word mood descriptor
- Exactly 5 colors with: valid hex code, color name, and role (primary/accent/neutral/background/statement)

The 6 palettes MUST be structured as:
1. SEASONAL SIGNATURE: Anchored to ${input.birthMonthName}. ${seasonalDirection.palette1Direction} — use the dominant color of this season.
2. VIBE MATCH: Captures their "${input.celebrationVibe}" energy. ${getVibeMoodBoardDirection(input.celebrationVibe)} — name it after their specific celebration.
3. AESTHETIC PULL: ${input.aestheticPreference ? `Inspired by "${input.aestheticPreference}" — translate this aesthetic into a color language.` : `Matches their ${input.zodiacSign} energy — use the planetary/elemental colors of this sign.`}
4. UNEXPECTED CONTRAST: Completely different color temperature and mood. Not the obvious choice. Surprises but still cohesive.
5. CITY COLOR: A palette that captures the color energy of ${input.celebrationCity} — think of it as a visual postcard of the city they're celebrating in.
6. BOLD STATEMENT: The most saturated, high-contrast, "you cannot miss this" palette. Not subtle. Not muted. Maximum impact.

FORBIDDEN DEFAULTS (never generate these):
- Champagne + mauve + navy + gold (wedding palette trap)
- More than one palette with predominantly muted/desaturated tones
- Any two palettes sharing the same dominant hue family
- Generic palette names that could apply to any birthday

All hex codes must be valid 6-digit hex (#RRGGBB). Colors within each palette must actually work together.`,
  };
}

function getSeasonalColorDirection(month: number): { season: string; direction: string; palette1Direction: string } {
  if (month >= 3 && month <= 5) {
    return {
      season: "spring",
      direction: "Spring energy: fresh greens, soft florals, bright pastels, lavender fields, cherry blossom pinks, new-growth yellows. Light, optimistic, alive.",
      palette1Direction: "Use spring-forward colors — fresh, light, blooming. Think cherry blossom, new leaf, morning sky.",
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      season: "summer",
      direction: "Summer energy: saturated tropicals, ocean blues, sunset oranges, hot pinks, golden yellows, coral reds. Bold, warm, sun-drenched.",
      palette1Direction: "Use high-summer colors — saturated, warm, sun-kissed. Think sunset, tropical water, ripe fruit.",
    };
  }
  if (month >= 9 && month <= 11) {
    return {
      season: "fall",
      direction: "Fall energy: burnt orange, deep burgundy, forest green, mustard, plum, warm browns, copper. Rich, grounded, cinematic.",
      palette1Direction: "Use autumnal colors — rich, warm, cinematic. Think harvest, amber light, velvet.",
    };
  }
  return {
    season: "winter",
    direction: "Winter energy: deep jewel tones, icy blues, silver, evergreen, midnight navy, cranberry, frosted metallics. Dramatic, elegant, crystalline.",
    palette1Direction: "Use winter colors — deep, dramatic, crystalline. Think midnight, frost, jewel box.",
  };
}

function getVibeMoodBoardDirection(vibe: string): string {
  const directions: Record<string, string> = {
    "Luxury & Indulgence": "Think: deep emerald, rich cognac, black onyx, brushed gold. NOT champagne-beige. Rich and decadent.",
    "Adventure & Travel": "Think: cerulean ocean, sun-baked terracotta, jungle green, sandstone. Saturated and kinetic.",
    "Intimate & Cozy": "Think: candlelight amber, wine-stained burgundy, warm ivory, dusty rose. Tactile and warm.",
    "Wild & Social": "Think: neon coral, electric cyan, hot magenta, acid yellow. Loud, party-ready, impossible to ignore.",
    "Self-Care & Restoration": "Think: cool sage, mineral blue, cloud white, soft eucalyptus, quartz pink. Spa-calming.",
    "Cultural & Intellectual": "Think: ink navy, oxidized copper, gallery white, terracotta, deep sienna. Museum-editorial.",
    "Romantic & Dreamy": "Think: deep blush, silvery lavender, moonstone gray, rose gold, garnet. Soft but not saccharine.",
    "Spiritual & Intentional": "Think: deep amethyst, midnight teal, smoke gray, gold leaf, burnt umber. Mystical and grounded.",
  };
  return directions[vibe] ?? "Push the color story beyond the obvious — make it feel like a distinct era.";
}

function getAestheticColorDirection(aesthetic: string | null, vibe: string): string {
  if (aesthetic) {
    const lower = aesthetic.toLowerCase();
    if (lower.includes("y2k")) return "Y2K aesthetic: iridescent, baby blue, hot pink, chrome silver, lilac. Playful futurism.";
    if (lower.includes("old money")) return "Old money aesthetic: navy, cream, hunter green, burgundy, camel. Inherited elegance.";
    if (lower.includes("cottagecore")) return "Cottagecore aesthetic: sage, cream, dusty rose, wheat, lavender. Pastoral warmth.";
    if (lower.includes("minimalist")) return "Minimalist aesthetic: pure whites, warm grays, single accent color. Restrained precision.";
    if (lower.includes("maximalist")) return "Maximalist aesthetic: jewel-saturated, bold pattern clashes, rich layering. More is more.";
    if (lower.includes("afro") || lower.includes("african")) return "Afrofuturist aesthetic: kente golds, indigo, terracotta, electric purple, sun orange. Cultural richness.";
    return `"${aesthetic}" aesthetic — translate this into a color language that feels authentic to this aesthetic.`;
  }

  // Fallback: use vibe for direction
  const vibeDirections: Record<string, string> = {
    "Luxury & Indulgence": "Lean into opulence: deep golds, rich blacks, emerald, champagne. But avoid the default mauve trap.",
    "Adventure & Travel": "Lean into movement: oceanic teals, sunset warmth, earthy neutrals, sky blues.",
    "Intimate & Cozy": "Lean into warmth: candlelight amber, soft blush, warm cream, muted wine.",
    "Wild & Social": "Lean into energy: electric brights, neon accents, bold contrasts, party-ready saturations.",
    "Self-Care & Restoration": "Lean into calm: spa greens, cloud whites, soft lavender, mineral blues.",
    "Cultural & Intellectual": "Lean into depth: museum neutrals, ink blues, architectural grays, accent vermillion.",
    "Romantic & Dreamy": "Lean into softness: blush, peony, soft gold, dove gray, moonlight blue.",
    "Spiritual & Intentional": "Lean into transcendence: amethyst, sage, midnight, moonstone, incense smoke.",
  };
  return vibeDirections[vibe] ?? "Match the celebration energy to a distinct color language.";
}

export function buildCaptionPrompt(input: NormalizedInput) {
  return {
    system: `You write Instagram captions for "You The Birthday." Your captions get screenshotted. They're not greeting cards — they're posts from someone who knows exactly who they are. You understand how people actually talk on Instagram, Twitter, and TikTok. Short, rhythmic, confident. No hashtags. No emojis unless they're truly earned.`,
    user: `Write a birthday caption pack for:

${vibeContext(input)}

Create at least 5 categories with 2-3 captions each:
- Hype & Confident: energy, self-assurance, main character
- Soft & Reflective: gratitude, growth, peace
- Funny & Real: self-deprecating, relatable, witty
- Luxury & Glamour: expensive taste, celebration, flex
- Mystical & Zodiac: cosmic, spiritual, ${input.zodiacSign} energy

Every caption must:
- Feel postable RIGHT NOW (not dated, not try-hard)
- Be specific to turning ${input.ageTurning}
- Match their ${input.celebrationVibe} energy
- Work as a standalone post — no context needed
- Be under 280 characters

Do NOT write: "Another year around the sun", "Birthday girl/boy", "It's my birthday and I'll...", or any played-out birthday cliché.`,
  };
}

export function buildDestinationPrompt(input: NormalizedInput) {
  const birthdayWindow = getBirthdayWindow(input.birthMonth);
  const isDifferentCity = input.celebrationCity.toLowerCase() !== input.currentCity.toLowerCase();

  return {
    system: `You are a birthday travel advisor for "You The Birthday." You recommend destinations like a well-traveled friend who knows the person — not a search engine. Your picks should feel curated, not algorithmic.

CRITICAL RANKING RULE: Timing fit is the #1 ranking factor. This person's birthday is in ${input.birthMonthName}. The first 3-4 destinations MUST be genuinely great to visit around their birthday month (${birthdayWindow}). The remaining 2-3 can be "dream picks" — places that match their vibe beautifully but shine best in a different season.

${isDifferentCity ? `NOTE: This person is already planning to celebrate in ${input.celebrationCity}. At least one "season" pick should be a destination near or easily accessible from ${input.celebrationCity}. The other picks should be distinct alternatives.` : `NOTE: This person is based in ${input.currentCity}. Include at least one driveable/short-flight option from there as a "season" pick.`}

This is a birthday product. If someone sees "best in March" for their June birthday in the top section, trust drops immediately. Timing truth matters more than poetic matching.`,
    user: `Recommend 6-7 birthday destinations for:

${vibeContext(input)}
Birthday month: ${input.birthMonthName}
Birthday window: ${birthdayWindow}

Generate TWO groups:

GROUP 1 — "season" picks (3-4 destinations):
These MUST be genuinely good to visit during ${birthdayWindow}. Timing fit should be "perfect" or "good".

GROUP 2 — "dream" picks (2-3 destinations):
These deeply match their vibe but are best in another season. Timing fit should be "workable" or "off-season".

For each destination:
- city and country
- whyItFitsYou: 2-3 sentences explaining why THIS person should go THERE. Reference their vibe, age, and goals. Don't just describe the city — explain the match.
- bestMonths: array of the best 2-4 months to visit (e.g. ["March", "April"])
- timingFit: "perfect" (their birthday month is peak season), "good" (shoulder season, still great), "workable" (doable but not ideal), or "off-season" (genuinely better another time)
- timingNote: human-readable timing copy:
  - For perfect: "Great around your birthday"
  - For good: "Still excellent in ${input.birthMonthName}"
  - For workable: "Doable in ${input.birthMonthName} — expect [specific condition]"
  - For off-season: "Best in [months] — a strong birthday-year trip"
- vibeMatch: 2-4 vibe tags (luxury, beach, nightlife, cultural, wellness, adventure, romantic, solo-friendly, foodie, artistic)
- estimatedBudget: "budget", "mid", or "luxury"
- section: "season" for Group 1, "dream" for Group 2

Mix it up: at least 2 destinations outside the US/Europe. Include one unexpected pick. Make "whyItFitsYou" feel like advice from a friend, not a travel brochure.`,
  };
}

function getBirthdayWindow(month: number): string {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const prev = monthNames[(month - 2 + 12) % 12];
  const curr = monthNames[month - 1];
  const next = monthNames[month % 12];
  return `late ${prev} through early ${next}`;
}

export function buildCelebrationPrompt(input: NormalizedInput) {
  return {
    system: `You are a birthday celebration director for "You The Birthday." You design birthday celebrations that feel like a creative brief — specific, aesthetic, and actionable. Not vague suggestions. Real direction that someone could hand to a friend and say "this is what I want."

CRITICAL: All suggestions must be grounded in where this person is ACTUALLY CELEBRATING. Your rituals, activity ideas, and venue references should make sense for the specific city they're celebrating in. Reference real neighborhoods, vibes, and cultural context of that city.`,
    user: `Design a celebration style for:

${vibeContext(input)}

This person is celebrating in ${input.celebrationCity}. Every ritual and suggestion should feel rooted in that city — reference real neighborhoods, local energy, and things that actually exist there.

Generate:
- primaryStyle: A named celebration style (e.g. "Intimate Dinner Goddess", "Rooftop Revival", "Solo Pilgrimage"). This is the headline for their celebration section.
- description: 2-3 sentences describing the overall feel of how they should celebrate. Specific and visual. Reference ${input.celebrationCity} and what makes celebrating there special.
- rituals: 3-5 specific birthday rituals or activities for their day. These should be concrete actions grounded in ${input.celebrationCity} — reference real neighborhoods, types of venues that exist there, and things you can actually do in that city. Example for NYC: "Start with a sunrise walk across the Brooklyn Bridge and voice-memo your intentions for ${input.ageTurning}" not "reflect on the year."
- aesthetic: One-line aesthetic direction (what the visual vibe should be)
- outfit: Outfit direction — not a specific product, but a mood/direction. Example: "All black with one gold accent piece" or "Linen and bare feet"
- playlist: Genre/vibe descriptor for a birthday playlist. Example: "90s R&B meets lo-fi sunset" or "Afrobeats and champagne energy"

Make it feel like a creative director who knows ${input.celebrationCity} designed their birthday.

${input.foodVibe ? `Their food vibe is "${input.foodVibe}" — let this shape the ritual suggestions, dinner direction, and any food-adjacent recommendations for ${input.celebrationCity}.` : ""}`,
  };
}

export function buildRestaurantPrompt(input: NormalizedInput) {
  const budgetDirection = input.budget === "luxury"
    ? "Focus on upscale and fine dining. $$$-$$$$ range. Places with tasting menus, wine programs, or chef-driven concepts."
    : input.budget === "budget"
    ? "Focus on high-quality affordable spots. $-$$ range. The gems that locals love — incredible food without the markup."
    : "Mix of mid-range and special-occasion spots. $$-$$$ range. Quality over flash.";

  return {
    system: `You are a local dining and nightlife curator for "You The Birthday." You recommend REAL venues that actually exist in the specified city. You know restaurant scenes like a food journalist — what's acclaimed, what's trending, what's the hidden gem locals gatekeep.

CRITICAL RULES:
1. Every venue MUST be a real, currently operating establishment. Do NOT invent restaurant names. If you aren't confident a place exists and is currently open, do NOT include it.
2. Prioritize places with strong reputations — well-reviewed (4.0+ stars equivalent), acclaimed by local press, trending on social media, or beloved neighborhood institutions.
3. Include a mix: at least one acclaimed/established spot, at least one newer or trending spot, and at least one hidden gem or local favorite.
4. Cuisine types should match the user's food vibe and celebration energy.
5. Include the REAL address or neighborhood — if you're not sure of the exact address, give the neighborhood/area.`,
    user: `Recommend 5-6 birthday dining and nightlife spots in ${input.celebrationCity} for:

${vibeContext(input)}

${budgetDirection}

Generate a mix of:
- 2-3 DINNER spots: restaurants perfect for a birthday dinner. These should be the "reservation you plan around" — not chains, not generic. Places that feel special.
- 1-2 DRINKS/NIGHTLIFE spots: bars, lounges, rooftop bars, speakeasies, or wine bars for pre-dinner drinks or after-dinner vibes. Match their energy.
- 1 WILDCARD: a brunch spot, dessert destination, cafe, or activity-venue (cooking class, supper club, etc.) that fits their vibe.

For each venue:
- name: The real name of the establishment
- cuisine: Cuisine type or venue type (e.g. "Japanese Omakase", "Craft Cocktail Bar", "New American", "Wine Bar")
- priceRange: "$", "$$", "$$$", or "$$$$"
- address: Real address or at minimum the neighborhood/area in ${input.celebrationCity}
- whyItFitsYou: 1-2 sentences explaining why this specific spot matches THIS person's birthday energy. Reference their vibe, food preferences, or celebration style. Not a generic review.
- rating: approximate rating out of 5 based on your knowledge (only include if confident, otherwise null)
- venueType: "dinner", "drinks", or "wildcard"

${input.foodVibe ? `Their food vibe is "${input.foodVibe}" — this should heavily shape the restaurant selection. Find places that match this energy specifically.` : ""}
${input.groupSize === "solo" ? "They're celebrating solo — recommend places with great bar seating, counter dining, or solo-friendly atmospheres." : ""}
${input.groupSize === "large" ? "They're celebrating with a large group — recommend places that handle groups well, have private dining options, or communal vibes." : ""}`,
  };
}

export function buildCosmicPrompt(input: NormalizedInput) {
  const chart = input.chart;

  return {
    system: `You are a cosmic birthday advisor for "You The Birthday." You blend real astrological knowledge with accessible, modern interpretation. You're not writing a horoscope — you're giving someone their cosmic birthday briefing. Informed but not dry. Mystical but not vague.

IMPORTANT: The astronomical positions (sun sign, moon sign, rising sign, dominant element) have already been computed using real ephemeris data. Do NOT change or override them. Your job is to write the interpretive content — the birthday message and astrocartography highlights.`,
    user: `Create a cosmic birthday profile for:

${vibeContext(input)}

Their computed chart data:
- Sun: ${chart?.sunSign ?? input.zodiacSign} at ${chart?.sunDegree ?? "?"}°
- Moon: ${chart?.moonSign ?? "unknown"}${chart?.moonDegree ? ` at ${chart.moonDegree}°` : ""}
- Rising: ${chart?.risingSign ?? "not available"}${chart?.risingDegree ? ` at ${chart.risingDegree}°` : ""}
- Dominant Element: ${chart?.dominantElement ?? "unknown"}

DO NOT generate sunSign, moonSign, risingSign, or dominantElement — these are already computed astronomically. Only generate:

- birthdayMessage: A personalized 2-3 sentence cosmic birthday message. Reference their sun sign (${chart?.sunSign ?? input.zodiacSign}), moon sign (${chart?.moonSign ?? "unknown"}), age (${input.ageTurning}), and vibe. This should feel like the universe wrote them a note. Be specific to their chart placements.

${input.birthCity ? `- astrocartographyHighlights: 2-3 locations where someone with this chart configuration would feel energized for celebration, travel, or growth. Frame these as "places where your chart lights up" — inspirational travel suggestions informed by their sign placements, not precise planetary line calculations.` : "Skip astrocartographyHighlights."}

Keep it grounded. This should feel insightful, not like a fortune cookie.`,
  };
}

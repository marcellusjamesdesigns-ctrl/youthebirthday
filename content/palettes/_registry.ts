import { registerPage } from "@/lib/content/registry";
import type { ContentPage } from "@/lib/content/types";

const palettePages: ContentPage[] = [
  {
    slug: "birthday-color-palette-inspiration",
    category: "palettes",
    title: "Birthday Color Palette Inspiration (2026) — Colors for Every Vibe",
    description: "Birthday color palettes for decorations, outfits, and themes. Luxury gold, soft pastels, bold jewel tones, and more with hex codes.",
    headline: "Birthday Color Palette Inspiration",
    subheadline: "Your birthday has a color story. Find it.",
    tags: { celebrationType: "decor" },
    canonicalPath: "/birthday-palettes/birthday-color-palette-inspiration",
    schemaType: "ItemList",
    publishStatus: "published",
    publishedAt: "2026-04-12",
    sections: [
      { type: "hero", headline: "Birthday Color Palette Inspiration", subheadline: "Your birthday has a color story. Find it." },
      { type: "paragraph", body: "Color sets the entire tone — from the invitation to the outfit to the Instagram grid. A strong birthday palette turns a party into an aesthetic. These palettes are designed for real birthday use: decor, flowers, outfits, nails, and everything in between." },
      {
        type: "palette-showcase",
        heading: "Birthday Palettes by Mood",
        palettes: [
          { name: "Midnight Luxe", mood: "sophisticated, mysterious", colors: [{ hex: "#1a1a2e", name: "Midnight" }, { hex: "#16213e", name: "Deep Navy" }, { hex: "#0f3460", name: "Sapphire" }, { hex: "#e94560", name: "Ruby" }, { hex: "#d4af37", name: "Gold" }] },
          { name: "Soft Bloom", mood: "romantic, gentle", colors: [{ hex: "#f8e8e0", name: "Blush" }, { hex: "#f5c6c6", name: "Rose" }, { hex: "#c9b1d0", name: "Lavender" }, { hex: "#a7c5bd", name: "Sage" }, { hex: "#f7f0e8", name: "Cream" }] },
          { name: "Golden Hour", mood: "warm, celebratory", colors: [{ hex: "#f4a261", name: "Amber" }, { hex: "#e76f51", name: "Terracotta" }, { hex: "#264653", name: "Deep Teal" }, { hex: "#2a9d8f", name: "Ocean" }, { hex: "#e9c46a", name: "Honey" }] },
          { name: "Main Character", mood: "bold, unapologetic", colors: [{ hex: "#ff006e", name: "Hot Pink" }, { hex: "#8338ec", name: "Electric Purple" }, { hex: "#3a86ff", name: "Cobalt" }, { hex: "#ffbe0b", name: "Marigold" }, { hex: "#fb5607", name: "Flame" }] },
          { name: "Earth & Stone", mood: "grounded, natural", colors: [{ hex: "#5e503f", name: "Umber" }, { hex: "#a9927d", name: "Tan" }, { hex: "#c2b8a3", name: "Sand" }, { hex: "#d5c4a1", name: "Wheat" }, { hex: "#f2e9e1", name: "Linen" }] },
          { name: "Coastal Calm", mood: "serene, oceanic", colors: [{ hex: "#caf0f8", name: "Ice Blue" }, { hex: "#90e0ef", name: "Sky" }, { hex: "#00b4d8", name: "Cerulean" }, { hex: "#0077b6", name: "Ocean Blue" }, { hex: "#03045e", name: "Deep Sea" }] },
        ],
      },
      { type: "tip-list", heading: "How to Use Birthday Color Palettes", tips: [
        { title: "Pick 2-3 colors, not all 5", body: "Choose a primary, an accent, and a neutral. Using all 5 equally looks chaotic." },
        { title: "Match your outfit to one accent color", body: "You don't need to match the whole palette. One strong color tie makes it intentional." },
        { title: "Use hex codes for digital invites", body: "Copy the hex codes directly into Canva, Figma, or any design tool for perfectly matched invitations." },
      ]},
      { type: "cta", headline: "Get a color palette made for your birthday", subheadline: "Our generator creates palettes based on your zodiac sign, vibe, and celebration style.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
      { type: "related-content" },
    ],
  },
  {
    slug: "zodiac-birthday-color-palettes",
    category: "palettes",
    title: "Zodiac Birthday Color Palettes — Colors for Every Sign",
    description: "Birthday color palettes matched to your zodiac sign. Aries red, Taurus earth, Gemini citrus, Leo gold, Scorpio obsidian, and more with hex codes.",
    headline: "Zodiac Birthday Color Palettes",
    subheadline: "Your sign has a color story. Here's what it looks like.",
    tags: { celebrationType: "decor" },
    canonicalPath: "/birthday-palettes/zodiac-birthday-color-palettes",
    schemaType: "ItemList",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    sections: [
      { type: "hero", headline: "Zodiac Birthday Color Palettes", subheadline: "Your sign has a color story. Here's what it looks like." },
      { type: "paragraph", body: "Every zodiac sign has a distinct energy — and that energy has a color language. These palettes are designed for birthday use: outfits, decorations, invitations, nail colors, and Instagram grids. Each one is rooted in the sign's element, ruling planet, and personality." },
      {
        type: "palette-showcase",
        heading: "Fire Signs (Aries, Leo, Sagittarius)",
        palettes: [
          { name: "Aries Ignition", mood: "bold, powerful", colors: [{ hex: "#c1121f", name: "Scarlet" }, { hex: "#e63946", name: "Fire Red" }, { hex: "#0a0a0a", name: "Black" }, { hex: "#f5f5f5", name: "White" }, { hex: "#ffd60a", name: "Gold Flash" }] },
          { name: "Leo Radiance", mood: "cinematic, golden", colors: [{ hex: "#d4af37", name: "Rich Gold" }, { hex: "#e8871e", name: "Amber" }, { hex: "#1a0a00", name: "Deep Black" }, { hex: "#f5c842", name: "Sunflower" }, { hex: "#fff8e7", name: "Ivory" }] },
          { name: "Sagittarius Horizon", mood: "expansive, jewel-toned", colors: [{ hex: "#4b0082", name: "Indigo" }, { hex: "#7b2d8b", name: "Purple" }, { hex: "#c97d4e", name: "Terra" }, { hex: "#1e3a5f", name: "Deep Blue" }, { hex: "#e8d5a3", name: "Sand" }] },
        ],
      },
      {
        type: "palette-showcase",
        heading: "Earth Signs (Taurus, Virgo, Capricorn)",
        palettes: [
          { name: "Taurus Garden", mood: "lush, sensory", colors: [{ hex: "#5a8a5b", name: "Forest" }, { hex: "#e8c4a0", name: "Blush Peach" }, { hex: "#c8a96e", name: "Caramel" }, { hex: "#f5ebe0", name: "Cream" }, { hex: "#8b5e3c", name: "Copper" }] },
          { name: "Virgo Precision", mood: "clean, intentional", colors: [{ hex: "#2d4a22", name: "Deep Sage" }, { hex: "#8fbc8f", name: "Sage" }, { hex: "#f0ead6", name: "Parchment" }, { hex: "#5c4827", name: "Bark" }, { hex: "#d4c5a9", name: "Wheat" }] },
          { name: "Capricorn Authority", mood: "timeless, powerful", colors: [{ hex: "#2c2c2c", name: "Charcoal" }, { hex: "#0f3d2e", name: "Dark Green" }, { hex: "#c9a96e", name: "Antique Gold" }, { hex: "#f5f0e8", name: "Ivory" }, { hex: "#6b4c2a", name: "Espresso" }] },
        ],
      },
      {
        type: "palette-showcase",
        heading: "Air Signs (Gemini, Libra, Aquarius)",
        palettes: [
          { name: "Gemini Citrus", mood: "bright, energetic", colors: [{ hex: "#f7c948", name: "Lemon" }, { hex: "#ffffff", name: "White" }, { hex: "#a8dadc", name: "Sky" }, { hex: "#f4a261", name: "Peach" }, { hex: "#1d3557", name: "Navy" }] },
          { name: "Libra Bloom", mood: "balanced, romantic", colors: [{ hex: "#e8b4b8", name: "Blush Rose" }, { hex: "#c9b1d0", name: "Soft Lavender" }, { hex: "#f5f5f0", name: "Off White" }, { hex: "#b7d1c4", name: "Sage Mist" }, { hex: "#d4af37", name: "Gold" }] },
          { name: "Aquarius Signal", mood: "futuristic, cool", colors: [{ hex: "#00b4d8", name: "Electric Cerulean" }, { hex: "#c0c0c0", name: "Silver" }, { hex: "#0a0a1a", name: "Midnight" }, { hex: "#90e0ef", name: "Ice Blue" }, { hex: "#dda0dd", name: "Mauve" }] },
        ],
      },
      {
        type: "palette-showcase",
        heading: "Water Signs (Cancer, Scorpio, Pisces)",
        palettes: [
          { name: "Cancer Moonlight", mood: "soft, ethereal", colors: [{ hex: "#d0e8f2", name: "Pearl Blue" }, { hex: "#f0f0f5", name: "Moonstone" }, { hex: "#b8c0d0", name: "Silver Blue" }, { hex: "#e8d5e8", name: "Blush" }, { hex: "#8090a8", name: "Slate" }] },
          { name: "Scorpio Obsidian", mood: "intense, magnetic", colors: [{ hex: "#0a0a0a", name: "Obsidian" }, { hex: "#6b0f1a", name: "Oxblood" }, { hex: "#3d0c52", name: "Midnight Plum" }, { hex: "#8b0000", name: "Deep Crimson" }, { hex: "#c9a96e", name: "Bronze" }] },
          { name: "Pisces Tide", mood: "dreamy, oceanic", colors: [{ hex: "#7ec8c8", name: "Seafoam" }, { hex: "#b8a9c9", name: "Lilac" }, { hex: "#d4eaf7", name: "Ice" }, { hex: "#6b8fa8", name: "Steel Blue" }, { hex: "#f0e6f6", name: "Lavender Mist" }] },
        ],
      },
      { type: "cta", headline: "Get a palette made for your exact zodiac birthday", subheadline: "Our generator creates palettes based on your sign, vibe, birth season, and aesthetic — all personalized.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
      { type: "related-content" },
    ],
  },
  {
    slug: "seasonal-birthday-color-palettes",
    category: "palettes",
    title: "Seasonal Birthday Color Palettes — Spring, Summer, Fall & Winter",
    description: "Birthday color palettes by birth season. Spring pastels, summer tropicals, fall jewel tones, and winter dramatics — all with hex codes for decorations and outfits.",
    headline: "Seasonal Birthday Color Palettes",
    subheadline: "Your birth season has a palette. Here it is.",
    tags: { celebrationType: "decor" },
    canonicalPath: "/birthday-palettes/seasonal-birthday-color-palettes",
    schemaType: "ItemList",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    sections: [
      { type: "hero", headline: "Seasonal Birthday Color Palettes", subheadline: "Your birth season has a palette. Here it is." },
      { type: "paragraph", body: "The season you were born in isn't just a calendar fact — it's an aesthetic. A December birthday lives in a different color world than a June one. These palettes are anchored to each season's real visual energy: not just what's trending, but what makes a birthday feel right for its time of year." },
      {
        type: "palette-showcase",
        heading: "Spring Birthdays (March – May)",
        palettes: [
          { name: "New Growth", mood: "fresh, optimistic", colors: [{ hex: "#90be6d", name: "Lime Leaf" }, { hex: "#f4c2c2", name: "Cherry Blossom" }, { hex: "#fff0f3", name: "Petal White" }, { hex: "#c9e4ca", name: "Mint" }, { hex: "#ffd700", name: "Buttercup" }] },
          { name: "Garden Party", mood: "romantic, blooming", colors: [{ hex: "#f7a8b8", name: "Blush" }, { hex: "#c3b1e1", name: "Wisteria" }, { hex: "#b5d5c5", name: "Sage" }, { hex: "#fff8dc", name: "Cream" }, { hex: "#ffcba4", name: "Apricot" }] },
        ],
      },
      {
        type: "palette-showcase",
        heading: "Summer Birthdays (June – August)",
        palettes: [
          { name: "Golden Hour", mood: "warm, saturated", colors: [{ hex: "#ff6b35", name: "Coral" }, { hex: "#ffd166", name: "Marigold" }, { hex: "#06d6a0", name: "Tropical Mint" }, { hex: "#1b4332", name: "Deep Palm" }, { hex: "#fff3b0", name: "Sunlight" }] },
          { name: "Ocean Drive", mood: "tropical, electric", colors: [{ hex: "#0096c7", name: "Ocean" }, { hex: "#ff006e", name: "Hot Pink" }, { hex: "#fff200", name: "Citrus" }, { hex: "#00b4d8", name: "Cerulean" }, { hex: "#f77f00", name: "Sunset Orange" }] },
        ],
      },
      {
        type: "palette-showcase",
        heading: "Fall Birthdays (September – November)",
        palettes: [
          { name: "Harvest Cinematic", mood: "rich, grounded", colors: [{ hex: "#9b2335", name: "Burgundy" }, { hex: "#c45c1e", name: "Burnt Orange" }, { hex: "#d4a017", name: "Amber Gold" }, { hex: "#2d4a1e", name: "Forest" }, { hex: "#3e2723", name: "Dark Espresso" }] },
          { name: "Velvet Autumn", mood: "moody, sophisticated", colors: [{ hex: "#6b2d5e", name: "Plum" }, { hex: "#b5451b", name: "Terracotta" }, { hex: "#d4845a", name: "Copper" }, { hex: "#8b7355", name: "Warm Taupe" }, { hex: "#1a1a2e", name: "Midnight" }] },
        ],
      },
      {
        type: "palette-showcase",
        heading: "Winter Birthdays (December – February)",
        palettes: [
          { name: "Midnight Crystal", mood: "dramatic, jewel-toned", colors: [{ hex: "#0d1b2a", name: "Midnight Navy" }, { hex: "#1b4d3e", name: "Evergreen" }, { hex: "#c9a96e", name: "Champagne Gold" }, { hex: "#dc143c", name: "Cranberry" }, { hex: "#e8e8e8", name: "Frost" }] },
          { name: "Ice Palace", mood: "crystalline, cool", colors: [{ hex: "#c0e0f0", name: "Ice Blue" }, { hex: "#e8d5f5", name: "Lavender Frost" }, { hex: "#c0c0c0", name: "Silver" }, { hex: "#f0f0f5", name: "Ghost White" }, { hex: "#5b6fa6", name: "Slate Blue" }] },
        ],
      },
      { type: "cta", headline: "Get a palette made for your exact birthday season", subheadline: "Our generator combines your birth season, zodiac sign, and aesthetic into four custom palettes.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
      { type: "related-content" },
    ],
  },
];

// ─── Pink palettes ───────────────────────────────────────────────────────────
palettePages.push({
  slug: "pink-birthday-color-palettes",
  category: "palettes",
  title: "Pink Birthday Color Palettes (2026) — Hot Pink, Blush, Rose & More",
  description: "Pink birthday color palettes with hex codes — hot pink Barbiecore, soft blush, moody dusty rose, and Y2K pink. For decor, outfits, and Instagram.",
  headline: "Pink Birthday Color Palettes",
  subheadline: "From Barbiecore to soft blush — pick the pink that matches the mood.",
  tags: { celebrationType: "decor" },
  canonicalPath: "/birthday-palettes/pink-birthday-color-palettes",
  schemaType: "ItemList",
  publishStatus: "published",
  publishedAt: "2026-04-22",
  sections: [
    { type: "hero", headline: "Pink Birthday Color Palettes", subheadline: "From Barbiecore to soft blush — pick the pink that matches the mood." },
    { type: "paragraph", body: "Pink is not one color — it's a whole spectrum of moods. Hot pink reads loud and celebratory; dusty pink reads moody and grown; blush reads soft and romantic; rose gold reads expensive. The palette you pick tells guests what kind of birthday this is before they read the invite. These four pink directions each carry a distinct feeling, with hex codes for everything from balloons to the Instagram story template." },
    {
      type: "palette-showcase",
      heading: "Four Pink Directions",
      palettes: [
        { name: "Barbiecore", mood: "loud, celebratory, confident", colors: [{ hex: "#ff2e93", name: "Barbie Pink" }, { hex: "#ff6eb4", name: "Hot Pink" }, { hex: "#ffc0cb", name: "Classic Pink" }, { hex: "#d4af37", name: "Gold" }, { hex: "#ffffff", name: "White" }] },
        { name: "Soft Bloom", mood: "romantic, gentle, photographable", colors: [{ hex: "#fbe8e8", name: "Petal" }, { hex: "#f5c6c6", name: "Blush" }, { hex: "#e8a4a4", name: "Dusty Rose" }, { hex: "#a7c5bd", name: "Sage" }, { hex: "#fff8f0", name: "Cream" }] },
        { name: "Moody Mauve", mood: "grown, sophisticated, low-key", colors: [{ hex: "#8b3a5c", name: "Deep Rose" }, { hex: "#c97b9c", name: "Dusty Pink" }, { hex: "#d4a5a5", name: "Warm Blush" }, { hex: "#4a1c2e", name: "Wine" }, { hex: "#ebd8c3", name: "Nude" }] },
        { name: "Y2K Bubblegum", mood: "playful, nostalgic, electric", colors: [{ hex: "#ff006e", name: "Electric Pink" }, { hex: "#ff71ce", name: "Bubblegum" }, { hex: "#01cdfe", name: "Cyan Pop" }, { hex: "#fffc4d", name: "Citrus" }, { hex: "#000000", name: "Black" }] },
      ],
    },
    { type: "tip-list", heading: "Pink Birthday Pro Tips", tips: [
      { title: "Pair hot pink with one grounding color", body: "Pure Barbie pink for a full room reads chaotic. Anchor it with gold, black, or white and the whole palette tightens up." },
      { title: "Blush photographs best with natural light", body: "Soft pinks can wash out under tungsten or fluorescent lighting. If you're indoors, add warm gold accents (candles, brass) to restore depth." },
      { title: "Don't mix more than two pink shades", body: "Hot pink plus blush plus dusty plus rose gold turns into visual noise. Pick one pink, one accent color, and let them carry the palette." },
    ]},
    { type: "cta", headline: "Get a pink palette made for your exact birthday vibe", subheadline: "Our generator tunes the pink to your age, zodiac, and how loud you want the day.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
    { type: "related-content" },
  ],
});

// ─── Gold palettes ───────────────────────────────────────────────────────────
palettePages.push({
  slug: "gold-birthday-color-palettes",
  category: "palettes",
  title: "Gold Birthday Color Palettes (2026) — Black & Gold, Rose Gold, Champagne",
  description: "Gold birthday color palettes with hex codes — black & gold, champagne & ivory, rose gold, burgundy & gold. For luxe birthday decor, outfits, and invites.",
  headline: "Gold Birthday Color Palettes",
  subheadline: "The color of celebration, done four ways.",
  tags: { celebrationType: "decor" },
  canonicalPath: "/birthday-palettes/gold-birthday-color-palettes",
  schemaType: "ItemList",
  publishStatus: "published",
  publishedAt: "2026-04-22",
  sections: [
    { type: "hero", headline: "Gold Birthday Color Palettes", subheadline: "The color of celebration, done four ways." },
    { type: "paragraph", body: "Gold is the default birthday color — which is exactly why it needs a point of view. Done wrong, it reads generic. Done well, it carries the whole room. These four gold palettes each lock gold into a specific mood: black and gold for classic drama, champagne and ivory for quiet luxury, rose gold and blush for romance, burgundy and gold for moody opulence. Pick the one that matches the feeling, not just the color." },
    {
      type: "palette-showcase",
      heading: "Four Gold Directions",
      palettes: [
        { name: "Black & Gold", mood: "classic, dramatic, high-contrast", colors: [{ hex: "#0a0a0a", name: "Jet Black" }, { hex: "#d4af37", name: "Rich Gold" }, { hex: "#b8860b", name: "Antique Gold" }, { hex: "#ffffff", name: "White" }, { hex: "#3a3a3a", name: "Charcoal" }] },
        { name: "Champagne & Ivory", mood: "quiet luxury, timeless, soft", colors: [{ hex: "#f5ecd9", name: "Champagne" }, { hex: "#faf5e8", name: "Ivory" }, { hex: "#c9a96e", name: "Muted Gold" }, { hex: "#d4c3a0", name: "Sand" }, { hex: "#5e4730", name: "Tobacco" }] },
        { name: "Rose Gold & Blush", mood: "romantic, feminine, warm", colors: [{ hex: "#e8b4a0", name: "Rose Gold" }, { hex: "#f5c8c2", name: "Blush" }, { hex: "#d4a5a5", name: "Warm Pink" }, { hex: "#faf0e8", name: "Cream" }, { hex: "#b76e79", name: "Deep Rose" }] },
        { name: "Bordeaux & Gold", mood: "moody, opulent, old world", colors: [{ hex: "#4a0e1a", name: "Bordeaux" }, { hex: "#6b1f2e", name: "Deep Wine" }, { hex: "#d4af37", name: "Rich Gold" }, { hex: "#f5ecd9", name: "Champagne" }, { hex: "#1a0a0a", name: "Near-Black" }] },
      ],
    },
    { type: "tip-list", heading: "Gold Palette Pro Tips", tips: [
      { title: "Commit to one metal", body: "Gold, rose gold, and silver accessories together read unintentional. If the palette is gold, the cutlery, candles, hardware, and jewelry should all be gold." },
      { title: "Use champagne gold for daylight events", body: "Rich antique gold can look dull in natural light. For a brunch or daytime photoshoot, soft champagne gold photographs better than saturated gold." },
      { title: "Balance gold with something matte", body: "All-gold reflective surfaces (metallic balloons, sequin tablecloth, foil signage) turn into glare. Mix gold accents with matte textures — linen, velvet, wood — to create depth." },
    ]},
    { type: "cta", headline: "Get a gold palette tuned to your birthday vibe", subheadline: "Our generator picks the gold direction based on your aesthetic — classic, quiet, romantic, or opulent.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
    { type: "related-content" },
  ],
});

// ─── Pastel palettes ─────────────────────────────────────────────────────────
palettePages.push({
  slug: "pastel-birthday-color-palettes",
  category: "palettes",
  title: "Pastel Birthday Color Palettes (2026) — Soft Hex Codes for Every Pastel Mood",
  description: "Pastel birthday color palettes with hex codes — soft bloom, mint sherbet, lilac cloud, and coastal pastel. For romantic and dreamy birthday decor.",
  headline: "Pastel Birthday Color Palettes",
  subheadline: "Soft doesn't mean bland. Four pastel palettes with a point of view.",
  tags: { celebrationType: "decor" },
  canonicalPath: "/birthday-palettes/pastel-birthday-color-palettes",
  schemaType: "ItemList",
  publishStatus: "published",
  publishedAt: "2026-04-22",
  sections: [
    { type: "hero", headline: "Pastel Birthday Color Palettes", subheadline: "Soft doesn't mean bland. Four pastel palettes with a point of view." },
    { type: "paragraph", body: "Pastels are the most photographed birthday palette family for a reason — they read dreamy, editorial, and photograph beautifully in natural light. The trap is going too sweet. Strong pastel palettes balance softness with a grounding element: a single saturated accent, a metal, or a deeper neutral that keeps the whole thing from disappearing. These four directions show four different ways to do pastels right." },
    {
      type: "palette-showcase",
      heading: "Four Pastel Directions",
      palettes: [
        { name: "Soft Bloom", mood: "romantic, garden, feminine", colors: [{ hex: "#fbe8e8", name: "Petal Pink" }, { hex: "#f5e6d3", name: "Butter" }, { hex: "#d4e8d4", name: "Spring Sage" }, { hex: "#c9b1d0", name: "Wisteria" }, { hex: "#d4af37", name: "Gold Accent" }] },
        { name: "Mint Sherbet", mood: "fresh, summery, cool", colors: [{ hex: "#c9e4ca", name: "Mint" }, { hex: "#f4c2c2", name: "Peach" }, { hex: "#ffe5a5", name: "Cream Yellow" }, { hex: "#b5d5e8", name: "Sky" }, { hex: "#ffffff", name: "White" }] },
        { name: "Lilac Cloud", mood: "dreamy, ethereal, soft-focus", colors: [{ hex: "#e8d5f5", name: "Lilac" }, { hex: "#d4eaf7", name: "Ice Blue" }, { hex: "#f5e6d3", name: "Cream" }, { hex: "#b8a9c9", name: "Muted Violet" }, { hex: "#c0c0c0", name: "Silver" }] },
        { name: "Coastal Pastel", mood: "serene, grown, beachy", colors: [{ hex: "#d4e8d4", name: "Sea Glass" }, { hex: "#f4e8d3", name: "Sand" }, { hex: "#b8d0e0", name: "Pale Sky" }, { hex: "#ebd8c3", name: "Shell" }, { hex: "#1d3557", name: "Navy Anchor" }] },
      ],
    },
    { type: "tip-list", heading: "Pastel Palette Pro Tips", tips: [
      { title: "Always include one saturated anchor", body: "Full pastel without a deeper color reads like a baby shower. A single dark accent — navy, charcoal, forest, or gold — turns the same palette into a grown-up birthday." },
      { title: "Pastels need texture to hold up on camera", body: "Flat pastel surfaces blow out in bright light. Use linen, velvet, dried florals, and matte paper to give pastels depth the camera can read." },
      { title: "Match your outfit to the saturated anchor", body: "Wearing head-to-toe pastel to a pastel party makes you blend in. Pick the palette's darkest color for your outfit and let the decor do the soft work." },
    ]},
    { type: "cta", headline: "Get a pastel palette matched to your birthday season", subheadline: "Spring-pastel palettes look different from summer or winter pastels. Our generator tunes for both the season and your vibe.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
    { type: "related-content" },
  ],
});

// ─── Jewel tone palettes ─────────────────────────────────────────────────────
palettePages.push({
  slug: "jewel-tone-birthday-palettes",
  category: "palettes",
  title: "Jewel Tone Birthday Palettes (2026) — Emerald, Sapphire, Ruby, Amethyst",
  description: "Jewel tone birthday color palettes with hex codes — emerald, sapphire, ruby, amethyst. For moody luxury, fall/winter birthdays, and dramatic decor.",
  headline: "Jewel Tone Birthday Palettes",
  subheadline: "Saturated, moody, cinematic. The grown-up birthday palette.",
  tags: { celebrationType: "decor" },
  canonicalPath: "/birthday-palettes/jewel-tone-birthday-palettes",
  schemaType: "ItemList",
  publishStatus: "published",
  publishedAt: "2026-04-22",
  sections: [
    { type: "hero", headline: "Jewel Tone Birthday Palettes", subheadline: "Saturated, moody, cinematic. The grown-up birthday palette." },
    { type: "paragraph", body: "Jewel tones are what pastels grow into. Emerald, sapphire, ruby, amethyst — deep saturated colors pulled from actual gemstones. They read expensive, intentional, and photograph beautifully under candlelight. For milestone birthdays, fall and winter celebrations, or anyone who wants the decor to feel less 'birthday party' and more 'private dinner' — jewel tones do the work. Four palettes, each anchored by a single gemstone color." },
    {
      type: "palette-showcase",
      heading: "Four Jewel Tone Directions",
      palettes: [
        { name: "Emerald Forest", mood: "rich, grounded, old world", colors: [{ hex: "#0f4c3a", name: "Emerald" }, { hex: "#1b4d3e", name: "Deep Green" }, { hex: "#c9a96e", name: "Antique Gold" }, { hex: "#f5ecd9", name: "Champagne" }, { hex: "#1a0a00", name: "Near Black" }] },
        { name: "Sapphire Midnight", mood: "dramatic, cinematic, regal", colors: [{ hex: "#0f3460", name: "Sapphire" }, { hex: "#1a1a2e", name: "Midnight" }, { hex: "#d4af37", name: "Rich Gold" }, { hex: "#c0c0c0", name: "Silver" }, { hex: "#f5f5f0", name: "Ivory" }] },
        { name: "Ruby Velvet", mood: "warm, opulent, moody romantic", colors: [{ hex: "#8b0000", name: "Ruby" }, { hex: "#c1121f", name: "Scarlet" }, { hex: "#4a0e1a", name: "Bordeaux" }, { hex: "#d4af37", name: "Gold" }, { hex: "#faf0e8", name: "Cream" }] },
        { name: "Amethyst Dusk", mood: "mystical, feminine-dark, intentional", colors: [{ hex: "#4a2c5e", name: "Amethyst" }, { hex: "#7b2d8b", name: "Royal Purple" }, { hex: "#e8b4a0", name: "Rose Gold" }, { hex: "#2d1b3d", name: "Plum Black" }, { hex: "#f5ecd9", name: "Champagne" }] },
      ],
    },
    { type: "tip-list", heading: "Jewel Tone Pro Tips", tips: [
      { title: "Candlelight is non-negotiable", body: "Jewel tones lose their richness under overhead lighting. Book a venue with dimmable lights or commit to candles — emerald and ruby look cheap in fluorescent and astonishing by flame." },
      { title: "Pair with a metal, not another jewel", body: "Emerald plus sapphire plus ruby reads like a Christmas ornament box. Lock in one jewel tone, add gold or silver, and let a cream neutral carry the rest." },
      { title: "Velvet, satin, and brass over matte plastic", body: "The palette carries luxury weight — cheap materials undercut it instantly. Use fabric tablecloths (velvet, satin, linen), real brass or gold hardware, and real candles instead of battery ones." },
    ]},
    { type: "cta", headline: "Get a jewel tone palette tuned to your birthday vibe", subheadline: "Our generator picks the gemstone anchor based on your sign, season, and the kind of drama you want.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
    { type: "related-content" },
  ],
});

// ─── Luxury palettes ─────────────────────────────────────────────────────────
palettePages.push({
  slug: "luxury-birthday-color-palettes",
  category: "palettes",
  title: "Luxury Birthday Color Palettes (2026) — Quiet Luxury, Old Money, Champagne",
  description: "Luxury birthday color palettes with hex codes — quiet luxury, old money, champagne & ivory, bordeaux & cream. For sophisticated, grown-up birthday decor.",
  headline: "Luxury Birthday Color Palettes",
  subheadline: "Quiet luxury, old money, private dinner — four palettes that carry weight.",
  tags: { celebrationType: "decor" },
  canonicalPath: "/birthday-palettes/luxury-birthday-color-palettes",
  schemaType: "ItemList",
  publishStatus: "published",
  publishedAt: "2026-04-22",
  sections: [
    { type: "hero", headline: "Luxury Birthday Color Palettes", subheadline: "Quiet luxury, old money, private dinner — four palettes that carry weight." },
    { type: "paragraph", body: "Luxury palettes don't announce themselves. Where a Barbiecore palette tells you it's a party before you walk in, a luxury palette tells you this is a dinner. The colors sit at the quieter, warmer end of the spectrum: tobacco, cream, champagne, olive, bordeaux, cognac. Everything reads expensive because the palette is committed — no bright accent, no pastel break, no metallic streamers. Four directions, each built for a specific kind of grown birthday." },
    {
      type: "palette-showcase",
      heading: "Four Luxury Directions",
      palettes: [
        { name: "Quiet Luxury", mood: "understated, considered, expensive", colors: [{ hex: "#faf5e8", name: "Ivory" }, { hex: "#f5ecd9", name: "Champagne" }, { hex: "#c9a96e", name: "Muted Gold" }, { hex: "#5e4730", name: "Tobacco" }, { hex: "#d4c3a0", name: "Sand" }] },
        { name: "Old Money", mood: "traditional, crisp, WASP-y", colors: [{ hex: "#f5f0e8", name: "Cream" }, { hex: "#1d3557", name: "Navy" }, { hex: "#c9a96e", name: "Gold" }, { hex: "#8b4513", name: "Saddle" }, { hex: "#0f4c3a", name: "Hunter Green" }] },
        { name: "Private Dinner", mood: "intimate, moody, candlelit", colors: [{ hex: "#4a0e1a", name: "Bordeaux" }, { hex: "#faf0e8", name: "Cream" }, { hex: "#1a0a0a", name: "Near Black" }, { hex: "#c9a96e", name: "Antique Gold" }, { hex: "#6b4c2a", name: "Espresso" }] },
        { name: "Villa", mood: "Mediterranean, sun-worn, warm", colors: [{ hex: "#ebd8c3", name: "Limestone" }, { hex: "#d4845a", name: "Terracotta" }, { hex: "#8b6f47", name: "Olive" }, { hex: "#c45c1e", name: "Burnt Sienna" }, { hex: "#f5ecd9", name: "Tuscan Cream" }] },
      ],
    },
    { type: "tip-list", heading: "Luxury Palette Pro Tips", tips: [
      { title: "Cut the balloons", body: "Nothing kills a luxury palette faster than a Mylar balloon arch. Swap for candles, real florals in neutral ceramic vases, and fabric runners. If you need a celebratory marker, use a custom-printed menu or signage." },
      { title: "Linen, not plastic", body: "Paper plates, plastic flatware, and plastic tablecloths instantly downgrade the palette. Even a budget-conscious luxury birthday uses real linen napkins, ceramic plates, and proper glassware — rentable by the dozen for less than you'd think." },
      { title: "Lighting is part of the palette", body: "Warm-toned bulbs (2700K or lower), candles, and dimmer switches are as much part of the luxury palette as the hex codes. Overhead fluorescents or bright daylight bulbs flatten every luxury color instantly." },
    ]},
    { type: "cta", headline: "Get a luxury palette built around your exact celebration", subheadline: "Our generator tunes the luxury direction to your age, venue, and how quiet or cinematic you want the evening to read.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
    { type: "related-content" },
  ],
});

palettePages.forEach(registerPage);

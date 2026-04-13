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

palettePages.forEach(registerPage);

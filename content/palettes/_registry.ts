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
];

palettePages.forEach(registerPage);

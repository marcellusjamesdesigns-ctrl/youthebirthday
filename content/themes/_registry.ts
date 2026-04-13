import { registerPage } from "@/lib/content/registry";
import type { ContentPage } from "@/lib/content/types";

const themePages: ContentPage[] = [
  {
    slug: "soft-life-birthday-theme",
    category: "themes",
    title: "Soft Life Birthday Theme (2026) — How to Plan an Effortlessly Beautiful Birthday",
    description: "Plan a soft life birthday theme with colors, decorations, outfit ideas, food, and activities that feel easy, elegant, and intentional.",
    headline: "Soft Life Birthday Theme",
    subheadline: "Luxury without the performance. Beauty without the stress.",
    tags: { vibe: "soft-life" },
    canonicalPath: "/birthday-themes/soft-life-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-12",
    sections: [
      { type: "hero", headline: "Soft Life Birthday Theme", subheadline: "Luxury without the performance. Beauty without the stress." },
      { type: "paragraph", body: "A soft life birthday theme is about ease elevated. It's not cheap — but it's not loud either. Think linen tablecloths, muted florals, natural light, and the kind of food that's beautiful without trying. The aesthetic is intentional simplicity. The feeling is 'I don't need to prove anything.'" },
      {
        type: "palette-showcase",
        heading: "Soft Life Color Palette",
        palettes: [
          { name: "Quiet Luxury", mood: "understated, warm", colors: [{ hex: "#f5ebe0", name: "Cream" }, { hex: "#d5c4a1", name: "Wheat" }, { hex: "#c2b8a3", name: "Sand" }, { hex: "#a68a64", name: "Caramel" }, { hex: "#463f3a", name: "Espresso" }] },
        ],
      },
      {
        type: "idea-list",
        heading: "Soft Life Birthday Elements",
        ideas: [
          { title: "Setting", description: "Garden, courtyard, or a well-lit space with natural elements. No nightclubs. Think places with natural light and fresh air.", vibeTag: "soft-life" },
          { title: "Food", description: "Brunch energy. Fresh fruit, pastries, charcuterie, sparkling water, champagne. Catered or at a restaurant with a beautiful setting.", vibeTag: "soft-life" },
          { title: "Outfit", description: "Linen, silk, or knit. Neutral tones or one soft accent color. Comfortable enough to sit on the floor if the vibe goes there.", vibeTag: "soft-life" },
          { title: "Music", description: "Lo-fi, bossa nova, or an R&B playlist that doesn't spike the energy. The music should feel like background warmth.", vibeTag: "soft-life" },
          { title: "Activities", description: "No games. No itinerary. Maybe a group toast, a few photos, and the kind of conversation you can't have in a loud bar.", vibeTag: "soft-life" },
        ],
      },
      { type: "cta", headline: "Get your full birthday theme built for you", subheadline: "Our generator creates your colors, captions, and celebration plan based on your exact vibe.", buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
      { type: "related-content" },
    ],
  },
];

themePages.forEach(registerPage);

import { registerPage } from "@/lib/content/registry";
import type { ContentPage } from "@/lib/content/types";

/**
 * Birthday theme pages — P0 content upgrade.
 *
 * Each page now has:
 *  - hero image (real Unsplash photo with proper attribution)
 *  - multi-paragraph editorial intro
 *  - tip-list / idea-list execution breakdowns
 *  - Amazon "shop the vibe" module
 *  - 5-question FAQ (featured snippet + AdSense pageview fuel)
 *  - inline-ctas cross-linking into ideas/palettes/captions/zodiac
 *  - contextual bottom CTA
 *  - related-content block (now diversified via registry rules)
 */

const themePages: ContentPage[] = [
  // ──────────────────────────────────────────────────────────────────────
  // SOFT LIFE
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "soft-life-birthday-theme",
    category: "themes",
    title: "Soft Life Birthday Theme (2026) — How to Plan an Effortlessly Beautiful Birthday",
    description:
      "Plan a soft life birthday theme with a full guide to colors, decor, outfits, food, activities, and captions. Editorial-quality ideas for a quietly luxurious birthday.",
    headline: "Soft Life Birthday Theme",
    subheadline: "Luxury without the performance. Beauty without the stress.",
    tags: { vibe: "soft-life" },
    canonicalPath: "/birthday-themes/soft-life-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-12",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Soft Life Birthday Theme",
        subheadline: "Luxury without the performance. Beauty without the stress.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1687370439501-5cb5fd9be204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A neutral linen table with unscented candles and soft natural light — the soft life birthday aesthetic",
        caption: "The soft life birthday isn't a party. It's a mood.",
        credit: "Photo by Mélyna Côté on Unsplash",
        creditUrl: "https://unsplash.com/@laptiteminimaliste?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "A soft life birthday theme is about ease elevated. It's not cheap — but it's not loud either. Think linen tablecloths, muted florals, natural light, and the kind of food that's beautiful without trying. The aesthetic is intentional simplicity. The feeling is <em>I don't need to prove anything.</em>",
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Soft life works for the person who has spent the last year earning back their nervous system. It's for the 30-somethings who've tried the club-birthday routine and want something that doesn't require Advil the next morning. It's for anyone who believes a birthday is supposed to feel like <em>being cared for</em>, not like hosting an event. If you're rolling your eyes at balloon arches and DJs, this is your theme.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Soft life peaks in spring and early summer — garden season, natural light until 8pm, weather that doesn't fight the aesthetic. It also lands beautifully in late fall for a golden-hour dinner at home. Skip it for mid-winter unless you have the lighting and florals to carry it indoors. And skip it entirely if you're trying to turn up — the theme is built on restraint, not energy.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look generic",
        body: "The fast way to kill a soft life birthday is to over-beige everything and call it done. Every neutral palette on Pinterest looks the same after a while. What separates a real soft life celebration from the <a href=\"/birthday-palettes/birthday-color-palette-inspiration\">stock-photo version</a> is specificity: one unexpected textural element (a rough-glazed ceramic, a single branch of curly willow, linen instead of cotton), real light (candlelight or natural — not overheads), and food that's actually good, not just photogenic. The theme fails when it becomes a flatlay. It works when it becomes a dinner.",
      },
      {
        type: "palette-showcase",
        heading: "Soft Life Color Palette",
        palettes: [
          {
            name: "Quiet Luxury",
            mood: "understated, warm",
            colors: [
              { hex: "#f5ebe0", name: "Cream" },
              { hex: "#d5c4a1", name: "Wheat" },
              { hex: "#c2b8a3", name: "Sand" },
              { hex: "#a68a64", name: "Caramel" },
              { hex: "#463f3a", name: "Espresso" },
            ],
          },
          {
            name: "Garden Soft",
            mood: "fresh, botanical",
            colors: [
              { hex: "#f8f4e3", name: "Ivory" },
              { hex: "#d4d7b9", name: "Sage" },
              { hex: "#a8ad9c", name: "Eucalyptus" },
              { hex: "#e8b9ab", name: "Dusty Rose" },
              { hex: "#5c6b5a", name: "Fern" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "Soft Life Birthday Elements",
        tips: [
          {
            title: "Setting",
            body: "A garden, courtyard, or a well-lit home with natural elements. No nightclubs, no strobe lights, no venues that require a dress code from a bouncer. Think places with real windows and fresh air. If you're at home, clear the clutter, open every blind, and light candles even in daytime.",
          },
          {
            title: "Food",
            body: "Brunch energy done well. Fresh fruit on ceramic platters, warm pastries from a local bakery, a charcuterie board that doesn't look like a caterer made it, sparkling water in pretty glasses, and champagne (good champagne, not prosecco trying to pass). If you're at a restaurant, <a href=\"/birthday-ideas/birthday-dinner-ideas\">book somewhere with natural light</a> and a tasting-menu option — let them do the heavy lifting.",
          },
          {
            title: "Outfit",
            body: "Linen, silk, or fine-gauge knit. Neutral tones or one soft accent color (dusty rose, pale sage, blush). Comfortable enough to sit on the floor if the vibe goes there. Slip dresses, tailored trousers with a silk camisole, or a matching set that photographs as a single tonal wash.",
          },
          {
            title: "Music",
            body: "Lo-fi, bossa nova, soul instrumentals, or an R&B playlist that doesn't spike the energy. Sade, Blood Orange, Nujabes, Sault, early Tirzah. The music should feel like background warmth — never center stage. Keep the volume where conversation stays easy.",
          },
          {
            title: "Activities",
            body: "No games. No itinerary printouts. Maybe a group toast at a natural pause, a few photos before the food gets eaten, and the kind of conversation you can't have in a loud bar. If you want a ritual, make it simple: everyone shares one thing they loved about the past year.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Full decoration breakdown in our Journal →",
        href: "/blog/best-birthday-decorations-soft-life-party",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "The soft life menu is built around natural colors and real ingredients. Think: a whipped ricotta board with honey and figs, heirloom tomato salad with torn basil, sourdough focaccia, a simple roast chicken or poached salmon, and a flourless chocolate cake served in slim wedges. Drink-wise, one signature cocktail (a lavender gin spritz, a white peach bellini, or a dirty martini done well) plus sparkling water in glass bottles on the table. If you want the exact vibe, browse our <a href=\"/birthday-ideas/birthday-dinner-ideas\">birthday dinner ideas</a> for restaurants built for this energy.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2400&auto=format&fit=crop",
        alt: "A soft neutral table setting with candles, florals, and linen napkins",
        caption: "The details are the design.",
        ratio: "wide",
      },
      {
        type: "amazon-shop",
        title: "Set the Soft Life Mood",
        subtitle: "A handful of pieces that quietly do the heavy lifting.",
        placement: "soft-life-theme",
        format: "grid",
        items: [
          { query: "linen tablecloth neutral beige", label: "Linen Tablecloth", description: "Wrinkles are part of the aesthetic." },
          { query: "taper candles unscented natural cream", label: "Unscented Taper Candles", description: "Burn slow. Light honest." },
          { query: "dried pampas grass natural arrangement", label: "Dried Florals", description: "Pampas, wheat, bunny tails." },
          { query: "champagne coupes crystal stemless", label: "Crystal Coupes", description: "The toast is the moment." },
          { query: "ceramic serving bowl handmade neutral", label: "Handmade Ceramic Bowl", description: "One unexpected textural piece." },
          { query: "essential oil diffuser ceramic minimalist", label: "Ceramic Diffuser", description: "Warm, quiet, barely there." },
          { query: "linen cloth napkins natural beige set", label: "Linen Napkins", description: "Always cloth. Never paper." },
          { query: "silk eye mask blackout cream", label: "Silk Eye Mask", description: "Morning-after protection." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "The soft life aesthetic is more forgiving to the budget than it looks. Under $150 gets you a linen runner, unscented candles, dried florals, and real napkins — more than enough for a dinner of 6. If you want to go further, invest in the tableware (ceramic plates, real glassware, linen everything) since they'll carry through every theme you host for the next decade. Skip the expensive florals; dried pampas, olive branches, and eucalyptus from the grocery store deliver the look.",
      },
      {
        type: "inline-cta",
        text: "Pair this with our birthday color palette inspiration for a full visual direction →",
        href: "/birthday-palettes/birthday-color-palette-inspiration",
      },
      {
        type: "faq",
        heading: "Soft Life Birthday FAQ",
        questions: [
          {
            question: "What colors work best for a soft life birthday theme?",
            answer:
              "Warm neutrals are the foundation — cream, wheat, sand, caramel, and a deep grounding tone like espresso or fern. Avoid pure white (too sterile) and bright colors that break the tonal flow. Pick one soft accent (dusty rose, pale sage, or blush) and let everything else stay in the neutral family. The whole palette should read as one quiet tonal wash.",
          },
          {
            question: "What should guests wear to a soft life birthday?",
            answer:
              "Suggest 'tonal neutrals and easy fabrics' on the invite. Linen, silk, knit, or cashmere in beige, cream, taupe, dusty rose, or sage. Avoid black (wrong energy) and anything with loud patterns. Slip dresses, tailored trousers with silk tops, or matching sets photograph beautifully together without coordination.",
          },
          {
            question: "How do you decorate for a soft life birthday on a budget?",
            answer:
              "Focus spend on linens and lighting — they carry 80% of the visual impact. A $40 linen runner, $25 of unscented taper candles, and $20 of dried pampas grass from a florist cover a dinner for 6. Skip fresh florals (dried and branches look more intentional anyway) and ignore balloon/signage trends entirely. The whole point is restraint.",
          },
          {
            question: "Is a soft life birthday better for dinner or brunch?",
            answer:
              "Both work, but brunch is the more natural fit — the aesthetic was built around natural light, fresh food, and unhurried pacing. Brunch also lets you skip alcohol if you want while keeping the vibe, where an evening dinner usually needs wine to feel complete. If you're hosting at home, brunch is also easier to execute beautifully.",
          },
          {
            question: "What food and drinks fit a soft life birthday?",
            answer:
              "Warm pastries, a fruit platter on ceramic, a whipped ricotta or charcuterie board, a simple main (roast chicken, poached salmon, or heirloom tomato pasta), and a flourless cake in slim wedges. Drink-wise: one signature cocktail, good champagne, sparkling water in glass bottles, and fresh herbs or fruit as the garnish — not cocktail napkins printed with 'birthday girl.'",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your soft life birthday built for you",
        subheadline: "Our generator creates your palettes, captions, celebration style, and destination picks tuned to your exact vibe.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // DARK FEMININE
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "dark-feminine-birthday-theme",
    category: "themes",
    title: "Dark Feminine Birthday Theme (2026) — Mysterious, Powerful & Intentional",
    description:
      "The complete dark feminine birthday theme guide: moody color palettes, ritual-inspired activities, dramatic dinner ideas, and shoppable decor for a powerful intentional birthday.",
    headline: "Dark Feminine Birthday Theme",
    subheadline: "Not a party. A ritual.",
    tags: { vibe: "intimate", zodiac: "scorpio", theme: "dark-feminine" },
    canonicalPath: "/birthday-themes/dark-feminine-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Dark Feminine Birthday Theme",
        subheadline: "Not a party. A ritual.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1543251660-ebb499e629bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "Moody candlelit table with taper candles — the dark feminine aesthetic",
        caption: "Candlelight does most of the work.",
        credit: "Photo by Annie Spratt on Unsplash",
        creditUrl: "https://unsplash.com/@anniespratt?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "The dark feminine birthday theme is about reclaiming depth. It's not goth — it's intentional. Burgundy candles, low lighting, velvet textures, and the kind of celebration that feels like a scene from a film nobody's made yet. The vibe is powerful, mysterious, and unapologetically female. Think: Scorpio energy, black-tie meets witchcraft, the dinner party where everyone leaves feeling like they witnessed something.",
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Dark feminine works for the person who's ready to stop performing lightness. It's for deep-water signs (<a href=\"/zodiac-birthdays/scorpio-birthday-ideas\">Scorpios</a>, Cancers, Pisces), late-stage millennials who grew up on Lana and Fiona Apple, and anyone whose birthday has started to feel more like a seasonal reckoning than a celebration. It's the theme for the year you stopped explaining yourself.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "October and November peak hard — Scorpio season, shorter days, the kind of darkness that makes candles finally make sense. Late January also works (winter depth + birthday intensity). Skip it in high summer when the sun sets at 9 — the aesthetic needs the dark to carry it. And be careful with outdoor dark-feminine attempts; the theme is inherently indoor, candlelit, enclosed.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look costume-y",
        body: "The fastest way to wreck a dark feminine birthday is leaning on Halloween signifiers — plastic spider webs, fake skulls, anything rubber. The theme lives at the intersection of <em>Vogue editorial</em> and <em>witchy dinner party</em>, not haunted house. Pick real materials (velvet, brass, silk, fresh flowers in dark tones), invest in real candles (not battery tea lights), and skip anything with a costume-shop price tag. The look is expensive-feeling even on a small budget — because it's about texture and restraint, not quantity.",
      },
      {
        type: "palette-showcase",
        heading: "Dark Feminine Color Palette",
        palettes: [
          {
            name: "Obsidian Ceremony",
            mood: "dramatic, powerful",
            colors: [
              { hex: "#1a0a0a", name: "Onyx" },
              { hex: "#6b1a2a", name: "Oxblood" },
              { hex: "#8b0000", name: "Deep Crimson" },
              { hex: "#3d1a4e", name: "Midnight Plum" },
              { hex: "#c9a96e", name: "Aged Gold" },
            ],
          },
          {
            name: "Velvet Underground",
            mood: "moody, intimate",
            colors: [
              { hex: "#0f0a0f", name: "Black Coffee" },
              { hex: "#4a1e3a", name: "Wine" },
              { hex: "#8b3a3a", name: "Dried Rose" },
              { hex: "#2a2018", name: "Smoked Oak" },
              { hex: "#b8860b", name: "Brass" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "Dark Feminine Birthday Elements",
        tips: [
          {
            title: "Setting",
            body: "Candlelit spaces, private dining rooms, underground bars, or a dramatically lit home setting. Darkness is the aesthetic — use it. No bright venues, no fluorescent lighting, no overhead ceiling fixtures. If you're at home, kill every overhead light and rely entirely on candles and one or two warm lamps.",
          },
          {
            title: "Décor",
            body: "Black or oxblood candles, dried flowers in dark tones, velvet ribbons, brass or gold accents. Fresh flowers in deep burgundy, black calla lilies, or dark dahlias. A table that looks like it belongs in a renaissance painting. Skip Halloween kitsch — no plastic, no costume-shop anything.",
          },
          {
            title: "Outfit",
            body: "Floor-length, structured, statement-making. Deep red, black, midnight purple, or oxblood. One piece of real jewelry (not a pile of costume pieces). Heels that mean business. The outfit should feel like armor and art simultaneously — the character you become at this dinner.",
          },
          {
            title: "Activity",
            body: "A tarot or astrology reading, a ritual journaling session at midnight, or a private sound bath. Something that marks the birthday as a portal, not just a party. If that's too far out, a wine-pairing dinner or a cocktail masterclass held entirely by candlelight delivers the same depth without the woo-woo.",
          },
          {
            title: "Music",
            body: "Lana Del Rey's deeper cuts, FKA Twigs, Sade, Portishead, Chelsea Wolfe, or a curated slow-burn R&B playlist. The music should feel like smoke — slow, atmospheric, enveloping. Never uptempo. The energy is inward, not hype.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Build this around a <a href=\"/birthday-ideas/birthday-dinner-ideas\">birthday dinner</a> or a <a href=\"/birthday-ideas/romantic-birthday-ideas\">romantic intimate format</a> — both fit.",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "Dark feminine menus lean heavy, rich, and slightly unexpected. Think: steak tartare, beef bourguignon, black risotto, fig-and-prosciutto flatbread, dark chocolate torte for dessert. Drink-wise: aged red wine, a negroni or boulevardier as the signature, mezcal-forward cocktails if you're feeling sharper, and espresso after dessert. Skip the white wine unless it's a natural orange wine — and skip anything neon or sugary. The menu should feel like a grown conversation.",
      },
      {
        type: "amazon-shop",
        title: "Shop the Dark Feminine Aesthetic",
        subtitle: "Objects that set the scene without saying a word.",
        placement: "dark-feminine-theme",
        format: "grid",
        items: [
          { query: "black taper candles unscented set", label: "Black Taper Candles", description: "Lighting is the first ritual." },
          { query: "velvet tablecloth burgundy wine", label: "Velvet Tablecloth", description: "Heavy, deep, deliberate." },
          { query: "dried black rose arrangement dahlia", label: "Dried Dark Florals", description: "Permanent. Theatrical." },
          { query: "crystal wine decanter smoke glass", label: "Smoke-Glass Decanter", description: "For the wine you actually chose." },
          { query: "brass incense holder minimalist", label: "Brass Incense Holder", description: "Scent is half the mood." },
          { query: "statement gold cocktail ring oversized", label: "Statement Ring", description: "One piece. Loud enough." },
          { query: "tarot deck rider waite gold edition", label: "Tarot Deck", description: "For the midnight reading." },
          { query: "red wine glasses stemless bordeaux", label: "Bordeaux Glasses", description: "Built for the wine you'll open." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Dark feminine is the theme where budget goes furthest — it was built on restraint and candlelight, not spend. Under $100 covers a dozen black tapers, a velvet runner, dried florals from a florist, and incense. The real investment is in one quality moment: either a tarot reader you actually respect ($150-300), a great wine you wouldn't normally open ($80-150), or a single piece of statement jewelry you'll wear for years. Pick one, skip the rest.",
      },
      {
        type: "inline-cta",
        text: "Pair this theme with a Scorpio-inspired birthday plan →",
        href: "/zodiac-birthdays/scorpio-birthday-ideas",
      },
      {
        type: "faq",
        heading: "Dark Feminine Birthday FAQ",
        questions: [
          {
            question: "What colors work best for a dark feminine birthday?",
            answer:
              "The core palette is black, oxblood (deep burgundy with brown undertones), deep crimson, midnight plum, and aged gold or brass. Avoid pure red (too vibrant), navy (reads preppy), and anything pastel. The gold accent is critical — without it the palette reads flat and gothic. With it, it reads expensive and editorial.",
          },
          {
            question: "What should guests wear to a dark feminine birthday?",
            answer:
              "Suggest 'black tie with an edge' or 'cocktail attire, deep tones only' on the invite. Floor-length dresses, structured suits, silk, velvet, lace. Black, oxblood, deep plum, burgundy. Real jewelry over costume. Anyone in a light color or a casual fabric breaks the scene — set the expectation clearly.",
          },
          {
            question: "How do you decorate for a dark feminine birthday without making it look like Halloween?",
            answer:
              "Stick to real materials: velvet, brass, silk, fresh or dried florals in dark tones, beeswax or real taper candles. Zero plastic, no costume-shop decor, no fake cobwebs or skulls. The aesthetic lives in the textures — if you can physically touch it and it feels luxurious, it's right. If it feels like a party store bought it, it's wrong.",
          },
          {
            question: "Can a dark feminine birthday work on a budget?",
            answer:
              "Yes — it's one of the most budget-forgiving themes because it's built on restraint. Under $100 gets you black candles, a velvet runner, dried florals, and incense. The theme rewards spending on one quality moment (a great bottle of wine, a tarot reader, a single statement piece) rather than decor volume.",
          },
          {
            question: "Is a dark feminine birthday better for dinner or a party?",
            answer:
              "Dinner, unambiguously. The theme is built for intimate, candlelit, slow-paced energy — 4 to 10 people max. A dark feminine 'party' with 30 people doesn't hold the vibe. If you want a larger format, think late-night cocktails in a dimly-lit bar rather than a dance floor. The mood is <em>scene</em>, not <em>crowd</em>.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your dark feminine birthday experience built for you",
        subheadline: "Our generator creates your colors, captions, celebration plan, and cosmic layer based on your exact vibe and zodiac.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // OLD MONEY
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "old-money-birthday-theme",
    category: "themes",
    title: "Old Money Birthday Theme (2026) — Quiet Luxury Birthday Aesthetic",
    description:
      "The old money birthday theme guide: quiet luxury colors, timeless décor, classic menu, and birthday celebration ideas that feel inherited, not purchased.",
    headline: "Old Money Birthday Theme",
    subheadline: "Understated. Timeless. Impossibly elegant.",
    tags: { vibe: "luxury", theme: "old-money" },
    canonicalPath: "/birthday-themes/old-money-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Old Money Birthday Theme",
        subheadline: "Understated. Timeless. Impossibly elegant.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1696249680087-c29352cda5e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A classic dining room with a set table and warm lighting — old money birthday aesthetic",
        caption: "The setting is the story.",
        credit: "Photo by Praswin Prakashan on Unsplash",
        creditUrl: "https://unsplash.com/@praswinprakashan?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "Old money doesn't announce itself — that's the point. An old money birthday theme is about restraint as a flex. Navy, cream, hunter green. Classic restaurants that have been open since 1987. A table that looks like it belongs in a colonial estate. No loud logos, no over-decorated cakes, no confetti cannons. Just exceptional quality, the right people, and an aesthetic that feels borrowed from a family portrait gallery.",
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Old money works for the person who's stopped trying to impress strangers on the internet. It's for late-30s and 40s who are done with club-birthday culture, for the person whose taste has outpaced their feed, and for anyone who grew up around — or aspires to — the kind of understated wealth where the house is 100 years old and nobody photographs the dinner. It's the theme for a quietly great year.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Any season, but fall is the sweet spot — the aesthetic is built for sweater weather, hunter green, candlelight, and longer dinners. Winter works at a private club or estate. Spring and summer require more care (garden parties can work; poolside doesn't). Save this for the milestone birthday where you want the night to feel like it mattered.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look theme-party",
        body: "Old money goes wrong when it becomes Ralph Lauren cosplay. The real version is subtle: real silver (or nothing), actual linen (not poly 'linen-look'), flowers from a florist you've used before, a restaurant that's been booked three weeks out. Skip anything with a crest, monogrammed napkins that look freshly ordered, or a 'dress code' on the invite using the word 'preppy.' The whole theme hinges on looking like you didn't have to think about it — which requires thinking about it carefully.",
      },
      {
        type: "palette-showcase",
        heading: "Old Money Color Palette",
        palettes: [
          {
            name: "Estate Library",
            mood: "timeless, inherited",
            colors: [
              { hex: "#1c3a2a", name: "Hunter Green" },
              { hex: "#1a2744", name: "Navy" },
              { hex: "#c8b88a", name: "Camel" },
              { hex: "#f5f0e8", name: "Ivory" },
              { hex: "#8b6914", name: "Antique Gold" },
            ],
          },
          {
            name: "Quiet Coast",
            mood: "understated, seaside",
            colors: [
              { hex: "#2c3e50", name: "Yacht Navy" },
              { hex: "#e8e4d9", name: "Linen" },
              { hex: "#8c7851", name: "Driftwood" },
              { hex: "#aa4a44", name: "Oxblood Leather" },
              { hex: "#d4c5a0", name: "Sand" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "Old Money Birthday Elements",
        tips: [
          {
            title: "Setting",
            body: "Private dining rooms, members-only clubs, historic restaurants, a well-appointed home, or a rented estate. The setting should feel like it predates Instagram. If you're renting a space, look for wood paneling, fireplaces, libraries, or gardens — not polished marble concept venues.",
          },
          {
            title: "Table Setting",
            body: "Real silverware (or nothing). Linen napkins, pressed. Flowers in a single color — all white, or deep green and white. No balloon arches. One large arrangement, centered low enough to see across the table. Crystal glassware, ideally different shapes for water, red, white, and champagne.",
          },
          {
            title: "Dress Code",
            body: "Smart casual to black tie depending on the night. Cashmere, blazers, loafers, silk, pearls. Nothing fast fashion — and nothing that screams logo. The aesthetic reward goes to the person who looks effortless in a piece they've owned for eight years.",
          },
          {
            title: "Menu",
            body: "Classic dishes done exceptionally well. Oysters, steak au poivre, Dover sole, roast chicken with potatoes, champagne. Order the wine properly — let the sommelier do their job and tip accordingly. Dessert is a proper crème brûlée or a flourless chocolate cake, not a printed-photo cake topper.",
          },
          {
            title: "Gift Culture",
            body: "One thoughtful gift over ten forgettable ones. A first-edition book, a cashmere something, a piece of estate jewelry, or an experience — dinner at a restaurant you've been meaning to try, tickets to something you'd never buy yourself. Old money is about curation, not quantity.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Perfect format: a milestone birthday dinner. See our <a href=\"/birthday-ideas/birthday-dinner-ideas\">birthday dinner ideas</a> and <a href=\"/birthday-destinations/luxury-birthday-destinations\">luxury destinations</a>.",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "The old money menu is a classical menu done right. Start with raw oysters or a wedge salad. Main: filet, Dover sole, or roast chicken with proper potatoes. Side: creamed spinach or haricots verts. Finish with a cheese course (real cheese, properly aged) and a single elegant dessert. Wine-wise: an aged Bordeaux, a proper Burgundy, or — if seasonal — a lightly chilled Beaujolais. Champagne is compulsory. Cocktails if any: classics only. Old fashioned, martini, Manhattan, French 75. No neon, no infused syrups, no 'signature cocktail' with a pun name.",
      },
      {
        type: "amazon-shop",
        title: "Shop the Old Money Aesthetic",
        subtitle: "Pieces that look like you inherited them.",
        placement: "old-money-theme",
        format: "grid",
        items: [
          { query: "crystal wine glasses set stemware", label: "Crystal Stemware Set", description: "For the wine and the moment." },
          { query: "monogram stationery cream personalized", label: "Monogram Stationery", description: "Real notes. Real paper." },
          { query: "cashmere throw blanket navy camel", label: "Cashmere Throw", description: "For the room, the couch, the lap." },
          { query: "silver picture frame vintage estate", label: "Silver Picture Frame", description: "Portrait-gallery energy." },
          { query: "ivory taper candles set classic", label: "Ivory Taper Candles", description: "Unscented, full-length, real wax." },
          { query: "leather guest book cream", label: "Leather Guest Book", description: "For the note nobody else will write." },
          { query: "linen napkins white hemstitch set", label: "Hemstitched Linen Napkins", description: "Cloth only. Always." },
          { query: "pearl stud earrings freshwater classic", label: "Pearl Studs", description: "One piece. Forever." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Old money is the theme most sensitive to budget — not because it requires spending, but because cheap signifiers read loud. Under $200: invest in linen napkins, real taper candles, and a single florist arrangement. Spend the rest on the restaurant reservation. $500+: add a cheese course at home or rent crystal glassware for a dinner party. The actual rule: spend on the 2-3 things guests will touch (glassware, linens, the menu) and zero on decor that photographs well but fades fast.",
      },
      {
        type: "inline-cta",
        text: "Pair this with a milestone birthday format — see <a href=\"/birthday-ideas/30th-birthday-ideas\">30th</a>, 40th, or 50th birthday directions.",
      },
      {
        type: "faq",
        heading: "Old Money Birthday FAQ",
        questions: [
          {
            question: "What colors work best for an old money birthday theme?",
            answer:
              "The core palette is hunter green, navy, ivory, camel, and antique gold. Burgundy and oxblood work as accents. Avoid anything bright, anything pastel, and anything metallic beyond brass or antique gold. Silver is fine for flatware but not for decor — too shiny. The goal is a palette that would blend into a 1920s library.",
          },
          {
            question: "What should guests wear to an old money birthday?",
            answer:
              "The dress code depends on the venue — smart casual for a lunch, cocktail for a club dinner, black tie for a milestone. Key aesthetic markers: cashmere, fine wool, silk, real pearls, tailored pieces, leather shoes. Skip fast fashion, large logos, and anything trend-dated. The aesthetic reward goes to whoever looks effortless in something they've clearly owned for years.",
          },
          {
            question: "How do you decorate for an old money birthday?",
            answer:
              "Focus on three things: lighting (warm, candle-forward, never bright), flowers (one monochromatic arrangement, never supermarket bouquets in mixed colors), and tableware (real silver, linen, crystal). Skip balloons, skip banners, skip anything printed with the word 'birthday.' The room should feel like the setting of a novel, not a celebration.",
          },
          {
            question: "Can an old money birthday work on a budget?",
            answer:
              "Yes, because the theme is about restraint, not spend. Under $200 gets you real linen napkins, unscented taper candles, a single florist arrangement, and a well-set table. The rest of the budget goes to the restaurant reservation or the wine. The cheap version of old money fails because it leans on signifiers (monograms, crests, Ralph Lauren) instead of quality — avoid that trap and a small budget goes far.",
          },
          {
            question: "What food and drinks fit an old money birthday?",
            answer:
              "Classical menus done right: oysters, steak au poivre or Dover sole, proper potatoes, creamed spinach, a cheese course, and a classic dessert like crème brûlée. Wine: aged Bordeaux, a good Burgundy, or champagne. Cocktails: classics only — old fashioned, martini, Manhattan, French 75. Nothing 'signature,' nothing with a pun name, nothing served in a coupe with flowers floating on top.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your old money birthday experience built for you",
        subheadline: "Our generator creates your palettes, captions, celebration plan, and destination picks based on your exact vibe.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Y2K
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "y2k-birthday-theme",
    category: "themes",
    title: "Y2K Birthday Theme (2026) — Retro Futurism Birthday Aesthetic",
    description:
      "Plan a Y2K birthday theme with iridescent colors, chrome accents, early-2000s nostalgia, maximalist outfits, and shoppable decor that feels like the future that never happened.",
    headline: "Y2K Birthday Theme",
    subheadline: "Chrome. Iridescent. The future that never happened — but should have.",
    tags: { vibe: "turn-up", theme: "y2k" },
    canonicalPath: "/birthday-themes/y2k-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Y2K Birthday Theme",
        subheadline: "Chrome. Iridescent. The future that never happened — but should have.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1603847734787-9e8a3f3e9d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "Iridescent chrome aesthetic with pink and blue metallic tones — Y2K birthday aesthetic",
        caption: "Every surface should catch the light.",
        credit: "Photo by Emily Bernal on Unsplash",
        creditUrl: "https://unsplash.com/@emilybernal?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "Y2K birthday themes are having a full renaissance — and the aesthetic is deeper than just nostalgia. It's a specific visual language: iridescent fabrics, chrome surfaces, baby blue and hot pink together, frosted lips and butterfly clips. A Y2K birthday done right feels like stepping into a 2001 music video produced by someone with genuinely good taste. Playful, maximalist, and completely unafraid.",
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Y2K works for anyone turning 21 through 35 who has the cultural reference points to do it right — not as costume, but as mood. It's for the person whose playlist opens with Aaliyah and closes with Charli XCX, who knows the difference between Destiny's Child era Beyoncé and solo-album Beyoncé, and who's ready for a birthday that photographs like a TRL segment. It's also the best theme for a group of friends who know how to go all in on a dress code.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Y2K peaks around <a href=\"/birthday-ideas/birthday-captions-for-yourself\">milestone birthdays</a> where dressing up is welcome — 21st, 25th, 30th. It's a party theme, not a dinner theme — best at night, best with a group of 8+, best where there's space to dance. Seasonally it holds up year-round but summer rooftop + winter disco are the two strongest formats. Skip for intimate dinners; it's too much energy for 4 people at a table.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look costume-y",
        body: "The fastest way to wreck a Y2K birthday is going full Halloween store — inflatable butterfly chairs, $5 rhinestone stickers, generic 'Y2K party' kits. The aesthetic works when the references are specific: actual butterfly hair clips from the drugstore (not a 'themed' pack), real iridescent fabric, a playlist that isn't just the 'Y2K Hits' Spotify generic list. Ground the theme in one great outfit, one great decor element, and one great photo moment — not thirty cheap ones.",
      },
      {
        type: "palette-showcase",
        heading: "Y2K Color Palette",
        palettes: [
          {
            name: "Millennium Shimmer",
            mood: "playful, futuristic",
            colors: [
              { hex: "#a8d8ea", name: "Baby Blue" },
              { hex: "#ff69b4", name: "Hot Pink" },
              { hex: "#c0c0c0", name: "Chrome Silver" },
              { hex: "#dda0dd", name: "Mauve Lilac" },
              { hex: "#f5f5dc", name: "Iridescent Cream" },
            ],
          },
          {
            name: "Chrome Club",
            mood: "nightlife, metallic",
            colors: [
              { hex: "#1a1a1a", name: "Obsidian" },
              { hex: "#e0e0e0", name: "Polished Chrome" },
              { hex: "#ff007f", name: "Rave Pink" },
              { hex: "#00d4ff", name: "Electric Blue" },
              { hex: "#b19cd9", name: "Holo Violet" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "Y2K Birthday Elements",
        tips: [
          {
            title: "Dress Code",
            body: "Low-rise, bedazzled, butterfly clips, platform sneakers, iridescent anything. The reference point is 2001 but the execution is 2026. Make it look intentional — statement pieces over full outfits. Paris Hilton dinner vibe, not Halloween store.",
          },
          {
            title: "Décor",
            body: "Mylar balloons, chrome table covers, mirror balls, holographic banners. Everything should catch the light and throw it somewhere unexpected. Skip printed backdrops with 'Y2K PARTY' in Comic Sans — they age the whole setup instantly.",
          },
          {
            title: "Playlist",
            body: "Destiny's Child, early Britney, Jennifer Lopez, Christina Aguilera, Aaliyah, TLC — mixed with hyperpop and modern Y2K-influenced artists (Charli XCX, Slayyyter, Rina Sawayama). The energy should be maximalist and unapologetic. Also worth pairing with our <a href=\"/birthday-captions/30th-birthday-captions\">milestone birthday captions</a>.",
          },
          {
            title: "Photo Ops",
            body: "Flip phone props, a Y2K photo booth backdrop, a mirrored surface setup, or an iridescent curtain. Disposable cameras for guests. The content should look like it came from a bedazzled camera phone circa 2002 — lo-fi flash, harsh light, perfect imperfection.",
          },
          {
            title: "Cake",
            body: "Chrome-effect fondant, holographic edible glitter, a cake that looks like a prop from TRL. Multi-tier, unapologetically bright, topped with something metallic. The more maximalist, the more correct. Photograph it before cutting.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Pair this with our <a href=\"/birthday-themes/maximalist-birthday-theme\">maximalist birthday theme</a> if you want to go even harder.",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "Y2K menus should feel playful and over-the-top. Pink champagne, cotton-candy cocktails, blue curaçao in martini glasses, mini sliders, candy-coated desserts, an ice cream bar with sprinkles and glitter toppings. Think less 'gourmet' and more 'millennium bug launch party' — the food should be a prop, not a course. Keep it shareable, Instagram-forward, and color-coordinated with the decor.",
      },
      {
        type: "amazon-shop",
        title: "Shop the Y2K Aesthetic",
        subtitle: "Chrome, sparkle, and the exact references you'll recognize.",
        placement: "y2k-theme",
        format: "grid",
        items: [
          { query: "butterfly hair clips pack colorful y2k", label: "Butterfly Hair Clips", description: "The universal Y2K signal." },
          { query: "iridescent tablecloth holographic party", label: "Iridescent Tablecloth", description: "Every surface should shimmer." },
          { query: "mirror disco ball large silver", label: "Large Disco Ball", description: "Hangs high, throws light." },
          { query: "instant camera fujifilm instax mini", label: "Instant Camera", description: "Lo-fi flash, perfect Y2K output." },
          { query: "chrome metallic shoulder bag mini", label: "Chrome Mini Bag", description: "The accessory of the decade." },
          { query: "rhinestone hair accessories set", label: "Rhinestone Hair Pieces", description: "For hair, for outfits, for vibes." },
          { query: "holographic photo backdrop birthday", label: "Holographic Backdrop", description: "Built-in photo op." },
          { query: "colored sunglasses tinted y2k oval", label: "Tinted Sunglasses", description: "Oval frames, colored lenses." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Y2K is surprisingly budget-friendly because the best signifiers are drugstore-cheap — butterfly clips, tinted sunglasses, iridescent tape. Under $100 gets you decor, photo props, and a playlist that carries the night. The mistake is overbuying: one great disco ball beats ten mylar balloons. Spend on the outfit and the cake. Skip the 'Y2K party kit' on Amazon — assemble the aesthetic yourself from real references.",
      },
      {
        type: "inline-cta",
        text: "Need captions to match? Browse <a href=\"/birthday-captions/25th-birthday-captions\">25th</a> and <a href=\"/birthday-captions/30th-birthday-captions\">30th birthday captions</a> for the Y2K energy.",
      },
      {
        type: "faq",
        heading: "Y2K Birthday FAQ",
        questions: [
          {
            question: "What colors work best for a Y2K birthday theme?",
            answer:
              "The classic Y2K palette: baby blue, hot pink, chrome silver, mauve lilac, and iridescent cream. For a more nightlife-forward version, swap in obsidian black, electric blue, rave pink, and holographic violet. The core rule: every color should feel metallic, frosted, or iridescent. Pure matte colors break the aesthetic.",
          },
          {
            question: "What should guests wear to a Y2K birthday party?",
            answer:
              "Suggest 'Y2K dress code' on the invite with specific references — 'think TRL 2002' or 'think Destiny's Child album cover.' Low-rise, bedazzled, iridescent, chrome, butterfly clips, platform sneakers, tinted sunglasses. Encourage statement pieces over full costumes — one great Y2K accessory beats a full outfit from a costume shop.",
          },
          {
            question: "How do you decorate for a Y2K birthday without it looking cheap?",
            answer:
              "Invest in one great centerpiece (a real disco ball, an iridescent backdrop, or a chrome table cover) and supplement with smaller accents. Skip 'Y2K PARTY' printed banners, inflatable decor, and generic themed kits. The aesthetic rewards authenticity — drugstore butterfly clips look more Y2K than 'Y2K-themed' stickers from a party store.",
          },
          {
            question: "Is Y2K better for a dinner or a party?",
            answer:
              "Party, unambiguously. The theme needs energy, volume, and space for outfits to be seen. Best with 8+ people, at night, somewhere with music and a dance floor (even if the dance floor is just a cleared living room). Skip Y2K for intimate dinners — it's too much production for four people at a table.",
          },
          {
            question: "What food and drinks fit a Y2K birthday?",
            answer:
              "Pink champagne, blue curaçao cocktails, cotton-candy martinis, mini sliders, candy-coated desserts, an ice cream bar with glitter toppings. Color-coordinate the food with the decor. The aesthetic is playful and over-the-top — skip gourmet, lean into nostalgic early-2000s party food with a modern glow-up.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your Y2K birthday built for you",
        subheadline: "Our generator creates your palettes, captions, and celebration plan based on your exact vibe and aesthetic.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // MAXIMALIST
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "maximalist-birthday-theme",
    category: "themes",
    title: "Maximalist Birthday Theme (2026) — Dopamine Dressing & Bold Party Aesthetic",
    description:
      "Plan a maximalist birthday theme with bold colors, layered textures, dopamine dressing, and celebration ideas where more is always more. Full decor, outfit, food, and shop-the-vibe guide.",
    headline: "Maximalist Birthday Theme",
    subheadline: "More color. More texture. More everything. That's the point.",
    tags: { vibe: "turn-up", zodiac: "leo", theme: "maximalist" },
    canonicalPath: "/birthday-themes/maximalist-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Maximalist Birthday Theme",
        subheadline: "More color. More texture. More everything. That's the point.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1573840470198-b55ed2ce236d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A colorful bold patterned table with layered textures — maximalist birthday aesthetic",
        caption: "Layered color is the whole idea.",
        credit: "Photo by Ronel Alvarez on Unsplash",
        creditUrl: "https://unsplash.com/@ronofalvarez?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "A maximalist birthday is a rejection of 'less is more' — and it's deeply, joyfully correct. The maximalist aesthetic is about layering: multiple patterns, unexpected color combinations, surfaces that shouldn't work but do, a table that looks like it took genuine vision to execute. If someone walks in and immediately says <em>this is a lot</em>, you're doing it right. This isn't chaos — it's curated abundance.",
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Maximalism works for <a href=\"/zodiac-birthdays/leo-birthday-ideas\">Leos</a>, Sagittarians, and anyone whose personality fills the room before they do. It's for the person who collects things — vintage glassware, printed scarves, colorful ceramics, art books. It's for whoever has spent the last five years pretending to like beige and is ready to go home. And it's the only theme built for someone whose friend group is incapable of coordinating outfits — maximalism makes the mismatch the point.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Maximalism is year-round but lands hardest in late spring, summer, and early fall — more light, more saturation, more outdoor options. It's ideal for a dinner party of 8-12 or a daytime-into-evening brunch-to-drinks format. Skip it for a minimalist venue or a black-tie format; the theme needs room to breathe and a host willing to commit fully. Half-maximalist always looks like indecision.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look chaotic",
        body: "Maximalism fails when it becomes random — piled-up colors with no through-line. The real version has a thesis: a palette of 4-5 specific colors that recur across the table, outfits, and florals. Patterns clash intentionally (stripe + floral + solid in the same color family). Nothing matches, but everything belongs. The rule is <em>curated abundance</em>: you can break every rule as long as you have a reason. Random is not maximalist. Intentional overabundance is.",
      },
      {
        type: "palette-showcase",
        heading: "Maximalist Color Palette",
        palettes: [
          {
            name: "Curated Abundance",
            mood: "bold, layered, joyful",
            colors: [
              { hex: "#e63946", name: "Fire Red" },
              { hex: "#f4a261", name: "Tangerine" },
              { hex: "#a8dadc", name: "Aqua" },
              { hex: "#6a0572", name: "Royal Purple" },
              { hex: "#ffd166", name: "Marigold" },
            ],
          },
          {
            name: "Garden Clash",
            mood: "botanical, unbridled",
            colors: [
              { hex: "#d62828", name: "Poppy Red" },
              { hex: "#f77f00", name: "Saffron" },
              { hex: "#06a77d", name: "Jade" },
              { hex: "#d4a5a5", name: "Rose Dust" },
              { hex: "#003049", name: "Peacock" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "Maximalist Birthday Elements",
        tips: [
          {
            title: "Table Setting",
            body: "Multiple floral arrangements in contrasting heights. Patterned tablecloths under solid runners. Colored glassware — every guest gets a different color. Mix china patterns intentionally (all vintage, mismatched on purpose). It should look collected, not matched.",
          },
          {
            title: "Outfit",
            body: "Pattern mixing, bold color blocking, statement jewelry stacked, a bag that doesn't coordinate with anything but works anyway. Maximalism is fashion with a point of view — florals + stripes, mustard + magenta, a printed suit with sequined heels. One anchor piece, everything else plays off it.",
          },
          {
            title: "Cake",
            body: "Tall, layered, multiple tiers of different flavors and textures. Decorated with fruit, flowers, sprinkles, and at least one surprise element. The cake is the centerpiece — it should photograph from ten feet away.",
          },
          {
            title: "Florals",
            body: "Multiple arrangements, multiple colors, multiple textures — tulips with dahlias with eucalyptus with hot-pink roses. Grocery-store florals rearranged with intention beat a single designer bouquet. Height variation matters; cluster short and tall together.",
          },
          {
            title: "Music",
            body: "A playlist that refuses genre consistency: Afrobeats into jazz into hyperpop into Motown into Samba. The maximalist playlist has range and doesn't apologize for it. Pair with our <a href=\"/birthday-ideas/birthday-dinner-ideas\">birthday dinner ideas</a> for a long-table dinner format.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Match the color chaos with <a href=\"/birthday-palettes/birthday-color-palette-inspiration\">our color palette inspiration</a>.",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "Maximalist menus are about color, abundance, and visual drama. A long-table grazing board with every color represented — heirloom tomatoes, roasted beets, pomegranate, blood orange, olives, pickled vegetables, three cheeses, three breads. Main course should be a family-style dish with color (saffron paella, a whole roasted fish with herbs, a colorful Moroccan tagine). Cocktails: bold, colorful, garnished heavily — negronis, spicy margaritas, hibiscus spritzes. Dessert: a tall fruit-topped cake that looks like a painting.",
      },
      {
        type: "amazon-shop",
        title: "Shop the Maximalist Vibe",
        subtitle: "Every piece earns its seat at a loud table.",
        placement: "maximalist-theme",
        format: "grid",
        items: [
          { query: "colored glassware tumblers set of six", label: "Colored Tumblers", description: "Every guest, different color." },
          { query: "bold floral patterned tablecloth cotton", label: "Patterned Tablecloth", description: "Start with a loud base." },
          { query: "faux flowers oversized bright bouquet", label: "Oversized Faux Florals", description: "Clusters in clashing tones." },
          { query: "colorful taper candles assorted set", label: "Colorful Taper Candles", description: "Mismatched by design." },
          { query: "patterned cloth napkins set mixed", label: "Patterned Napkins", description: "Never match. Always work." },
          { query: "colorful cake topper birthday letter", label: "Statement Cake Topper", description: "The cake's final layer." },
          { query: "disco ball centerpiece mirror small", label: "Mini Disco Ball", description: "One unexpected accent." },
          { query: "colorful serving platter stoneware ceramic", label: "Colorful Serving Platters", description: "Every platter a different tone." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Maximalism is forgiving to budgets because it's built on layering — secondhand, grocery-store, thrifted items actually work better than matched new sets. Under $100: grocery-store florals in 4 colors, mismatched thrifted glassware, and a printed tablecloth. The real investment is time, not money: sourcing the mismatched pieces takes care. If you want to go bigger, rent colored glassware and plates from a party rental company — it's cheaper than buying and gives you the volume of variety the theme requires.",
      },
      {
        type: "inline-cta",
        text: "Pair this theme with our <a href=\"/birthday-themes/y2k-birthday-theme\">Y2K birthday theme</a> for a high-energy nightlife version.",
      },
      {
        type: "faq",
        heading: "Maximalist Birthday FAQ",
        questions: [
          {
            question: "What colors work best for a maximalist birthday theme?",
            answer:
              "A maximalist palette is 4-5 bold, saturated colors that recur across decor, outfits, and florals. The classic: fire red, tangerine, aqua, royal purple, and marigold. For a more botanical version: poppy red, saffron, jade, rose dust, peacock blue. The key isn't the specific palette — it's committing to 4-5 and repeating them everywhere so the chaos feels intentional.",
          },
          {
            question: "What should guests wear to a maximalist birthday?",
            answer:
              "Suggest 'bold color welcome, pattern mixing encouraged' on the invite. Florals with stripes, statement jewelry stacked, color-blocked outfits, a printed suit, sequined anything. The aesthetic rewards commitment — someone who shows up in all black looks disconnected from the night. Encourage one anchor piece guests are willing to go big with.",
          },
          {
            question: "How do you decorate for a maximalist birthday without it looking chaotic?",
            answer:
              "Pick a 4-5 color palette and repeat it across every surface — tablecloth, napkins, florals, glassware, cake. The colors clash, but because they're the <em>same</em> colors clashing everywhere, it reads intentional. Skip random decor. Every piece should echo another piece somewhere in the room.",
          },
          {
            question: "Can a maximalist birthday work on a budget?",
            answer:
              "Yes — maximalism is forgiving to budgets because secondhand, thrifted, and grocery-store items actually work better than matched new sets. Under $100: grocery-store florals in 4 colors, mismatched thrifted glassware, a printed tablecloth. The investment is time (sourcing the pieces) not money. Party rental companies also offer cheap colored glassware by the dozen.",
          },
          {
            question: "What food and drinks fit a maximalist birthday?",
            answer:
              "Color-forward and abundant. A grazing board with every color represented (heirloom tomatoes, roasted beets, pomegranate, blood orange, olives, three cheeses). Family-style mains with visual drama (saffron paella, whole roasted fish, Moroccan tagine). Cocktails heavy on garnish: negronis, spicy margaritas, hibiscus spritzes. Cake: tall, layered, topped with fruit and flowers.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your maximalist birthday built for you",
        subheadline: "Our generator creates your palettes, captions, and celebration plan based on your exact vibe.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────
  // GARDEN PARTY — new theme page prototype (2026-04-19)
  // Thesis: Not flowers on a table. Outdoor softness, good light, pretty
  //         food, an easy dress code.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "garden-party-birthday-theme",
    category: "themes",
    title: "Garden Party Birthday Theme (2026) — Outdoor Softness, Good Light, Pretty Food",
    description:
      "Plan a garden party birthday theme with real editorial direction: palettes, outfit ideas, menu, rain plan, and curated decor. For spring and summer birthdays that deserve to happen outside.",
    headline: "Garden Party Birthday Theme",
    subheadline: "Outdoor softness. Good light. Pretty food. An easy dress code.",
    tags: { vibe: "soft-life", season: "spring", theme: "garden-party" },
    canonicalPath: "/birthday-themes/garden-party-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-19",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Garden Party Birthday Theme",
        subheadline: "Outdoor softness. Good light. Pretty food. An easy dress code.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1680695779444-24fc71296e66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "An outdoor table set for a garden party birthday — linen, florals, natural light",
        caption: "The light does most of the work.",
        credit: "Photo by Rhamely on Unsplash",
        creditUrl: "https://unsplash.com/@rhamely?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "A garden party birthday is not flowers on a table. It's outdoor softness, real light, food that looks like itself, and a dress code that doesn't require explaining. The whole theme hinges on one thing: being outside, intentionally. Everything else — florals, palette, menu, drinkware — exists to support that one decision.",
      },
      {
        type: "quick-take",
        rows: [
          { label: "Best for", value: "Spring birthdays, brunches, intimate milestone dinners" },
          { label: "Works best", value: "Outdoor garden, patio, rooftop greenhouse, backyard, park table" },
          { label: "Budget", value: "$150–$500, flexible depending on venue" },
          { label: "Dress code", value: "Linen, cotton, soft florals, block heels, garden-party polish" },
          { label: "Avoid", value: "Plastic tea-party decor, pastel overload, fake storybook energy" },
        ],
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Garden party works for anyone whose birthday lands between late April and early October. It's for the person who wants a celebration that feels easy — no DJ, no venue buyout, no logistics that require a group text. It's especially good for milestone birthdays (30th, 40th) where the guest list is small and the vibe wants to feel like an afternoon you'll remember a decade later, not a party you'll recover from.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Late spring and early fall are the sweet spots — when the sun is out but not punishing and the light holds late enough for golden hour to do its job. Mid-summer works if you have shade. Avoid the hottest month in your climate (August in the South, July in the Midwest) unless the venue is covered. Garden parties also land well at <a href=\"/birthday-ideas/birthday-dinner-ideas\">outdoor restaurants with real gardens</a> — not just a patio with string lights.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look like a toddler tea party",
        body: "The fastest way to wreck a garden party birthday is going full storybook — pastel bunting, floral-print tablecloths from a party store, plastic teacups. That reads as kid's birthday, not grown-up celebration. The real version is tonal and restrained: linen in one neutral, florals in 2-3 colors max (not every pastel at once), real glassware, and a dress code that leaves room for an actual outfit. The aesthetic is <em>brunch at a private home in the South of France</em>, not <em>tea party with dolls</em>. If something on your table would look right in a child's bedroom, cut it.",
      },
      {
        type: "palette-showcase",
        heading: "Garden Party Color Palettes",
        palettes: [
          {
            name: "Fresh Garden",
            mood: "soft, botanical, sunlit",
            colors: [
              { hex: "#f5ebe0", name: "Cream Linen" },
              { hex: "#d4d7b9", name: "Sage" },
              { hex: "#e8b9ab", name: "Blush" },
              { hex: "#a68a64", name: "Honey" },
              { hex: "#5c6b5a", name: "Fern" },
            ],
          },
          {
            name: "Wildflower",
            mood: "unbridled, picked-from-the-field",
            colors: [
              { hex: "#fcefcb", name: "Butter" },
              { hex: "#e76f51", name: "Poppy" },
              { hex: "#a8c9e0", name: "Dusty Sky" },
              { hex: "#6a994e", name: "Meadow" },
              { hex: "#bc4749", name: "Berry" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "Garden Party Birthday Elements",
        tips: [
          {
            title: "Setting",
            body: "A real garden (yours, a rental estate, or a restaurant with an actual outdoor dining area). Covered patio works if the coverage is architectural — a pergola, a greenhouse, an awning. Avoid bare grass with no shade structure unless you're planning for full-sun afternoon. The setting carries 60% of the aesthetic; invest in the venue before anything else.",
          },
          {
            title: "Florals",
            body: "Mismatched arrangements, 2-3 colors that belong together (not every pastel at once). Seasonal is everything — tulips and ranunculus in spring, sweet peas and peonies in early summer, dahlias and cosmos in late summer, chrysanthemums and roses in fall. Skip premium florist arrangements; hit the farmer's market and arrange yourself. Clusters in varied heights, some low enough to see across.",
          },
          {
            title: "Food",
            body: "Food that looks like itself. Heirloom tomato salad with torn basil, burrata with stone fruit, a warm olive tapenade, fresh sourdough, a long platter of roasted vegetables. A simple main (grilled fish, roast chicken, or a vegetable tart) served family-style. Lemon olive oil cake or a fruit galette for dessert. Nothing dyed, nothing neon, nothing that requires explaining.",
          },
          {
            title: "Dress code",
            body: "'Garden party attire' on the invite is enough — guests know. Linen, silk, fine cotton. Florals welcome but not required. Block-heeled sandals (stilettos sink in grass). Straw hats if the sun is up. Avoid tight polyester — the fabric photographs badly outdoors and doesn't breathe. Your own outfit can anchor the palette; let guests orbit around it.",
          },
          {
            title: "Drinks",
            body: "A signature garden cocktail (elderflower spritz, rosé punch with fresh berries, a Pimm's cup if you want tradition). Sparkling water in glass bottles on every table. Good champagne. Iced herbal tea for non-drinkers. Skip the full bar — two cocktails done well beats eight done okay, and a garden party is not a bar-rail format.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Pair this with <a href=\"/birthday-themes/soft-life-birthday-theme\">soft life</a> if you want even more restraint — they share DNA.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1618072400417-462cce71debe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "Red and yellow wildflowers on a wooden table — garden party florals",
        caption: "Mismatched, seasonal, arranged by someone with a point of view.",
        credit: "Photo by Parker Coffman on Unsplash",
        creditUrl: "https://unsplash.com/@lowmurmer?utm_source=youthebirthday&utm_medium=referral",
        ratio: "wide",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "The garden party menu is built around things that photograph well without trying and eat well without coordination. Open with a grazing board (heirloom tomatoes, burrata, stone fruit, three cheeses, olive tapenade, sourdough). Main, served family-style: a simple grilled protein or a vegetable tart — something that can sit on the table for 20 minutes without dying. Sides: a green salad with a real dressing, a grain salad with herbs, roasted seasonal vegetables. Dessert: a lemon olive oil cake, a galette, or a pavlova with fresh berries. Drinks: one signature cocktail, good rosé or champagne, iced herbal tea, sparkling water in glass. If you want the exact vibe, browse our <a href=\"/birthday-ideas/birthday-dinner-ideas\">birthday dinner ideas</a> for restaurants with real gardens.",
      },
      {
        type: "tip-list",
        heading: "Rain Plan / Indoor Backup",
        tips: [
          {
            title: "Covered patio or pergola",
            body: "The easiest save. A covered outdoor space keeps the garden-party vibe intact — you just move the table under the structure and add warm lighting. Works in drizzle; less so in wind. Have battery-powered string lights or lanterns ready if the afternoon turns overcast.",
          },
          {
            title: "Conservatory or greenhouse restaurant",
            body: "If you're booking a venue, search for restaurants with glass-enclosed dining rooms, conservatories, or greenhouse spaces. These cities have them: New York (Gallow Green), LA (Cafe Gratitude has outdoor covered seating, Barbareño has a garden), Chicago (Galit, Lula Cafe), London (Kensington Roof Gardens). The aesthetic translates perfectly indoors when the room has plants and real light.",
          },
          {
            title: "Indoor table with garden styling",
            body: "If you have to be fully indoors, lean into it. Move your dining room table near the largest window. Use a linen runner, open a real bottle of wine, bring in real florals (not fake). Skip the outdoor signifiers that won't translate (straw hats, sun umbrellas) and go full Nancy Meyers kitchen instead.",
          },
          {
            title: "Botanical centerpiece instead of full outdoor setup",
            body: "If plans change last-minute, dial the theme back to one strong element: a single dramatic florist arrangement (tall, wild, textural) as the centerpiece, with the rest of the table kept minimal. A really beautiful floral centerpiece in an indoor space still carries the garden party feeling without the production of moving the whole concept inside.",
          },
        ],
      },
      {
        type: "amazon-shop",
        title: "Shop the Garden Party Vibe",
        subtitle: "Eight pieces that carry the setting when the venue doesn't do all the work.",
        placement: "garden-party-theme",
        format: "grid",
        items: [
          { query: "linen tablecloth natural cream outdoor", label: "Natural Linen Tablecloth", description: "The foundation. Wrinkles are fine outdoors." },
          { query: "rattan chargers set woven bamboo", label: "Rattan Chargers", description: "Texture under every plate." },
          { query: "outdoor lantern candles brass garden", label: "Garden Lanterns", description: "For golden hour and after." },
          { query: "stemless wine glasses set outdoor", label: "Stemless Wine Glasses", description: "Stems blow over on grass. Learn from us." },
          { query: "floral shears brass pruning garden", label: "Brass Floral Shears", description: "For last-minute cuttings from the yard." },
          { query: "rattan serving trays set round woven", label: "Rattan Serving Trays", description: "For the grazing board. For the cake. For everything." },
          { query: "outdoor cushions linen natural set of four", label: "Linen Outdoor Cushions", description: "For the stone bench nobody usually sits on." },
          { query: "woven picnic basket large french", label: "Large Picnic Basket", description: "Double duty — storage during, decor before." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Garden party is forgiving to tight budgets because the venue (a real garden, your yard, a park) is usually free or cheap. Under $150 covers a linen runner, farmer's-market florals, stemless glassware, and a grazing board. $300-500 lets you add proper rattan chargers, outdoor lanterns, and invest in better florals. Luxury version ($1,000+): rent a private estate garden or book a private dining experience at a greenhouse restaurant — the venue is where luxury garden parties actually spend.",
      },
      {
        type: "inline-cta",
        text: "Need a full palette match? Start with our <a href=\"/birthday-palettes/birthday-color-palette-inspiration\">birthday color palette inspiration</a>.",
      },
      {
        type: "faq",
        heading: "Garden Party Birthday FAQ",
        questions: [
          {
            question: "What colors work best for a garden party birthday?",
            answer:
              "The classic palette is cream, sage, blush, honey, and a grounding deep green. For a more vibrant version, go wildflower: butter yellow, poppy red, dusty sky blue, meadow green, berry. The key rule is 2-3 colors max beyond your neutral base — if every pastel on the wheel is on your table, it reads as kid's birthday. Pick a tight palette and repeat it across florals, napkins, and glassware.",
          },
          {
            question: "What should guests wear to a garden party birthday?",
            answer:
              "Put 'garden party attire' on the invite — guests understand. Linen, silk, fine cotton, block-heeled sandals (stilettos sink in grass). Florals welcome but not required. Straw hats if the sun is up. Avoid tight polyester (doesn't photograph well outdoors) and full suits (wrong energy). Your own outfit can anchor the palette; let guests dress to orbit around it.",
          },
          {
            question: "What's the rain plan for a garden party birthday?",
            answer:
              "Four options, in order of preference: (1) covered patio or pergola — easiest save, keeps the vibe; (2) conservatory or greenhouse restaurant — glass enclosure preserves the aesthetic; (3) indoor dining room near the largest window with lots of real florals and linen, leaning into Nancy Meyers energy; (4) a single dramatic florist centerpiece indoors, dialing the theme back to one strong element rather than moving the full concept inside.",
          },
          {
            question: "What food and drinks fit a garden party birthday?",
            answer:
              "Open with a grazing board (heirloom tomatoes, burrata, stone fruit, olives, sourdough, three cheeses). Main served family-style: grilled fish, roast chicken, or a vegetable tart. Simple sides: green salad with a real dressing, a grain salad with fresh herbs. Dessert: lemon olive oil cake, galette, or pavlova. Drinks: one signature cocktail (elderflower spritz, rosé punch, Pimm's cup), good champagne or rosé, sparkling water in glass bottles, iced herbal tea for non-drinkers.",
          },
          {
            question: "Can a garden party birthday work on a budget?",
            answer:
              "Yes — it's one of the most budget-friendly themes because the venue (your garden, a park, a friend's yard) is usually free. Under $150 covers a linen runner, farmer's-market florals, stemless glassware, and a grazing board. The investment goes further with time: sourcing the right florals at 6am on Saturday, arranging them yourself, and doing the food simply. The luxury version spends on the venue — a private estate or greenhouse restaurant — rather than decor.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your garden party birthday built for you",
        subheadline: "Our generator creates your palettes, captions, celebration plan, and destination picks tuned to your exact vibe and season.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // ALL-WHITE
  // Thesis: A palette that is a rule, not a decor trick.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "all-white-birthday-theme",
    category: "themes",
    title: "All-White Birthday Theme (2026) — How to Make All-White Feel Expensive, Not Sterile",
    description:
      "Plan an all-white birthday theme with texture, lighting, and editorial direction. Full guide to making all-white feel intentional and expensive — not bridal, sterile, or plain.",
    headline: "All-White Birthday Theme",
    subheadline: "A palette that is a rule, not a decor trick.",
    tags: { vibe: "luxury", season: "winter", theme: "all-white" },
    canonicalPath: "/birthday-themes/all-white-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-19",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "All-White Birthday Theme",
        subheadline: "A palette that is a rule, not a decor trick.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1754996615146-285cfbd9259e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "An elegant all-white birthday table setting with candles and subtle floral arrangements",
        caption: "Texture carries the whole aesthetic.",
        credit: "Photo by Babak Eshaghian on Unsplash",
        creditUrl: "https://unsplash.com/@babak22ir?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "An all-white birthday is not a decor choice. It's a <em>rule</em> — a dress code and palette commitment that everyone follows, which is exactly what makes it work. When half the room shows up in color, it collapses. When the whole room commits, you get a photograph that doesn't look like any other birthday. The theme lives or dies on enforcement.",
      },
      {
        type: "quick-take",
        rows: [
          { label: "Best for", value: "30th, 40th, and 50th milestones; late-summer and winter celebrations" },
          { label: "Works best", value: "Open-plan home, gallery-style venue, private dining room, rooftop in warm weather" },
          { label: "Budget", value: "$300–$1,500+ (linens and florals are the spend)" },
          { label: "Dress code", value: "All-white, any fabric, any silhouette — enforce it on the invite" },
          { label: "Avoid", value: "Bridal energy, cheap plastic white decor, unfinished-looking rooms, loud guests in color" },
        ],
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "All-white works for the person who wants their birthday to feel like a statement without being loud about it. It's for the milestone birthdays (30, 40, 50) where the guest list is curated and everyone can be trusted to follow a dress code. It's for someone whose personality can hold a commitment this strong — the theme is inherently confident, and a host who's apologetic about it will wreck the aesthetic.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Late summer (August–September) is the natural fit — warm evenings, outdoor options, guests already wearing linen. Winter also works beautifully (December–February) because all-white against bare trees and crisp light reads as editorial. Spring can work but requires vigilance against pastels bleeding in. Skip mid-summer heat — white fabrics wilt visibly in high humidity, and guests will sweat through everything.",
      },
      {
        type: "paragraph",
        heading: "How to avoid making it look bridal or sterile",
        body: "Bridal is the #1 misread. The fastest fix: skip anything with traditional wedding signifiers — no arches, no rose-petal aisles, no tiered white cake with sugar flowers. Sterile is the #2 misread, and it happens when every white in the room is the same white. The solution is <strong>varied temperature</strong>: mix ivory, cream, bone, chalk, and crisp white together deliberately. Combine matte and sheen textures (linen with silk with pearl with ceramic). Add one real architectural element — a structural floral, a dramatic candelabra, an oversized framed mirror. All-white isn't minimalism; it's a <em>disciplined maximalism</em> where the only rule is the color.",
      },
      {
        type: "palette-showcase",
        heading: "All-White Color Palettes",
        palettes: [
          {
            name: "Warm Whites",
            mood: "textured, lived-in, expensive",
            colors: [
              { hex: "#faf7f0", name: "Linen" },
              { hex: "#f3ece1", name: "Cream" },
              { hex: "#ede2d3", name: "Bone" },
              { hex: "#e8ddc9", name: "Chalk" },
              { hex: "#d9cfb8", name: "Soft Camel (accent)" },
            ],
          },
          {
            name: "Cool Whites",
            mood: "crisp, architectural, editorial",
            colors: [
              { hex: "#ffffff", name: "Pure White" },
              { hex: "#f5f5f0", name: "Porcelain" },
              { hex: "#eceae0", name: "Frost" },
              { hex: "#dfdccf", name: "Paper" },
              { hex: "#b8b5a6", name: "Soft Stone (accent)" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "How to Keep All-White From Looking Flat",
        tips: [
          {
            title: "Vary the temperature of your whites",
            body: "Nothing kills this theme faster than matching every white in the room. Use warm (ivory, cream, bone) and cool (porcelain, frost, paper) together. Pick one as the dominant 70% and the other as the 30% accent. The eye reads <em>variation</em> as editorial; it reads <em>uniformity</em> as stock photo.",
          },
          {
            title: "Layer textures, not colors",
            body: "Since you've taken color off the table, texture does the entire visual job. Linen tablecloth with a silk runner. Matte ceramic plates with a brushstroke glaze. Pearl-accented napkin rings against rough-woven napkins. Add an unexpected textural element — bone-colored tapered candles, a single architectural dried floral (pampas, palm frond, birch branch) — so the table has depth.",
          },
          {
            title: "Control the lighting",
            body: "Overhead white light is a death sentence. Kill every ceiling fixture and rely on warm candlelight (cream or ivory tapers, not pure white which reads clinical) plus one or two warm lamps at eye level. The goal is skin-flattering light that makes whites glow instead of glare. Late-afternoon natural light at golden hour does half the work if the venue allows it.",
          },
          {
            title: "Enforce the dress code with zero apology",
            body: "Put 'strict all-white dress code' on the invite. Give examples (linen suit, silk slip dress, cashmere, ivory knit). Any color breaks the aesthetic, and one guest in red ruins the photos. If someone asks if cream counts — yes. If someone asks if they can wear a pattern on white — yes, as long as the pattern is white-on-white or tonal. If someone asks if they can wear beige — also yes. Black is the hard no.",
          },
          {
            title: "Pick food that won't stain the palette",
            body: "This is the one practical rule nobody talks about. Skip red wine (serve white, rosé, or champagne). Skip berries on the cake. Skip tomato sauce, beet anything, bold curry. A serving of food that stains a napkin mid-dinner wrecks the visual. Stick to a menu that stays in the palette: champagne and white wine, oysters, crudo, white fish, cauliflower and potato sides, a white chocolate or lemon-olive-oil cake.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Pair this with <a href=\"/birthday-themes/old-money-birthday-theme\">old money</a> if you want heritage-coded all-white, or <a href=\"/birthday-themes/soft-life-birthday-theme\">soft life</a> for a gentler version.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1772475385350-d130ebe22bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A white-toned interior with natural light and textured linen furniture",
        caption: "Natural light is a free upgrade.",
        credit: "Photo by Caroline Badran on Unsplash",
        creditUrl: "https://unsplash.com/@___atmos?utm_source=youthebirthday&utm_medium=referral",
        ratio: "wide",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "The all-white menu is constraint as design. Drinks: champagne, white wine, rosé that reads pale, vodka martinis, white negronis, sparkling water in glass. Skip anything red, anything with berry muddle, anything neon. Food: oysters, crudo, a white fish course, burrata, cauliflower steaks, potato gratin, a pale-colored risotto, a cheese board that stays in the ivory family. Dessert: a flourless white chocolate cake, lemon olive oil cake, coconut panna cotta. Garnish with herbs (thyme, rosemary, white-flowering basil) not red or purple anything.",
      },
      {
        type: "amazon-shop",
        title: "Shop the All-White Aesthetic",
        subtitle: "Eight pieces that carry texture and temperature variation — the actual trick.",
        placement: "all-white-theme",
        format: "grid",
        items: [
          { query: "white linen tablecloth hemstitch large", label: "Hemstitched Linen Tablecloth", description: "The warm-white base layer." },
          { query: "ivory taper candles unscented set", label: "Ivory Taper Candles", description: "Warm tapers, not clinical whites." },
          { query: "white ceramic dinner plates matte stoneware", label: "Matte Ceramic Plates", description: "Brushstroke glaze — not gloss." },
          { query: "pearl napkin rings set elegant", label: "Pearl Napkin Rings", description: "Tonal accent with sheen." },
          { query: "white pampas grass dried bouquet large", label: "Dried Pampas Bouquet", description: "The one architectural moment." },
          { query: "white linen napkins woven cloth set", label: "Woven Linen Napkins", description: "Rough texture against smooth plates." },
          { query: "champagne flutes crystal white gold rim", label: "Crystal Flutes", description: "For the toast and every refill." },
          { query: "cream taper candle holders brass set", label: "Brass Candle Holders", description: "One warm accent. Just one." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "All-white is the one theme where budget shows. Cheap plastic white decor (cake toppers, 'HAPPY BIRTHDAY' balloons, dollar-store plates) reads as kids' party instantly. Under $300 works only if you already own quality white linens and glassware. $500-$1,000 covers a proper dinner for 8-12: linen runner, real plates, tapers, florals. Luxury version ($1,500+) rents tabletop rentals from a company — you'll have matching crystal, real silver, pressed linens, and no stress about breakage.",
      },
      {
        type: "inline-cta",
        text: "Match the crisp palette with our <a href=\"/birthday-palettes/birthday-color-palette-inspiration\">birthday color palette inspiration</a>.",
      },
      {
        type: "faq",
        heading: "All-White Birthday FAQ",
        questions: [
          {
            question: "What colors actually count as all-white?",
            answer:
              "Ivory, cream, bone, chalk, porcelain, paper, pale beige, and crisp white. Light taupe works if it reads tonal. Black is the hard no. Pastels (pink, blue, green) break the theme. Gold and silver are fine as accents (candle holders, flatware, jewelry) but shouldn't appear as major surface colors. When in doubt: if it photographs as white or off-white in overhead light, it counts.",
          },
          {
            question: "How do I keep an all-white birthday from looking sterile?",
            answer:
              "Sterile happens when every white is the same white. The fix is temperature variation: mix warm whites (ivory, cream, bone) with cool whites (porcelain, frost, paper) deliberately. Layer textures — linen with silk with pearl with ceramic. Add one real architectural element (a dramatic floral, a candelabra, an oversized mirror). And control lighting: no overhead white lights, only warm candles and lamps at eye level.",
          },
          {
            question: "How do I make it feel expensive, not bridal?",
            answer:
              "Skip wedding signifiers. No arches, no rose-petal runners, no tiered cake with sugar flowers, no welcome signs in cursive. Use editorial references instead — think Hermès showroom, Aesop store, a Calvin Klein campaign from the 90s. The difference is <em>restraint and texture</em>: an all-white birthday that feels expensive has 3-4 strong elements (linens, florals, lighting, one statement piece) instead of 20 small bridal touches.",
          },
          {
            question: "What should I tell guests about the all-white dress code?",
            answer:
              "Be direct on the invite: 'Strict all-white dress code — any fabric, any silhouette.' Give 2-3 examples (linen suit, silk slip dress, ivory knit). Mention that cream, ivory, and tonal white-on-white patterns count; black and any other color do not. Expect one or two guests to text asking; confirm directly. Anyone who shows up in color should be politely seated in the photos' background.",
          },
          {
            question: "What food and drinks work for an all-white birthday?",
            answer:
              "Menu that stays in the palette: oysters, crudo, white fish, burrata, potato gratin, cauliflower, risotto, white chocolate or lemon olive oil cake. Drinks: champagne, white wine, pale rosé, vodka martinis, white negronis, sparkling water. Skip red wine, berry anything, tomato sauce, beet, bold curry, anything that stains. Herbs as garnish — thyme, rosemary, white-flowering basil — never red or purple garnish.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your all-white birthday built for you",
        subheadline: "Our generator creates your palettes, captions, celebration plan, and destination picks tuned to your exact vibe.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // DISCO
  // Thesis: The most photographed-badly theme. Here's how to do it
  //         photographed well.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "disco-birthday-theme",
    category: "themes",
    title: "Disco Birthday Theme (2026) — How to Do Disco That Photographs Well",
    description:
      "The disco birthday theme guide for adults — mirror balls, warm directional lighting, sequins done right, playlist arc, and how to avoid Halloween costume chaos.",
    headline: "Disco Birthday Theme",
    subheadline: "The most photographed-badly theme. Here's how to do it photographed well.",
    tags: { vibe: "turn-up", season: "summer", theme: "disco" },
    canonicalPath: "/birthday-themes/disco-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-19",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Disco Birthday Theme",
        subheadline: "The most photographed-badly theme. Here's how to do it photographed well.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1583236753302-ded72d40a5e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A single dramatic light spot against darkness — disco aesthetic done intentionally",
        caption: "Light is the whole point.",
        credit: "Photo by Portuguese Gravity on Unsplash",
        creditUrl: "https://unsplash.com/@portuguesegravity?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "Disco is the most photographed-badly theme — and it's usually because people treat it like a costume party. The real aesthetic is about <em>light, reflection, and movement</em>. Mirror balls throwing fractured light across a room. Sequins catching a single warm bulb. Sweat on skin under directional light. A disco birthday done well looks like a 1979 Studio 54 photograph. A disco birthday done badly looks like a Spirit Halloween aisle.",
      },
      {
        type: "quick-take",
        rows: [
          { label: "Best for", value: "21st–35th birthdays, group formats, late-night energy" },
          { label: "Works best", value: "Dimly lit venue, private event space, a living room cleared for dancing" },
          { label: "Budget", value: "$200–$800 (lighting and mirror balls are the investment)" },
          { label: "Dress code", value: "Sequins, metallic, silk, satin — one statement piece, not full costume" },
          { label: "Avoid", value: "Rainbow chaos, costume wigs, overhead white lighting that makes everyone look green" },
        ],
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Disco works for the person whose birthday wants energy and a real dance floor. It's for 21st through 35th birthdays where the guest list has rhythm and the venue has space. It's for the friend group that will commit to a dress code rather than apologize for it, and for the host who understands that disco is less about <em>looking</em> retro and more about <em>feeling</em> like the best night anyone's had that year.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Summer nights and winter holiday season both land well. Summer because it flows naturally from drinks into dancing and sweaty joy. December because disco is the correct aesthetic for the end-of-year 'we made it' energy — especially NYE-adjacent birthdays. Skip disco for daytime or brunch formats; the theme is built on darkness, warm artificial light, and the kind of volume that requires neighbors to not be home.",
      },
      {
        type: "paragraph",
        heading: "How to avoid Halloween/costume energy",
        body: "The costume trap comes from leaning on 70s signifiers as shorthand — bell-bottoms, afro wigs, tinted round sunglasses worn indoors. These read as <em>costume</em>, not <em>theme</em>. The real version is contemporary: silk shirts, structured sequined dresses, metallic suits, platform shoes that feel like fashion not parody. Skip anything you'd buy at a costume store. Shop at vintage stores, designer consignment, and your own closet for pieces that have texture and shine. The rule: if you'd wear it to a good restaurant, it belongs at a disco birthday. If you'd wear it trick-or-treating, it doesn't.",
      },
      {
        type: "palette-showcase",
        heading: "Disco Color Palettes",
        palettes: [
          {
            name: "Studio Gold",
            mood: "warm metallic, sweaty glow",
            colors: [
              { hex: "#1a0f0a", name: "Deep Obsidian" },
              { hex: "#c9a96e", name: "Vintage Gold" },
              { hex: "#e6d3a3", name: "Champagne" },
              { hex: "#8b5a2b", name: "Bronze" },
              { hex: "#ffd700", name: "Pure Gold (accent)" },
            ],
          },
          {
            name: "Mirror & Smoke",
            mood: "silver, chrome, moody",
            colors: [
              { hex: "#0a0a0a", name: "Smoke Black" },
              { hex: "#c0c0c0", name: "Mirror Silver" },
              { hex: "#e8e4dc", name: "Chrome White" },
              { hex: "#6b0f1a", name: "Wine Red" },
              { hex: "#d4af37", name: "Warm Gold (accent)" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "How to Make Disco Photograph Well",
        tips: [
          {
            title: "One large mirror ball, hung high",
            body: "A real mirror ball — 12-inch minimum, 16-inch ideal — hung from the ceiling with a rotating motor. One good mirror ball beats ten tabletop sequin accents. Position it near a directional light so it throws fractured light across the walls and ceiling. This is the single highest-impact decor move on the list.",
          },
          {
            title: "Warm directional lighting — not overhead",
            body: "Kill every overhead fixture. Use warm-toned lamps (2700K) at eye level, or better, a single spotlight pointed at the mirror ball. Add a warm amber or red gel if you're being ambitious. The goal: skin looks good, the room glows warm, and the mirror ball has a light to reflect. Overhead white LED is what makes every disco party photograph like a school gym.",
          },
          {
            title: "Sequins in moderation, real textures everywhere else",
            body: "One sequined element — a dress, a tablecloth, a backdrop — reads as <em>disco</em>. Five sequined elements reads as a craft store exploded. Pair sequins with silk, satin, leather, velvet. Texture variation is what separates editorial disco from Party City disco.",
          },
          {
            title: "Reflective accents — metallic, not plastic",
            body: "Brass candleholders. Silver or gold-rimmed glassware. A metallic table runner (real fabric, not foil). Disco balls as smaller centerpieces (4-inch, hanging from fishing line above the table). Anything that catches light adds to the atmosphere; anything plastic or printed breaks it. Shop for <em>objects</em>, not decor kits.",
          },
          {
            title: "Build a real playlist arc — don't use 'Disco Hits'",
            body: "A real disco playlist has a shape. Open warm (Chaka Khan, Marvin Gaye, Earth Wind & Fire). Build energy through the first hour (Donna Summer, Diana Ross, Chic). Peak late (Sister Sledge, Thelma Houston, early Madonna). Close with slow-burn soul (Curtis Mayfield, Al Green). Three hours minimum. Skip anything with 'Disco Hits' in the title — those playlists are flat and skip the deep cuts that make the night land.",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Pair with our <a href=\"/birthday-themes/y2k-birthday-theme\">Y2K theme</a> for a chrome-forward version, or <a href=\"/birthday-themes/maximalist-birthday-theme\">maximalist</a> for color-forward.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1719607055881-fe8c6aa6a199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A mirror ball on a white surface reflecting warm light",
        caption: "The mirror ball is the centerpiece, not an afterthought.",
        credit: "Photo by Liana S on Unsplash",
        creditUrl: "https://unsplash.com/@cherstve_pechivo?utm_source=youthebirthday&utm_medium=referral",
        ratio: "wide",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "Disco isn't a dinner theme — it's a drinks-and-snacks theme. Heavy hors d'oeuvres that survive heat and movement: sliders, cheese board with aged cheddar and prosciutto, oysters on ice if the venue allows it, popcorn in small metal bowls, a late-night fries moment. Drinks: champagne is mandatory, a signature golden cocktail (French 75, gold-rimmed margaritas, or a tequila sour), espresso martinis as the second-half pick-me-up. Skip plated dinner — it kills the energy and guests can't dance on full stomachs anyway.",
      },
      {
        type: "amazon-shop",
        title: "Shop the Disco Aesthetic",
        subtitle: "Real objects, not costume-shop shortcuts.",
        placement: "disco-theme",
        format: "grid",
        items: [
          { query: "mirror ball large 12 inch hanging", label: "12-inch Mirror Ball", description: "The actual centerpiece. Hang it high." },
          { query: "disco ball motor rotating hanging", label: "Rotating Motor", description: "Without this, it's just a ball." },
          { query: "warm spotlight bulb amber directional", label: "Warm Spotlight Bulb", description: "Point it at the ball. Watch the room transform." },
          { query: "sequin table runner gold metallic fabric", label: "Sequin Runner", description: "Real fabric, not foil." },
          { query: "gold rimmed champagne coupes vintage", label: "Gold-Rim Champagne Coupes", description: "Real glass, real weight." },
          { query: "brass candleholders vintage tall set", label: "Vintage Brass Candleholders", description: "Warm metal, real reflection." },
          { query: "mini disco balls 4 inch set hanging", label: "Mini Disco Balls (set)", description: "Hang over the table on fishing line." },
          { query: "metallic tablecloth satin gold elegant", label: "Satin Tablecloth", description: "Sheen without the sequin chaos." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Disco scales well with budget because one great mirror ball does most of the work. Under $200 covers a mirror ball, motor, one warm spotlight, and a sequin runner — enough for a great home party. $500 adds a sound system upgrade (real speakers beat a Bluetooth dock), better glassware, and vintage-shop sequin pieces for the host. Luxury version ($800-$1,500) rents a full DJ setup, uplighting, and catered hors d'oeuvres — but the mirror ball still does the aesthetic heavy lifting.",
      },
      {
        type: "inline-cta",
        text: "Need captions to match the energy? See our <a href=\"/birthday-captions/30th-birthday-captions\">30th</a> and <a href=\"/birthday-captions/25th-birthday-captions\">25th birthday captions</a>.",
      },
      {
        type: "faq",
        heading: "Disco Birthday FAQ",
        questions: [
          {
            question: "How do I make a disco birthday photograph well?",
            answer:
              "Three things, in order of importance. First: one large mirror ball hung high with a rotating motor — 12 inches minimum, 16 is better. Second: warm directional lighting (2700K lamps at eye level or a warm spotlight), no overhead white LED. Third: limit sequins to one or two elements and rely on real textures (silk, satin, brass, velvet) for everything else. Those three choices separate editorial disco from school-gym disco.",
          },
          {
            question: "What should guests wear to a disco birthday?",
            answer:
              "Put 'disco dress code — sequins, metallic, satin' on the invite. One statement piece, not a costume. Examples: a sequined dress with plain hair and makeup, a metallic suit over a silk t-shirt, a satin slip dress with gold jewelry, platform shoes or heeled boots. Shop vintage and designer consignment — skip costume stores entirely. If it reads more 1979-fashion-photograph than Halloween-aisle, it's right.",
          },
          {
            question: "What's the right playlist for a disco birthday?",
            answer:
              "A real arc, not a greatest-hits playlist. Open warm and soulful (Chaka Khan, Marvin Gaye, Earth Wind & Fire). Build through the first hour (Donna Summer, Diana Ross, Chic, Sylvester). Peak late (Sister Sledge, Thelma Houston, early Madonna, modern disco revivalists like Jessie Ware). Close on slow-burn soul (Curtis Mayfield, Al Green). Three hours minimum. Skip any Spotify playlist titled 'Disco Hits' — they flatten the genre and miss the deep cuts.",
          },
          {
            question: "Is disco better for a dinner or a party?",
            answer:
              "Party, always. Disco is a drinks-and-dancing theme — heavy hors d'oeuvres, late-night energy, a real dance floor. A seated dinner with a disco ball above the table is a misread; the ball doesn't do anything unless there's movement. Best format: cocktail-attire party, 15-30 people, drinks and snacks flowing, music peaking around hour two.",
          },
          {
            question: "How do I do a disco birthday on a budget?",
            answer:
              "One great mirror ball + one warm spotlight + a sequin runner is 80% of the aesthetic for under $200. Skip costume-shop disco kits entirely (they read cheap on camera). Vintage-shop your own outfit. Build a real playlist instead of paying for a DJ. The theme rewards commitment to a few key elements far more than spreading budget across cheap decor.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your disco birthday built for you",
        subheadline: "Our generator creates your palettes, captions, celebration plan, and destination picks based on your exact vibe.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // COQUETTE
  // Thesis: Femininity taken seriously, not ironically.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "coquette-birthday-theme",
    category: "themes",
    title: "Coquette Birthday Theme (2026) — Grown, Not Childish — The Adult Coquette Guide",
    description:
      "How to plan a coquette birthday theme that feels grown and intentional — bows, ribbons, pearls, and blush done with restraint, not childish cosplay. Full guide with colors, dress code, and menu.",
    headline: "Coquette Birthday Theme",
    subheadline: "Femininity taken seriously, not ironically.",
    tags: { vibe: "soft-life", theme: "coquette" },
    canonicalPath: "/birthday-themes/coquette-birthday-theme",
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-19",
    updatedAt: "2026-04-19",
    sections: [
      {
        type: "hero",
        headline: "Coquette Birthday Theme",
        subheadline: "Femininity taken seriously, not ironically.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1756758155895-e13e0afbe54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "Delicate pink fabric roses with pearl accents on lace — coquette aesthetic",
        caption: "Pearl, ribbon, restraint. That's the whole formula.",
        credit: "Photo by Alfonso Scarpa on Unsplash",
        creditUrl: "https://unsplash.com/@lucidistortephoto?utm_source=youthebirthday&utm_medium=referral",
        ratio: "hero",
      },
      {
        type: "paragraph",
        body: "Coquette is femininity taken seriously, not ironically. It's bows, ribbons, pearls, blush, and candlelight — but grown. The aesthetic was built for TikTok and got diluted into a cartoon version, but done right, it's closer to a Sofia Coppola film than a teenager's bedroom. The difference is <em>restraint</em>: one perfect bow instead of fifty, real pearls instead of plastic, candlelight instead of pink LED strips.",
      },
      {
        type: "quick-take",
        rows: [
          { label: "Best for", value: "25th–35th birthdays, intimate dinners and brunches, milestone celebrations for someone reclaiming softness" },
          { label: "Works best", value: "Candlelit dinner, afternoon tea, private dining room, cozy home setting" },
          { label: "Budget", value: "$150–$500 (the details are the spend — real ribbon, real pearls, real florals)" },
          { label: "Dress code", value: "Blush, cream, ivory, pearls, bows, lace — soft silhouettes, no hair-bow cosplay" },
          { label: "Avoid", value: "Costume bows, cartoon pink, plastic pearls, little-girl birthday energy, hot pink balloon arches" },
        ],
      },
      {
        type: "paragraph",
        heading: "Who this theme is for",
        body: "Coquette works for the person who grew up being told softness was childish and is now reclaiming it with full authority. It's for 25th through 35th birthdays, especially for women coming off a hard year who want something that feels <em>gentle</em> without being performative. It's for people who can pull off a bow without looking like they're in costume, and who understand that the theme is as much about mood (candlelit, intimate, unhurried) as it is about specific signifiers.",
      },
      {
        type: "paragraph",
        heading: "When it works best",
        body: "Spring and early summer for the natural alignment with florals and light pastels. Winter works beautifully for a candlelit dinner format — deep candles + pale florals + cashmere reads as an elevated holiday-season birthday. Skip it for a loud group party; coquette needs intimate format (dinner of 6-10, brunch of 4-8, a private tea) where the details can be seen. It falls apart in a venue with 30 people where nobody can see the table.",
      },
      {
        type: "paragraph",
        heading: "How to keep coquette grown, not childish",
        body: "The childish trap comes from <em>quantity, not quality</em> — hanging a pink balloon arch, tying bows on every single chair, serving cotton candy with rainbow sprinkles. The grown version uses the same vocabulary but with restraint: one dramatic bow on the cake stand instead of bows everywhere. Real freshwater pearls as napkin rings instead of plastic. Blush linen instead of hot pink. Candlelight instead of pink LED. And — critically — <em>real food and real drinks</em>. A cocktail of Campari and champagne reads mature; a pink-frosted unicorn cake reads like a 7-year-old's birthday. The theme hinges on taking the aesthetic seriously rather than signaling it cheaply.",
      },
      {
        type: "palette-showcase",
        heading: "Coquette Color Palettes",
        palettes: [
          {
            name: "Soft Blush",
            mood: "gentle, restored, candlelit",
            colors: [
              { hex: "#f5ebe0", name: "Cream" },
              { hex: "#f3d1ca", name: "Powder Pink" },
              { hex: "#e8b9ab", name: "Dusty Rose" },
              { hex: "#c8a995", name: "Warm Taupe" },
              { hex: "#8b6f5a", name: "Cocoa (accent)" },
            ],
          },
          {
            name: "Romantic Grown",
            mood: "deeper, intimate, cashmere-coded",
            colors: [
              { hex: "#fcefdc", name: "Butter Cream" },
              { hex: "#d4a5a5", name: "Rose Dust" },
              { hex: "#a67d7d", name: "Mauve" },
              { hex: "#8b3a3a", name: "Dried Rose (accent)" },
              { hex: "#c9a96e", name: "Aged Gold (accent)" },
            ],
          },
        ],
      },
      {
        type: "tip-list",
        heading: "How to Keep Coquette Grown",
        tips: [
          {
            title: "One perfect bow, not fifty",
            body: "The quickest signal of 'grown coquette': restraint on the bow. Tie one dramatic satin bow on the cake stand, or one at the back of your chair, or one on a favor bag. Do NOT tie bows on every chair, every vase, every napkin. One perfect bow reads as intentional; many read as party decoration.",
          },
          {
            title: "Real pearls, not plastic",
            body: "A strand of real freshwater pearls as a napkin tie. Vintage pearl earrings as place-setting gifts. A single pearl embedded in a place card. Skip plastic pearls from the craft store entirely — they photograph exactly as what they are. Real pearls cost less than you think ($20-60 for a strand) and carry the aesthetic across the whole evening.",
          },
          {
            title: "Blush, not hot pink",
            body: "The grown coquette palette is powder pink, dusty rose, cream, mauve — never hot pink, neon pink, bubblegum, or magenta. If the color would show up on a cartoon Barbie box, it's wrong. If it would show up on a watercolor painting of a peony, it's right.",
          },
          {
            title: "Candlelight is mandatory",
            body: "Overhead light kills this theme faster than any decor choice. Burn tapered candles (cream, dusty pink, or ivory — never neon) in every arrangement. A pair of pillar candles on the dining table, tapers down the runner, tealights in the bathroom. The light should be warm, flickering, and skin-flattering. Overhead white LED reads clinical.",
          },
          {
            title: "Grown-up food and drinks — no candy, no cartoons",
            body: "Serve real food. A roast chicken with rosemary, a seasonal tart, cheese course, good bread, proper dessert. Drinks: champagne, rosé, a Campari-and-champagne aperitif, espresso martinis. Skip cotton candy, unicorn cake, rainbow sprinkles, pink lemonade. The menu is the fastest way to signal 'adult celebration' rather than 'little girl's tea party.'",
          },
        ],
      },
      {
        type: "inline-cta",
        text: "Pair with <a href=\"/birthday-themes/soft-life-birthday-theme\">soft life</a> for the broader restraint aesthetic, or <a href=\"/birthday-themes/garden-party-birthday-theme\">garden party</a> for a daytime version.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1652419476890-edbe7576760d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2400&utm_source=youthebirthday&utm_medium=referral",
        alt: "A white cake topped with soft pink florals — grown coquette birthday aesthetic",
        caption: "The cake is the statement — and it knows to be quiet about it.",
        credit: "Photo by choose your stories on Unsplash",
        creditUrl: "https://unsplash.com/@chooseyourstories?utm_source=youthebirthday&utm_medium=referral",
        ratio: "wide",
      },
      {
        type: "paragraph",
        heading: "Food & drink direction",
        body: "The coquette menu is romantic and restrained. Start with a cheese course (burrata with honey, soft goat cheese with fig jam, baguette), move to a simple main (roast chicken with lemon, halibut with brown butter, or a herb-forward pasta), side of greens with a shallot vinaigrette. Dessert: a pale floral cake (rose-water pistachio, lavender lemon, or a simple vanilla with edible pressed flowers). Drinks: champagne, rosé, a Campari-and-champagne aperitif, espresso martinis for dessert. Garnish with edible flowers and fresh herbs — never sprinkles, never anything neon.",
      },
      {
        type: "amazon-shop",
        title: "Shop the Coquette Aesthetic",
        subtitle: "Details that carry the theme without childish signifiers.",
        placement: "coquette-theme",
        format: "grid",
        items: [
          { query: "satin ribbon blush pink wide yards", label: "Wide Satin Ribbon", description: "For one dramatic bow. Not fifty." },
          { query: "freshwater pearl strand necklace real", label: "Freshwater Pearl Strand", description: "For napkin ties or place-setting accents." },
          { query: "ivory taper candles set unscented", label: "Ivory Taper Candles", description: "Warm light is mandatory." },
          { query: "blush pink linen napkins cloth set", label: "Blush Linen Napkins", description: "Powder-soft, not hot pink." },
          { query: "vintage teacups floral pink gold rim set", label: "Vintage Teacups", description: "Mismatched, floral, gold-rimmed — thrifted works." },
          { query: "pressed edible flowers cake decoration", label: "Pressed Edible Flowers", description: "For the cake, the cocktails, the plate edges." },
          { query: "cake stand white ceramic pedestal elegant", label: "White Pedestal Cake Stand", description: "The one piece that makes the cake a moment." },
          { query: "rose water hydrosol facial spray", label: "Rose Water Spray", description: "For the bathroom. Small details matter." },
        ],
      },
      {
        type: "paragraph",
        heading: "Budget notes",
        body: "Coquette is budget-forgiving because the theme rewards time and sourcing over spend. Under $150 covers blush linen napkins, ivory tapers, a real ribbon, a freshwater pearl strand, and grocery-store florals arranged with care. $300-500 adds vintage teacups, a better cake order, and proper glassware. The luxury version ($800+) invests in a custom cake from a real pastry chef and vintage tabletop rentals. The theme fails when budget goes to cheap plastic (plastic pearls, craft-store bows, dollar-store pink decor) rather than fewer quality pieces.",
      },
      {
        type: "inline-cta",
        text: "Anchor the aesthetic with our <a href=\"/birthday-palettes/birthday-color-palette-inspiration\">birthday color palette inspiration</a>.",
      },
      {
        type: "faq",
        heading: "Coquette Birthday FAQ",
        questions: [
          {
            question: "How do I do a coquette birthday without it feeling childish?",
            answer:
              "Restraint is the entire answer. One dramatic bow instead of fifty. Real freshwater pearls instead of plastic. Blush linen instead of hot pink. Candlelight instead of pink LED. And — critically — real grown-up food and drinks: champagne and Campari, roast chicken, a pale floral cake. The theme hinges on taking the aesthetic seriously rather than signaling it with party-store shortcuts. If every element is high-quality and there are fewer of them, it reads grown. If everything is cheap and there are lots of it, it reads childish.",
          },
          {
            question: "What colors work for a coquette birthday?",
            answer:
              "Powder pink, dusty rose, cream, mauve, warm taupe, blush, butter cream. Aged gold and cocoa brown as accents. Avoid hot pink, neon pink, bubblegum, magenta, bright white (too bridal). The rule: if the color would appear on a cartoon Barbie box, it's too young. If it would appear on a watercolor painting of a peony, it's right. Think Sofia Coppola film palette, not toy store.",
          },
          {
            question: "What should guests wear to a coquette birthday?",
            answer:
              "Suggest 'soft dress code — blush, cream, pearls, lace' on the invite. Silk slip dresses, cashmere sets, lace tops, pearl earrings, low-heeled sandals or mules. One bow as an accent is welcome; full-hair-ribbon costume is not. The vibe is 'intentionally soft and grown,' not 'dressed as a doll.' If guests ask, tell them to aim for 'afternoon-tea elegance' rather than 'coquette aesthetic TikTok.'",
          },
          {
            question: "What food and drinks work for a coquette birthday?",
            answer:
              "Real food, romantic-restrained menu. Cheese course (burrata with honey, soft goat cheese with fig jam), simple main (roast chicken with lemon, herb pasta, halibut), greens with shallot vinaigrette, pale floral cake (rose-water pistachio, lavender lemon, vanilla with pressed flowers). Drinks: champagne, rosé, Campari-and-champagne aperitif, espresso martinis. Garnish with edible flowers and fresh herbs — never sprinkles, never neon, never anything that reads as child's menu.",
          },
          {
            question: "Is coquette better for a dinner, brunch, or tea?",
            answer:
              "All three work, but the theme is fundamentally an intimate-format theme — 4 to 10 people max. A candlelit dinner is the most romantic. An afternoon tea with vintage china is the most photogenic. A brunch with a pale cake and champagne is the most accessible. Skip any large-group format; coquette falls apart when there are 25 people and nobody can see the table. The details ARE the theme; they have to be visible.",
          },
        ],
      },
      {
        type: "cta",
        headline: "Get your coquette birthday built for you",
        subheadline: "Our generator creates your palettes, captions, celebration plan, and destination picks tuned to your exact vibe.",
        buttonText: "Generate My Birthday",
        buttonHref: "/onboarding",
      },
      { type: "related-content" },
    ],
  },
];

themePages.forEach(registerPage);

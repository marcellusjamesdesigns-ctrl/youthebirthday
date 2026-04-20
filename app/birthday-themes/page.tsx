import type { Metadata } from "next";
import Link from "next/link";
import { getContentPagesByCategory } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import type { ContentPage } from "@/lib/content/types";
import { ThemeFinder } from "./_components/ThemeFinder";

export const metadata: Metadata = {
  title: "Find Your Birthday Aesthetic — Birthday Themes (2026) | You The Birthday",
  description:
    "Discover your birthday aesthetic. Complete theme guides with colors, outfits, decor, food, and celebration direction — soft life, dark feminine, old money, Y2K, maximalist, and more.",
  alternates: { canonical: "/birthday-themes" },
  openGraph: {
    title: "Find Your Birthday Aesthetic",
    description: "Editorial birthday theme guides — find the aesthetic that fits you.",
    url: "https://youthebirthday.app/birthday-themes",
    type: "website",
  },
};

// ─── Theme groupings ───────────────────────────────────────────────────
// When a new theme page ships, move its slug from `comingSoon` to `themes`
// in the relevant groups. The hub picks up the change automatically.

const BY_VIBE = [
  {
    id: "vibe-quiet",
    label: "Quiet & Intentional",
    intro: "For the birthday that doesn't need to perform. Restrained, considered, lived-in luxury.",
    themes: ["soft-life-birthday-theme", "old-money-birthday-theme", "garden-party-birthday-theme", "all-white-birthday-theme"],
    comingSoon: ["Quiet Luxury"],
  },
  {
    id: "vibe-moody",
    label: "Moody & Intimate",
    intro: "For the birthday that wants depth. Candlelit, ritual-adjacent, slow-burn energy.",
    themes: ["dark-feminine-birthday-theme"],
    comingSoon: ["Black & Gold", "Wine Country"],
  },
  {
    id: "vibe-bold",
    label: "Bold & Unapologetic",
    intro: "For the birthday that takes up space. Maximum color, energy, and presence.",
    themes: ["maximalist-birthday-theme", "y2k-birthday-theme", "disco-birthday-theme", "coquette-birthday-theme"],
    comingSoon: [],
  },
];

const BY_SEASON = [
  {
    id: "season-spring",
    label: "Spring Birthdays",
    intro: "Natural light, fresh florals, garden-forward energy.",
    themes: ["soft-life-birthday-theme", "garden-party-birthday-theme"],
    comingSoon: ["Pastel Brunch"],
  },
  {
    id: "season-summer",
    label: "Summer Birthdays",
    intro: "Long days, rooftop energy, color-saturated celebration.",
    themes: ["maximalist-birthday-theme", "y2k-birthday-theme", "disco-birthday-theme"],
    comingSoon: ["Rooftop", "Tropical", "Beach"],
  },
  {
    id: "season-fall",
    label: "Fall Birthdays",
    intro: "Shorter days, deeper palettes, candlelit dinner season.",
    themes: ["dark-feminine-birthday-theme", "old-money-birthday-theme"],
    comingSoon: ["Harvest", "Wine Country"],
  },
  {
    id: "season-winter",
    label: "Winter Birthdays",
    intro: "Indoor energy, rich textures, intentional warmth.",
    themes: ["dark-feminine-birthday-theme", "old-money-birthday-theme", "all-white-birthday-theme"],
    comingSoon: ["Winter Wonderland"],
  },
];

const BY_COLOR = [
  {
    id: "color-neutral",
    label: "Neutral & Warm",
    intro: "Cream, wheat, camel, ivory. Understated palettes built on texture.",
    themes: ["soft-life-birthday-theme", "old-money-birthday-theme", "garden-party-birthday-theme", "all-white-birthday-theme"],
  },
  {
    id: "color-deep",
    label: "Deep & Moody",
    intro: "Burgundy, oxblood, midnight plum, onyx. Depth over brightness.",
    themes: ["dark-feminine-birthday-theme"],
    comingSoon: ["Black & Gold"],
  },
  {
    id: "color-bold",
    label: "Bold & Saturated",
    intro: "Fire red, tangerine, electric blue, hot pink. Color-forward and unafraid.",
    themes: ["maximalist-birthday-theme", "y2k-birthday-theme", "disco-birthday-theme"],
  },
];

const BY_BUDGET = [
  {
    id: "budget-under-150",
    label: "Under $150",
    intro: "Themes that work on a tight budget because they're built on restraint or resourcefulness.",
    themes: ["soft-life-birthday-theme", "dark-feminine-birthday-theme", "y2k-birthday-theme"],
  },
  {
    id: "budget-150-500",
    label: "$150–$500",
    intro: "Themes that shine with a middle-ground budget — real linens, quality decor, considered menu.",
    themes: ["soft-life-birthday-theme", "maximalist-birthday-theme", "dark-feminine-birthday-theme"],
  },
  {
    id: "budget-luxury",
    label: "$500+",
    intro: "Themes that benefit from real investment — private dining, premium spirits, curated detail.",
    themes: ["old-money-birthday-theme", "dark-feminine-birthday-theme"],
  },
];

const BY_OCCASION = [
  {
    id: "occasion-dinner",
    label: "Dinner Party",
    intro: "Seated, intimate, 6–12 people. Table is the centerpiece.",
    themes: ["dark-feminine-birthday-theme", "old-money-birthday-theme", "soft-life-birthday-theme"],
  },
  {
    id: "occasion-party",
    label: "Party / Group Celebration",
    intro: "Music, volume, 15+ people. Energy is the format.",
    themes: ["y2k-birthday-theme", "maximalist-birthday-theme", "disco-birthday-theme"],
  },
  {
    id: "occasion-brunch",
    label: "Brunch / Daytime",
    intro: "Natural light, relaxed pacing, photogenic food.",
    themes: ["soft-life-birthday-theme", "garden-party-birthday-theme"],
  },
];

const FEATURED: { slug: string; why: string }[] = [
  {
    slug: "soft-life-birthday-theme",
    why: "The most flexible theme. Works for every age, every venue, every budget.",
  },
  {
    slug: "dark-feminine-birthday-theme",
    why: "The highest-impact theme. Candlelit, ritual-adjacent, unforgettable.",
  },
  {
    slug: "y2k-birthday-theme",
    why: "The party theme. 21st through 35th, group-format, high energy.",
  },
];

const FAQS = [
  {
    question: "What is a birthday theme?",
    answer:
      "A birthday theme is a visual and emotional direction that ties together your colors, outfit, decor, food, music, and overall mood. Instead of planning piece by piece, a theme gives you a through-line — so the florals match the palette, the outfit matches the vibe, and the entire celebration feels intentional rather than improvised. The best themes aren't costumes; they're aesthetic choices you could actually live with.",
  },
  {
    question: "How do I choose a birthday theme that fits me?",
    answer:
      "Start with your energy, not Pinterest. If you want a birthday that feels calm and restored, soft life or old money fits. If you want depth and drama, dark feminine. If you want a party with a dress code people will actually follow, Y2K or maximalist. Then match the theme to your venue, season, and budget. The right theme is the one that feels like an expanded version of how you already live — not a character you're putting on for a night.",
  },
  {
    question: "What are the most popular birthday themes right now?",
    answer:
      "In 2026, the strongest aesthetic trends are soft life (quiet luxury, restraint as a flex), dark feminine (ritual-adjacent, candlelit, intimate), old money (heritage-coded, understated), Y2K (chrome, iridescent, maximalist nostalgia), and maximalist (layered color, bold pattern, dopamine dressing). Coquette, garden party, and all-white are also rising. Themes peak seasonally — soft life and garden party in spring, dark feminine and old money in fall, Y2K and maximalist year-round.",
  },
  {
    question: "How do I do a birthday theme on a budget?",
    answer:
      "Most themes work under $150 if you invest in the right 2–3 things. Soft life rewards linen and candles (skip fresh florals; dried pampas looks more intentional anyway). Dark feminine is built on candlelight and texture, not spend. Y2K is drugstore-friendly — butterfly clips and iridescent tape go further than any themed kit. The expensive-looking themes (old money, maximalist) benefit most from time rather than money: sourcing the right mismatched pieces, booking the right venue, writing the right invite.",
  },
  {
    question: "What birthday theme works for a dinner party?",
    answer:
      "Dark feminine is built for dinner — candlelit, intimate, 6–10 people, slow-paced. Old money works if the venue has heritage character (private dining room, historic restaurant). Soft life is the easier option for an at-home dinner because the aesthetic forgives imperfect execution. Avoid Y2K and maximalist for small intimate dinners — they need energy and a crowd to work.",
  },
  {
    question: "Should my birthday outfit match my theme?",
    answer:
      "Yes — but 'match' means 'belongs,' not 'coordinates.' The outfit should feel like it's from the same world as the decor, palette, and mood. Soft life outfit: linen, neutral tones, tonal-on-tonal. Dark feminine outfit: oxblood or black, floor-length, real jewelry. Y2K outfit: butterfly clips, iridescent fabric, platform anything. If your outfit would look wrong at your own party, the theme hasn't translated — fix one or the other.",
  },
];

export default function ThemesHub() {
  const pages = getContentPagesByCategory("themes");
  const themeLookup: Record<string, ContentPage> = {};
  for (const p of pages) {
    const slug = p.canonicalPath.split("/").pop();
    if (slug) themeLookup[slug] = p;
  }

  const featured = FEATURED.map((f) => ({ page: themeLookup[f.slug], why: f.why })).filter(
    (f) => !!f.page,
  );

  const breadcrumbItems = breadcrumbsForHub("themes");
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-5xl px-6 py-8 pb-20 space-y-10">
        <Breadcrumbs items={breadcrumbItems} />

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section className="py-8 sm:py-12 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60 animate-fade-rise">
            you the birthday
          </p>
          <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl animate-fade-rise stagger-1">
            Find Your Birthday Aesthetic
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            Pick the aesthetic that feels like an expanded version of how you already
            live. Or let us generate it for you.
          </p>
          <div className="pt-2 animate-fade-rise stagger-3">
            <Link
              href="/onboarding"
              className="inline-block rounded-full bg-foreground px-7 py-3 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all"
            >
              Generate Your Birthday Aesthetic
            </Link>
          </div>
        </section>

        {/* ─── FEATURED ─────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              Editor&apos;s picks
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">Start here</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map(({ page, why }) => (
              <Link
                key={page!.canonicalPath}
                href={page!.canonicalPath}
                className="lift-card p-6 space-y-3 block group"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne/50">
                  Featured
                </p>
                <h3 className="font-editorial text-xl text-foreground group-hover:text-champagne transition-colors">
                  {page!.headline}
                </h3>
                <p className="text-[13px] text-foreground/70 italic leading-relaxed">
                  {page!.subheadline}
                </p>
                <p className="text-[12px] text-muted-foreground/60 leading-relaxed pt-2 border-t border-border/20">
                  {why}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── THEME FINDER (tabbed) ────────────────────────────────── */}
        <ThemeFinder
          themeLookup={themeLookup}
          byVibe={BY_VIBE}
          bySeason={BY_SEASON}
          byColor={BY_COLOR}
          byBudget={BY_BUDGET}
          byOccasion={BY_OCCASION}
        />

        {/* ─── MID CTA ──────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            Not sure yet?
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Let the generator pick your aesthetic
          </h2>
          <Link
            href="/onboarding"
            className="inline-block rounded-full bg-foreground px-7 py-2.5 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all mt-2"
          >
            Generate My Birthday
          </Link>
        </section>

        {/* ─── AD ───────────────────────────────────────────────────── */}
        <AdUnit slot="2856419037" format="auto" className="my-2" />

        {/* ─── CROSS-LINK BLOCK ─────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              Keep building
            </p>
            <h2 className="heading-editorial text-xl sm:text-2xl">Pair your theme with</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/birthday-palettes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Palettes</p>
              <p className="text-sm font-medium text-foreground/80">Color stories that complete the theme</p>
            </Link>
            <Link href="/birthday-ideas" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Ideas</p>
              <p className="text-sm font-medium text-foreground/80">Concrete birthday plans for every format</p>
            </Link>
            <Link href="/birthday-captions" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Captions</p>
              <p className="text-sm font-medium text-foreground/80">Copy-ready captions that match the vibe</p>
            </Link>
            <Link href="/zodiac-birthdays" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Zodiac</p>
              <p className="text-sm font-medium text-foreground/80">Birthday energy by sign</p>
            </Link>
            <Link href="/birthday-destinations" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Destinations</p>
              <p className="text-sm font-medium text-foreground/80">Trip ideas that fit your aesthetic</p>
            </Link>
            <Link href="/blog" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">The Journal</p>
              <p className="text-sm font-medium text-foreground/80">Editorial guides on birthday planning</p>
            </Link>
          </div>
        </section>

        {/* ─── EDITORIAL GUIDE (collapsed by default) ───────────────── */}
        <section className="max-w-3xl mx-auto">
          <details className="lift-card p-6 group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
                  The Guide
                </p>
                <h2 className="heading-editorial text-xl sm:text-2xl text-foreground">
                  How to choose a birthday theme that actually fits you
                </h2>
                <p className="text-[12px] text-muted-foreground/60">
                  A 5-minute read on vibe, venue, budget, dress code, and color stories.
                </p>
              </div>
              <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-base shrink-0">
                ▾
              </span>
            </summary>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed mt-6 pt-6 border-t border-border/20">
              <p>
                The wrong theme is the one you picked because it looked good on Pinterest.
                The right theme is the one that feels like an expanded version of how you
                already live. Start there — with your actual energy, your actual
                aesthetic, your actual people — and the rest gets easier.
              </p>
              <p>
                <strong className="text-foreground/90">Start with vibe, not visuals.</strong>{" "}
                Ask yourself: do I want the night to feel calm, intimate, celebratory, or
                electric? A soft life birthday is built on restraint. A dark feminine
                birthday is built on depth. A maximalist birthday is built on presence.
                Once the energy is locked, the palette and decor answer themselves.
              </p>
              <p>
                <strong className="text-foreground/90">Check the venue.</strong> An
                old-money birthday doesn&apos;t work in a polished concept venue. A Y2K
                birthday doesn&apos;t work in a candlelit dining room. The space and the
                theme have to agree — if they don&apos;t, one of them has to change. When in
                doubt, let the venue lead and pick a theme that flatters it, not one that
                fights it.
              </p>
              <p>
                <strong className="text-foreground/90">Respect your budget.</strong> Some
                themes scale beautifully on $150 (soft life, dark feminine, Y2K).
                Others need real investment to avoid looking cheap (old money,
                maximalist). Pick the theme your budget can execute well rather than the
                one you have to fake. A fully-committed $200 soft life dinner beats a
                watered-down $800 old money event every time.
              </p>
              <p>
                <strong className="text-foreground/90">Set a dress code — and mean it.</strong>{" "}
                The fastest way to kill a theme is letting guests show up however they
                want. A real dress code (&ldquo;cocktail, jewel tones only&rdquo; or &ldquo;black tie
                with an edge&rdquo;) brings the scene together. Put it on the invite.
                People rise to the occasion when you give them one.
              </p>
              <p>
                <strong className="text-foreground/90">Lock the color story early.</strong>{" "}
                Every other decision follows from the palette. Florals, napkins, cake,
                invite, outfit — they all need to belong to the same visual world. Pick 3–5
                colors and hold the line. Browse our{" "}
                <Link href="/birthday-palettes/birthday-color-palette-inspiration" className="text-champagne/80 hover:text-champagne transition-colors underline underline-offset-2">
                  birthday color palette inspiration
                </Link>{" "}
                if you need a starting point.
              </p>
              <p>
                <strong className="text-foreground/90">Decide: subtle or full production?</strong>{" "}
                Not every birthday needs a theme at full volume. A subtle theme shows up
                in one or two gestures (the right flowers, a dress code on the invite, a
                single signature cocktail). A full-production theme shows up in every
                element. Both work. Pick which energy the night deserves before you start
                buying decor.
              </p>
            </div>
          </details>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              FAQ
            </p>
            <h2 className="heading-editorial text-2xl">
              Birthday Theme Questions
            </h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details key={faq.question} className="lift-card p-5 group">
                <summary className="font-medium text-sm cursor-pointer list-none flex items-center justify-between text-foreground/80 hover:text-foreground transition-colors">
                  {faq.question}
                  <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-xs">
                    +
                  </span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            One last thing
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Not sure which theme is yours?
          </h2>
          <Link
            href="/onboarding"
            className="inline-block rounded-full bg-foreground px-7 py-2.5 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all mt-2"
          >
            Generate My Birthday
          </Link>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}

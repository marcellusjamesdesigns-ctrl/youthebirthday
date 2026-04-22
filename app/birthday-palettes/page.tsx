import type { Metadata } from "next";
import Link from "next/link";
import { getContentPagesByCategory } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import { HubCards } from "@/components/content/HubCards";

export const metadata: Metadata = {
  title: "Birthday Color Palettes (2026) — Hex Codes for Decor, Outfits & Invites",
  description:
    "Birthday color palettes with hex codes for decorations, outfits, invitations, and the Instagram grid. Luxury gold, soft pastels, jewel tones, seasonal, and zodiac palettes.",
  alternates: { canonical: "/birthday-palettes" },
  openGraph: {
    title: "Birthday Color Palettes",
    description: "Hex-code palettes for birthday decor, outfits, and the grid.",
    url: "https://youthebirthday.app/birthday-palettes",
    type: "website",
  },
};

const FAQS = [
  {
    question: "How do I pick a birthday color palette?",
    answer:
      "Start with how you want the day to feel, not what's trending. Soft and romantic? Pull blush, sage, cream, and a muted plum. Bold and celebratory? Hot pink, cobalt, marigold, flame. Quiet and luxe? Deep green, champagne, ivory, rich brown. Pick a mood first, then pull 3–5 colors that all answer to it. The palette should feel like a decision, not a sampler.",
  },
  {
    question: "How many colors should a birthday palette have?",
    answer:
      "Three to five. Fewer than three looks underdone; more than five turns into visual chaos. The classic structure: one dominant color (60% of visual weight — walls, tablecloth, backdrop), one supporting color (30% — florals, accents), and one or two accents (10% — balloons, candles, plates). A neutral (cream, ivory, charcoal) as a tie-break color is almost always worth the fourth slot.",
  },
  {
    question: "What are the most popular birthday color palettes for 2026?",
    answer:
      "Four dominant directions this year: (1) Quiet luxury — champagne, ivory, tobacco, soft gold. (2) Soft life — blush, sage, lavender, cream. (3) Main character — hot pink, cobalt, marigold, black. (4) Moody romantic — burgundy, chocolate, dusty rose, cream. The generic rainbow and pastel-everything palettes are finally fading. Everyone's leaning into palettes with a clear point of view.",
  },
  {
    question: "Should my birthday palette match my outfit?",
    answer:
      "Match one color, not all of them. The strongest look is when your outfit picks up a single color from the palette — ideally an accent, not the dominant — so you read as part of the scene without blending into the decor. Example: if your palette is sage, blush, cream, and gold, wear cream or blush; skip sage (you'll disappear into the flowers). Metallic accessories in the palette's metal (gold, silver, bronze) tie it all together.",
  },
  {
    question: "How do I use birthday palette hex codes?",
    answer:
      "Copy the hex codes directly into Canva, Figma, or any design tool to build invitations, Instagram story templates, menus, and signage that match perfectly. For printed decor (balloons, streamers, tablecloths), search the hex name on Amazon or a party supplier — most brands list color names (e.g. 'champagne,' 'blush,' 'sage') that match the palette's descriptor. For florals, send the hex codes to your florist — they translate colors into flower varieties.",
  },
  {
    question: "Do palettes change by season or zodiac sign?",
    answer:
      "They can, and leaning into it makes the birthday feel considered. Summer palettes lean warm and saturated (terracotta, marigold, ocean, honey). Winter palettes lean jewel-toned and candlelit (burgundy, emerald, gold, cream). Fall and spring are where the best moody-romantic and soft-life palettes sit. Zodiac-wise: fire signs suit bold saturated; earth signs suit warm grounded; air signs suit light airy; water signs suit deep moody. Use your season or sign as the starting point, then customize from there.",
  },
];

export default function PalettesHub() {
  const pages = getContentPagesByCategory("palettes");
  const breadcrumbItems = breadcrumbsForHub("palettes");
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
      <div className="mx-auto max-w-5xl px-6 py-8 pb-20 space-y-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section className="pt-2 pb-2 sm:pt-4 sm:pb-4 text-center space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70 animate-fade-rise">
            you the birthday
          </p>
          <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl animate-fade-rise stagger-1">
            Birthday Color Palettes
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            Hex-code palettes for the decor, the outfit, the invites, and the
            grid. Pick a mood — take the whole palette.
          </p>
          <div className="pt-2 animate-fade-rise stagger-3">
            <Link
              href="/onboarding"
              className="inline-block rounded-full bg-foreground px-7 py-3 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all"
            >
              Generate My Birthday
            </Link>
          </div>
        </section>

        {/* ─── PRIMARY GRID ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
              Browse all
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              Birthday palette guides
            </h2>
          </div>
          <HubCards pages={pages} />
        </section>

        {/* ─── MID CTA ──────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
            Not sure which mood yet?
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Let the generator build a palette around your vibe
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
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
              Keep building
            </p>
            <h2 className="heading-editorial text-xl sm:text-2xl">Pair your palette with</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/birthday-themes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">Themes</p>
              <p className="text-sm font-medium text-foreground/80">The aesthetic the palette belongs to</p>
            </Link>
            <Link href="/birthday-ideas" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">Ideas</p>
              <p className="text-sm font-medium text-foreground/80">Birthday plans built around a color story</p>
            </Link>
            <Link href="/birthday-captions" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">Captions</p>
              <p className="text-sm font-medium text-foreground/80">Caption the photo once the grid is set</p>
            </Link>
            <Link href="/zodiac-birthdays" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">Zodiac</p>
              <p className="text-sm font-medium text-foreground/80">Palettes by sign and element</p>
            </Link>
            <Link href="/birthday-destinations" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">Destinations</p>
              <p className="text-sm font-medium text-foreground/80">Trip palettes — warm, oceanic, alpine, desert</p>
            </Link>
            <Link href="/blog" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">The Journal</p>
              <p className="text-sm font-medium text-foreground/80">Editorial guides on color, styling, and mood</p>
            </Link>
          </div>
        </section>

        {/* ─── EDITORIAL GUIDE (collapsed) ──────────────────────────── */}
        <section className="max-w-3xl mx-auto">
          <details className="lift-card p-6 group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
                  The Guide
                </p>
                <h2 className="heading-editorial text-xl sm:text-2xl text-foreground">
                  How to build a birthday color palette that actually holds together
                </h2>
                <p className="text-[12px] text-muted-foreground/80">
                  A 3-minute read on mood, ratio, and what to leave out.
                </p>
              </div>
              <span className="text-muted-foreground/60 transition-transform group-open:rotate-180 text-base shrink-0">
                ▾
              </span>
            </summary>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed mt-6 pt-6 border-t border-border/20">
              <p>
                The best birthday palettes don&apos;t start from a Pinterest
                board — they start from a feeling. Ask yourself what you want
                the day to feel like in the photos six months from now. Quiet
                and considered? Loud and alive? Nostalgic? Grown? The answer
                narrows your color range before you open a swatch tool.
              </p>
              <p>
                <strong className="text-foreground/90">Use the 60/30/10 ratio.</strong>{" "}
                One dominant color fills ~60% of visual weight — the walls,
                the tablecloth, the backdrop. One supporting color takes the
                next 30% — florals, plates, accents. The last 10% is the pop
                — candles, balloons, signage. Without ratio discipline, every
                palette looks like a sampler set.
              </p>
              <p>
                <strong className="text-foreground/90">Cut the fifth color if in doubt.</strong>{" "}
                Five-color palettes work on paper and fail in practice. By the
                time you layer in florals, lighting, food, outfits, and photo
                filters, a four-color palette usually already reads as five or
                six. Three anchor colors plus one neutral is almost always the
                strongest move.
              </p>
              <p>
                <strong className="text-foreground/90">Balance warmth.</strong>{" "}
                Too many warm colors (red, orange, gold) without a cooler
                anchor turn a room into a sunset — beautiful for five minutes,
                exhausting for three hours. Too many cool colors (blue, green,
                violet) without warmth turn it into a boardroom. Aim for
                roughly 70/30 warm-to-cool or cool-to-warm, depending on the
                mood.
              </p>
              <p>
                <strong className="text-foreground/90">Pick a metal and commit.</strong>{" "}
                Gold, silver, bronze, rose gold, or black — just one. Mixing
                metals on accessories, cutlery, and hardware reads as
                unintentional. The metal is part of the palette — treat it
                like a color choice, not an afterthought.
              </p>
            </div>
          </details>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
              FAQ
            </p>
            <h2 className="heading-editorial text-2xl">
              Birthday Color Palette Questions
            </h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details key={faq.question} className="lift-card p-5 group">
                <summary className="font-medium text-sm cursor-pointer list-none flex items-center justify-between gap-3 text-foreground/80 hover:text-foreground transition-colors">
                  <span className="flex-1">{faq.question}</span>
                  <span aria-hidden="true" className="text-muted-foreground/60 transition-transform group-open:rotate-180 text-sm shrink-0 leading-none">▾</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[62ch]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
            One last thing
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Still staring at a blank Pinterest board?
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

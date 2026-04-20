import type { Metadata } from "next";
import Link from "next/link";
import { getContentPagesByCategory } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import type { ContentPage } from "@/lib/content/types";
import { IdeaFinder } from "./_components/IdeaFinder";

export const metadata: Metadata = {
  title: "Birthday Ideas That Actually Fit the Day (2026) | You The Birthday",
  description:
    "Browse birthday ideas by format, age, vibe, budget, or who you're planning for. Dinner, trips, weekends, solo, romantic, for her, for him — editorial guides built for real celebrations.",
  alternates: { canonical: "/birthday-ideas" },
  openGraph: {
    title: "Birthday Ideas That Actually Fit the Day",
    description: "Editorial birthday idea guides — find the plan that fits how you want to celebrate.",
    url: "https://youthebirthday.app/birthday-ideas",
    type: "website",
  },
};

// ─── Idea groupings ────────────────────────────────────────────────────
// When a new idea page ships, move its slug from `comingSoon` to `ideas`
// in the relevant groups. The hub picks up the change automatically.

const BY_FORMAT = [
  {
    id: "format-dinner",
    label: "Dinner & Drinks",
    intro: "The table is the celebration. Works at every age and every budget.",
    ideas: ["birthday-dinner-ideas", "birthday-ideas-for-adults"],
  },
  {
    id: "format-trips",
    label: "Trips & Weekends",
    intro: "Extend the birthday. Turn one day into a memory.",
    ideas: ["birthday-trip-ideas", "birthday-weekend-ideas"],
  },
  {
    id: "format-photoshoot",
    label: "Photoshoot / Content",
    intro: "The birthday where the gift is a print you'd actually frame.",
    ideas: ["birthday-photoshoot-ideas"],
  },
  {
    id: "format-solo",
    label: "Solo / Reset",
    intro: "Choosing yourself is a full format. Quiet isn't the opposite of celebrated.",
    ideas: ["solo-birthday-ideas", "soft-life-birthday-ideas"],
  },
];

const BY_AGE = [
  {
    id: "age-adults",
    label: "Birthday Ideas for Adults",
    intro: "Past 25, the best birthdays feel intentional — not loud.",
    ideas: ["birthday-ideas-for-adults"],
  },
  {
    id: "age-30",
    label: "30th Birthday",
    intro: "The milestone. Big enough to mark, specific enough to plan.",
    ideas: ["30th-birthday-ideas"],
  },
];

const BY_VIBE = [
  {
    id: "vibe-soft",
    label: "Soft Life",
    intro: "Calm, considered, restored. Not every birthday needs volume.",
    ideas: ["soft-life-birthday-ideas"],
  },
  {
    id: "vibe-romantic",
    label: "Romantic",
    intro: "Two people, real presence, the plan that doesn't need an audience.",
    ideas: ["romantic-birthday-ideas"],
  },
  {
    id: "vibe-solo",
    label: "Solo / Main Character",
    intro: "The birthday that belongs to you, first. Everything else is extra.",
    ideas: ["solo-birthday-ideas"],
  },
  {
    id: "vibe-luxury",
    label: "Luxury / Splurge",
    intro: "Access and curation over ostentation. Real luxury doesn't announce itself.",
    ideas: ["luxury-birthday-ideas"],
  },
];

const BY_BUDGET = [
  {
    id: "budget-free",
    label: "Free / Low Cost",
    intro: "Effort beats spend. The best low-budget birthdays feel the most considered.",
    ideas: ["cheap-birthday-ideas"],
  },
  {
    id: "budget-mid",
    label: "$100–$500",
    intro: "The sweet spot. Real dinners, small trips, curated at-home celebrations.",
    ideas: ["birthday-dinner-ideas", "birthday-weekend-ideas", "soft-life-birthday-ideas"],
  },
  {
    id: "budget-luxury",
    label: "Luxury / Splurge",
    intro: "Private dining, real trips, styled photoshoots. The birthday with no corners cut.",
    ideas: ["luxury-birthday-ideas", "birthday-trip-ideas"],
  },
];

const BY_WHO = [
  {
    id: "who-her",
    label: "For Her",
    intro: "Personal, stylish, actually thoughtful. Beyond flowers and chocolate.",
    ideas: ["birthday-ideas-for-her"],
  },
  {
    id: "who-him",
    label: "For Him",
    intro: "Experience over object. Beyond gift cards and steakhouses.",
    ideas: ["birthday-ideas-for-him"],
  },
  {
    id: "who-partner",
    label: "For Your Partner",
    intro: "The plan that reminds you why you chose each other.",
    ideas: ["romantic-birthday-ideas"],
  },
  {
    id: "who-yourself",
    label: "For Yourself",
    intro: "Planning your own birthday isn't sad — it's sovereign.",
    ideas: ["solo-birthday-ideas", "soft-life-birthday-ideas"],
  },
];

const FEATURED: { slug: string; why: string }[] = [
  {
    slug: "birthday-dinner-ideas",
    why: "The most flexible format. Works at every age, every budget, every group size.",
  },
  {
    slug: "birthday-ideas-for-adults",
    why: "The umbrella guide for celebrations past 25 — intentional, grown, not childish.",
  },
  {
    slug: "luxury-birthday-ideas",
    why: "Access and curation over ostentation. The considered version of spend.",
  },
];

const FAQS = [
  {
    question: "What are good birthday ideas for adults?",
    answer:
      "The best birthday ideas for adults match energy to format. If you want the night to feel planned and intentional, book a dinner (private room or chef's counter for small groups; long family-style table for larger ones). If you want a story you'll reference for years, take a trip — even a 2-night weekend away resets the year. If you want to reclaim the day from obligation, go solo or do a wellness reset. Skip themed kid-style parties past 25 unless the theme is a genuine aesthetic choice (disco, Y2K, garden party) rather than a novelty.",
  },
  {
    question: "What can I do for my birthday on a budget?",
    answer:
      "Budget birthdays work when the effort is visible. Under $100: host a long-table dinner at home with one great main and everyone bringing sides, plan a full day where you handle zero logistics for someone you love, or write real letters to your closest people. Under $300: book a single nice dinner at a restaurant that takes birthdays seriously (they often comp something), rent a hotel room in your own city for one night, or plan a curated day-trip. The rule: one well-executed idea beats three half-executed ones.",
  },
  {
    question: "What are birthday ideas that don't feel childish?",
    answer:
      "Adult birthday ideas that land: a chef's counter dinner for 6, a weekend away with 4–8 people, a photoshoot for yourself (not for social — for a print you hang), a styled dinner party at home with a dress code, a solo trip somewhere you've been curious about. The common thread is intention — the plan looks considered rather than defaulted-into. Skip balloon arches, Pinterest banner kits, and anything that requires explaining the theme to guests.",
  },
  {
    question: "How do I plan a birthday when I don't know what I want?",
    answer:
      "Start with the feeling, not the format. Ask: do I want the night to feel calm, celebrated, or electric? Then pick one format (dinner, trip, solo day, party) and strip it to its essentials — where, who, what time, what to wear. You don't need a theme to have a great birthday. You need a clear decision and the willingness to protect it against creep ('what if we also…'). One good idea, fully committed to, beats five half-ideas.",
  },
  {
    question: "What are good last-minute birthday ideas?",
    answer:
      "For under 48 hours notice: book the best dinner you can still get at your favorite restaurant, plan a day that's already built around something happening that weekend (a concert, exhibit, hike), or call 3 friends and organize a drop-in style hangout where people come and go. At-home: order in from the best restaurant you haven't tried, pick up real flowers and decent wine, light every candle you own. Last-minute works when it's intimate and intentional — not when it tries to imitate a planned event.",
  },
  {
    question: "Should I choose a birthday theme before choosing an idea?",
    answer:
      "Either works, but most people should pick the idea first and let the theme follow. If you know you want a dinner at home, the theme emerges from the space, season, and palette that already fit you. If you know you want a trip, the theme can just be 'the place.' Theme-first works if you already have a strong aesthetic reference (garden party, old money, disco) and the idea needs to serve it. Browse birthday themes for aesthetic direction after the idea is locked.",
  },
];

export default function IdeasHub() {
  const pages = getContentPagesByCategory("ideas");
  const ideaLookup: Record<string, ContentPage> = {};
  for (const p of pages) {
    const slug = p.canonicalPath.split("/").pop();
    if (slug) ideaLookup[slug] = p;
  }

  const featured = FEATURED.map((f) => ({ page: ideaLookup[f.slug], why: f.why })).filter(
    (f) => !!f.page,
  );

  const breadcrumbItems = breadcrumbsForHub("ideas");
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
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60 animate-fade-rise">
            you the birthday
          </p>
          <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl animate-fade-rise stagger-1">
            Birthday Ideas That Actually Fit the Day
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            Browse by format, age, vibe, budget, or who you&apos;re planning for.
            Or let the generator build the plan for you.
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

        {/* ─── IDEA FINDER (tabbed) ─────────────────────────────────── */}
        <IdeaFinder
          ideaLookup={ideaLookup}
          byFormat={BY_FORMAT}
          byAge={BY_AGE}
          byVibe={BY_VIBE}
          byBudget={BY_BUDGET}
          byWho={BY_WHO}
        />

        {/* ─── MID CTA ──────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            Not sure yet?
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Let the generator build your birthday plan
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
            <h2 className="heading-editorial text-xl sm:text-2xl">Pair your plan with</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/birthday-themes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Themes</p>
              <p className="text-sm font-medium text-foreground/80">Aesthetic direction for the celebration</p>
            </Link>
            <Link href="/birthday-captions" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Captions</p>
              <p className="text-sm font-medium text-foreground/80">Copy-ready captions that match the vibe</p>
            </Link>
            <Link href="/birthday-palettes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Palettes</p>
              <p className="text-sm font-medium text-foreground/80">Color stories to anchor the day</p>
            </Link>
            <Link href="/birthday-destinations" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Destinations</p>
              <p className="text-sm font-medium text-foreground/80">Trip ideas for birthday travelers</p>
            </Link>
            <Link href="/zodiac-birthdays" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Zodiac</p>
              <p className="text-sm font-medium text-foreground/80">Birthday energy by sign</p>
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
                  How to choose a birthday idea that actually fits your life
                </h2>
                <p className="text-[12px] text-muted-foreground/60">
                  A 5-minute read on budget, group size, energy, and what you actually want from the day.
                </p>
              </div>
              <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-base shrink-0">
                ▾
              </span>
            </summary>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed mt-6 pt-6 border-t border-border/20">
              <p>
                The wrong birthday idea is the one you picked because it&apos;s what
                people expect. The right idea is the one that matches how you
                actually want the day to feel. Start there — with the feeling —
                and the format, budget, and invite list get easier.
              </p>
              <p>
                <strong className="text-foreground/90">Start with the feeling, not the format.</strong>{" "}
                Ask yourself: do I want the day to feel calm, celebrated,
                intentional, or electric? A soft-life birthday works on a reset
                day. A celebrated birthday works as a dinner. An intentional one
                works as a solo trip. An electric one works as a party. Pick the
                feeling first — the format answers itself.
              </p>
              <p>
                <strong className="text-foreground/90">Match it to your budget honestly.</strong>{" "}
                Most birthday ideas work at every price point if you commit to
                the right version. A long-table dinner at home beats a watered-down
                restaurant reservation. A weekend in a nearby city beats a
                scattered week somewhere international. The best birthday is
                the one your budget can execute well, not the one you have to fake.
              </p>
              <p>
                <strong className="text-foreground/90">Think about the group size you want.</strong>{" "}
                Two people, six people, twelve, or thirty — each implies a
                different format. Dinner at home caps around 10. A restaurant
                private room handles 12–20. A house rental or trip works best
                around 4–8. A party format kicks in at 15+. Let the guest list
                pick the venue, not the other way around.
              </p>
              <p>
                <strong className="text-foreground/90">Decide: memory, photo, or reset?</strong>{" "}
                Every birthday does one of these well. A trip creates a memory.
                A styled dinner or photoshoot creates a photo. A solo day creates
                a reset. Pick one — the day gets easier when you&apos;re not
                trying to do all three. Trying to do all three is how birthdays
                end up feeling like work.
              </p>
              <p>
                <strong className="text-foreground/90">Protect the day from creep.</strong>{" "}
                The fastest way to ruin a birthday plan is letting it grow
                beyond the original intent. If you picked a quiet dinner, don&apos;t
                let it become a party of 18. If you picked a solo trip, don&apos;t
                let someone guilt you into company. Protect the feeling you
                decided on.
              </p>
              <p>
                <strong className="text-foreground/90">Not every birthday needs to be a party.</strong>{" "}
                The culture assumes big birthdays = big parties. They don&apos;t
                have to. Some of the best birthdays are quiet dinners, solo
                days, slow trips, or at-home celebrations with the 4 people who
                actually know you. The birthday belongs to you — it doesn&apos;t
                owe anyone a production.
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
              Birthday Idea Questions
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
            Not sure which idea is yours?
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

import type { Metadata } from "next";
import Link from "next/link";
import { getContentPagesByCategory } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import { HubCards } from "@/components/content/HubCards";

export const metadata: Metadata = {
  title: "Zodiac Birthday Ideas — How to Celebrate Your Sign (2026)",
  description:
    "Birthday ideas by zodiac sign — Aries through Pisces. Destinations, captions, themes, and celebration styles matched to each sign's energy.",
  alternates: { canonical: "/zodiac-birthdays" },
  openGraph: {
    title: "Birthday Ideas by Zodiac Sign",
    description: "How each sign should celebrate — ideas, destinations, captions.",
    url: "https://youthebirthday.app/zodiac-birthdays",
    type: "website",
  },
};

const FAQS = [
  {
    question: "What should I do for my birthday based on my zodiac sign?",
    answer:
      "Each sign has a birthday energy that rewards different formats. Fire signs (Aries, Leo, Sagittarius) do best with high-energy or adventure-led birthdays — parties, trips, physical experiences. Earth signs (Taurus, Virgo, Capricorn) want quality and comfort — great dinners, spa days, curated small events. Air signs (Gemini, Libra, Aquarius) thrive on novelty and conversation — new cities, group formats, cultural experiences. Water signs (Cancer, Scorpio, Pisces) want intimacy and atmosphere — candlelit dinners, close friends, meaningful rituals.",
  },
  {
    question: "What is the best zodiac sign to have a birthday?",
    answer:
      "There's no single best sign — but each has seasonal advantages. Summer signs (Gemini, Cancer, Leo, Virgo) get outdoor-first celebrations with natural golden-hour light. Winter signs (Sagittarius, Capricorn, Aquarius, Pisces) get cozy candlelit and holiday-adjacent energy. Spring signs (Aries, Taurus, Gemini) get garden-party season. Fall signs (Libra, Scorpio, Sagittarius) get the best moody dinners. Plan to your season rather than fighting it.",
  },
  {
    question: "How should a Scorpio celebrate their birthday?",
    answer:
      "Scorpio birthdays should feel moody, intimate, and intentional. Lean into candlelit dinners, private dining, dark-feminine aesthetic, small guest lists. Skip bright rooms, loud venues, and big group parties — they flatten Scorpio energy. Best formats: a 6–8 person dinner in a candlelit private room, a cabin weekend with 2–4 close people, or a styled photoshoot leaning into the sign's natural drama.",
  },
  {
    question: "How should a Leo celebrate their birthday?",
    answer:
      "Leo birthdays should be big, warm, and genuinely celebrated — no understating. Leo thrives on being seen by people they love. Best formats: a party with a real dress code (maximalist, disco, or Y2K themes land perfectly), a destination trip with a group, a styled photoshoot that produces prints. Skip quiet formats that might feel restrained or apologetic — Leo birthdays are supposed to feel like a production.",
  },
  {
    question: "Do zodiac signs really affect how you should celebrate?",
    answer:
      "Zodiac is a useful shortcut, not a rulebook. It groups people by energy patterns that often correlate with what feels right. If your sign's recommended format doesn't match who you actually are, follow yourself — a Pisces who genuinely wants a loud party is allowed to have one, a Leo who wants a quiet solo day is allowed to take it. Use zodiac as a prompt, not a prescription.",
  },
  {
    question: "What's the best gift for someone based on their zodiac sign?",
    answer:
      "Match the gift to the sign's core language. Fire signs: experiences over objects (concert tickets, a trip, an adventure). Earth signs: quality over quantity (cashmere, real jewelry, a great bottle, a spa day). Air signs: novelty and conversation (books, a subscription, a class, a restaurant new to them). Water signs: meaningful and specific (a handwritten letter, a print, a piece tied to a memory, anything with depth).",
  },
];

export default function ZodiacHub() {
  const pages = getContentPagesByCategory("zodiac");
  const breadcrumbItems = breadcrumbsForHub("zodiac");
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
            Birthday Ideas by Zodiac Sign
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            How each sign should celebrate. Ideas, destinations, captions, and
            themes matched to your energy.
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

        {/* ─── INTRO BLOCK ──────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto text-center space-y-3">
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Each sign has a birthday energy. Fire signs want motion. Earth
            signs want quality. Air signs want novelty. Water signs want
            intimacy. Start with yours — or skim all twelve to find the one
            that actually fits the night you want.
          </p>
        </section>

        {/* ─── ZODIAC GRID (numbered cards) ─────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              Start with your sign
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              All twelve birthday energies
            </h2>
          </div>
          <HubCards pages={pages} />
        </section>

        {/* ─── MID CTA ──────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            Not sure yet?
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Let the generator match your sign to a full plan
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
            <h2 className="heading-editorial text-xl sm:text-2xl">Pair your sign with</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/birthday-themes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Themes</p>
              <p className="text-sm font-medium text-foreground/80">Aesthetic direction that matches your sign</p>
            </Link>
            <Link href="/birthday-ideas" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Ideas</p>
              <p className="text-sm font-medium text-foreground/80">The format that fits your energy</p>
            </Link>
            <Link href="/birthday-captions" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Captions</p>
              <p className="text-sm font-medium text-foreground/80">Birthday voice by tone</p>
            </Link>
            <Link href="/birthday-palettes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Palettes</p>
              <p className="text-sm font-medium text-foreground/80">Color stories by vibe</p>
            </Link>
            <Link href="/birthday-destinations" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Destinations</p>
              <p className="text-sm font-medium text-foreground/80">Trip styles by sign</p>
            </Link>
            <Link href="/blog" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">The Journal</p>
              <p className="text-sm font-medium text-foreground/80">Editorial guides on birthday planning</p>
            </Link>
          </div>
        </section>

        {/* ─── EDITORIAL GUIDE (collapsed) ──────────────────────────── */}
        <section className="max-w-3xl mx-auto">
          <details className="lift-card p-6 group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
                  The Guide
                </p>
                <h2 className="heading-editorial text-xl sm:text-2xl text-foreground">
                  How to plan a birthday that actually matches your sign
                </h2>
                <p className="text-[12px] text-muted-foreground/60">
                  A 4-minute read on element, season, and when to break your own rules.
                </p>
              </div>
              <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-base shrink-0">▾</span>
            </summary>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed mt-6 pt-6 border-t border-border/20">
              <p>
                Zodiac is a useful shortcut for planning a birthday. Each
                sign has an energy pattern that tends to reward specific
                formats — so starting with your sign gets you 70% of the
                answer before you even think about venue or budget. The
                other 30% is knowing when to ignore your sign and follow
                yourself.
              </p>
              <p>
                <strong className="text-foreground/90">Start with your element.</strong>{" "}
                Fire signs (Aries, Leo, Sagittarius) want motion, heat, and
                an audience. Earth signs (Taurus, Virgo, Capricorn) want
                quality, comfort, and something they&apos;ll still enjoy
                when they&apos;re alone with it. Air signs (Gemini, Libra,
                Aquarius) want conversation, novelty, and variety. Water
                signs (Cancer, Scorpio, Pisces) want intimacy, atmosphere,
                and emotional resonance. The element tells you the format;
                the sign tells you the dress code.
              </p>
              <p>
                <strong className="text-foreground/90">Match the sign to the season.</strong>{" "}
                Your sign&apos;s actual birthday season matters more than
                any aesthetic rule. A summer Leo doesn&apos;t need winter
                candlelight. A winter Capricorn doesn&apos;t need rooftop
                energy. Use the season to decide venue type (outdoor vs.
                indoor), then let the sign inform the mood inside that venue.
              </p>
              <p>
                <strong className="text-foreground/90">Know when to break your own rules.</strong>{" "}
                A Scorpio who genuinely wants a loud group party is allowed
                to have one. A Leo who wants a quiet solo day is allowed to
                take it. Zodiac is a starting prompt, not a prescription.
                Your actual preferences always win — the sign-based
                recommendations just save you the decision when you don&apos;t
                know where to start.
              </p>
            </div>
          </details>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">FAQ</p>
            <h2 className="heading-editorial text-2xl">Zodiac Birthday Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details key={faq.question} className="lift-card p-5 group">
                <summary className="font-medium text-sm cursor-pointer list-none flex items-center justify-between gap-3 text-foreground/80 hover:text-foreground transition-colors">
                  <span className="flex-1">{faq.question}</span>
                  <span aria-hidden="true" className="text-muted-foreground/55 transition-transform group-open:rotate-180 text-sm shrink-0 leading-none">▾</span>
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
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">One last thing</p>
          <h2 className="heading-editorial text-xl sm:text-2xl">Let your sign pick the plan</h2>
          <Link
            href="/onboarding"
            className="inline-block rounded-full bg-foreground px-7 py-2.5 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all mt-2"
          >
            Generate My Birthday
          </Link>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}

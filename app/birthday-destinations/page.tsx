import type { Metadata } from "next";
import Link from "next/link";
import { getContentPagesByCategory } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import { HubCards } from "@/components/content/HubCards";

export const metadata: Metadata = {
  title: "Best Birthday Trip Ideas & Destinations (2026)",
  description:
    "Where to celebrate your birthday — luxury getaways, beach escapes, solo trips, and budget-friendly birthday destinations by vibe and season.",
  alternates: { canonical: "/birthday-destinations" },
  openGraph: {
    title: "Birthday Trip Destinations",
    description: "Where to go for your birthday — by vibe, budget, and how you want to feel.",
    url: "https://youthebirthday.app/birthday-destinations",
    type: "website",
  },
};

const FAQS = [
  {
    question: "Where is the best place to go for your birthday?",
    answer:
      "The best birthday destination matches your season, your energy, and your travel party. For small-group ease: boutique hotels in Mexico, Portugal, or Italy. For adventure: Costa Rica, Iceland, Japan. For quiet luxury resets: Positano, Santorini, Bali. For domestic weekends: Charleston, Santa Fe, the Hudson Valley. The wrong destination in the right season beats the right destination in the wrong one — always book around the weather and the crowd calendar first.",
  },
  {
    question: "What's a good birthday trip for a woman?",
    answer:
      "Strong birthday trip destinations that tend to land well for women traveling solo or with close friends: Paris, Lisbon, Mexico City, Charleston, Santorini, Tulum, Positano, Kyoto, Marrakech. The through-line: walkable cities with great food, strong safety records, curated boutique lodging options, and enough daytime culture that you don't need to rely on nightlife to make the trip feel full. Pick somewhere with at least three reasons to be there, not just one.",
  },
  {
    question: "What's the best birthday destination on a budget?",
    answer:
      "Budget birthday trips win on duration and proximity, not destination. A 2-night stay at a great Airbnb within 3 hours of home lands better than a stressed 5-night international trip booked last-minute. Strong budget options: domestic coastal weekends, shoulder-season European cities (Portugal, Spain, Italy in April or October), road trips with 2–3 close friends, or a boutique hotel staycation in your own city. Concentrate spend on one great meal per day rather than many mid ones.",
  },
  {
    question: "What's a good solo birthday trip?",
    answer:
      "Solo birthday trips work best in walkable, well-designed cities with great food and strong safety records. Top picks: Lisbon, Copenhagen, Kyoto, Mexico City, Montreal, Charleston, Santa Fe. Aim for 2–4 nights in a boutique hotel rather than a resort, build in at least one unstructured day, and plan one excellent dinner per night. Solo trips are one of the most underrated birthday formats — especially for milestone birthdays.",
  },
  {
    question: "How far ahead should I book a birthday trip?",
    answer:
      "Domestic: 6–12 weeks. International: 3–6 months. For peak-season destinations (Europe in summer, Caribbean in December–March, ski towns in January–March), lean toward the longer end. Booking early means better accommodation, better airfare pricing, and more time for the anticipation — which is half the gift of a birthday trip. Last-minute birthday trips tend to cost 2–3x more and deliver 60% of the experience.",
  },
  {
    question: "Is a birthday trip worth it?",
    answer:
      "For most adult birthdays past 25, yes. A 2-night trip creates weeks of anticipation, days of being somewhere new, and memories that last longer than any party. The trade-off is planning and cost — trips take more lead time than dinners and more budget than staycations. If the choice is between a thrown-together party and a considered weekend trip, the trip almost always produces the better year-in-review photo and the better story.",
  },
];

export default function DestinationsHub() {
  const pages = getContentPagesByCategory("destinations");
  const breadcrumbItems = breadcrumbsForHub("destinations");
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
            Birthday Trip Destinations
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            Where to celebrate by vibe, budget, and how you want to feel —
            not by where photographs best on Instagram.
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

        {/* ─── CURATED PRIMARY ──────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              Start with your trip type
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              Four birthday trip directions
            </h2>
            <p className="text-[13px] text-muted-foreground/65 max-w-xl mx-auto leading-relaxed">
              Curated direction before destination. Pick the energy of the
              trip you want — then let the generator build the itinerary to
              match.
            </p>
          </div>
          <HubCards pages={pages} />
        </section>

        {/* ─── MID CTA ──────────────────────────────────────────────── */}
        <section className="animated-border-card p-8 text-center space-y-3 glow-champagne">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            Not sure where to go?
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Let the generator match a destination to your birthday
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
            <h2 className="heading-editorial text-xl sm:text-2xl">Pair your trip with</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/birthday-ideas/birthday-trip-ideas" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Trip Ideas</p>
              <p className="text-sm font-medium text-foreground/80">How to plan the trip once you&apos;ve picked where</p>
            </Link>
            <Link href="/birthday-ideas/birthday-weekend-ideas" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Weekend Ideas</p>
              <p className="text-sm font-medium text-foreground/80">Closer trips, 2–3 nights, lower lift</p>
            </Link>
            <Link href="/birthday-themes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Themes</p>
              <p className="text-sm font-medium text-foreground/80">Aesthetic direction for the trip</p>
            </Link>
            <Link href="/birthday-captions" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Captions</p>
              <p className="text-sm font-medium text-foreground/80">Trip-post captions by vibe</p>
            </Link>
            <Link href="/zodiac-birthdays" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Zodiac</p>
              <p className="text-sm font-medium text-foreground/80">Trip styles by sign</p>
            </Link>
            <Link href="/blog" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">The Journal</p>
              <p className="text-sm font-medium text-foreground/80">Editorial guides on birthday travel</p>
            </Link>
          </div>
        </section>

        {/* ─── EDITORIAL GUIDE (collapsed) ──────────────────────────── */}
        <section className="max-w-3xl mx-auto">
          <details className="lift-card p-6 group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">The Guide</p>
                <h2 className="heading-editorial text-xl sm:text-2xl text-foreground">
                  How to pick a birthday destination that actually works
                </h2>
                <p className="text-[12px] text-muted-foreground/60">A 4-minute read on season, pace, and when to book.</p>
              </div>
              <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-base shrink-0">▾</span>
            </summary>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed mt-6 pt-6 border-t border-border/20">
              <p>
                The wrong birthday destination is the one that looked good on
                Pinterest. The right one is the one that matches the season,
                the energy you want, and the people traveling with you. Start
                there — with those three inputs — and the destination answers
                itself.
              </p>
              <p>
                <strong className="text-foreground/90">Book around the season, not the destination.</strong>{" "}
                A great destination in the wrong season is a disappointing
                trip. Europe in August is crowded and hot. Caribbean in
                September is hurricane season. Japan in cherry blossom week
                is beautiful and impossible to book. Match your birthday
                month to a destination in its best window — even if that
                means a less famous city.
              </p>
              <p>
                <strong className="text-foreground/90">Match pace to your travel party.</strong>{" "}
                Solo: walkable city, boutique hotel, 2–4 nights. Couple: one
                great hotel, one activity per day, room to wander. Small
                group (4–6): house rental, one booked dinner per night,
                one unscheduled day. Big group (8+): all-inclusive or villa
                rental — scattered itineraries across a city kill group trips.
              </p>
              <p>
                <strong className="text-foreground/90">Build in one unstructured day.</strong>{" "}
                Over-scheduling a birthday trip is the most common mistake.
                The best memories happen in the unplanned windows — the cafe
                you stumbled into, the walk at sunset, the dinner that ran
                long. Leave at least one morning and one evening completely
                free. You&apos;ll thank yourself on the flight home.
              </p>
              <p>
                <strong className="text-foreground/90">Book 6–12 weeks ahead domestic, 3–6 months international.</strong>{" "}
                Early booking rewards trip quality — better hotels, better
                airfare, more reservation availability. Last-minute birthday
                trips tend to cost 2–3x more and deliver 60% of the
                experience. The anticipation is half the gift.
              </p>
            </div>
          </details>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">FAQ</p>
            <h2 className="heading-editorial text-2xl">Birthday Destination Questions</h2>
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
          <h2 className="heading-editorial text-xl sm:text-2xl">Let the generator pick the destination too</h2>
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

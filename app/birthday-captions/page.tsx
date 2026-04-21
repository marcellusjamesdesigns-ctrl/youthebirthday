import type { Metadata } from "next";
import Link from "next/link";
import { getContentPagesByCategory } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import { HubCards } from "@/components/content/HubCards";

export const metadata: Metadata = {
  title: "Birthday Captions for Instagram (2026) — Copy & Paste Ready",
  description:
    "The best birthday captions for Instagram — funny, cute, short, aesthetic, luxury. Captions for your 21st, 25th, 30th, 40th, and 50th. Copy-paste ready.",
  alternates: { canonical: "/birthday-captions" },
  openGraph: {
    title: "Birthday Captions for Instagram",
    description: "Copy-paste birthday captions by age, vibe, and relationship.",
    url: "https://youthebirthday.app/birthday-captions",
    type: "website",
  },
};

const FAQS = [
  {
    question: "What is a good birthday caption for Instagram?",
    answer:
      "The best birthday captions feel specific to how you actually are — not generic. Pair the tone to the photo. For aesthetic solo portraits, lean short and confident ('Another year, same energy'). For group photos, lean playful ('Found the people who'd show up at any hour'). For milestone birthdays, lean reflective rather than boastful. Avoid overused phrases (blessed, grateful beyond words, another trip around the sun) — they dilute even a great photo.",
  },
  {
    question: "What should I caption my birthday post?",
    answer:
      "Match caption length to photo energy. One strong line beats a paragraph for portrait-style shots. For a carousel or recap post, you can go longer — a 2–4 line caption with structure works. The best captions say something the photo can't: a feeling, a private joke, a one-line year-in-review. If the caption could be on anyone else's post, it's not personal enough.",
  },
  {
    question: "What are short birthday captions?",
    answer:
      "Short captions (under 10 words) work for most Instagram formats. Strong patterns: 'It's giving [X].' 'Aged like [Y].' 'Main character energy, day [age].' 'Started the year as planned.' Keep it declarative, lowercase, zero hashtags. The short caption's job is to anchor the photo — not explain it.",
  },
  {
    question: "How do I pick a birthday caption for a milestone birthday?",
    answer:
      "Milestone birthdays (21st, 25th, 30th, 40th, 50th) reward a caption that acknowledges the moment without performing it. Skip 'dirty 30' and similar trope phrases. Instead: one specific observation about the year you just finished, or one specific intention for the year ahead. Reflection > bravado. The milestone post is the one people screenshot — write something worth reading twice.",
  },
  {
    question: "What's a good birthday caption for a girl or woman?",
    answer:
      "Skip generic 'birthday girl' phrasing — it's been overused for a decade. Better patterns: confident single-line statements ('Soft life, louder year'), playful references to your actual life ('The group chat approved this post'), or subtle nods to a specific aesthetic you're leaning into (soft life, coquette, old money). The caption should read like something only you'd write, not something anyone on Instagram could paste.",
  },
  {
    question: "Should I use hashtags in my birthday caption?",
    answer:
      "Skip hashtags in the main caption. Drop them in the first comment if you want reach — it keeps the caption readable. Generic hashtags like #birthdaygirl or #blessed actually hurt engagement now because they signal low-effort posts to the algorithm. If you use hashtags at all, make them specific (a location, a vibe, a private in-joke) and keep it under 5.",
  },
];

export default function CaptionsHub() {
  const pages = getContentPagesByCategory("captions");
  const breadcrumbItems = breadcrumbsForHub("captions");
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
            Birthday Captions That Actually Land
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            Copy-paste captions by age, vibe, and relationship. Pick the one
            that sounds like you — not like everyone else.
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

        {/* ─── PRIMARY GRID (numbered cards) ────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
              Browse all
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              Birthday caption guides
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
            Let the generator write your caption too
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
            <h2 className="heading-editorial text-xl sm:text-2xl">Pair your caption with</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/birthday-themes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Themes</p>
              <p className="text-sm font-medium text-foreground/80">The aesthetic the caption belongs to</p>
            </Link>
            <Link href="/birthday-ideas" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Ideas</p>
              <p className="text-sm font-medium text-foreground/80">The birthday plan behind the post</p>
            </Link>
            <Link href="/birthday-palettes" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Palettes</p>
              <p className="text-sm font-medium text-foreground/80">Color stories that tie the feed together</p>
            </Link>
            <Link href="/zodiac-birthdays" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Zodiac</p>
              <p className="text-sm font-medium text-foreground/80">Birthday voice by sign</p>
            </Link>
            <Link href="/birthday-destinations" className="lift-card p-5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Destinations</p>
              <p className="text-sm font-medium text-foreground/80">Trip-post captions by vibe</p>
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
                  How to choose a birthday caption that fits the post
                </h2>
                <p className="text-[12px] text-muted-foreground/60">
                  A 3-minute read on voice, length, and what to cut.
                </p>
              </div>
              <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-base shrink-0">
                ▾
              </span>
            </summary>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed mt-6 pt-6 border-t border-border/20">
              <p>
                The best birthday caption doesn&apos;t describe the photo — it
                adds a layer the photo can&apos;t carry on its own. A feeling,
                a private joke, a year-in-one-line, an inside reference only
                your close people will catch. Treat the caption as the second
                act, not a label.
              </p>
              <p>
                <strong className="text-foreground/90">Match length to format.</strong>{" "}
                Portrait or single photo: one strong line. Carousel or recap:
                two to four lines with rhythm. Reels: a single declarative
                line that works even if someone mutes the audio. The
                algorithm doesn&apos;t reward long captions — readers do, but
                only if the length earns itself.
              </p>
              <p>
                <strong className="text-foreground/90">Cut the overused phrases.</strong>{" "}
                &ldquo;Blessed,&rdquo; &ldquo;grateful beyond words,&rdquo; &ldquo;another trip around the
                sun,&rdquo; &ldquo;birthday girl,&rdquo; &ldquo;level up.&rdquo; These have been used
                enough that they read as template-filler even when you mean
                them. Replace with something specific — a year you had, a
                person who showed up, a habit you&apos;re leaving in this age.
              </p>
              <p>
                <strong className="text-foreground/90">Write it first, edit it second.</strong>{" "}
                Draft longer than you&apos;ll post. Then cut everything that
                feels like explanation. The caption you post should feel like
                it was inevitable — like there was only one right answer.
                Usually that&apos;s the second or third version, not the first.
              </p>
              <p>
                <strong className="text-foreground/90">Skip hashtags in the caption.</strong>{" "}
                Drop them in the first comment if you want reach — don&apos;t
                clutter the caption itself. Generic hashtags actually hurt
                engagement now. If you use hashtags at all, keep them under
                five and make them specific (a location, a vibe, a subculture).
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
              Birthday Caption Questions
            </h2>
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
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            One last thing
          </p>
          <h2 className="heading-editorial text-xl sm:text-2xl">
            Still staring at a blank caption field?
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

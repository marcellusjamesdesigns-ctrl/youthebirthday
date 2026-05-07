import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | You The Birthday",
  description:
    "You The Birthday is an editorial platform for birthday planning — personalized captions, color palettes, trip destinations, themes, and celebration guides, all curated by vibe, age, and zodiac.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | You The Birthday",
    description:
      "An editorial platform for birthday planning — captions, palettes, destinations, and guides curated for you.",
    url: "https://youthebirthday.app/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-16 pb-24 space-y-12">

        {/* Header */}
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">About</p>
          <h1 className="heading-editorial text-4xl sm:text-5xl">
            You The Birthday
          </h1>
          <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl">
            A birthday platform built for adults who want their birthday to feel like something — not just another year passing.
          </p>
        </div>

        {/* What it is */}
        <section className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-medium text-foreground/90">What We Do</h2>
          <p>
            You The Birthday is an editorial platform and personalized birthday generator. We combine original content — guides, captions, color palettes, destination write-ups, and celebration ideas — with a tool that personalizes all of it to your exact birthday, city, vibe, and zodiac sign.
          </p>
          <p>
            The generator takes your birthday details and builds a full dashboard: a birthday title for the year, Instagram-ready captions across five moods, four curated color palettes with hex codes, five vibe-matched destination picks, a creative celebration direction, and an optional cosmic layer for those who track their chart.
          </p>
          <p>
            The editorial side — The Journal, the destination guides, the theme writeups, the zodiac birthday pages — exists for anyone who wants to research and plan without generating anything. It's birthday intelligence, made readable.
          </p>
        </section>

        {/* Who it's for */}
        <section className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-medium text-foreground/90">Who It's For</h2>
          <p>
            Adults who take their birthday seriously — or want to start. People who are tired of last-minute dinner reservations, generic Instagram captions, and celebrations that don't feel like them. People planning milestone birthdays (30th, 40th, 50th) who want a guide, not a listicle. And people who just want a caption that sounds like they wrote it themselves.
          </p>
          <p>
            The platform skews toward women 25–45 planning their own birthday or a close friend's, but the content and generator are built to work for anyone.
          </p>
        </section>

        {/* Editorial approach */}
        <section className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-medium text-foreground/90">Editorial Approach</h2>
          <p>
            Every piece of content on this site is written with a specific point of view. The destination guides are opinionated. The caption packs are intentional. The Journal posts are written to be useful, not just read. We don't publish anything that feels like it could have been written for anyone — the best birthday content is specific.
          </p>
          <p>
            The generator is powered by AI (Claude by Anthropic), but the editorial framework — the vibes, the aesthetic categories, the structure of what a birthday should feel like — is written by hand. The AI fills in the personalization layer; the platform provides the editorial direction it runs on.
          </p>
        </section>

        {/* Contact + links */}
        <section className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-medium text-foreground/90">Get In Touch</h2>
          <p>
            For press inquiries, partnership opportunities, or general feedback, reach us at{" "}
            <a
              href="mailto:hello@youthebirthday.app"
              className="text-foreground/80 hover:text-foreground underline underline-offset-2 transition-colors"
            >
              hello@youthebirthday.app
            </a>
            .
          </p>
          <p>
            For privacy-related inquiries, contact{" "}
            <a
              href="mailto:privacy@youthebirthday.app"
              className="text-foreground/80 hover:text-foreground underline underline-offset-2 transition-colors"
            >
              privacy@youthebirthday.app
            </a>
            .
          </p>
        </section>

        {/* CTA */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Link
            href="/onboarding"
            className="inline-block rounded-full bg-foreground px-7 py-3 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all text-center"
          >
            Generate My Birthday
          </Link>
          <Link
            href="/blog"
            className="inline-block rounded-full border border-border/40 px-7 py-3 text-[14px] font-medium text-foreground/70 tracking-wide hover:text-foreground hover:border-border/70 transition-all text-center"
          >
            Read The Journal
          </Link>
        </div>
      </div>
    </div>
  );
}

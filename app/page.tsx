import Link from "next/link";
import type { Metadata } from "next";
import { BirthdayTicker } from "@/components/home/BirthdayTicker";
import { CyclingPreview } from "@/components/home/CyclingPreview";
import { StaticPreview } from "@/components/home/StaticPreview";
import { ZodiacBar } from "@/components/home/ZodiacBar";
import { FeatureCards } from "@/components/home/FeatureCards";
import { Reveal } from "@/components/ui/reveal";
import { HeroSection } from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: "You The Birthday — Personalized Birthday Captions, Ideas & Color Palettes",
  description:
    "Create a personalized birthday experience — Instagram captions, color palettes, trip destinations, celebration plans, and more. Curated by vibe, age, and zodiac sign. Free.",
  alternates: {
    canonical: "https://youthebirthday.app",
  },
  openGraph: {
    title: "You The Birthday — Your Personalized Birthday Experience",
    description:
      "Birthday titles, captions, color palettes, destinations, and celebration style — curated for you.",
    url: "https://youthebirthday.app",
    type: "website",
  },
};

const HUBS = [
  {
    eyebrow: "Captions",
    title: "Birthday Captions",
    desc: "Instagram-ready captions by age, vibe, and relationship — copy-paste ready.",
    href: "/birthday-captions",
  },
  {
    eyebrow: "Ideas",
    title: "Birthday Ideas",
    desc: "Celebration plans by age, format, and budget — from dinners to full weekends.",
    href: "/birthday-ideas",
  },
  {
    eyebrow: "Themes",
    title: "Birthday Themes",
    desc: "Aesthetic directions — soft life, quiet luxury, Y2K, and more, fully built out.",
    href: "/birthday-themes",
  },
  {
    eyebrow: "Palettes",
    title: "Color Palettes",
    desc: "Curated palettes with hex codes for outfits, decor, and the Instagram grid.",
    href: "/birthday-palettes",
  },
  {
    eyebrow: "Destinations",
    title: "Birthday Destinations",
    desc: "Where to celebrate — luxury, solo, group, domestic, and abroad picks.",
    href: "/birthday-destinations",
  },
  {
    eyebrow: "Milestones",
    title: "Milestone Birthdays",
    desc: "Dedicated guides for 21st, 25th, 30th, 35th, 40th, and 50th birthdays.",
    href: "/milestone-birthdays",
  },
  {
    eyebrow: "Zodiac",
    title: "Zodiac Birthdays",
    desc: "How each sign should celebrate — Aries through Pisces, built by element.",
    href: "/zodiac-birthdays",
  },
  {
    eyebrow: "Journal",
    title: "The Journal",
    desc: "Editorial guides on birthday planning, etiquette, and cultural context.",
    href: "/blog",
  },
];

const features = [
  {
    label: "Birthday Title",
    desc: "A headline for your year that feels like it was written by someone who knows you.",
    accent: "champagne",
  },
  {
    label: "Caption Pack",
    desc: "Instagram-ready captions across five moods — hype, soft, funny, luxe, mystical.",
    accent: "rose",
  },
  {
    label: "Color Palettes",
    desc: "Four curated palettes with hex codes for your decorations, outfit, and grid.",
    accent: "coral",
  },
  {
    label: "Destinations",
    desc: "Five vibe-matched birthday trip picks with personalized explanations.",
    accent: "champagne",
  },
  {
    label: "Celebration Style",
    desc: "A creative direction for how to celebrate — rituals, outfit, playlist, aesthetic.",
    accent: "lavender",
  },
  {
    label: "Cosmic Layer",
    desc: "Optional astrology-informed birthday read for those who know their birth time.",
    accent: "plum",
  },
];


export default function Home() {
  return (
    <div className="bg-gradient-hero">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── TICKER ────────────────────────────────────────────────────── */}
      <BirthdayTicker />

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center mb-14 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
                What your birthday becomes
              </p>
              <h2 className="heading-editorial text-2xl sm:text-3xl">
                Six personalized sections, one dashboard
              </h2>
            </div>
          </Reveal>

          <FeatureCards features={features} />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-border/10">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <div className="flex justify-center gap-8 sm:gap-16 text-center">
              {[
                { value: "2 min", label: "to generate" },
                { value: "6",     label: "sections"    },
                { value: "Free",  label: "no account"  },
              ].map(({ value, label }, i) => (
                <div key={i}>
                  <p className="text-2xl font-editorial text-foreground">{value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── PRODUCT PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-border/20">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <div className="text-center mb-12 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
                What you get
              </p>
              <h2 className="heading-editorial text-2xl sm:text-3xl">
                A real birthday, personalized
              </h2>
              <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
                Here&apos;s what a generated birthday dashboard looks like — yours will be tailored to your age, city, vibe, and zodiac sign.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <StaticPreview />
          </Reveal>

          <Reveal delay={300}>
            <div className="text-center mt-10">
              <Link href="/onboarding" className="glow-btn">
                Generate Mine
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ZODIAC BAR ────────────────────────────────────────────────── */}
      <ZodiacBar />

      {/* ── BROWSE HUBS ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-border/20">
        <Reveal>
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="text-center space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
                Every angle on the birthday
              </p>
              <h2 className="heading-editorial text-2xl sm:text-3xl">
                Browse the guides
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="lift-card p-5 space-y-1.5"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/70">
                    {hub.eyebrow}
                  </p>
                  <p className="text-sm font-medium text-foreground/90">
                    {hub.title}
                  </p>
                  <p className="text-[13px] text-muted-foreground/80 leading-relaxed">
                    {hub.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}

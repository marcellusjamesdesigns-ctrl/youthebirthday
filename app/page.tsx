import Link from "next/link";
import type { Metadata } from "next";
import { BirthdayTicker } from "@/components/home/BirthdayTicker";
import { CyclingPreview } from "@/components/home/CyclingPreview";
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
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center mb-12 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
                What it looks like
              </p>
              <h2 className="heading-editorial text-2xl sm:text-3xl">
                A real birthday, personalized
              </h2>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <CyclingPreview />
          </Reveal>

          <Reveal delay={300}>
            <div className="text-center mt-10">
              <Link href="/onboarding" className="glow-btn">
                Get Yours
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ZODIAC BAR ────────────────────────────────────────────────── */}
      <ZodiacBar />

      {/* ── EXPLORE CONTENT ───────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-border/20">
        <Reveal>
          <div className="mx-auto max-w-5xl text-center space-y-8">
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              Explore birthday inspiration
            </h2>
            <div className="flex flex-wrap justify-center gap-2.5">
              {[
                { label: "30th Captions",      href: "/birthday-captions/30th-birthday-captions"             },
                { label: "Luxury Destinations", href: "/birthday-destinations/luxury-birthday-destinations"   },
                { label: "Soft Life Theme",     href: "/birthday-themes/soft-life-birthday-theme"             },
                { label: "Color Palettes",      href: "/birthday-palettes/birthday-color-palette-inspiration" },
                { label: "Zodiac Birthdays",    href: "/zodiac-birthdays"                                     },
                { label: "Birthday Ideas",      href: "/birthday-ideas"                                       },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border/50 px-5 py-2 text-[13px] text-muted-foreground/60 hover:text-champagne hover:border-champagne/30 hover:bg-champagne/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}

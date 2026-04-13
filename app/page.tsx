import Link from "next/link";
import type { Metadata } from "next";
import { ParticleField } from "@/components/home/ParticleField";
import { BirthdayTicker } from "@/components/home/BirthdayTicker";
import { CyclingPreview } from "@/components/home/CyclingPreview";
import { ZodiacBar } from "@/components/home/ZodiacBar";

export const metadata: Metadata = {
  title: "You The Birthday — Personalized Birthday Titles, Captions, Palettes & Trip Ideas",
  description:
    "Generate a personalized birthday dashboard with titles, Instagram captions, color palettes, travel destinations, and celebration plans — curated for your vibe, zodiac sign, and style. Free, no account needed.",
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

const accentColors: Record<string, string> = {
  champagne: "rgba(212, 175, 55, 0.06)",
  rose:      "rgba(212, 160, 160, 0.06)",
  coral:     "rgba(232, 131, 107, 0.06)",
  lavender:  "rgba(184, 169, 201, 0.06)",
  plum:      "rgba(155, 114, 207, 0.06)",
};

const accentBorders: Record<string, string> = {
  champagne: "rgba(212, 175, 55, 0.18)",
  rose:      "rgba(212, 160, 160, 0.18)",
  coral:     "rgba(232, 131, 107, 0.18)",
  lavender:  "rgba(184, 169, 201, 0.18)",
  plum:      "rgba(155, 114, 207, 0.18)",
};

export default function Home() {
  return (
    <div className="bg-gradient-hero">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 overflow-hidden">

        {/* Ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-champagne/[0.04] blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-plum/[0.03] blur-[120px]" />
        </div>

        {/* Particle field */}
        <ParticleField />

        <div className="max-w-3xl text-center space-y-10 relative z-10">

          {/* Eyebrow */}
          <div className="space-y-6 animate-fade-rise">
            <p className="text-[11px] uppercase tracking-[0.35em] text-champagne/60 font-medium">
              You The Birthday
            </p>

            {/* Hero headline */}
            <h1 className="heading-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-[90px] text-foreground">
              Your birthday,
              <br />
              <span className="shimmer-gold italic">personalized</span>
              <br />
              like an experience.
            </h1>
          </div>

          <p className="mx-auto max-w-lg text-base text-muted-foreground/70 leading-relaxed animate-fade-rise stagger-2">
            Birthday titles, captions, color palettes, destinations,
            and celebration style — curated for you, powered by your
            vibe and your story.
          </p>

          <div className="space-y-4 animate-fade-rise stagger-3">
            <Link href="/onboarding" className="glow-btn">
              Start Your Birthday
            </Link>
            <p className="text-xs text-muted-foreground/40 tracking-wide">
              No account needed. Takes 2 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────────────── */}
      <BirthdayTicker />

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
              What your birthday becomes
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              Six personalized sections, one dashboard
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.label}
                className="glass-card group relative rounded-xl p-6 space-y-3 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background:   accentColors[item.accent],
                  borderColor:  accentBorders[item.accent],
                }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-50"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentBorders[item.accent]}, transparent)`,
                  }}
                />
                <p className="text-[11px] uppercase tracking-[0.2em] text-champagne font-medium">
                  {item.label}
                </p>
                <p className="text-[13px] text-foreground/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-border/10">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-center gap-8 sm:gap-16 text-center">
            {[
              { value: "2 min", label: "to generate" },
              { value: "6",     label: "sections"    },
              { value: "Free",  label: "no account"  },
            ].map(({ value, label }, i) => (
              <div key={i}>
                <p className="text-2xl font-editorial text-foreground">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-border/20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
              What it looks like
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              A real birthday, personalized
            </h2>
          </div>

          <CyclingPreview />

          <div className="text-center mt-10">
            <Link href="/onboarding" className="glow-btn">
              Get Yours
            </Link>
          </div>
        </div>
      </section>

      {/* ── ZODIAC BAR ────────────────────────────────────────────────── */}
      <ZodiacBar />

      {/* ── EXPLORE CONTENT ───────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-border/20">
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
      </section>

    </div>
  );
}

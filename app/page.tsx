import Link from "next/link";
import type { Metadata } from "next";

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
  champagne: "rgba(212, 175, 55, 0.08)",
  rose: "rgba(212, 160, 160, 0.08)",
  coral: "rgba(232, 131, 107, 0.08)",
  lavender: "rgba(184, 169, 201, 0.08)",
  plum: "rgba(155, 114, 207, 0.08)",
};

const accentBorders: Record<string, string> = {
  champagne: "rgba(212, 175, 55, 0.15)",
  rose: "rgba(212, 160, 160, 0.15)",
  coral: "rgba(232, 131, 107, 0.15)",
  lavender: "rgba(184, 169, 201, 0.15)",
  plum: "rgba(155, 114, 207, 0.15)",
};

export default function Home() {
  return (
    <div className="bg-gradient-hero">
      {/* Hero */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 relative">
        {/* Subtle radial glow behind hero text */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-champagne/[0.03] blur-[120px]" />
        </div>

        <div className="max-w-3xl text-center space-y-10 relative">
          <div className="space-y-6 animate-fade-rise">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70 font-medium">
              You The Birthday
            </p>
            <h1 className="heading-editorial text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-foreground">
              Your birthday,
              <br />
              <span className="italic text-champagne/80">personalized</span>
              <br />
              like an experience.
            </h1>
          </div>

          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            Birthday titles, captions, color palettes, destinations,
            and celebration style — curated for you, powered by your
            vibe and your story.
          </p>

          <div className="space-y-4 animate-fade-rise stagger-3">
            <Link
              href="/onboarding"
              className="inline-block rounded-full bg-foreground px-10 py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)]"
            >
              Start Your Birthday
            </Link>
            <p className="text-xs text-muted-foreground/50 tracking-wide">
              No account needed. Takes 2 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get — promotional card grid */}
      <section className="py-20 px-6">
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
                className="group relative rounded-xl p-6 space-y-3 border transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: accentColors[item.accent],
                  borderColor: accentBorders[item.accent],
                }}
              >
                {/* Subtle top glow line */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-40"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentBorders[item.accent].replace("0.15", "0.4")}, transparent)`,
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

      {/* Social proof moment */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="flex justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-editorial text-foreground">2 min</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">to generate</p>
            </div>
            <div className="w-px bg-border/20" />
            <div>
              <p className="text-2xl font-editorial text-foreground">6</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">sections</p>
            </div>
            <div className="w-px bg-border/20" />
            <div>
              <p className="text-2xl font-editorial text-foreground">Free</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">no account</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Output Preview — proves quality before commitment */}
      <section className="py-20 px-6 border-t border-border/20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
              What it looks like
            </p>
            <h2 className="heading-editorial text-2xl sm:text-3xl">
              A real birthday, personalized
            </h2>
          </div>

          {/* Sample dashboard preview */}
          <div className="luxury-card p-6 sm:p-8 space-y-8">
            {/* Identity preview */}
            <div className="text-center space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/50">you the birthday</p>
              <h3 className="heading-editorial text-2xl sm:text-3xl">Thirty, Dripped Out, and Untouchable</h3>
              <div className="flex justify-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-champagne/20 text-champagne/60">Velvet Sovereign</span>
                <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-border/60 text-muted-foreground/50">The Indulgence Epoch</span>
              </div>
              <p className="text-xs text-muted-foreground/40">Jade · turning 30</p>
            </div>

            {/* Palette preview */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">Color story</p>
              <div className="flex h-12 rounded-lg overflow-hidden">
                <div className="flex-1" style={{ backgroundColor: "#1a1a2e" }} />
                <div className="flex-1" style={{ backgroundColor: "#C47E3A" }} />
                <div className="flex-1" style={{ backgroundColor: "#d4af37" }} />
                <div className="flex-1" style={{ backgroundColor: "#8B1A2F" }} />
                <div className="flex-1" style={{ backgroundColor: "#E8D5B0" }} />
              </div>
              <p className="text-[11px] text-muted-foreground/40">Midnight Luxe · sophisticated, mysterious</p>
            </div>

            {/* Caption preview */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">Caption</p>
              <p className="text-sm text-foreground/70 italic font-editorial">
                &ldquo;Jade. 30. Atlanta. Not a warning — a welcome.&rdquo;
              </p>
            </div>

            {/* Destination preview */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">Destination match</p>
              <p className="text-sm text-foreground/60">Kyoto, Japan <span className="text-muted-foreground/30">· luxury · cultural</span></p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/onboarding"
              className="inline-block rounded-full bg-foreground px-8 py-3 text-[14px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)]"
            >
              Get Yours
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Content */}
      <section className="py-16 px-6 border-t border-border/20">
        <div className="mx-auto max-w-5xl text-center space-y-8">
          <h2 className="heading-editorial text-2xl sm:text-3xl">
            Explore birthday inspiration
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { label: "30th Captions", href: "/birthday-captions/30th-birthday-captions" },
              { label: "Luxury Destinations", href: "/birthday-destinations/luxury-birthday-destinations" },
              { label: "Soft Life Theme", href: "/birthday-themes/soft-life-birthday-theme" },
              { label: "Color Palettes", href: "/birthday-palettes/birthday-color-palette-inspiration" },
              { label: "Zodiac Birthdays", href: "/zodiac-birthdays" },
              { label: "Birthday Ideas", href: "/birthday-ideas" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-border/60 px-5 py-2 text-[13px] text-muted-foreground/60 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/3 transition-all"
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

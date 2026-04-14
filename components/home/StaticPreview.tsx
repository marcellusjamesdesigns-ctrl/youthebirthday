import Link from "next/link";

const EXAMPLE = {
  name: "Jade",
  age: "turning 30",
  city: "Atlanta",
  title: "Thirty, Dripped Out, and Untouchable",
  archetype: "Velvet Sovereign",
  era: "The Indulgence Epoch",
  palette: [
    { hex: "#1a1a2e", name: "Midnight" },
    { hex: "#C47E3A", name: "Bourbon" },
    { hex: "#d4af37", name: "Champagne" },
    { hex: "#8B1A2F", name: "Burgundy" },
    { hex: "#E8D5B0", name: "Ivory" },
  ],
  paletteName: "Midnight Luxe",
  paletteMood: "sophisticated, mysterious",
  caption: "Jade. 30. Atlanta. Not a warning — a welcome.",
  captionCategory: "Main Character",
  destination: "Kyoto, Japan",
  destVibe: "luxury · cultural",
  destNote: "Cherry blossom season aligns with your birthday month.",
  celebration: "Black-Tie Garden Party",
  celebrationDesc: "An elevated outdoor dinner under string lights — linen, candles, curated playlist, and no phones.",
};

export function StaticPreview() {
  return (
    <div className="animated-border-card overflow-hidden">
      <div className="p-6 sm:p-8 space-y-7">
        {/* Identity */}
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/50">
            you the birthday
          </p>
          <h3 className="heading-editorial text-xl sm:text-2xl md:text-3xl">
            {EXAMPLE.title}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-champagne/20 text-champagne/60">
              {EXAMPLE.archetype}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-border/60 text-muted-foreground/50">
              {EXAMPLE.era}
            </span>
          </div>
          <p className="text-xs text-muted-foreground/65">
            {EXAMPLE.name} · {EXAMPLE.age} · {EXAMPLE.city}
          </p>
        </div>

        <div className="section-divider" />

        {/* Color palette */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">
            Color Story
          </p>
          <div className="flex h-14 rounded-lg overflow-hidden">
            {EXAMPLE.palette.map((c) => (
              <div
                key={c.hex}
                className="flex-1"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <div className="flex justify-between items-baseline">
            <p className="text-[11px] text-muted-foreground/65">
              {EXAMPLE.paletteName}
            </p>
            <p className="text-[10px] text-muted-foreground/40">
              {EXAMPLE.paletteMood}
            </p>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">
              Caption
            </p>
            <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground/30">
              {EXAMPLE.captionCategory}
            </span>
          </div>
          <p className="text-sm text-foreground/70 italic font-editorial leading-relaxed">
            &ldquo;{EXAMPLE.caption}&rdquo;
          </p>
        </div>

        {/* Destination preview */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">
            Destination Match
          </p>
          <div className="beam-card p-4 space-y-1.5">
            <div className="flex justify-between items-baseline">
              <p className="font-editorial text-sm text-foreground/80">
                {EXAMPLE.destination}
              </p>
              <span className="text-[9px] text-muted-foreground/40">
                {EXAMPLE.destVibe}
              </span>
            </div>
            <p className="text-[11px] text-green-400/60">
              {EXAMPLE.destNote}
            </p>
          </div>
        </div>

        {/* Celebration style preview */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">
            Celebration Style
          </p>
          <p className="text-sm font-medium text-foreground/75">
            {EXAMPLE.celebration}
          </p>
          <p className="text-[12px] text-muted-foreground/55 leading-relaxed">
            {EXAMPLE.celebrationDesc}
          </p>
        </div>

        {/* Bottom fade + CTA hint */}
        <div className="text-center pt-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/20" />
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/30">
              + restaurants · activities · cosmic profile
            </p>
            <div className="flex-1 h-px bg-border/20" />
          </div>
          <Link
            href="/onboarding"
            className="inline-block text-[12px] uppercase tracking-[0.15em] text-champagne/60 hover:text-champagne/80 transition-colors"
          >
            Generate yours →
          </Link>
        </div>
      </div>
    </div>
  );
}

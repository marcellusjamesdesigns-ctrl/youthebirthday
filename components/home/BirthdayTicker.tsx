"use client";

const TITLES = [
  "VELVET SOVEREIGN",
  "THE INDULGENCE EPOCH",
  "THIRTY & UNTOUCHABLE",
  "SOFT LIFE ERA",
  "MYSTIC MAIN CHARACTER",
  "DRIPPED OUT & DIVINE",
  "THE GLOW-UP CHAPTER",
  "DARK FEMININE ASCENSION",
  "QUIET LUXURY SEASON",
  "THE BIRTHDAY ARCHIVE",
  "CELESTIAL & UNBOTHERED",
  "OPULENT ORIGINS",
];

const DOT = (
  <span className="mx-6 text-champagne/30 text-xs select-none" aria-hidden="true">
    ✦
  </span>
);

export function BirthdayTicker() {
  // Duplicate for seamless loop
  const items = [...TITLES, ...TITLES];

  return (
    <div
      className="w-full overflow-hidden border-y border-border/20 py-4 select-none"
      aria-label="Birthday title examples"
    >
      <div className="ticker-track">
        {items.map((title, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-[11px] uppercase tracking-[0.35em] text-champagne/60 font-medium">
              {title}
            </span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  );
}

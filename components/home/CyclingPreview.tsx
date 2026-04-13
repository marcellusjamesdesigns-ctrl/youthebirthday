"use client";

import { useEffect, useState } from "react";

const PERSONAS = [
  {
    name: "Jade",
    age: "turning 30",
    city: "Atlanta",
    title: "Thirty, Dripped Out, and Untouchable",
    tag1: "Velvet Sovereign",
    tag2: "The Indulgence Epoch",
    palette: ["#1a1a2e", "#C47E3A", "#d4af37", "#8B1A2F", "#E8D5B0"],
    paletteName: "Midnight Luxe · sophisticated, mysterious",
    caption: "Jade. 30. Atlanta. Not a warning — a welcome.",
    destination: "Kyoto, Japan",
    destTags: "luxury · cultural",
    glow: "rgba(212,175,55,0.08)",
  },
  {
    name: "Marcus",
    age: "turning 25",
    city: "Houston",
    title: "Twenty-Five, Built Different, Just Getting Started",
    tag1: "The Ascension Year",
    tag2: "Golden Era Protocol",
    palette: ["#0d1b2a", "#1b4332", "#d4af37", "#c77dff", "#f8f9fa"],
    paletteName: "Emerald Throne · bold, ambitious",
    caption: "Marcus. 25. Houston. The setup year is over — this is the payoff.",
    destination: "Dubai, UAE",
    destTags: "luxury · adventure",
    glow: "rgba(155,114,207,0.08)",
  },
  {
    name: "Zara",
    age: "turning 21",
    city: "New York",
    title: "Twenty-One, Soft Life Activated, Unbothered",
    tag1: "Celestial Bloom",
    tag2: "The Softness Chapter",
    palette: ["#f8e1e7", "#e8b4b8", "#d4af37", "#c9ada7", "#99c1b9"],
    paletteName: "Rose Dusk · tender, luminous",
    caption: "Zara. 21. New York. She arrived quietly and changed everything.",
    destination: "Amalfi Coast, Italy",
    destTags: "romantic · scenic",
    glow: "rgba(212,160,160,0.08)",
  },
];

export function CyclingPreview() {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PERSONAS.length);
      setKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const p = PERSONAS[index];

  return (
    <div
      key={key}
      className="luxury-card glass-card preview-card-enter p-6 sm:p-8 space-y-8"
      style={{ boxShadow: `0 0 80px -20px ${p.glow}` }}
    >
      {/* Identity */}
      <div className="text-center space-y-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/50">you the birthday</p>
        <h3 className="heading-editorial text-xl sm:text-2xl md:text-3xl">{p.title}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-champagne/20 text-champagne/60">
            {p.tag1}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-border/60 text-muted-foreground/50">
            {p.tag2}
          </span>
        </div>
        <p className="text-xs text-muted-foreground/65">{p.name} · {p.age} · {p.city}</p>
      </div>

      {/* Color palette */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">Color story</p>
        <div className="flex h-12 rounded-lg overflow-hidden">
          {p.palette.map((color, i) => (
            <div key={i} className="flex-1 transition-all duration-700" style={{ backgroundColor: color }} />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground/65">{p.paletteName}</p>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">Caption</p>
        <p className="text-sm text-foreground/70 italic font-editorial">
          &ldquo;{p.caption}&rdquo;
        </p>
      </div>

      {/* Destination */}
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/40">Destination match</p>
        <p className="text-sm text-foreground/60">
          {p.destination}{" "}
          <span className="text-muted-foreground/55">· {p.destTags}</span>
        </p>
      </div>

      {/* Persona dots */}
      <div className="flex justify-center gap-2 pt-2">
        {PERSONAS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setKey((k) => k + 1); }}
            aria-label={`Show ${PERSONAS[i].name}'s birthday`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-champagne/70 scale-125"
                : "bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

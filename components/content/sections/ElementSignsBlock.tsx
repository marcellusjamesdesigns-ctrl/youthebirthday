import Link from "next/link";

interface ElementSignsBlockProps {
  element: string;
  signs: string[];      // fellow element signs (excluding current)
  currentSign: string;  // label of the current sign
}

const elementColors: Record<string, { border: string; bg: string; text: string; label: string }> = {
  Fire:  { border: "border-orange-500/20", bg: "bg-orange-500/5",  text: "text-orange-400/80",  label: "text-orange-400/50" },
  Earth: { border: "border-green-500/20",  bg: "bg-green-500/5",   text: "text-green-400/80",   label: "text-green-400/50" },
  Air:   { border: "border-sky-400/20",    bg: "bg-sky-400/5",     text: "text-sky-400/80",     label: "text-sky-400/50" },
  Water: { border: "border-plum/20",       bg: "bg-plum/5",        text: "text-plum/80",        label: "text-plum/50" },
};

const elementGlyph: Record<string, string> = {
  Fire: "🜂", Earth: "🜃", Air: "🜁", Water: "🜄",
};

export function ElementSignsBlock({ element, signs, currentSign }: ElementSignsBlockProps) {
  const colors = elementColors[element] ?? {
    border: "border-border/30", bg: "bg-foreground/3", text: "text-foreground/70", label: "text-muted-foreground/40",
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
          More {element} Signs
        </p>
        <span className="text-[13px] opacity-40">{elementGlyph[element]}</span>
      </div>

      <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 space-y-3`}>
        <p className={`text-[12px] ${colors.label} leading-relaxed`}>
          {currentSign} shares the <span className="font-medium">{element}</span> element with{" "}
          {signs.join(" and ")}. Same energy, different expression.
        </p>
        <div className="flex gap-3 flex-wrap">
          {signs.map((sign) => {
            const slug = sign.toLowerCase();
            return (
              <Link
                key={slug}
                href={`/zodiac-birthdays/${slug}-birthday-ideas`}
                className={`text-sm font-medium ${colors.text} ${colors.border} border rounded-full px-4 py-1.5 ${colors.bg} hover:opacity-80 transition-opacity`}
              >
                {sign} Birthday Ideas
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

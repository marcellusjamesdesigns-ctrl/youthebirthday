"use client";

import { useState } from "react";

interface PaletteShowcaseSectionProps {
  heading: string;
  subheading?: string;
  palettes: {
    name: string;
    mood: string;
    colors: { hex: string; name: string }[];
  }[];
}

export function PaletteShowcaseSection({
  heading,
  subheading,
  palettes,
}: PaletteShowcaseSectionProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  function handleCopy(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
        {subheading && (
          <p className="mt-2 text-muted-foreground">{subheading}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {palettes.map((palette) => (
          <div key={palette.name} className="luxury-card overflow-hidden">
            <div className="flex h-24">
              {palette.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleCopy(color.hex)}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} — ${color.hex}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white tracking-wider">
                    {copiedHex === color.hex ? "Copied" : color.hex}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-foreground">{palette.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{palette.mood}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

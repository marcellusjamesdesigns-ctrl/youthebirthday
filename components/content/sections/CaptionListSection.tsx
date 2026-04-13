"use client";

import { useState } from "react";

interface CaptionListSectionProps {
  heading: string;
  subheading?: string;
  categories: { name: string; captions: string[] }[];
}

export function CaptionListSection({
  heading,
  subheading,
  categories,
}: CaptionListSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  function handleCopy(caption: string, key: string) {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
        {subheading && (
          <p className="mt-2 text-muted-foreground">{subheading}</p>
        )}
      </div>

      {categories.map((cat) => (
        <div key={cat.name} className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {cat.name}
            </p>
            <span className="text-[10px] text-muted-foreground/50">{cat.captions.length}</span>
          </div>
          <div className="space-y-1.5">
            {cat.captions.map((caption, j) => {
              const key = `${cat.name}-${j}`;
              return (
                <button
                  key={key}
                  onClick={() => handleCopy(caption, key)}
                  className="w-full text-left luxury-card p-4 text-sm text-foreground/80 hover:text-foreground transition-all group"
                >
                  <span>{caption}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedIndex === key ? "Copied" : "Copy"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

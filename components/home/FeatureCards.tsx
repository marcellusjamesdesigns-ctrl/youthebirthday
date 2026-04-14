"use client";

import { useCallback, useRef } from "react";

const ACCENT_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  champagne: {
    bg: "rgba(212, 175, 55, 0.05)",
    border: "rgba(212, 175, 55, 0.15)",
    glow: "rgba(212, 175, 55, 0.08)",
  },
  rose: {
    bg: "rgba(212, 160, 160, 0.05)",
    border: "rgba(212, 160, 160, 0.15)",
    glow: "rgba(212, 160, 160, 0.08)",
  },
  coral: {
    bg: "rgba(232, 131, 107, 0.05)",
    border: "rgba(232, 131, 107, 0.15)",
    glow: "rgba(232, 131, 107, 0.08)",
  },
  lavender: {
    bg: "rgba(184, 169, 201, 0.05)",
    border: "rgba(184, 169, 201, 0.15)",
    glow: "rgba(184, 169, 201, 0.08)",
  },
  plum: {
    bg: "rgba(155, 114, 207, 0.05)",
    border: "rgba(155, 114, 207, 0.15)",
    glow: "rgba(155, 114, 207, 0.08)",
  },
};

const ACCENT_ICONS: Record<string, string> = {
  champagne: "✦",
  rose: "❋",
  coral: "◈",
  lavender: "✧",
  plum: "☾",
};

interface Feature {
  label: string;
  desc: string;
  accent: string;
}

export function FeatureCards({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((item, i) => (
        <FeatureCard key={item.label} feature={item} index={i} />
      ))}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const colors = ACCENT_COLORS[feature.accent] ?? ACCENT_COLORS.champagne;
  const icon = ACCENT_ICONS[feature.accent] ?? "✦";

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    },
    []
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl p-6 space-y-3 transition-all duration-500 hover:translate-y-[-2px] animate-fade-rise stagger-${Math.min(index + 1, 6)}`}
      style={{
        background: colors.bg,
        border: `1px solid rgba(245, 240, 235, 0.04)`,
      }}
    >
      {/* Soft ambient glow — contained within card, large fade radius */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-[-50%] pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), ${colors.glow.replace("0.08", "0.12")}, transparent 45%)`,
          }}
        />
      </div>

      {/* Top beam line — soft, inset from edges */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-px opacity-50 group-hover:opacity-80 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
        }}
      />

      {/* Accent icon */}
      <div className="flex items-center gap-2.5 relative">
        <span
          className="text-base opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: colors.border.replace("0.15", "0.7") }}
        >
          {icon}
        </span>
        <p className="text-[11px] uppercase tracking-[0.2em] text-champagne font-medium">
          {feature.label}
        </p>
      </div>

      <p className="text-[13px] text-foreground/75 leading-relaxed relative">
        {feature.desc}
      </p>

    </div>
  );
}

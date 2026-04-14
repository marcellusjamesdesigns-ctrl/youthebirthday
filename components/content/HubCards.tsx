"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import type { ContentPage } from "@/lib/content/types";

/* ── Category accent mapping ─────────────────────────────────────────────── */

const CATEGORY_ACCENT: Record<string, string> = {
  captions: "212, 175, 55",
  ideas: "232, 131, 107",
  destinations: "155, 114, 207",
  palettes: "212, 160, 160",
  themes: "184, 169, 201",
  zodiac: "155, 114, 207",
};

const DEFAULT_RGB = "212, 175, 55";

/* ── Category decorative numeral ─────────────────────────────────────────── */

const CATEGORY_LABEL: Record<string, string> = {
  captions: "Captions",
  ideas: "Ideas",
  destinations: "Destinations",
  palettes: "Palettes",
  themes: "Themes",
  zodiac: "Zodiac",
};

/* ── Grid ─────────────────────────────────────────────────────────────────── */

export function HubCards({ pages }: { pages: ContentPage[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {pages.map((page, i) => (
        <HubCard key={page.canonicalPath} page={page} index={i} />
      ))}
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────────────────────── */

function HubCard({
  page,
  index,
}: {
  page: ContentPage;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rgb = CATEGORY_ACCENT[page.category] ?? DEFAULT_RGB;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    },
    []
  );

  const tags = [
    page.tags.age && `${page.tags.age}th`,
    page.tags.zodiac,
    page.tags.vibe,
  ].filter(Boolean);

  const label = CATEGORY_LABEL[page.category] ?? "";
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      ref={ref}
      href={page.canonicalPath}
      onMouseMove={handleMouseMove}
      className={`
        group relative flex flex-col justify-between
        rounded-2xl p-7 sm:p-8 min-h-[200px]
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        animate-fade-rise stagger-${Math.min(index + 1, 8)}
        hover:-translate-y-1
      `}
      style={{
        background: `linear-gradient(
          168deg,
          rgba(${rgb}, 0.03) 0%,
          rgba(26, 26, 29, 0.55) 40%,
          rgba(26, 26, 29, 0.45) 100%
        )`,
      }}
    >
      {/* ── Pointer-following spotlight ─────────────────────────────── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className="absolute inset-[-60%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(
              circle at var(--spot-x, 50%) var(--spot-y, 50%),
              rgba(${rgb}, 0.07),
              transparent 40%
            )`,
          }}
        />
      </div>

      {/* ── Top accent line — reveals on hover ─────────────────────── */}
      <div
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.25), transparent)`,
        }}
      />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-3 z-10">
        {/* Eyebrow: index + category */}
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-mono tracking-wider opacity-25 group-hover:opacity-50 transition-opacity duration-500"
            style={{ color: `rgb(${rgb})` }}
          >
            {num}
          </span>
          {label && (
            <>
              <span className="w-4 h-px bg-foreground/10 group-hover:w-6 group-hover:bg-foreground/20 transition-all duration-500" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors duration-500">
                {label}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="font-editorial text-[17px] sm:text-lg leading-snug text-foreground/90 group-hover:text-foreground transition-colors duration-500">
          {page.headline}
        </h2>

        {/* Description */}
        {page.subheadline && (
          <p className="text-[13px] text-muted-foreground/60 leading-relaxed group-hover:text-muted-foreground/75 transition-colors duration-500 max-w-[85%]">
            {page.subheadline}
          </p>
        )}
      </div>

      {/* ── Footer: Tags + Arrow ───────────────────────────────────── */}
      <div className="relative flex items-end justify-between mt-5 z-10">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-[0.15em] px-2 py-[3px] rounded-full text-muted-foreground/35 group-hover:text-muted-foreground/55 transition-colors duration-500"
                style={{
                  background: `rgba(${rgb}, 0.04)`,
                  boxShadow: `inset 0 0 0 0.5px rgba(${rgb}, 0.1)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Arrow — refined, thin, editorial */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-500">
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
            Read
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-muted-foreground/40"
          >
            <path
              d="M5.25 3.5L8.75 7L5.25 10.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── Bottom shadow depth — subtle ground shadow ──────────── */}
      <div
        className="absolute -bottom-1 left-4 right-4 h-4 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0.2), transparent 70%)`,
        }}
      />
    </Link>
  );
}

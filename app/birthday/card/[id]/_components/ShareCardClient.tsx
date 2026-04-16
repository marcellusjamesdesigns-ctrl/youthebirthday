"use client";

import { useRef } from "react";
import Link from "next/link";
import { CardActions } from "./CardActions";
import type { ColorPalette, CosmicProfile, CelebrationStyle, Destination } from "@/lib/db/schema";

interface ShareCardClientProps {
  sessionId: string;
  name: string;
  ageTurning: number;
  birthdayTitle?: string | null;
  birthdayArchetype?: string | null;
  birthdayEra?: string | null;
  primaryPalette: ColorPalette | null;
  cosmic: CosmicProfile | null;
  celebrationStyle: CelebrationStyle | null;
  topDestination: Destination | null;
  bestCaption: string | null;
  accentHex: string;
}

export function ShareCardClient({
  sessionId,
  name,
  ageTurning,
  birthdayTitle,
  birthdayArchetype,
  birthdayEra,
  primaryPalette,
  cosmic,
  celebrationStyle,
  topDestination,
  bestCaption,
  accentHex,
}: ShareCardClientProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 pb-12">
      {/* The card — capture target for PNG export */}
      <div
        ref={cardRef}
        data-card
        className="w-full max-w-[440px] relative overflow-hidden rounded-2xl border border-border/30"
        style={{ backgroundColor: "#0a0a0b" }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background: `radial-gradient(ellipse at top, ${accentHex}, transparent 60%), radial-gradient(ellipse at bottom right, rgba(155,114,207,0.3), transparent 60%)`,
          }}
        />

        {/* Color bar */}
        {primaryPalette && (
          <div className="flex h-1.5 relative z-10">
            {primaryPalette.colors.map((c) => (
              <div key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        )}

        <div className="relative z-10 p-8 sm:p-10 space-y-6">
          {/* Brand + name row */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/40">
              You the Birthday
            </p>
            <p className="text-[11px] text-muted-foreground/40">
              {name} · {ageTurning}
            </p>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="heading-editorial text-[28px] sm:text-[32px] leading-[1.12] tracking-tight">
              {birthdayTitle ?? `${name}'s Birthday`}
            </h1>
            <div className="flex flex-wrap justify-center gap-2">
              {birthdayArchetype && (
                <span
                  className="text-[10px] uppercase tracking-[0.15em] rounded-full px-3 py-1 border"
                  style={{ borderColor: `${accentHex}40`, color: `${accentHex}cc` }}
                >
                  {birthdayArchetype}
                </span>
              )}
              {birthdayEra && (
                <span className="text-[10px] uppercase tracking-[0.15em] border border-border/40 text-muted-foreground/60 rounded-full px-3 py-1">
                  {birthdayEra}
                </span>
              )}
            </div>
          </div>

          {/* Featured caption */}
          {bestCaption && (
            <div
              className="py-2 px-4"
              style={{ borderLeft: `2px solid ${accentHex}60` }}
            >
              <p className="font-editorial italic text-[15px] text-foreground/80 leading-relaxed">
                &ldquo;{bestCaption}&rdquo;
              </p>
            </div>
          )}

          {/* Celebration style + destination */}
          {(celebrationStyle || topDestination) && (
            <div className="space-y-3 py-3 border-t border-b border-border/10">
              {celebrationStyle && (
                <div className="space-y-1.5">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/35">
                    Your celebration
                  </p>
                  <p className="text-[13px] text-foreground/75 font-medium">
                    {celebrationStyle.primaryStyle}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[9px] text-muted-foreground/40 border border-border/20 rounded-full px-2 py-0.5">
                      {celebrationStyle.aesthetic}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40 border border-border/20 rounded-full px-2 py-0.5">
                      {celebrationStyle.outfit}
                    </span>
                  </div>
                </div>
              )}
              {topDestination && (
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/35">
                    Top destination pick
                  </p>
                  <p className="text-[13px] text-foreground/75 font-medium">
                    {topDestination.city}
                    {topDestination.country ? `, ${topDestination.country}` : ""}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom row: Big 3 + palette */}
          <div className="flex items-center justify-between">
            {cosmic?.sunSign ? (
              <div className="flex gap-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40">
                <span>☉ {cosmic.sunSign}</span>
                {cosmic.moonSign && <span>☽ {cosmic.moonSign}</span>}
                {cosmic.risingSign && <span>↑ {cosmic.risingSign}</span>}
              </div>
            ) : (
              <div />
            )}
            {primaryPalette && (
              <div className="flex gap-1">
                {primaryPalette.colors.map((c) => (
                  <div
                    key={c.hex}
                    className="w-5 h-5 rounded-full border border-white/10"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Brand footer inside card (for PNG export) */}
          <div className="pt-3 border-t border-border/15 text-center">
            <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.25em]">
              youthebirthday.app
            </p>
          </div>
        </div>
      </div>

      {/* Action bar — below the card (not captured in PNG) */}
      <CardActions sessionId={sessionId} cardRef={cardRef} />
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { birthdaySessions } from "@/lib/db/schema";
import type {
  StepStatusMap,
  ColorPalette,
  CaptionCategory,
  Destination,
  CelebrationStyle,
  CosmicProfile,
  Restaurant,
} from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { BirthdayHero } from "./BirthdayHero";
import { StreamingStatus } from "./StreamingStatus";
import { ShareButtons } from "./ShareButtons";
import AdUnit from "@/components/AdUnit";

type Session = InferSelectModel<typeof birthdaySessions>;

interface Sections {
  identity: {
    birthdayTitle: string;
    birthdayArchetype: string;
    birthdayEra: string;
    celebrationNarrative: string;
  } | null;
  palettes: ColorPalette[] | null;
  captions: CaptionCategory[] | null;
  destinations: Destination[] | null;
  celebrationStyle: CelebrationStyle | null;
  restaurants: Restaurant[] | null;
  cosmicProfile: CosmicProfile | null;
}

interface StatusResponse {
  status: string;
  version: number | null;
  stepStatus: StepStatusMap | null;
  sections: Sections | null;
  error: string | null;
}

interface DashboardShellProps {
  session: Session;
  initialGeneration: { status: string; stepStatus: StepStatusMap | null } | null;
  sessionId: string;
}

export function DashboardShell({
  session,
  initialGeneration,
  sessionId,
}: DashboardShellProps) {
  const [status, setStatus] = useState(
    initialGeneration?.status ?? session.status
  );
  const [stepStatus, setStepStatus] = useState<StepStatusMap | null>(
    initialGeneration?.stepStatus ?? null
  );
  const [sections, setSections] = useState<Sections | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerGeneration = useCallback(async () => {
    if (status !== "pending" && status !== "error") return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/birthday/${sessionId}/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        setIsGenerating(false);
        return;
      }
      setStatus("processing");
    } catch {
      setIsGenerating(false);
    }
  }, [sessionId, status]);

  useEffect(() => {
    if (status === "pending" && !sections) {
      triggerGeneration();
    }
  }, [status, sections, triggerGeneration]);

  useEffect(() => {
    if (status !== "processing") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/birthday/${sessionId}/status`);
        const data: StatusResponse = await res.json();
        setStatus(data.status);
        setStepStatus(data.stepStatus);

        if (data.sections) {
          setSections(data.sections);
        }

        if (data.status === "complete" || data.status === "error") {
          setIsGenerating(false);
          if (data.error) setErrorMsg(data.error);
        }
      } catch {
        // silently retry
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, sessionId]);

  const ageTurning = new Date().getFullYear() - session.birthYear;

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <BirthdayHero
          name={session.name}
          ageTurning={ageTurning}
          title={sections?.identity?.birthdayTitle}
          archetype={sections?.identity?.birthdayArchetype}
          era={sections?.identity?.birthdayEra}
          narrative={sections?.identity?.celebrationNarrative}
        />

        {(status === "processing" || isGenerating) && (
          <StreamingStatus sessionId={sessionId} stepStatus={stepStatus} />
        )}

        <div className="mt-12 space-y-10">
          {/* ─── Color Palettes ─────────────────────────────────────────── */}
          {sections?.palettes && sections.palettes.length > 0 && (
            <section className="animate-fade-rise space-y-5">
              <SectionLabel>Your Color Story</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                {sections.palettes.map((palette, i) => (
                  <PaletteCard key={palette.name} palette={palette} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ─── Captions ──────────────────────────────────────────────── */}
          {sections?.captions && sections.captions.length > 0 && (
            <section className="animate-fade-rise space-y-5">
              <SectionLabel>Your Caption Pack</SectionLabel>
              <div className="space-y-6">
                {sections.captions.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
                      {cat.category}
                    </p>
                    {cat.captions.map((caption, j) => (
                      <CopyableCaption key={j} caption={caption} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Ad: after captions ───────────────────────────────────── */}
          {sections?.captions && sections.captions.length > 0 && (
            <AdUnit slot="3782501964" format="auto" className="my-2" />
          )}

          {/* ─── Celebration Style ─────────────────────────────────────── */}
          {sections?.celebrationStyle && (
            <section className="animate-fade-rise">
              <div className="luxury-card p-6 sm:p-8 space-y-4 glow-champagne">
                <SectionLabel>Your Celebration</SectionLabel>
                <h3 className="heading-editorial text-xl sm:text-2xl">
                  {sections.celebrationStyle.primaryStyle}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {sections.celebrationStyle.description}
                </p>
                <div className="space-y-1.5 pt-1">
                  {sections.celebrationStyle.rituals.slice(0, 4).map((ritual, i) => (
                    <p key={i} className="text-[13px] text-foreground/70 pl-3 border-l border-champagne/20 leading-relaxed">
                      {ritual}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                  <StyleTag>{sections.celebrationStyle.aesthetic}</StyleTag>
                  <StyleTag>{sections.celebrationStyle.outfit}</StyleTag>
                  <StyleTag>{sections.celebrationStyle.playlist}</StyleTag>
                </div>
              </div>
            </section>
          )}

          {/* ─── Destinations: Season Picks ──────────────────────────── */}
          {sections?.destinations && sections.destinations.length > 0 && (() => {
            const seasonPicks = sections.destinations.filter((d) => d.section === "season" || !d.section);
            const dreamPicks = sections.destinations.filter((d) => d.section === "dream");
            // Fallback: if no section field (old generations), show all as season
            const hasNewFormat = sections.destinations.some((d) => d.section);

            return (
              <>
                {seasonPicks.length > 0 && (
                  <section className="animate-fade-rise space-y-5">
                    <div>
                      <SectionLabel>Best for Your Birthday Season</SectionLabel>
                      <p className="text-[12px] text-muted-foreground/65 mt-1.5">
                        Picked for your vibe, budget, and the time of year you&apos;re actually celebrating.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {seasonPicks.map((dest, i) => (
                        <DestinationCard key={dest.city} dest={dest} index={i} />
                      ))}
                    </div>
                  </section>
                )}

                {hasNewFormat && dreamPicks.length > 0 && (
                  <section className="animate-fade-rise space-y-5">
                    <div>
                      <SectionLabel>Dream Picks for Your Birthday Year</SectionLabel>
                      <p className="text-[12px] text-muted-foreground/65 mt-1.5">
                        These match your energy beautifully, even if they shine best in another season.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {dreamPicks.map((dest, i) => (
                        <DestinationCard key={dest.city} dest={dest} index={i} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            );
          })()}

          {/* ─── Ad: between destinations and restaurants ─────────────── */}
          {sections?.destinations && sections.destinations.length > 0 && (
            <AdUnit slot="7641823095" format="horizontal" className="my-2" />
          )}

          {/* ─── Restaurants & Venues ───────────────────────────────────── */}
          {sections?.restaurants && sections.restaurants.length > 0 && (
            <section className="animate-fade-rise space-y-5">
              <SectionLabel>Where to Go</SectionLabel>
              <div className="space-y-3">
                {sections.restaurants.map((r) => (
                  <div
                    key={r.name}
                    className="luxury-card p-5 space-y-2.5"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium text-foreground">{r.name}</h3>
                          {r.venueType && (
                            <span className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border shrink-0 ${
                              r.venueType === "dinner"
                                ? "border-champagne/20 text-champagne/60 bg-champagne/5"
                                : r.venueType === "drinks"
                                ? "border-plum/20 text-plum/60 bg-plum/5"
                                : "border-border/40 text-muted-foreground/55"
                            }`}>
                              {r.venueType}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {r.cuisine} · {r.priceRange}
                        </p>
                      </div>
                      {r.rating != null && (
                        <span className="text-sm font-mono text-champagne/60 shrink-0">
                          {r.rating}★
                        </span>
                      )}
                    </div>
                    {r.whyItFitsYou && r.whyItFitsYou !== "A great spot for your birthday." && (
                      <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
                        {r.whyItFitsYou}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground/60">
                      {r.address}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Cosmic Profile ─────────────────────────────────────────── */}
          {sections?.cosmicProfile && (
            <section className="animate-fade-rise">
              <div className="luxury-card overflow-hidden glow-plum">
                {/* Big 3 visual card */}
                <div className="p-7 sm:p-8 space-y-6">
                  <SectionLabel>Your Cosmic Layer</SectionLabel>

                  {/* Big 3 grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <Big3SignCard
                      label="Sun"
                      value={sections.cosmicProfile.sunSign}
                      symbol="☉"
                      accent="champagne"
                    />
                    {sections.cosmicProfile.moonSign ? (
                      <Big3SignCard
                        label="Moon"
                        value={sections.cosmicProfile.moonSign}
                        symbol="☽"
                        accent="plum"
                      />
                    ) : (
                      <div className="rounded-xl border border-border/20 p-4 flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">Moon</span>
                        <span className="text-[9px] text-muted-foreground/25 leading-tight">add birth time</span>
                      </div>
                    )}
                    {sections.cosmicProfile.risingSign ? (
                      <Big3SignCard
                        label="Rising"
                        value={sections.cosmicProfile.risingSign}
                        symbol="↑"
                        accent="mixed"
                      />
                    ) : (
                      <div className="rounded-xl border border-border/20 p-4 flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">Rising</span>
                        <span className="text-[9px] text-muted-foreground/25 leading-tight">add birth time</span>
                      </div>
                    )}
                  </div>

                  {/* Element badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40">Dominant Element</span>
                    <span className="text-[11px] rounded-full border border-plum/20 px-3 py-0.5 text-plum/60 bg-plum/5 tracking-wide">
                      {sections.cosmicProfile.dominantElement}
                    </span>
                  </div>

                  {/* Birthday message */}
                  <p className="text-muted-foreground leading-relaxed italic font-editorial">
                    {sections.cosmicProfile.birthdayMessage}
                  </p>

                  {/* Astrocartography */}
                  {sections.cosmicProfile.astrocartographyHighlights &&
                    sections.cosmicProfile.astrocartographyHighlights.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-plum/60">
                        Your chart lights up in
                      </p>
                      {sections.cosmicProfile.astrocartographyHighlights.map((h, idx) => (
                        <p key={idx} className="text-sm text-foreground/80 pl-4 border-l border-plum/20">
                          {h}
                        </p>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground/30 italic">
                    Cosmic readings are AI-interpreted for entertainment and inspiration.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Share */}
        {status === "complete" && sections?.identity && (
          <div className="mt-16 animate-fade-rise">
            <div className="luxury-card p-6 sm:p-8 text-center space-y-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
                Share your birthday experience
              </p>
              <ShareButtons
                sessionId={sessionId}
                title={sections.identity.birthdayTitle}
              />
            </div>
          </div>
        )}

        {/* ─── Ad: bottom of completed dashboard ─────────────────────── */}
        {status === "complete" && (
          <AdUnit slot="5920347618" format="auto" className="mt-10" />
        )}

        {/* Viral CTA — for recipients viewing a shared dashboard */}
        {status === "complete" && (
          <div className="mt-8 text-center animate-fade-rise">
            <Link
              href="/onboarding"
              className="inline-block rounded-full border border-champagne/20 bg-champagne/5 px-8 py-3 text-[14px] font-medium text-champagne/80 tracking-wide transition-all hover:bg-champagne/10 hover:border-champagne/30"
            >
              Create Your Own Birthday Experience
            </Link>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="mt-12 text-center space-y-4">
            <p className="text-rose text-sm">
              Something went wrong generating your birthday experience.
            </p>
            {errorMsg && (
              <p className="text-xs text-muted-foreground/40">{errorMsg}</p>
            )}
            <button
              onClick={triggerGeneration}
              className="rounded-full border border-border px-6 py-2.5 text-sm text-foreground hover:bg-foreground/5 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
      {children}
    </p>
  );
}

function StyleTag({ children }: { children: string }) {
  return (
    <span className="text-[10px] uppercase tracking-[0.1em] rounded-full border border-champagne/15 px-3 py-1 text-champagne/50 bg-champagne/3">
      {children}
    </span>
  );
}

function CosmicTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-sm rounded-full border border-plum/20 px-3.5 py-1.5 text-plum/70 bg-plum/5">
      <span className="text-[10px] uppercase tracking-[0.1em] text-plum/40 mr-1.5">{label}</span>
      {value}
    </span>
  );
}

function Big3SignCard({
  label,
  value,
  symbol,
  accent,
}: {
  label: string;
  value: string;
  symbol: string;
  accent: "champagne" | "plum" | "mixed";
}) {
  const borderClass =
    accent === "champagne"
      ? "border-champagne/20 bg-champagne/3"
      : accent === "plum"
      ? "border-plum/20 bg-plum/5"
      : "border-foreground/10 bg-foreground/3";
  const symbolClass =
    accent === "champagne"
      ? "text-champagne/50"
      : accent === "plum"
      ? "text-plum/50"
      : "text-foreground/30";
  const labelClass =
    accent === "champagne"
      ? "text-champagne/40"
      : accent === "plum"
      ? "text-plum/40"
      : "text-muted-foreground/40";
  const valueClass =
    accent === "champagne"
      ? "text-champagne/90"
      : accent === "plum"
      ? "text-plum/80"
      : "text-foreground/70";

  return (
    <div className={`rounded-xl border ${borderClass} p-4 sm:p-5 flex flex-col gap-2 text-center`}>
      <span className={`text-lg ${symbolClass}`}>{symbol}</span>
      <div>
        <p className={`text-[9px] uppercase tracking-[0.2em] ${labelClass} mb-1`}>{label}</p>
        <p className={`text-sm sm:text-base font-medium ${valueClass} leading-tight`}>{value}</p>
      </div>
    </div>
  );
}

function PaletteCard({ palette, index }: { palette: ColorPalette; index: number }) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  function handleCopy(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  }

  return (
    <div className={`luxury-card overflow-hidden animate-fade-rise stagger-${index + 1}`}>
      {/* Swatch row with always-visible hex labels */}
      <div className="flex h-24">
        {palette.colors.map((c) => {
          // Determine text color based on perceived luminance
          const hex = c.hex.replace("#", "");
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const textColor = luminance > 0.55 ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.75)";

          return (
            <button
              key={c.hex}
              type="button"
              className="flex-1 relative flex flex-col items-center justify-end pb-2 group transition-all hover:flex-[1.35] duration-200"
              style={{ backgroundColor: c.hex }}
              aria-label={`Copy ${c.name} (${c.hex})`}
              onClick={() => handleCopy(c.hex)}
            >
              <span
                className="text-[8px] font-mono tracking-wider leading-none transition-opacity group-hover:opacity-100"
                style={{ color: textColor }}
              >
                {copiedHex === c.hex ? "✓" : c.hex.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
      {/* Name + mood row + copy-all strip */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{palette.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{palette.mood}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(palette.colors.map((c) => c.hex).join("  "))
          }
          className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors whitespace-nowrap mt-0.5"
        >
          Copy all
        </button>
      </div>
    </div>
  );
}

function DestinationCard({ dest, index }: { dest: Destination; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = dest.whyItFitsYou.length > 120
    ? dest.whyItFitsYou.slice(0, 120).trim() + "..."
    : dest.whyItFitsYou;

  const timingColors: Record<string, string> = {
    perfect: "text-green-400/70",
    good: "text-champagne/60",
    workable: "text-muted-foreground/50",
    "off-season": "text-muted-foreground/55",
  };

  return (
    <div className={`luxury-card p-5 sm:p-6 space-y-2.5 animate-fade-rise stagger-${Math.min(index + 1, 8)}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-editorial text-base sm:text-lg">
          {dest.city}, {dest.country}
        </h3>
        <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40 whitespace-nowrap">
          {dest.estimatedBudget}
        </span>
      </div>
      <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
        {expanded ? dest.whyItFitsYou : shortDesc}
        {dest.whyItFitsYou.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-champagne/50 hover:text-champagne/70 transition-colors text-[12px]"
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>
      {/* Timing truth */}
      {dest.timingNote && (
        <p className={`text-[11px] ${timingColors[dest.timingFit] ?? "text-muted-foreground/50"}`}>
          {dest.timingNote}
          {dest.bestMonths && dest.bestMonths.length > 0 && dest.timingFit !== "perfect" && (
            <span className="text-muted-foreground/30 ml-1">
              · Best in {dest.bestMonths.slice(0, 2).join("–")}
            </span>
          )}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {dest.vibeMatch.map((v) => (
          <span
            key={v}
            className="text-[9px] uppercase tracking-[0.1em] rounded-full border border-border/50 px-2 py-0.5 text-muted-foreground/50"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

function CopyableCaption({ caption }: { caption: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="w-full text-left luxury-card p-4 text-sm text-foreground/80 hover:text-foreground transition-all group"
    >
      <span>{caption}</span>
      <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

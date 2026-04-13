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
                  <div
                    key={palette.name}
                    className={`luxury-card overflow-hidden animate-fade-rise stagger-${i + 1}`}
                  >
                    <div className="flex h-20">
                      {palette.colors.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          className="flex-1 relative group"
                          style={{ backgroundColor: c.hex }}
                          aria-label={`Copy ${c.name} (${c.hex})`}
                          onClick={() => navigator.clipboard.writeText(c.hex)}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity bg-black/50 text-white tracking-wider">
                            {c.hex}
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
                      <p className="text-[12px] text-muted-foreground/50 mt-1.5">
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
                      <p className="text-[12px] text-muted-foreground/50 mt-1.5">
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

          {/* ─── Restaurants ────────────────────────────────────────────── */}
          {sections?.restaurants && sections.restaurants.length > 0 && (
            <section className="animate-fade-rise space-y-5">
              <SectionLabel>Where to Eat</SectionLabel>
              <div className="space-y-3">
                {sections.restaurants.map((r) => (
                  <div
                    key={r.name}
                    className="luxury-card p-5 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{r.name}</h3>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        {r.cuisine} · {r.priceRange}
                      </p>
                      <p className="text-xs text-muted-foreground/40 mt-1">
                        {r.address}
                      </p>
                    </div>
                    {r.rating && (
                      <span className="text-sm font-mono text-champagne/60">{r.rating}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Cosmic Profile ─────────────────────────────────────────── */}
          {sections?.cosmicProfile && (
            <section className="animate-fade-rise">
              <div className="luxury-card p-7 sm:p-8 space-y-5 glow-plum">
                <SectionLabel>Your Cosmic Layer</SectionLabel>
                <div className="flex gap-3 flex-wrap">
                  <CosmicTag label="Sun" value={sections.cosmicProfile.sunSign} />
                  {sections.cosmicProfile.risingSign && (
                    <CosmicTag label="Rising" value={sections.cosmicProfile.risingSign} />
                  )}
                  {sections.cosmicProfile.moonSign && (
                    <CosmicTag label="Moon" value={sections.cosmicProfile.moonSign} />
                  )}
                  <CosmicTag label="Element" value={sections.cosmicProfile.dominantElement} />
                </div>
                <p className="text-muted-foreground leading-relaxed italic font-editorial">
                  {sections.cosmicProfile.birthdayMessage}
                </p>
                {sections.cosmicProfile.astrocartographyHighlights &&
                  sections.cosmicProfile.astrocartographyHighlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-plum/60">
                      Your chart lights up in
                    </p>
                    {sections.cosmicProfile.astrocartographyHighlights.map((h, i) => (
                      <p key={i} className="text-sm text-foreground/80 pl-4 border-l border-plum/20">
                        {h}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground/30 italic pt-2">
                  Cosmic readings are AI-interpreted for entertainment and inspiration.
                </p>
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

function DestinationCard({ dest, index }: { dest: Destination; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = dest.whyItFitsYou.length > 120
    ? dest.whyItFitsYou.slice(0, 120).trim() + "..."
    : dest.whyItFitsYou;

  const timingColors: Record<string, string> = {
    perfect: "text-green-400/70",
    good: "text-champagne/60",
    workable: "text-muted-foreground/50",
    "off-season": "text-muted-foreground/40",
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

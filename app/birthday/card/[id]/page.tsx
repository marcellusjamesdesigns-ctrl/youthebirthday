import Link from "next/link";
import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ColorPalette, CosmicProfile, CelebrationStyle, Destination } from "@/lib/db/schema";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!session) return { title: "Not Found" };

  return {
    title: `${session.name}'s Birthday Card | You the Birthday`,
    robots: { index: false, follow: false },
    openGraph: {
      images: [`/api/og/${id}`],
    },
  };
}

export default async function ShareCardPage({ params }: PageProps) {
  const { id } = await params;
  const db = getDb();

  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!session) notFound();

  const generation = await db
    .select()
    .from(birthdayGenerations)
    .where(eq(birthdayGenerations.sessionId, id))
    .orderBy(desc(birthdayGenerations.version))
    .limit(1)
    .then((r) => r[0] ?? null);

  const ageTurning = new Date().getFullYear() - session.birthYear;
  const palettes = generation?.colorPalettes as ColorPalette[] | null;
  const primaryPalette = palettes?.[0];
  const cosmic = generation?.cosmicProfile as CosmicProfile | null;
  const celebrationStyle = generation?.celebrationStyle as CelebrationStyle | null;
  const destinations = (generation?.destinations as Destination[]) ?? [];
  const topDestination = destinations[0];
  const captions = generation?.captionPack as
    | { category: string; captions: string[] }[]
    | null;

  // Pick the shortest, punchiest caption
  const allCaptions = captions?.flatMap((c) => c.captions) ?? [];
  const bestCaption = allCaptions
    .filter((c) => c.length < 100)
    .sort((a, b) => a.length - b.length)[0] ?? allCaptions[0];

  // Derive accent color from palette
  const accentHex =
    primaryPalette?.colors?.find((c) => c.role?.includes("primary"))?.hex ??
    primaryPalette?.colors?.[0]?.hex ??
    "#d4af37";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] relative overflow-hidden rounded-2xl border border-border/30">
        {/* Gradient background using palette accent */}
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
              {session.name} · {ageTurning}
            </p>
          </div>

          {/* Title — the hero */}
          <div className="text-center space-y-3">
            {generation?.birthdayTitle ? (
              <h1 className="heading-editorial text-[28px] sm:text-[32px] leading-[1.12] tracking-tight">
                {generation.birthdayTitle}
              </h1>
            ) : (
              <h1 className="heading-editorial text-[28px] leading-[1.15]">
                {session.name}&apos;s Birthday
              </h1>
            )}

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {generation?.birthdayArchetype && (
                <span
                  className="text-[10px] uppercase tracking-[0.15em] rounded-full px-3 py-1 border"
                  style={{ borderColor: `${accentHex}40`, color: `${accentHex}cc` }}
                >
                  {generation.birthdayArchetype}
                </span>
              )}
              {generation?.birthdayEra && (
                <span className="text-[10px] uppercase tracking-[0.15em] border border-border/40 text-muted-foreground/60 rounded-full px-3 py-1">
                  {generation.birthdayEra}
                </span>
              )}
            </div>
          </div>

          {/* Featured caption — the screenshot-worthy line */}
          {bestCaption && (
            <div className="py-2 px-4 border-l-2 border-r-0 border-t-0 border-b-0" style={{ borderColor: `${accentHex}60` }}>
              <p className="font-editorial italic text-[15px] text-foreground/80 leading-relaxed">
                &ldquo;{bestCaption}&rdquo;
              </p>
            </div>
          )}

          {/* Celebration style + destination — the "substance" section */}
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
                    {topDestination.city}{topDestination.country ? `, ${topDestination.country}` : ""}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom row: Big 3 + palette */}
          <div className="flex items-center justify-between">
            {/* Big 3 (if cosmic) */}
            {cosmic?.sunSign ? (
              <div className="flex gap-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40">
                <span>☉ {cosmic.sunSign}</span>
                {cosmic.moonSign && <span>☽ {cosmic.moonSign}</span>}
                {cosmic.risingSign && <span>↑ {cosmic.risingSign}</span>}
              </div>
            ) : (
              <div />
            )}

            {/* Palette swatches */}
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

          {/* CTA — the viral conversion point */}
          <div className="pt-4 space-y-3 border-t border-border/15 text-center">
            <Link
              href="/onboarding"
              className="inline-block rounded-full bg-foreground px-7 py-2.5 text-[13px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)]"
            >
              Create Your Own
            </Link>
            <p className="text-[10px] text-muted-foreground/30">
              <Link
                href="/"
                className="uppercase tracking-[0.25em] hover:text-muted-foreground/60 transition-colors"
              >
                youthebirthday.app
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

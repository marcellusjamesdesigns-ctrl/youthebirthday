import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ColorPalette, CosmicProfile } from "@/lib/db/schema";

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
  const captions = generation?.captionPack as
    | { category: string; captions: string[] }[]
    | null;
  // Pick the shortest, punchiest caption for the card
  const allCaptions = captions?.flatMap((c) => c.captions) ?? [];
  const bestCaption = allCaptions
    .filter((c) => c.length < 100)
    .sort((a, b) => a.length - b.length)[0] ?? allCaptions[0];

  // Derive accent color from palette
  const accentHex = primaryPalette?.colors?.find((c) => c.role?.includes("primary"))?.hex
    ?? primaryPalette?.colors?.[0]?.hex
    ?? "#d4af37";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] relative overflow-hidden rounded-2xl border border-border/30">
        {/* Gradient background using palette accent */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: `radial-gradient(ellipse at top, ${accentHex}, transparent 70%)`,
          }}
        />

        {/* Color bar — thicker for visual impact */}
        {primaryPalette && (
          <div className="flex h-1.5 relative z-10">
            {primaryPalette.colors.map((c) => (
              <div key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        )}

        <div className="relative z-10 p-8 sm:p-10 space-y-5 text-center">
          {/* Brand */}
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/40">
            You the Birthday
          </p>

          {/* Title — the hero */}
          {generation?.birthdayTitle ? (
            <h1 className="heading-editorial text-[28px] sm:text-3xl leading-[1.15] tracking-tight">
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

          {/* Name + age */}
          <p className="text-sm text-muted-foreground/50">
            {session.name} · turning {ageTurning}
          </p>

          {/* Featured caption — the screenshot-worthy line */}
          {bestCaption && (
            <div className="py-3">
              <p className="font-editorial italic text-[15px] text-foreground/80 leading-relaxed">
                &ldquo;{bestCaption}&rdquo;
              </p>
            </div>
          )}

          {/* Big 3 row (if cosmic) */}
          {cosmic?.sunSign && (
            <div className="flex justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
              <span>☉ {cosmic.sunSign}</span>
              {cosmic.moonSign && <span>☽ {cosmic.moonSign}</span>}
              {cosmic.risingSign && <span>↑ {cosmic.risingSign}</span>}
            </div>
          )}

          {/* Palette swatches — mini version */}
          {primaryPalette && (
            <div className="flex justify-center gap-1.5 pt-1">
              {primaryPalette.colors.map((c) => (
                <div
                  key={c.hex}
                  className="w-6 h-6 rounded-full border border-white/10"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="pt-4 border-t border-border/15">
            <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.25em]">
              youthebirthday.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

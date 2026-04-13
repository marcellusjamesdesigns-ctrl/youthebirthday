import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ColorPalette } from "@/lib/db/schema";

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
    title: `${session.name}'s Birthday Card | You The Birthday`,
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
  const captions = generation?.captionPack as
    | { category: string; captions: string[] }[]
    | null;
  const firstCaption = captions?.[0]?.captions?.[0];
  const destinations = generation?.destinations as
    | { city: string; country: string }[]
    | null;
  const firstDest = destinations?.[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      {/* Screenshot-friendly card — fixed 420px width for mobile screenshots */}
      <div className="w-[420px] rounded-2xl border border-white/10 overflow-hidden bg-[#111]">
        {/* Color bar */}
        {primaryPalette && (
          <div className="flex h-2">
            {primaryPalette.colors.map((c) => (
              <div
                key={c.hex}
                className="flex-1"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        <div className="p-8 space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            you the birthday
          </p>

          {generation?.birthdayTitle ? (
            <h1 className="text-2xl font-bold leading-tight">
              {generation.birthdayTitle}
            </h1>
          ) : (
            <h1 className="text-2xl font-bold">{session.name}&apos;s Birthday</h1>
          )}

          <div className="flex justify-center gap-2">
            {generation?.birthdayArchetype && (
              <span className="text-xs bg-white/10 rounded-full px-3 py-1">
                {generation.birthdayArchetype}
              </span>
            )}
            {generation?.birthdayEra && (
              <span className="text-xs border border-white/20 rounded-full px-3 py-1">
                {generation.birthdayEra}
              </span>
            )}
          </div>

          <p className="text-sm text-white/50">
            {session.name} · turning {ageTurning}
          </p>

          {firstCaption && (
            <p className="text-sm italic text-white/70 leading-relaxed">
              &ldquo;{firstCaption}&rdquo;
            </p>
          )}

          {firstDest && (
            <p className="text-xs text-white/40">
              Birthday destination match: {firstDest.city}, {firstDest.country}
            </p>
          )}

          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">
              youthebirthday.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

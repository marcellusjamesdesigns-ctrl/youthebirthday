import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type {
  ColorPalette,
  CaptionCategory,
  Destination,
  CelebrationStyle,
  CosmicProfile,
  Restaurant,
  Activity,
} from "@/lib/db/schema";
import { PrintActions } from "./_components/PrintActions";

type PageProps = { params: Promise<{ id: string }> };

export default async function PrintPage({ params }: PageProps) {
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

  if (!generation || generation.status !== "complete") notFound();

  const ageTurning = new Date().getFullYear() - session.birthYear;
  const palettes = (generation.colorPalettes as ColorPalette[]) ?? [];
  const captions = (generation.captionPack as CaptionCategory[]) ?? [];
  const celebrationStyle = generation.celebrationStyle as CelebrationStyle | null;
  const destinations = (generation.destinations as Destination[]) ?? [];
  const restaurants = (generation.restaurants as Restaurant[]) ?? [];
  const activities = (generation.activities as Activity[]) ?? [];
  const cosmic = generation.cosmicProfile as CosmicProfile | null;

  return (
    <div className="min-h-screen bg-white text-black print:bg-white">
      {/* Print/Download controls — hidden when printing */}
      <PrintActions />

      <div className="max-w-3xl mx-auto px-8 py-12 print:px-4 print:py-6">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-4">You the Birthday</p>
          <h1 className="text-3xl font-serif mb-2">{generation.birthdayTitle ?? `${session.name}'s Birthday`}</h1>
          <div className="flex justify-center gap-3 mb-3">
            {generation.birthdayArchetype && (
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1">{generation.birthdayArchetype}</span>
            )}
            {generation.birthdayEra && (
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1">{generation.birthdayEra}</span>
            )}
          </div>
          <p className="text-sm text-gray-500">{session.name} · turning {ageTurning}</p>
          {generation.celebrationNarrative && (
            <p className="text-sm italic text-gray-600 mt-4 max-w-lg mx-auto leading-relaxed">{generation.celebrationNarrative}</p>
          )}
        </div>

        {/* Color Palettes */}
        {palettes.length > 0 && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">Your Color Story</h2>
            <div className="grid grid-cols-2 gap-4">
              {palettes.map((p) => (
                <div key={p.name} className="mb-4">
                  <p className="text-xs font-medium mb-2">{p.name} — {p.mood}</p>
                  <div className="flex gap-1">
                    {p.colors.map((c) => (
                      <div key={c.hex} className="flex-1">
                        <div className="h-8 rounded" style={{ backgroundColor: c.hex }} />
                        <p className="text-[9px] text-gray-500 mt-1 text-center">{c.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Captions */}
        {captions.length > 0 && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">Your Caption Pack</h2>
            {captions.map((cat) => (
              <div key={cat.category} className="mb-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">{cat.category}</p>
                {cat.captions.map((c, j) => (
                  <p key={j} className="text-sm text-gray-700 mb-1 pl-3 border-l-2 border-gray-200">{c}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Celebration Style */}
        {celebrationStyle && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">Your Celebration</h2>
            <p className="text-lg font-serif mb-2">{celebrationStyle.primaryStyle}</p>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{celebrationStyle.description}</p>
            <div className="space-y-1">
              {celebrationStyle.rituals.map((r, i) => (
                <p key={i} className="text-sm text-gray-700">• {r}</p>
              ))}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1">{celebrationStyle.aesthetic}</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1">{celebrationStyle.outfit}</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1">{celebrationStyle.playlist}</span>
            </div>
          </section>
        )}

        {/* Destinations */}
        {destinations.length > 0 && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">Birthday Destinations</h2>
            {destinations.map((d) => (
              <div key={d.city} className="mb-4 pl-3 border-l-2 border-gray-200">
                <p className="text-sm font-medium">{d.city}, {d.country}</p>
                <p className="text-xs text-gray-500">{d.timingNote} · {d.estimatedBudget}</p>
                <p className="text-sm text-gray-600 mt-1">{d.whyItFitsYou}</p>
              </div>
            ))}
          </section>
        )}

        {/* Restaurants */}
        {restaurants.length > 0 && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">Where to Eat & Drink</h2>
            {restaurants.map((r) => (
              <div key={r.name} className="mb-3 pl-3 border-l-2 border-gray-200">
                <p className="text-sm font-medium">{r.name} · {r.cuisine} · {r.priceRange}</p>
                <p className="text-sm text-gray-600">{r.whyItFitsYou}</p>
                <p className="text-xs text-gray-400">{r.address}</p>
              </div>
            ))}
          </section>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">What to Do</h2>
            {activities.map((a) => (
              <div key={a.name} className="mb-3 pl-3 border-l-2 border-gray-200">
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-gray-500">{a.neighborhood} · {a.priceRange} · {a.bestTimeOfDay}</p>
                <p className="text-sm text-gray-600">{a.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Cosmic */}
        {cosmic && (
          <section className="mb-10 print:mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">Your Cosmic Layer</h2>
            <div className="flex gap-4 mb-3 text-sm">
              <span>☉ {cosmic.sunSign}</span>
              {cosmic.moonSign && <span>☽ {cosmic.moonSign}</span>}
              {cosmic.risingSign && <span>↑ {cosmic.risingSign}</span>}
            </div>
            <p className="text-sm italic text-gray-600 leading-relaxed">{cosmic.birthdayMessage}</p>
          </section>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">youthebirthday.app</p>
        </div>
      </div>
    </div>
  );
}

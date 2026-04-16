import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ColorPalette, CosmicProfile, CelebrationStyle, Destination } from "@/lib/db/schema";
import { ShareCardClient } from "./_components/ShareCardClient";

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
  const primaryPalette = palettes?.[0] ?? null;
  const cosmic = (generation?.cosmicProfile as CosmicProfile | null) ?? null;
  const celebrationStyle = (generation?.celebrationStyle as CelebrationStyle | null) ?? null;
  const destinations = (generation?.destinations as Destination[]) ?? [];
  const topDestination = destinations[0] ?? null;
  const captions = generation?.captionPack as
    | { category: string; captions: string[] }[]
    | null;

  const allCaptions = captions?.flatMap((c) => c.captions) ?? [];
  const bestCaption =
    allCaptions.filter((c) => c.length < 100).sort((a, b) => a.length - b.length)[0] ??
    allCaptions[0] ??
    null;

  const accentHex =
    primaryPalette?.colors?.find((c) => c.role?.includes("primary"))?.hex ??
    primaryPalette?.colors?.[0]?.hex ??
    "#d4af37";

  return (
    <ShareCardClient
      sessionId={id}
      name={session.name}
      ageTurning={ageTurning}
      birthdayTitle={generation?.birthdayTitle}
      birthdayArchetype={generation?.birthdayArchetype}
      birthdayEra={generation?.birthdayEra}
      primaryPalette={primaryPalette}
      cosmic={cosmic}
      celebrationStyle={celebrationStyle}
      topDestination={topDestination}
      bestCaption={bestCaption}
      accentHex={accentHex}
    />
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const db = getDb();

  const generation = await db
    .select()
    .from(birthdayGenerations)
    .where(eq(birthdayGenerations.sessionId, id))
    .orderBy(desc(birthdayGenerations.version))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!generation) {
    return NextResponse.json({
      status: "pending",
      version: null,
      stepStatus: null,
      sections: null,
      error: null,
    });
  }

  // Always return completed sections so dashboard can progressively render
  const sections = {
    identity:
      generation.birthdayTitle
        ? {
            birthdayTitle: generation.birthdayTitle,
            birthdayArchetype: generation.birthdayArchetype,
            birthdayEra: generation.birthdayEra,
            celebrationNarrative: generation.celebrationNarrative,
          }
        : null,
    palettes: generation.colorPalettes ?? null,
    captions: generation.captionPack ?? null,
    destinations: generation.destinations ?? null,
    celebrationStyle: generation.celebrationStyle ?? null,
    restaurants: generation.restaurants ?? null,
    activities: generation.activities ?? null,
    cosmicProfile: generation.cosmicProfile ?? null,
  };

  return NextResponse.json({
    status: generation.status,
    version: generation.version,
    stepStatus: generation.stepStatus,
    sections,
    error: generation.errorMessage ?? null,
  });
}

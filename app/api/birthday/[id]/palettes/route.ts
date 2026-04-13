import { NextRequest, NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getDb } from "@/lib/db";
import { birthdaySessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_MODEL } from "@/lib/ai/client";
import { normalizeInput } from "@/lib/ai/normalize-input";
import { ColorPaletteSchema } from "@/lib/ai/schemas";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const db = getDb();

  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const input = normalizeInput(session);
  const seed = Math.floor(Math.random() * 9000) + 1000;

  try {
    const result = await generateText({
      model: DEFAULT_MODEL,
      system: `You are a color director for "You The Birthday." Design 4 additional birthday color palettes that are COMPLETELY DIFFERENT from typical birthday palettes. Push creative boundaries — unexpected color families, bold combinations, cultural references.`,
      prompt: `Generate 4 MORE color palettes for ${input.name}, turning ${input.ageTurning}, celebrating in ${input.celebrationCity}. Vibe: ${input.celebrationVibe}. Zodiac: ${input.zodiacSign}.

Seed: ${seed}

These are BONUS palettes — go bolder than the defaults:
1. CITY COLOR: Visual postcard of ${input.celebrationCity} — what does this city look like as a palette?
2. BOLD STATEMENT: Maximum saturation, high-contrast, impossible to ignore.
3. NIGHT MODE: The after-dark palette — what the celebration looks like when the sun goes down.
4. CULTURAL MOMENT: Reference a current cultural aesthetic or trend that matches their vibe.

Each palette: name, mood (2-3 words), 5 colors with hex/name/role.`,
      output: Output.object({ schema: ColorPaletteSchema }),
    });

    return NextResponse.json({ palettes: result.output?.palettes ?? [] });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

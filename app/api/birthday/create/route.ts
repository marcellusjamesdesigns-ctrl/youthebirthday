import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { birthdaySessions } from "@/lib/db/schema";
import { BirthdayInputSchema } from "@/lib/validators/birthday-input";
import { createSessionId } from "@/lib/utils/id";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = BirthdayInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const sessionId = createSessionId();

  const db = getDb();
  await db.insert(birthdaySessions).values({
    id: sessionId,
    name: input.name,
    pronoun: input.pronoun || null,
    birthdate: input.birthdate,
    birthYear: input.birthYear,
    currentCity: input.currentCity,
    currentLat: input.currentLat || null,
    currentLng: input.currentLng || null,
    celebrationCity: input.celebrationCity || null,
    celebrationVibe: input.celebrationVibe,
    birthdayGoals: input.birthdayGoals,
    mode: input.mode,
    birthTime: input.birthTime || null,
    birthCity: input.birthCity || null,
    birthLat: input.birthLat || null,
    birthLng: input.birthLng || null,
    budget: input.budget || null,
    groupSize: input.groupSize || null,
    foodVibe: input.foodVibe || null,
    aestheticPreference: input.aestheticPreference || null,
    status: "pending",
  });

  return NextResponse.json({
    id: sessionId,
    redirectUrl: `/birthday/${sessionId}`,
  });
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { birthdaySessions } from "@/lib/db/schema";
import { BirthdayInputSchema } from "@/lib/validators/birthday-input";
import { createSessionId } from "@/lib/utils/id";

async function geocodeCity(city: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "User-Agent": "YouTheBirthday/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lng: data[0].lon };
    }
  } catch {
    // Geocoding is best-effort — don't block session creation
  }
  return null;
}

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

  // Geocode birth city for Rising sign calculation if not already provided
  let birthLat = input.birthLat || null;
  let birthLng = input.birthLng || null;
  if (input.birthCity && !birthLat) {
    const coords = await geocodeCity(input.birthCity);
    if (coords) {
      birthLat = coords.lat;
      birthLng = coords.lng;
    }
  }

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
    birthLat,
    birthLng,
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

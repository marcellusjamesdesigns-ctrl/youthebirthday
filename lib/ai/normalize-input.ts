import { parseBirthdate, getAgeTurning } from "@/lib/utils/date";
import { calculateChart, getSunSignFromDate, type AstroChart } from "@/lib/astrology/calculate";
import type { InferSelectModel } from "drizzle-orm";
import type { birthdaySessions } from "@/lib/db/schema";

type Session = InferSelectModel<typeof birthdaySessions>;

export interface NormalizedInput {
  name: string;
  ageTurning: number;
  zodiacSign: string;
  birthMonth: number; // 1-12
  birthMonthName: string; // "June"
  currentCity: string;
  celebrationVibe: string;
  birthdayGoals: string[];
  mode: "quick" | "cosmic";
  // Optional enrichments
  pronoun: string | null;
  budget: string | null;
  groupSize: string | null;
  foodVibe: string | null;
  aestheticPreference: string | null;
  // Cosmic-only
  birthTime: string | null;
  birthCity: string | null;
  // Computed astro chart (when birth data is sufficient)
  chart: AstroChart | null;
}

export function normalizeInput(session: Session): NormalizedInput {
  const { month, day } = parseBirthdate(session.birthdate);
  const zodiacSign = getSunSignFromDate(month, day);
  const ageTurning = getAgeTurning(session.birthYear);

  // Compute chart if we have enough data
  let chart: AstroChart | null = null;

  if (session.mode === "cosmic" || session.birthTime) {
    const birthHour = session.birthTime
      ? parseInt(session.birthTime.split(":")[0])
      : undefined;
    const birthMinute = session.birthTime
      ? parseInt(session.birthTime.split(":")[1])
      : undefined;

    const birthLat = session.birthLat ? parseFloat(session.birthLat) : undefined;
    const birthLng = session.birthLng ? parseFloat(session.birthLng) : undefined;

    chart = calculateChart({
      year: session.birthYear,
      month,
      day,
      hour: birthHour,
      minute: birthMinute,
      latitude: birthLat,
      longitude: birthLng,
    });
  } else {
    // Even in quick mode, compute sun + moon (moon only needs date)
    chart = calculateChart({
      year: session.birthYear,
      month,
      day,
    });
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return {
    name: session.name,
    ageTurning,
    zodiacSign: chart?.sunSign ?? zodiacSign,
    birthMonth: month,
    birthMonthName: monthNames[month - 1],
    currentCity: session.currentCity,
    celebrationVibe: session.celebrationVibe,
    birthdayGoals: (session.birthdayGoals as string[]) ?? [],
    mode: session.mode ?? "quick",
    pronoun: session.pronoun,
    budget: session.budget,
    groupSize: session.groupSize,
    foodVibe: session.foodVibe,
    aestheticPreference: session.aestheticPreference,
    birthTime: session.birthTime,
    birthCity: session.birthCity,
    chart,
  };
}

export function inputToCacheKey(input: NormalizedInput, step: string, promptVersion: string): Record<string, string | number | string[]> {
  return {
    step,
    promptVersion,
    name: input.name,
    ageTurning: input.ageTurning,
    zodiacSign: input.zodiacSign,
    birthMonth: input.birthMonth, // critical for seasonal differentiation
    currentCity: input.currentCity,
    celebrationVibe: input.celebrationVibe,
    birthdayGoals: input.birthdayGoals,
    mode: input.mode,
    ...(input.budget && { budget: input.budget }),
    ...(input.groupSize && { groupSize: input.groupSize }),
    ...(input.aestheticPreference && { aestheticPreference: input.aestheticPreference }),
    ...(input.foodVibe && { foodVibe: input.foodVibe }),
  };
}

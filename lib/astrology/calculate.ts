// ─── Astronomical Zodiac Calculations ────────────────────────────────────────
// Powered by celestine — a pure-TypeScript ephemeris library validated against
// NASA JPL Horizons and Swiss Ephemeris. Accuracy within 1 arcminute for
// dates 1800–2200.

import { calculateChart as celestineChart } from "celestine";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

const ELEMENTS: Record<string, string> = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water",
};

export interface AstroChart {
  sunSign: string;
  sunDegree: number;
  moonSign: string;
  moonDegree: number;
  risingSign: string | null;
  risingDegree: number | null;
  dominantElement: string;
}

export interface BirthData {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
  hour?: number; // 0-23 (local time)
  minute?: number; // 0-59
  latitude?: number; // decimal degrees, positive = north
  longitude?: number; // decimal degrees, positive = east
  timezoneOffset?: number; // UTC offset in hours (e.g., -5 for EST, -4 for EDT)
}

function degreeInSign(longitude: number): number {
  return Math.round((longitude % 30) * 10) / 10;
}

export function calculateChart(birth: BirthData): AstroChart {
  const hasFullData = birth.hour !== undefined
    && birth.latitude !== undefined
    && birth.longitude !== undefined;

  const chart = celestineChart({
    year: birth.year,
    month: birth.month,
    day: birth.day,
    hour: birth.hour ?? 12,
    minute: birth.minute ?? 0,
    second: 0,
    timezone: birth.timezoneOffset ?? 0,
    latitude: birth.latitude ?? 0,
    longitude: birth.longitude ?? 0,
  });

  // Sun = planets[0], Moon = planets[1]
  const sunSign = ZODIAC_SIGNS[chart.planets[0].sign] ?? "Aries";
  const sunDegree = degreeInSign(chart.planets[0].longitude);
  const moonSign = ZODIAC_SIGNS[chart.planets[1].sign] ?? "Aries";
  const moonDegree = degreeInSign(chart.planets[1].longitude);

  // Rising sign requires birth time + location
  let risingSign: string | null = null;
  let risingDegree: number | null = null;

  if (hasFullData && chart.angles?.ascendant) {
    risingSign = chart.angles.ascendant.signName ?? ZODIAC_SIGNS[chart.angles.ascendant.sign];
    risingDegree = degreeInSign(chart.angles.ascendant.longitude);
  }

  // Dominant element from Big 3
  const signs = [sunSign, moonSign, risingSign].filter(Boolean) as string[];
  const elementCounts: Record<string, number> = {};
  for (const sign of signs) {
    const element = ELEMENTS[sign];
    elementCounts[element] = (elementCounts[element] ?? 0) + 1;
  }
  const dominantElement = Object.entries(elementCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? ELEMENTS[sunSign];

  return {
    sunSign,
    sunDegree,
    moonSign,
    moonDegree,
    risingSign,
    risingDegree,
    dominantElement,
  };
}

// ─── Sun Sign from Date (simple, for non-cosmic mode) ────────────────────────

export function getSunSignFromDate(month: number, day: number): string {
  const chart = celestineChart({
    year: 2024, month, day,
    hour: 12, minute: 0, second: 0,
    timezone: 0, latitude: 0, longitude: 0,
  });
  return ZODIAC_SIGNS[chart.planets[0].sign] ?? "Aries";
}

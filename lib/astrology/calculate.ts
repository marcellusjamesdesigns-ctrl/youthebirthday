// ─── Astronomical Zodiac Calculations ────────────────────────────────────────
// Based on standard astronomical formulas for Moon sign, Rising sign (Ascendant),
// and zodiac positioning. Uses Julian Date conversions and sidereal time.
//
// Sources: Meeus "Astronomical Algorithms", standard LST/GST conversion formulas.

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

// ─── Julian Date ─────────────────────────────────────────────────────────────

function toJulianDate(year: number, month: number, day: number, hour: number = 0): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + B - 1524.5;
}

// ─── Sun Position (ecliptic longitude) ───────────────────────────────────────

function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = L0 % 360;
  if (L0 < 0) L0 += 360;

  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = M % 360;
  if (M < 0) M += 360;
  const Mrad = M * Math.PI / 180;

  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);

  let sunLong = L0 + C;
  sunLong = sunLong % 360;
  if (sunLong < 0) sunLong += 360;

  return sunLong;
}

// ─── Moon Position (simplified, ~1-2° accuracy) ──────────────────────────────

function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;

  let Lp = 218.3165 + 481267.8813 * T;
  Lp = Lp % 360;
  if (Lp < 0) Lp += 360;

  let Mp = 134.9634 + 477198.8676 * T;
  Mp = Mp % 360;
  if (Mp < 0) Mp += 360;
  const Mprad = Mp * Math.PI / 180;

  let M = 357.5291 + 35999.0503 * T;
  M = M % 360;
  if (M < 0) M += 360;
  const Mrad = M * Math.PI / 180;

  let D = 297.8502 + 445267.1115 * T;
  D = D % 360;
  if (D < 0) D += 360;
  const Drad = D * Math.PI / 180;

  let F = 93.2720 + 483202.0175 * T;
  F = F % 360;
  if (F < 0) F += 360;
  const Frad = F * Math.PI / 180;

  let moonLong = Lp
    + 6.289 * Math.sin(Mprad)
    + 1.274 * Math.sin(2 * Drad - Mprad)
    + 0.658 * Math.sin(2 * Drad)
    + 0.214 * Math.sin(2 * Mprad)
    - 0.186 * Math.sin(Mrad)
    - 0.114 * Math.sin(2 * Frad);

  moonLong = moonLong % 360;
  if (moonLong < 0) moonLong += 360;

  return moonLong;
}

// ─── Ascendant (Rising Sign) ─────────────────────────────────────────────────

function getAscendant(jd: number, latitude: number, longitude: number): number {
  const T = (jd - 2451545.0) / 36525;

  let GST0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
           + 0.000387933 * T * T - T * T * T / 38710000;
  GST0 = GST0 % 360;
  if (GST0 < 0) GST0 += 360;

  let LST = GST0 + longitude;
  LST = LST % 360;
  if (LST < 0) LST += 360;

  const LSTrad = LST * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;

  const obliquity = 23.4393 - 0.013 * T;
  const oblRad = obliquity * Math.PI / 180;

  const y = -Math.cos(LSTrad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(LSTrad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;

  asc = asc % 360;
  if (asc < 0) asc += 360;

  return asc;
}

// ─── Degree to Sign ──────────────────────────────────────────────────────────

function degreeToSign(degree: number): string {
  const index = Math.floor((degree % 360) / 30);
  return ZODIAC_SIGNS[index];
}

function degreeInSign(degree: number): number {
  return Math.round((degree % 30) * 10) / 10;
}

// ─── Main Calculation ────────────────────────────────────────────────────────

export interface BirthData {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
  hour?: number; // 0-23 (LOCAL time — will be converted to UT using timezoneOffset)
  minute?: number; // 0-59
  latitude?: number; // decimal degrees, positive = north
  longitude?: number; // decimal degrees, positive = east
  timezoneOffset?: number; // UTC offset in hours (e.g., -5 for EST, -4 for EDT)
}

export function calculateChart(birth: BirthData): AstroChart {
  // Convert local time to UT if timezone offset is provided
  let utYear = birth.year;
  let utMonth = birth.month;
  let utDay = birth.day;
  let utHour = (birth.hour ?? 12) + (birth.minute ?? 0) / 60;

  if (birth.timezoneOffset !== undefined && birth.hour !== undefined) {
    // UTC = local time - offset (e.g., 10:30 PM EDT (UTC-4) → 10:30 PM - (-4) = 2:30 AM next day UTC)
    const utcDate = new Date(
      Date.UTC(birth.year, birth.month - 1, birth.day, birth.hour, birth.minute ?? 0)
    );
    // Subtract offset to get UTC (offset is in hours, e.g., -5 for EST)
    utcDate.setUTCHours(utcDate.getUTCHours() - birth.timezoneOffset);
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() - ((birth.timezoneOffset % 1) * 60));
    utYear = utcDate.getUTCFullYear();
    utMonth = utcDate.getUTCMonth() + 1;
    utDay = utcDate.getUTCDate();
    utHour = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60;
  }

  const jd = toJulianDate(utYear, utMonth, utDay, utHour);

  // Sun
  const sunLong = getSunLongitude(jd);
  const sunSign = degreeToSign(sunLong);

  // Moon
  const moonLong = getMoonLongitude(jd);
  const moonSign = degreeToSign(moonLong);

  // Rising (requires birth time + location)
  let risingSign: string | null = null;
  let risingDegree: number | null = null;

  if (birth.hour !== undefined && birth.latitude !== undefined && birth.longitude !== undefined) {
    const ascDegree = getAscendant(jd, birth.latitude, birth.longitude);
    risingSign = degreeToSign(ascDegree);
    risingDegree = degreeInSign(ascDegree);
  }

  // Dominant element
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
    sunDegree: degreeInSign(sunLong),
    moonSign,
    moonDegree: degreeInSign(moonLong),
    risingSign,
    risingDegree,
    dominantElement,
  };
}

// ─── Sun Sign from Date (simple, for non-cosmic mode) ────────────────────────

export function getSunSignFromDate(month: number, day: number): string {
  const sunLong = getSunLongitude(toJulianDate(2024, month, day, 12));
  return degreeToSign(sunLong);
}

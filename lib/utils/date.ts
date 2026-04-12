import { parse, differenceInYears, format } from "date-fns";

export function calculateAge(birthYear: number, birthMonth: number, birthDay: number): number {
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  return differenceInYears(new Date(), birthDate);
}

export function getZodiacSign(month: number, day: number): string {
  const signs: [string, number, number][] = [
    ["Capricorn", 1, 19],
    ["Aquarius", 2, 18],
    ["Pisces", 3, 20],
    ["Aries", 4, 19],
    ["Taurus", 5, 20],
    ["Gemini", 6, 20],
    ["Cancer", 7, 22],
    ["Leo", 8, 22],
    ["Virgo", 9, 22],
    ["Libra", 10, 22],
    ["Scorpio", 11, 21],
    ["Sagittarius", 12, 21],
    ["Capricorn", 12, 31],
  ];

  for (const [sign, m, d] of signs) {
    if (month < m || (month === m && day <= d)) {
      return sign;
    }
  }
  return "Capricorn";
}

export function parseBirthdate(birthdate: string): { month: number; day: number } {
  const [month, day] = birthdate.split("-").map(Number);
  return { month, day };
}

export function getAgeTurning(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getResend, FROM_EMAIL } from "./resend";
import { buildReportEmailHtml } from "./birthday-report";
import type {
  ColorPalette,
  CaptionCategory,
  Destination,
  CelebrationStyle,
  CosmicProfile,
  Restaurant,
  Activity,
} from "@/lib/db/schema";

export async function sendBirthdayReport(
  email: string,
  sessionId: string
): Promise<boolean> {
  const db = getDb();

  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, sessionId))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!session) return false;

  const generation = await db
    .select()
    .from(birthdayGenerations)
    .where(eq(birthdayGenerations.sessionId, sessionId))
    .orderBy(desc(birthdayGenerations.version))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!generation || generation.status !== "complete") return false;

  const ageTurning = new Date().getFullYear() - session.birthYear;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app";

  const html = buildReportEmailHtml({
    name: session.name,
    ageTurning,
    birthdayTitle: generation.birthdayTitle ?? `${session.name}'s Birthday`,
    birthdayArchetype: generation.birthdayArchetype ?? "",
    birthdayEra: generation.birthdayEra ?? "",
    celebrationNarrative: generation.celebrationNarrative ?? "",
    palettes: (generation.colorPalettes as ColorPalette[]) ?? [],
    captions: (generation.captionPack as CaptionCategory[]) ?? [],
    celebrationStyle: (generation.celebrationStyle as CelebrationStyle) ?? null,
    destinations: (generation.destinations as Destination[]) ?? [],
    restaurants: (generation.restaurants as Restaurant[]) ?? [],
    activities: (generation.activities as Activity[]) ?? [],
    cosmicProfile: (generation.cosmicProfile as CosmicProfile) ?? null,
    dashboardUrl: `${siteUrl}/birthday/${sessionId}`,
  });

  try {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${session.name}'s Birthday Experience — You the Birthday`,
      html,
    });
    return true;
  } catch (err) {
    console.error(JSON.stringify({
      level: "error",
      msg: "email:send_failed",
      email,
      sessionId,
      error: err instanceof Error ? err.message : String(err),
    }));
    return false;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { isSessionPaid, getPassCredits } from "@/lib/limits/generation-limits";

/**
 * GET /api/user/tier
 *
 * Resolves the caller's access state for the preview-first model.
 * Returns:
 *   - isPaidForSession: whether the named session is unlocked (either
 *     via single-report purchase OR Birthday Pass auto-unlock)
 *   - passCredits: remaining Birthday Pass credits (or null if no pass)
 *   - tier: one of "free" | "single_report" | "birthday_pass"
 *
 * The old "premium" tier is retained for backward compat with admin-
 * flagged rows but no longer auto-grants unlimited access.
 */
export async function GET(request: NextRequest) {
  const deviceToken = request.headers.get("x-device-token");
  const sessionId = new URL(request.url).searchParams.get("sessionId");

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  // Two independent checks:
  //   1. Is THIS session unlocked?
  //   2. Does the caller have a Birthday Pass with credits remaining?
  const [isPaidForSession, passCredits] = await Promise.all([
    sessionId ? isSessionPaid(sessionId) : Promise.resolve(false),
    getPassCredits(ipHash, deviceToken),
  ]);

  const hasActivePass = !!passCredits && passCredits.remaining > 0;

  // DB tier lookup — mostly informational. Does not grant unlimited.
  let dbTier: string = "free";
  try {
    const db = getDb();
    const clauses = [eq(userWaitlist.ipHash, ipHash)];
    if (deviceToken) clauses.push(eq(userWaitlist.deviceToken, deviceToken));
    const row = await db
      .select({ tier: userWaitlist.tier })
      .from(userWaitlist)
      .where(or(...clauses))
      .limit(1)
      .then((r) => r[0] ?? null);
    if (row?.tier) dbTier = row.tier;
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "warn",
        msg: "tier_db_lookup_failed",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  return NextResponse.json({
    tier: dbTier,
    isPaidForSession,
    hasActivePass,
    passCredits: passCredits
      ? {
          total: passCredits.total,
          used: passCredits.used,
          remaining: passCredits.remaining,
        }
      : null,
  });
}

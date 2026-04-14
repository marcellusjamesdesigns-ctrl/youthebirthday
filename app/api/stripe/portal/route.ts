import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceToken } = body as { deviceToken: string };

  if (!deviceToken) {
    return NextResponse.json({ error: "Missing deviceToken" }, { status: 400 });
  }

  const db = getDb();
  const user = await db
    .select({ stripeCustomerId: userWaitlist.stripeCustomerId })
    .from(userWaitlist)
    .where(eq(userWaitlist.deviceToken, deviceToken))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  try {
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app"}/onboarding`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ level: "error", msg: "stripe:portal_failed", error: message }));
    return NextResponse.json({ error: "Portal unavailable" }, { status: 500 });
  }
}

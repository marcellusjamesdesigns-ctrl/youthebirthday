import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getDb } from "@/lib/db";
import { userWaitlist } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET redirect — used from email links
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const db = getDb();
  const user = await db
    .select({ stripeCustomerId: userWaitlist.stripeCustomerId })
    .from(userWaitlist)
    .where(eq(userWaitlist.email, email))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!user?.stripeCustomerId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app"}`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

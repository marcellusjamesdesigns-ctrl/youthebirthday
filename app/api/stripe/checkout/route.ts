import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { plan, deviceToken, email, sessionId } = body as {
    plan: "one_time" | "monthly";
    deviceToken: string;
    email?: string;
    sessionId?: string;
  };

  if (!plan || !deviceToken) {
    return NextResponse.json({ error: "Missing plan or deviceToken" }, { status: 400 });
  }

  const priceId = plan === "monthly" ? PRICES.monthly : PRICES.oneTime;
  const mode = plan === "monthly" ? "subscription" : "payment";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app";

  // Preserve the user's birthday session through the Stripe round-trip.
  // Without this, `/premium/success` has no idea which paid session to
  // send the user back to, and they end up at fresh onboarding.
  const successUrl = sessionId
    ? `${base}/premium/success?session_id={CHECKOUT_SESSION_ID}&birthday=${encodeURIComponent(sessionId)}`
    : `${base}/premium/success?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${base}${sessionId ? `/birthday/${sessionId}` : "/onboarding"}`,
      customer_email: email || undefined,
      metadata: {
        deviceToken,
        sessionId: sessionId ?? "",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ level: "error", msg: "stripe:checkout_failed", error: message, plan, priceId }));
    return NextResponse.json({ error: "Failed to create checkout", detail: message }, { status: 500 });
  }
}

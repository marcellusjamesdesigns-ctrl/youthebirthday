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

  try {
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app"}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app"}${sessionId ? `/birthday/${sessionId}` : "/onboarding"}`,
      customer_email: email || undefined,
      metadata: {
        deviceToken,
        sessionId: sessionId ?? "",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}

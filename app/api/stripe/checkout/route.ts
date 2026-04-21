import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/stripe/client";

/**
 * Checkout route.
 *
 * Plans:
 *   - "single_report" ($2.99): unlock THIS report only. Stripe mode=payment.
 *   - "birthday_pass" ($4.99): grant 10 full-report credits. Stripe mode=payment.
 *
 * Legacy aliases accepted (for any client still sending the old names):
 *   - "one_time" → single_report
 *   - "monthly"  → birthday_pass (intentionally remapped: the old monthly
 *                  subscription is being replaced with a one-time 10-credit
 *                  pack. If STRIPE_PRICE_BIRTHDAY_PASS isn't set yet, we
 *                  fall back to the legacy STRIPE_PRICE_MONTHLY price ID.)
 */
type PlanName = "single_report" | "birthday_pass" | "one_time" | "monthly";

function normalizePlan(plan: PlanName): "single_report" | "birthday_pass" {
  if (plan === "one_time") return "single_report";
  if (plan === "monthly") return "birthday_pass";
  return plan;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { plan, deviceToken, email, sessionId } = body as {
    plan: PlanName;
    deviceToken: string;
    email?: string;
    sessionId?: string;
  };

  if (!plan || !deviceToken) {
    return NextResponse.json({ error: "Missing plan or deviceToken" }, { status: 400 });
  }

  const normalized = normalizePlan(plan);
  const priceId =
    normalized === "birthday_pass" ? PRICES.birthdayPass : PRICES.singleReport;

  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price not configured for plan", plan: normalized },
      { status: 500 },
    );
  }

  // Pricing modes:
  //   single_report  → one-time payment ($2.99), unlocks this report only
  //   birthday_pass  → recurring subscription ($4.99/mo), grants 10
  //                    report credits per billing period
  // The pass is a real Stripe subscription so credits refresh monthly
  // via invoice.payment_succeeded. The existing STRIPE_PRICE_MONTHLY
  // env var (now $4.99 for 10 reports/month) is kept as the price source.
  const mode = normalized === "birthday_pass" ? "subscription" : "payment";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youthebirthday.app";

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
        // Record the normalized plan name so the webhook can apply the
        // right unlock logic without re-inferring from Stripe's mode.
        purchaseType: normalized,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      JSON.stringify({
        level: "error",
        msg: "stripe:checkout_failed",
        error: message,
        plan: normalized,
        priceId,
      }),
    );
    return NextResponse.json({ error: "Failed to create checkout", detail: message }, { status: 500 });
  }
}

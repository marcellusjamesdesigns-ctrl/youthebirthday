import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return _stripe;
}

export const PRICES = {
  // Legacy names preserved for backward compat with existing imports.
  get oneTime() { return process.env.STRIPE_PRICE_ONE_TIME ?? ""; },
  get monthly() { return process.env.STRIPE_PRICE_MONTHLY ?? ""; },

  // New semantic names.
  get singleReport() {
    return process.env.STRIPE_PRICE_SINGLE_REPORT ?? process.env.STRIPE_PRICE_ONE_TIME ?? "";
  },
  get birthdayPass() {
    // Prefer the new one-time $4.99 price when configured. Falls back to
    // the old monthly price ID to avoid breaking launch if the new env
    // var isn't set yet. Note: if the legacy price is recurring, the
    // Stripe API will reject `mode: "payment"` — update the env var to
    // a new one-time $4.99 price in Stripe before launch.
    return (
      process.env.STRIPE_PRICE_BIRTHDAY_PASS ??
      process.env.STRIPE_PRICE_MONTHLY ??
      ""
    );
  },
};

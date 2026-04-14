import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const PRICES = {
  get oneTime() { return process.env.STRIPE_PRICE_ONE_TIME ?? ""; },
  get monthly() { return process.env.STRIPE_PRICE_MONTHLY ?? ""; },
};

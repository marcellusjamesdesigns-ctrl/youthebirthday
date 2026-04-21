"use client";

import { useState } from "react";
import { getOrCreateDeviceToken } from "@/lib/limits/device-token";
import { analytics } from "@/lib/analytics/events";

interface GenerationGateProps {
  sessionId: string;
  /** Retained for signature compatibility — no longer used by this gate. */
  onSuccess?: () => void;
}

/**
 * Post-free-tier paywall.
 *
 * Design decision (2026-04-21): the old email-for-2-more-free step was
 * removed. It was a dead-end step (email capture route was broken and the
 * UX reward was unclear) that reduced conversion without providing
 * meaningful value. Stripe captures email at checkout and the post-purchase
 * webhook auto-emails the report, so pre-purchase email capture is redundant.
 *
 * Flow now: free generation used → this gate → pick a plan → Stripe →
 * email with report → unlock.
 */
export function GenerationGate({ sessionId }: GenerationGateProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  async function handlePremium(plan: "one_time" | "monthly") {
    setLoadingCheckout(plan);
    setError(null);
    analytics.premiumCheckoutStarted({ plan, session_id: sessionId });
    try {
      const deviceToken = getOrCreateDeviceToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          deviceToken,
          sessionId,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Checkout unavailable. Please try again in a moment.");
        setLoadingCheckout(null);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoadingCheckout(null);
    }
  }

  return (
    <div className="text-center space-y-8 py-12 animate-fade-rise">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
          You&apos;ve used your free birthday
        </p>
        <h2 className="heading-editorial text-2xl sm:text-3xl">
          Unlock the full experience
        </h2>
        <p className="mx-auto max-w-md text-[14px] text-muted-foreground leading-relaxed">
          Your report includes the captions, palettes, destinations, and
          celebration plan — tailored to you. We&apos;ll email it right after
          checkout.
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        {/* Pricing grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* One-time — this report */}
          <button
            onClick={() => handlePremium("one_time")}
            disabled={!!loadingCheckout}
            className="lift-card p-5 text-left transition-all hover:border-champagne/40 disabled:opacity-40 space-y-2"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/65">
              Birthday Pass
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-medium text-foreground">$2.99</p>
              <p className="text-[11px] text-muted-foreground/60">one-time</p>
            </div>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              Unlock this birthday report for life. Email delivery included.
            </p>
            {loadingCheckout === "one_time" && (
              <p className="text-[10px] text-champagne/60 animate-gentle-pulse">
                Redirecting to secure checkout...
              </p>
            )}
          </button>

          {/* Subscription — unlimited */}
          <button
            onClick={() => handlePremium("monthly")}
            disabled={!!loadingCheckout}
            className="lift-card p-5 text-left transition-all hover:border-plum/40 disabled:opacity-40 space-y-2 relative"
          >
            <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.15em] text-plum/80 bg-plum/10 rounded-full px-2 py-0.5 border border-plum/25">
              Best value
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-plum/70">
              Birthday Pro
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-medium text-foreground">$4.99</p>
              <p className="text-[11px] text-muted-foreground/60">/ month</p>
            </div>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              Unlimited birthdays. Extra palettes, caption rerolls, HD share cards.
            </p>
            {loadingCheckout === "monthly" && (
              <p className="text-[10px] text-plum/60 animate-gentle-pulse">
                Redirecting to secure checkout...
              </p>
            )}
          </button>
        </div>

        {error && (
          <p className="text-[12px] text-rose-400/80 pt-1">{error}</p>
        )}

        <p className="text-[10px] text-muted-foreground/40 pt-2 leading-relaxed">
          Secure checkout via Stripe. Cancel anytime on the Pro plan.
          Your report emails automatically once payment completes.
        </p>
      </div>
    </div>
  );
}

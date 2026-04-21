"use client";

import { useState } from "react";
import { getOrCreateDeviceToken } from "@/lib/limits/device-token";
import { analytics } from "@/lib/analytics/events";

interface GenerationGateProps {
  sessionId: string;
  /** Deprecated — kept for signature compatibility with existing callers. */
  onSuccess?: () => void;
  /** When true, this gate is rendered inline inside the report (no top
   *  headline/eyebrow) rather than full-page. Default false. */
  inline?: boolean;
}

/**
 * In-report paywall card.
 *
 * Preview-first model: the report renders with locked premium sections;
 * this card is the primary CTA to unlock the full report. Offers two
 * plans — single-report unlock ($2.99) or Birthday Pass (recurring
 * $4.99/month, 10 reports per billing period).
 */
export function GenerationGate({ sessionId, inline = false }: GenerationGateProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  async function handleCheckout(plan: "single_report" | "birthday_pass") {
    setLoadingCheckout(plan);
    setError(null);
    analytics.premiumCheckoutStarted({
      plan: plan === "birthday_pass" ? "monthly" : "one_time",
      session_id: sessionId,
    });
    try {
      const deviceToken = getOrCreateDeviceToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, deviceToken, sessionId }),
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
    <div
      className={`text-center space-y-8 animate-fade-rise ${
        inline ? "py-6" : "py-12"
      }`}
    >
      {!inline && (
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
            Your preview is ready
          </p>
          <h2 className="heading-editorial text-2xl sm:text-3xl">
            Unlock your full birthday plan
          </h2>
          <p className="mx-auto max-w-md text-[14px] text-muted-foreground leading-relaxed">
            Unlock destinations, zodiac energy, full caption sets, complete
            color palettes, and the full celebration plan. We&apos;ll email
            your report right after checkout.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-xl space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Single report — $2.99 */}
          <button
            onClick={() => handleCheckout("single_report")}
            disabled={!!loadingCheckout}
            className="lift-card p-5 text-left transition-all hover:border-champagne/40 disabled:opacity-40 space-y-2"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/65">
              Unlock this report
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-medium text-foreground">$2.99</p>
              <p className="text-[11px] text-muted-foreground/60">one-time</p>
            </div>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              Unlocks this birthday report for life. Download, share, and
              full access.
            </p>
            {loadingCheckout === "single_report" && (
              <p className="text-[10px] text-champagne/60 animate-gentle-pulse">
                Redirecting to secure checkout...
              </p>
            )}
          </button>

          {/* Birthday Pass — $4.99/mo, 10 reports */}
          <button
            onClick={() => handleCheckout("birthday_pass")}
            disabled={!!loadingCheckout}
            className="lift-card p-5 text-left transition-all hover:border-plum/40 disabled:opacity-40 space-y-2 relative"
          >
            <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.15em] text-plum/80 bg-plum/10 rounded-full px-2 py-0.5 border border-plum/25">
              Best value
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-plum/70">
              Birthday Pass
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-medium text-foreground">$4.99</p>
              <p className="text-[11px] text-muted-foreground/60">/ month</p>
            </div>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              Create up to 10 full birthday reports per month. Best if
              you&apos;re planning for friends, family, or multiple
              birthday ideas.
            </p>
            {loadingCheckout === "birthday_pass" && (
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
          Secure checkout via Stripe. Cancel anytime on the Birthday Pass.
          Your report emails automatically once payment completes.
        </p>
      </div>
    </div>
  );
}

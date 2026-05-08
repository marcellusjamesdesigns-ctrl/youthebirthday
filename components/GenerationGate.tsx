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
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/65">
            Your preview is ready
          </p>
          <h2 className="heading-editorial text-2xl sm:text-3xl">
            See the full birthday we planned for you
          </h2>
          <p className="mx-auto max-w-md text-[14px] text-muted-foreground leading-relaxed">
            The destinations to book, the captions to post, the palette to
            wear, and a full celebration script — emailed to you the moment
            you check out.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-xl space-y-4">
        <div className="grid gap-3 sm:grid-cols-5">
          {/* Birthday Pass — $4.99/mo, 10 reports — PRIMARY */}
          <button
            onClick={() => handleCheckout("birthday_pass")}
            disabled={!!loadingCheckout}
            className="sm:col-span-3 lift-card p-6 text-left transition-all border-plum/40 ring-1 ring-plum/30 hover:border-plum/60 hover:ring-plum/50 disabled:opacity-40 space-y-2.5 relative bg-plum/[0.04]"
          >
            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.15em] text-plum bg-plum/15 rounded-full px-2.5 py-1 border border-plum/40 font-medium">
              Most popular
            </span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum/85">
              Birthday Pass
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-medium text-foreground">$4.99</p>
              <p className="text-[12px] text-muted-foreground/85">/ month</p>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Plan up to 10 full birthdays per month. Ideal if you&apos;re
              planning for friends and family, or trying multiple directions
              for your own day.
            </p>
            {loadingCheckout === "birthday_pass" && (
              <p className="text-[12px] text-plum animate-gentle-pulse pt-1">
                Redirecting to secure checkout…
              </p>
            )}
          </button>

          {/* Single report — $2.99 — SECONDARY */}
          <button
            onClick={() => handleCheckout("single_report")}
            disabled={!!loadingCheckout}
            className="sm:col-span-2 lift-card p-5 text-left transition-all hover:border-champagne/40 disabled:opacity-40 space-y-2"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/85">
              Just this one
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-medium text-foreground">$2.99</p>
              <p className="text-[12px] text-muted-foreground/85">one-time</p>
            </div>
            <p className="text-[12px] text-muted-foreground/85 leading-relaxed">
              Keep this plan forever. Download as a PDF, share with whoever&apos;s
              helping, and re-open it next year.
            </p>
            {loadingCheckout === "single_report" && (
              <p className="text-[12px] text-champagne animate-gentle-pulse pt-1">
                Redirecting…
              </p>
            )}
          </button>
        </div>

        {error && (
          <p className="text-[13px] text-rose-400 pt-1">{error}</p>
        )}

        <p className="text-[12px] text-muted-foreground/70 pt-2 leading-relaxed">
          Secure checkout via Stripe. Cancel anytime on the Birthday Pass.
          Your plan emails automatically once payment completes.
        </p>
      </div>
    </div>
  );
}

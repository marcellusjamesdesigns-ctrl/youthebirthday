"use client";

import { useState } from "react";
import { getOrCreateDeviceToken } from "@/lib/limits/device-token";
import { analytics } from "@/lib/analytics/events";

interface GenerationGateProps {
  sessionId: string;
  onSuccess: () => void;
}

export function GenerationGate({ sessionId, onSuccess }: GenerationGateProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const deviceToken = getOrCreateDeviceToken();
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), deviceToken }),
      });

      if (!res.ok) {
        setError("Something went wrong. Try again.");
        setIsSubmitting(false);
        return;
      }

      analytics.emailCaptured();
      setDone(true);
      setTimeout(() => onSuccess(), 1200);
    } catch {
      setError("Connection error. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function handlePremium(plan: "one_time" | "monthly") {
    setLoadingCheckout(plan);
    try {
      const deviceToken = getOrCreateDeviceToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          deviceToken,
          email: email.trim() || undefined,
          sessionId,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Checkout unavailable. Try the free option.");
        setLoadingCheckout(null);
      }
    } catch {
      setError("Connection error.");
      setLoadingCheckout(null);
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4 py-12 animate-fade-rise">
        <p className="heading-editorial text-2xl">You&apos;re in</p>
        <p className="text-sm text-muted-foreground">
          2 more generations unlocked. Generating now...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8 py-12 animate-fade-rise">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
          Free generation used
        </p>
        <h2 className="heading-editorial text-2xl sm:text-3xl">
          Want another birthday?
        </h2>
      </div>

      {/* Free option — email for 2 more */}
      <div className="mx-auto max-w-sm space-y-4">
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="luxury-input w-full px-4 py-3.5 text-base text-center"
          />
          {error && (
            <p className="text-[12px] text-rose-400/80">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="w-full rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Unlocking..." : "Unlock 2 more free"}
          </button>
        </form>

        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-border/30" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30">or go unlimited</p>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        {/* Premium options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handlePremium("one_time")}
            disabled={!!loadingCheckout}
            className="lift-card p-4 text-center transition-all hover:border-champagne/30 disabled:opacity-40 space-y-1.5"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/60">Birthday Pass</p>
            <p className="text-xl font-medium text-foreground">$2.99</p>
            <p className="text-[11px] text-muted-foreground/50">one-time</p>
            {loadingCheckout === "one_time" && (
              <p className="text-[10px] text-champagne/50 animate-gentle-pulse">Redirecting...</p>
            )}
          </button>
          <button
            onClick={() => handlePremium("monthly")}
            disabled={!!loadingCheckout}
            className="lift-card p-4 text-center transition-all hover:border-plum/30 disabled:opacity-40 space-y-1.5"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-plum/60">Birthday Pro</p>
            <p className="text-xl font-medium text-foreground">$4.99</p>
            <p className="text-[11px] text-muted-foreground/50">per month</p>
            {loadingCheckout === "monthly" && (
              <p className="text-[10px] text-plum/50 animate-gentle-pulse">Redirecting...</p>
            )}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground/25 pt-2">
          Unlimited generations · extra palettes · caption rerolls · HD share cards
        </p>
      </div>
    </div>
  );
}

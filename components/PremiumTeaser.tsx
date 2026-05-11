"use client";

import { getOrCreateDeviceToken } from "@/lib/limits/device-token";
import { useState } from "react";
import { analytics } from "@/lib/analytics/events";

interface PremiumTeaserProps {
  label: string;
  description: string;
  sessionId: string;
}

export function PremiumTeaser({ label, description, sessionId }: PremiumTeaserProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(plan: "one_time" | "monthly") {
    setLoading(plan);
    analytics.premiumCheckoutStarted({ plan, session_id: sessionId });
    try {
      const deviceToken = getOrCreateDeviceToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, deviceToken, sessionId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Gradient border top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent z-30" />

      {/* Blurred placeholder content */}
      <div className="p-6 sm:p-8 space-y-3 select-none" aria-hidden="true">
        <div className="flex gap-3">
          <div className="h-3 w-24 bg-foreground/5 rounded-full" />
          <div className="h-3 w-16 bg-foreground/5 rounded-full" />
        </div>
        <div className="h-5 w-56 bg-foreground/5 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-foreground/4 rounded" />
          <div className="h-3 w-4/5 bg-foreground/4 rounded" />
          <div className="h-3 w-3/5 bg-foreground/4 rounded" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 bg-foreground/4 rounded-full" />
          <div className="h-6 w-20 bg-foreground/4 rounded-full" />
          <div className="h-6 w-14 bg-foreground/4 rounded-full" />
        </div>
      </div>

      {/* Blur + gradient overlay */}
      <div className="absolute inset-0 backdrop-blur-[6px] bg-gradient-to-b from-background/70 via-background/60 to-background/80 z-10" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full bg-champagne/[0.04] blur-[80px] pointer-events-none z-10" aria-hidden="true" />

      {/* CTA overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center space-y-4 px-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-plum/30 bg-plum/10 px-3 py-1">
            <span className="text-plum text-xs">&#9830;</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-plum font-medium">{label}</span>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex flex-col gap-2.5 items-stretch sm:items-center pt-1">
            {/* Birthday Pass — primary (matches GenerationGate hierarchy) */}
            <button
              onClick={() => handleUpgrade("monthly")}
              disabled={!!loading}
              className="rounded-full bg-foreground py-3 px-6 text-[14px] font-medium text-background tracking-wide min-h-[48px] shadow-[0_0_40px_-8px_rgba(212,175,55,0.35)] active:scale-[0.99] transition-all disabled:opacity-40"
            >
              {loading === "monthly" ? "Redirecting…" : "Birthday Pass — $4.99/mo"}
            </button>
            {/* Single report — secondary text link */}
            <button
              onClick={() => handleUpgrade("one_time")}
              disabled={!!loading}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors min-h-[44px] disabled:opacity-40"
            >
              {loading === "one_time" ? "Redirecting…" : "Or just this one — $2.99"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

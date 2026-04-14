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
        <div className="text-center space-y-4 px-6 max-w-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-champagne/20 bg-champagne/5 px-3 py-1">
            <span className="text-champagne/70 text-xs">&#9830;</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-champagne/60 font-medium">{label}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
            <button
              onClick={() => handleUpgrade("one_time")}
              disabled={!!loading}
              className="glow-btn !py-2.5 !px-6 !text-[12px] disabled:opacity-40"
            >
              {loading === "one_time" ? "..." : "Unlock — $2.99"}
            </button>
            <button
              onClick={() => handleUpgrade("monthly")}
              disabled={!!loading}
              className="rounded-full border border-border/60 px-5 py-2.5 text-[12px] text-muted-foreground/70 hover:text-foreground hover:border-foreground/15 transition-all disabled:opacity-40"
            >
              {loading === "monthly" ? "..." : "$4.99/mo — unlimited"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

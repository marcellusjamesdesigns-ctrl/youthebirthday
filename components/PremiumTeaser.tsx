"use client";

import { getOrCreateDeviceToken } from "@/lib/limits/device-token";
import { useState } from "react";

interface PremiumTeaserProps {
  label: string;
  description: string;
  sessionId: string;
}

export function PremiumTeaser({ label, description, sessionId }: PremiumTeaserProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(plan: "one_time" | "monthly") {
    setLoading(plan);
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
    <div className="relative rounded-xl border border-border/30 bg-card/50 overflow-hidden">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-background/60 z-10" />

      {/* Placeholder content behind blur */}
      <div className="p-6 space-y-3 opacity-40 select-none" aria-hidden="true">
        <div className="h-3 w-32 bg-muted-foreground/10 rounded" />
        <div className="h-4 w-48 bg-muted-foreground/10 rounded" />
        <div className="h-3 w-full bg-muted-foreground/10 rounded" />
        <div className="h-3 w-3/4 bg-muted-foreground/10 rounded" />
        <div className="h-3 w-5/6 bg-muted-foreground/10 rounded" />
      </div>

      {/* CTA overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center space-y-4 px-6 max-w-sm">
          <p className="text-[10px] uppercase tracking-[0.25em] text-champagne/60">{label}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => handleUpgrade("one_time")}
              disabled={!!loading}
              className="rounded-full bg-foreground px-5 py-2 text-[12px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.2)] disabled:opacity-40"
            >
              {loading === "one_time" ? "..." : "Unlock — $2.99"}
            </button>
            <button
              onClick={() => handleUpgrade("monthly")}
              disabled={!!loading}
              className="rounded-full border border-border px-5 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all disabled:opacity-40"
            >
              {loading === "monthly" ? "..." : "$4.99/mo — unlimited"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

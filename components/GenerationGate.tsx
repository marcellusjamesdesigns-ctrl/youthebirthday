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

  async function handleSubmit(e: React.FormEvent) {
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
    <div className="text-center space-y-6 py-12 animate-fade-rise">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
          Free generation used
        </p>
        <h2 className="heading-editorial text-2xl sm:text-3xl">
          Want another birthday?
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Drop your email to unlock 2 more personalized birthday experiences.
          No spam — just birthday energy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-xs space-y-3">
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
          {isSubmitting ? "Unlocking..." : "Unlock 2 More"}
        </button>
      </form>

      <p className="text-[10px] text-muted-foreground/30">
        Premium with unlimited generations coming soon.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";

interface BlogEmailCaptureProps {
  /** Optional contextual hook — e.g. "Get a soft life birthday note monthly." */
  hook?: string;
  /** Source tag for analytics (which post the capture came from) */
  source: string;
}

export function BlogEmailCapture({
  hook = "One birthday planning note, monthly. No noise, no list-sharing.",
  source,
}: BlogEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");

    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          deviceToken: `blog-${source}`,
          source: `blog-${source}`,
        }),
      });
      if (res.ok) {
        setState("done");
        if (typeof window !== "undefined" && "posthog" in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).posthog?.capture("blog_email_captured", { source });
        }
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="my-12 py-10 px-6 sm:px-10 rounded-2xl bg-card/40 text-center space-y-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">You&apos;re In</p>
        <p className="font-editorial text-lg text-foreground/85">
          Welcome to The Journal list.
        </p>
        <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
          One note a month. Unsubscribe any time. Your birthday planning life
          just got quieter.
        </p>
      </div>
    );
  }

  return (
    <aside
      className="my-12 py-10 px-6 sm:px-10 rounded-2xl bg-card/40 space-y-5"
      aria-label="Subscribe to The Journal"
    >
      <div className="text-center space-y-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
          The Journal · Monthly Notes
        </p>
        <p className="font-editorial text-xl sm:text-2xl text-foreground/90 leading-snug">
          Plan birthdays that feel like yours.
        </p>
        <p className="text-sm text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
          {hook}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          className="luxury-input flex-1 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={state === "loading" || !email.trim()}
          className="rounded-full bg-foreground px-5 py-3 text-[13px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {state === "loading" ? "Adding…" : "Subscribe"}
        </button>
      </form>

      {state === "error" && (
        <p className="text-center text-[12px] text-rose-400/80">
          Something went wrong. Try again in a moment.
        </p>
      )}

      <p className="text-center text-[10px] text-muted-foreground/40">
        No spam. Unsubscribe any time.
      </p>
    </aside>
  );
}

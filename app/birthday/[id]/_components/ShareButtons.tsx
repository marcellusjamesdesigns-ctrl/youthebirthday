"use client";

import { useState, useEffect } from "react";
import { analytics } from "@/lib/analytics/events";
import type { PurchaseType } from "@/lib/limits/use-premium";

interface ShareButtonsProps {
  sessionId: string;
  title?: string;
  isPremium?: boolean;
  purchaseType?: PurchaseType;
}

export function ShareButtons({ sessionId, title, isPremium, purchaseType }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = (path: string) =>
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const shareUrl = getUrl(`/birthday/card/${sessionId}`);
  const dashboardUrl = getUrl(`/birthday/${sessionId}`);

  function handleCopyLink() {
    navigator.clipboard.writeText(dashboardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    analytics.shareClicked({ session_id: sessionId, method: "copy_link" });
  }

  function handleShare() {
    analytics.shareClicked({ session_id: sessionId, method: "native_share" });
    if (navigator.share) {
      navigator.share({
        title: title ?? "My Birthday Experience",
        text: "Check out my personalized birthday dashboard on You the Birthday",
        url: shareUrl,
      });
    } else {
      handleCopyLink();
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* Primary */}
      <button
        onClick={handleShare}
        className="rounded-full bg-foreground px-7 py-2.5 text-[13px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.2)]"
      >
        Share
      </button>
      {/* Secondary */}
      <button
        onClick={handleCopyLink}
        className="rounded-full border border-border px-5 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
      {/* Tertiary */}
      <button
        onClick={() => { analytics.shareClicked({ session_id: sessionId, method: "view_card" }); window.open(`/birthday/card/${sessionId}`, "_blank"); }}
        className="rounded-full px-5 py-2.5 text-[13px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        View Card
      </button>
      {/* Download — premium only */}
      {isPremium && (
        <button
          onClick={() => window.open(`/birthday/${sessionId}/print`, "_blank")}
          className="rounded-full border border-champagne/20 px-5 py-2.5 text-[13px] text-champagne/60 hover:text-champagne hover:border-champagne/40 transition-all"
        >
          Download Report
        </button>
      )}
      {/* Purchase-type-aware controls */}
      {isPremium && purchaseType === "subscription" && <ManageBillingButton />}
      {isPremium && purchaseType === "one_time" && (
        <button
          onClick={async () => {
            const { getOrCreateDeviceToken } = await import("@/lib/limits/device-token");
            const token = getOrCreateDeviceToken();
            const res = await fetch("/api/stripe/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan: "monthly", deviceToken: token, sessionId }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
          }}
          className="rounded-full px-5 py-2.5 text-[13px] text-champagne/40 hover:text-champagne/60 transition-colors"
        >
          Upgrade to Unlimited
        </button>
      )}
      {/* Fallback for unknown purchase type (admin/manual) — try billing portal */}
      {isPremium && purchaseType === "unknown" && <ManageBillingButton />}
    </div>
  );
}

/**
 * Attempts to fetch a Stripe billing portal URL on mount.
 * If the user has no stripeCustomerId (one-time purchase or manual repair),
 * the API returns 404 and the button never renders — no dead button.
 */
function ManageBillingButton() {
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { getOrCreateDeviceToken } = await import("@/lib/limits/device-token");
        const token = getOrCreateDeviceToken();
        const res = await fetch("/api/stripe/portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceToken: token }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) setPortalUrl(data.url);
        }
      } catch {
        // silently don't show the button
      }
    })();
  }, []);

  if (!portalUrl) return null;

  return (
    <button
      onClick={() => { window.location.href = portalUrl; }}
      className="rounded-full px-5 py-2.5 text-[13px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
    >
      Manage Billing
    </button>
  );
}

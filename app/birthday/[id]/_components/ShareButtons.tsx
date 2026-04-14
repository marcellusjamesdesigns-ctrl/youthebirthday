"use client";

import { useState } from "react";
import { analytics } from "@/lib/analytics/events";

interface ShareButtonsProps {
  sessionId: string;
  title?: string;
  isPremium?: boolean;
}

export function ShareButtons({ sessionId, title, isPremium }: ShareButtonsProps) {
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
        <>
          <button
            onClick={() => window.open(`/birthday/${sessionId}/print`, "_blank")}
            className="rounded-full border border-champagne/20 px-5 py-2.5 text-[13px] text-champagne/60 hover:text-champagne hover:border-champagne/40 transition-all"
          >
            Download Report
          </button>
          <button
            onClick={async () => {
              const { getOrCreateDeviceToken } = await import("@/lib/limits/device-token");
              const token = getOrCreateDeviceToken();
              const res = await fetch("/api/stripe/portal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceToken: token }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="rounded-full px-5 py-2.5 text-[13px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            Manage Subscription
          </button>
        </>
      )}
    </div>
  );
}

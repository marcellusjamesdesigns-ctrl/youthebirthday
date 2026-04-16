"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface CardActionsProps {
  sessionId: string;
}

/**
 * Export / share action bar for the birthday share card.
 *
 * Download uses the server-side /api/og/{id} image endpoint (Satori)
 * instead of html2canvas — much more reliable, no browser canvas issues.
 */
export function CardActions({ sessionId }: CardActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/birthday/card/${sessionId}`
      : `/birthday/card/${sessionId}`;

  const ogImageUrl = `/api/og/${sessionId}`;

  // ── Download PNG (server-rendered via /api/og) ────────────────────
  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const res = await fetch(ogImageUrl);
      if (!res.ok) throw new Error("Image fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "my-birthday-card.png";
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: open the image in a new tab so they can long-press / right-click save
      window.open(ogImageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  }, [ogImageUrl, downloading]);

  // ── Native Share ──────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    // Try sharing with the OG image as a file attachment
    if (navigator.share) {
      try {
        const res = await fetch(ogImageUrl);
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], "birthday-card.png", { type: "image/png" });
          const shareData = {
            title: "My Birthday Experience",
            text: "Check out my personalized birthday card",
            url: cardUrl,
            files: [file],
          };
          if (navigator.canShare?.(shareData)) {
            await navigator.share(shareData);
            return;
          }
        }
      } catch {
        // Fall through to text-only share
      }

      // Text-only share fallback
      try {
        await navigator.share({
          title: "My Birthday Experience",
          text: "Check out my personalized birthday card on You The Birthday",
          url: cardUrl,
        });
        return;
      } catch {
        // User cancelled
      }
    }

    // Final fallback: copy link
    handleCopyLink();
  }, [ogImageUrl, cardUrl]);

  // ── Copy Link ─────────────────────────────────────────────────────
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cardUrl]);

  return (
    <div className="w-full max-w-[440px] mt-6 space-y-4">
      {/* Primary action row */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 rounded-full bg-foreground py-3 text-[13px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.2)] disabled:opacity-50"
        >
          {downloading ? "Saving..." : "Save Image"}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 rounded-full border border-border py-3 text-[13px] text-foreground/80 tracking-wide transition-all hover:border-foreground/20 hover:text-foreground"
        >
          Share
        </button>
      </div>

      {/* Secondary action row */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyLink}
          className="flex-1 rounded-full border border-border/50 py-2.5 text-[12px] text-muted-foreground/60 tracking-wide transition-all hover:border-border hover:text-muted-foreground"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <Link
          href={`/birthday/${sessionId}`}
          className="flex-1 rounded-full border border-border/50 py-2.5 text-[12px] text-muted-foreground/60 tracking-wide text-center transition-all hover:border-border hover:text-muted-foreground"
        >
          Full Report
        </Link>
      </div>

      {/* Viral CTA */}
      <div className="pt-2 text-center">
        <Link
          href="/onboarding"
          className="text-[11px] uppercase tracking-[0.2em] text-champagne/50 hover:text-champagne/80 transition-colors"
        >
          Create Your Own →
        </Link>
      </div>
    </div>
  );
}

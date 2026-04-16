"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";

interface CardActionsProps {
  sessionId: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Export / share action bar for the birthday share card.
 *
 * Turns the card page from a passive poster into a social export studio:
 *   - Download PNG (html-to-canvas via the browser)
 *   - Native Share (with image on supported platforms)
 *   - Copy link
 *   - View full report
 *   - Create your own
 */
export function CardActions({ sessionId, cardRef }: CardActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const dashboardUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/birthday/${sessionId}`
      : `/birthday/${sessionId}`;

  const cardUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/birthday/card/${sessionId}`
      : `/birthday/card/${sessionId}`;

  // ── Download PNG ──────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      // Dynamically import html2canvas to keep bundle small
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0b",
        scale: 2, // retina quality
        useCORS: true,
        logging: false,
        // Fix for fonts / custom properties not rendering
        onclone: (doc: Document) => {
          const el = doc.querySelector("[data-card]") as HTMLElement | null;
          if (el) el.style.fontFamily = "Georgia, 'Times New Roman', serif";
        },
        allowTaint: true,
        foreignObjectRendering: false,
      });
      // Use blob download — more reliable than dataURL on large canvases
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Download failed — try taking a screenshot instead.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "my-birthday-card.png";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: prompt user to screenshot
      alert("Download failed — try taking a screenshot instead.");
    } finally {
      setDownloading(false);
    }
  }, [cardRef, downloading]);

  // ── Native Share ──────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    // Try sharing with image (works on mobile Safari, Android)
    if (cardRef.current && navigator.share && navigator.canShare) {
      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#0a0a0b",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (blob) {
          const file = new File([blob], "birthday-card.png", {
            type: "image/png",
          });
          const shareData = {
            title: "My Birthday Experience",
            text: "Check out my personalized birthday card",
            url: cardUrl,
            files: [file],
          };
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
          }
        }
      } catch {
        // Fall through to text-only share
      }
    }

    // Fallback: text-only share
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Birthday Experience",
          text: "Check out my personalized birthday card on You The Birthday",
          url: cardUrl,
        });
        return;
      } catch {
        // User cancelled — that's fine
      }
    }

    // Final fallback: copy link
    handleCopyLink();
  }, [cardRef, cardUrl]);

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

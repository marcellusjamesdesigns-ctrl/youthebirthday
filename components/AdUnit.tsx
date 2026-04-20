"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "ca-pub-1064040585397799";

export type AdFormat =
  | "auto"
  | "fluid"
  | "rectangle"
  | "vertical"
  | "horizontal";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
  /** Override min-height to prevent layout shift (default 90px) */
  minHeight?: number;
  /** Collapse the slot when AdSense reports unfilled. Default true. */
  collapseWhenUnfilled?: boolean;
  /** How long to wait before assuming the slot is unfilled (ms). Default 2500. */
  unfilledTimeoutMs?: number;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  minHeight = 90,
  collapseWhenUnfilled = true,
  unfilledTimeoutMs = 2500,
}: AdUnitProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Reset on route change so ads re-render on SPA navigation
    pushed.current = false;
    setCollapsed(false);
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (pushed.current) return;

    const push = () => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch (e) {
        console.warn("[AdUnit] adsbygoogle.push failed:", e);
      }
    };

    // Small delay to let AdSense script initialise on first load
    const timer = setTimeout(push, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Collapse the slot when AdSense reports unfilled (or nothing renders in time).
  // AdSense sets data-ad-status="unfilled" on the <ins> element when no ad
  // is available for the slot. We also bail if no iframe child has been
  // inserted by the timeout — that covers cases where the script is blocked
  // or the slot is invalid.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!collapseWhenUnfilled) return;
    const el = adRef.current;
    if (!el) return;

    let settled = false;
    const markUnfilled = () => {
      if (settled) return;
      settled = true;
      setCollapsed(true);
    };

    const checkStatus = () => {
      const status = el.getAttribute("data-ad-status");
      if (status === "unfilled") {
        markUnfilled();
        return true;
      }
      if (status === "filled") {
        settled = true;
        return true;
      }
      return false;
    };

    // MutationObserver catches AdSense setting data-ad-status async
    const observer = new MutationObserver(() => {
      checkStatus();
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-ad-status"] });

    // Timeout fallback: if nothing settled by the deadline, collapse
    const timer = setTimeout(() => {
      if (settled) return;
      if (!checkStatus()) {
        // No status set at all — likely blocked or failed to fill
        const hasIframe = !!el.querySelector("iframe");
        if (!hasIframe) markUnfilled();
      }
    }, unfilledTimeoutMs);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname, collapseWhenUnfilled, unfilledTimeoutMs]);

  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        className={`flex items-center justify-center rounded border border-dashed border-white/10 text-xs text-white/20 ${className}`}
        style={{ minHeight }}
        aria-hidden="true"
      >
        Ad Placeholder [{slot}]
      </div>
    );
  }

  // When collapsed, render nothing visible and zero out the wrapper margins
  // the parent applied via className. The empty span keeps ref stability
  // unnecessary — we just unmount the <ins> entirely.
  if (collapsed) {
    return <div aria-hidden="true" style={{ display: "none" }} />;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block", minHeight }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}

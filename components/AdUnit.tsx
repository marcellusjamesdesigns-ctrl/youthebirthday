"use client";

import { useEffect, useRef } from "react";
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
}: AdUnitProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Reset on route change so ads re-render on SPA navigation
    pushed.current = false;
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

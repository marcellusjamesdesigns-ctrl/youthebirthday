"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Mobile-only sticky "Generate My Birthday" CTA.
 *
 * Appears on content detail pages after the user scrolls past the opening
 * hero/image area. Hides when the final CTA comes into view so it doesn't
 * double-up or cover the footer.
 *
 * Only renders on md < breakpoint via the className `md:hidden`.
 */
export function MobileStickyGenerateCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after 400px of scroll (past hero+image on most pages)
      const scrolled = window.scrollY > 400;

      // Hide when final CTA is in viewport (look for the glow-champagne CTA
      // near the bottom of the article). If not found, fall back to showing
      // while scrolled > 400.
      const finalCta = document.querySelector<HTMLElement>(
        "article .animated-border-card"
      );
      let nearFinalCta = false;
      if (finalCta) {
        const rect = finalCta.getBoundingClientRect();
        nearFinalCta = rect.top < window.innerHeight && rect.bottom > 0;
      }

      setVisible(scrolled && !nearFinalCta);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Link
        href="/onboarding"
        className="block rounded-full bg-foreground/95 backdrop-blur text-background text-center py-3 text-[14px] font-medium shadow-lg hover:bg-foreground transition-colors"
      >
        Generate My Birthday →
      </Link>
    </div>
  );
}

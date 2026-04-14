"use client";

import { analytics } from "@/lib/analytics/events";

interface AffiliateLinkProps {
  href: string;
  provider: "booking" | "viator" | "opentable" | "airbnb" | "amazon" | "other";
  category: "destination" | "restaurant" | "activity" | "gift" | "supply";
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable affiliate link component with tracking and disclosure.
 *
 * Usage:
 * <AffiliateLink
 *   href="https://booking.com/..."
 *   provider="booking"
 *   category="destination"
 *   label="Book Kyoto hotel"
 * >
 *   Book Now
 * </AffiliateLink>
 */
export function AffiliateLink({
  href,
  provider,
  category,
  label,
  children,
  className,
}: AffiliateLinkProps) {
  function handleClick() {
    if (typeof window !== "undefined" && "posthog" in window) {
      (window as any).posthog?.capture("affiliate_clicked", {
        provider,
        category,
        label,
        href,
      });
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

/**
 * Affiliate disclosure text — required by FTC and most affiliate programs.
 * Place this near any section that contains affiliate links.
 */
export function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={`text-[9px] text-muted-foreground/25 italic ${className ?? ""}`}>
      Some links may earn us a commission at no extra cost to you.
    </p>
  );
}

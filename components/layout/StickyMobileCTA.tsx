"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sticky bottom CTA on mobile only.
 *
 * Lives in the natural thumb-zone for one-handed phone use. Hidden on
 * surfaces where the user is already mid-flow (onboarding, paywall,
 * dashboard), in admin/legal views, OR on content detail pages
 * (which use ContentPageLayout's own scroll-triggered
 * MobileStickyGenerateCTA — we defer to it there to avoid double CTAs).
 *
 * Audit driver: ux-laws-audit + ux-mobile-audit + ux-burden-audit all
 * flagged the missing persistent mobile primary CTA — Navbar's Start
 * button is `hidden sm:inline-flex`, leaving 70% of traffic with no
 * always-visible conversion affordance.
 */
const HIDE_PREFIXES = [
  "/onboarding",
  "/admin",
  "/premium",
  "/dashboard",
  "/birthday/", // generated report routes
];

// Content detail pages already render their own scroll-triggered sticky
// CTA via ContentPageLayout. Skip on any path that has a slug under one
// of these hubs (e.g. /birthday-ideas/30th-birthday-ideas).
const CONTENT_HUB_PREFIXES = [
  "/birthday-captions/",
  "/birthday-ideas/",
  "/birthday-themes/",
  "/birthday-palettes/",
  "/birthday-destinations/",
  "/zodiac-birthdays/",
];

function isContentDetailRoute(pathname: string): boolean {
  return CONTENT_HUB_PREFIXES.some(
    (prefix) =>
      pathname.startsWith(prefix) && pathname.length > prefix.length
  );
}

export function StickyMobileCTA() {
  const pathname = usePathname();

  if (!pathname) return null;
  if (HIDE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  if (isContentDetailRoute(pathname)) return null;

  return (
    <>
      {/* Spacer so content/footer doesn't hide under the sticky bar on mobile. */}
      <div className="sm:hidden h-[88px]" aria-hidden="true" />
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none">
        <div className="px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] bg-gradient-to-t from-background via-background/95 to-transparent">
          <Link
            href="/onboarding"
            className="pointer-events-auto block w-full text-center rounded-full bg-foreground py-3.5 text-[15px] font-medium text-background tracking-wide shadow-[0_0_40px_-8px_rgba(212,175,55,0.35)] active:scale-[0.99] transition-transform"
          >
            Plan my birthday
          </Link>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sticky bottom CTA on mobile only.
 *
 * Lives in the natural thumb-zone for one-handed phone use. Hidden on
 * surfaces where the user is already mid-flow (onboarding, paywall,
 * dashboard) or in admin/legal views.
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

export function StickyMobileCTA() {
  const pathname = usePathname();

  if (!pathname) return null;
  if (HIDE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

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

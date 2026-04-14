/**
 * Affiliate configuration — defines placement zones and provider mappings.
 *
 * ACTIVATION CHECKLIST:
 * 1. Sign up for affiliate programs: Booking.com, Viator, OpenTable, Amazon Associates
 * 2. Get tracking IDs / affiliate tags
 * 3. Replace placeholder URLs below with real affiliate URLs
 * 4. Add <AffiliateDisclosure /> near each placement zone
 * 5. Test tracking events in PostHog
 */

export type AffiliateProvider = "booking" | "viator" | "opentable" | "airbnb" | "amazon" | "other";

export interface AffiliatePlacement {
  /** Page type where this placement lives */
  pageType: "destination-detail" | "destination-hub" | "restaurant-dashboard" | "activity-dashboard" | "idea-detail" | "theme-detail" | "gift-suggestion";
  /** Which section within the page */
  section: string;
  /** Recommended affiliate provider */
  provider: AffiliateProvider;
  /** CTA text */
  cta: string;
  /** Whether this placement is active (has real affiliate links) */
  active: boolean;
}

/**
 * All defined affiliate placement zones.
 * Set `active: true` and add real URLs once affiliate accounts are approved.
 */
export const AFFILIATE_PLACEMENTS: AffiliatePlacement[] = [
  // ── Destination pages ─────────────────────────────────────────
  {
    pageType: "destination-detail",
    section: "per-destination-card",
    provider: "booking",
    cta: "Search Hotels",
    active: false,
  },
  {
    pageType: "destination-detail",
    section: "per-destination-card",
    provider: "viator",
    cta: "Browse Experiences",
    active: false,
  },
  {
    pageType: "destination-hub",
    section: "bottom-of-hub",
    provider: "booking",
    cta: "Start Planning Your Trip",
    active: false,
  },

  // ── Dashboard (premium) ───────────────────────────────────────
  {
    pageType: "restaurant-dashboard",
    section: "per-restaurant-card",
    provider: "opentable",
    cta: "Reserve a Table",
    active: false,
  },
  {
    pageType: "activity-dashboard",
    section: "per-activity-card",
    provider: "viator",
    cta: "Book This Experience",
    active: false,
  },

  // ── Idea & theme pages ────────────────────────────────────────
  {
    pageType: "idea-detail",
    section: "dinner-ideas",
    provider: "opentable",
    cta: "Find Restaurants",
    active: false,
  },
  {
    pageType: "idea-detail",
    section: "trip-ideas",
    provider: "booking",
    cta: "Search Flights & Hotels",
    active: false,
  },
  {
    pageType: "theme-detail",
    section: "party-supplies",
    provider: "amazon",
    cta: "Shop Decorations",
    active: false,
  },

  // ── Gift suggestions (future) ─────────────────────────────────
  {
    pageType: "gift-suggestion",
    section: "gift-card",
    provider: "amazon",
    cta: "Shop This Gift",
    active: false,
  },
];

/**
 * Helper: get active placements for a given page type.
 */
export function getActivePlacements(pageType: string): AffiliatePlacement[] {
  return AFFILIATE_PLACEMENTS.filter((p) => p.pageType === pageType && p.active);
}

/**
 * Affiliate URL builders — replace with real tracking URLs once approved.
 */
export const affiliateUrls = {
  booking: (city: string) =>
    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&aid=YOUR_BOOKING_AID`,
  viator: (city: string) =>
    `https://www.viator.com/searchResults/all?text=${encodeURIComponent(city)}&pid=YOUR_VIATOR_PID`,
  opentable: (restaurant: string, city: string) =>
    `https://www.opentable.com/s?term=${encodeURIComponent(restaurant)}&queryUnderstandingType=spell&quickSearchValue=${encodeURIComponent(city)}`,
  amazon: (query: string) =>
    `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=youthebirthda-20`,
};

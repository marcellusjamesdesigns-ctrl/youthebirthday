/**
 * Build a Google Maps search query for a restaurant/activity/venue card.
 *
 * The goal is to send Google Maps the BUSINESS/VENUE name (e.g.
 * "Jack's Boat Rental") plus the city — not the full descriptive card
 * title (e.g. "Kayaking the Potomac River at Jack's Boat Rental"),
 * which produces useless search results.
 *
 * Resolution order:
 *   1. Explicit `mapsQuery` field if the AI produced one
 *   2. Explicit venue-like field: venueName / businessName / restaurantName / placeName
 *   3. `name` field — with a fallback parser: if `name` contains " at ",
 *      use the text AFTER the last " at " as the venue candidate. This
 *      salvages existing stored records where the AI concatenated the
 *      experience and the venue into a single string.
 *   4. Final fallback: use `name` as-is (or `title` if no name).
 *
 * The city is appended if available, unless the venue candidate already
 * contains the city name (rough substring match).
 */

interface VenueItemLike {
  name?: string;
  title?: string;
  venueName?: string;
  businessName?: string;
  restaurantName?: string;
  placeName?: string;
  mapsQuery?: string;
  city?: string;
  address?: string;
  neighborhood?: string;
}

/**
 * Extract a venue-focused query candidate from a potentially descriptive
 * name string.
 *
 * Uses `lastIndexOf(" at ")` so that ambiguous cases like
 * "Brunch at Monroe at Sunset" still resolve to the rightmost venue
 * candidate, which is most often correct for the generated format
 * ("{experience} at {venue}").
 */
export function extractVenueFromPhrase(phrase: string): string | null {
  if (!phrase) return null;
  const atIdx = phrase.toLowerCase().lastIndexOf(" at ");
  if (atIdx === -1) return null;
  const after = phrase.slice(atIdx + 4).trim();
  // Strip trailing punctuation that sometimes sneaks in (periods, commas).
  const cleaned = after.replace(/[.,;:!?]+$/, "").trim();
  return cleaned.length > 0 ? cleaned : null;
}

export function buildMapsQuery(
  item: VenueItemLike,
  cityFallback?: string,
): string {
  // 1. Explicit structured field from the AI (future-proof)
  if (item.mapsQuery && item.mapsQuery.trim()) {
    return item.mapsQuery.trim();
  }

  // 2. Explicit venue-like field
  const explicitVenue =
    item.venueName ||
    item.businessName ||
    item.restaurantName ||
    item.placeName;

  const nameField = item.name ?? item.title ?? "";
  const city = item.city ?? cityFallback ?? "";

  let venueCandidate: string | null = null;

  if (explicitVenue && explicitVenue.trim()) {
    venueCandidate = explicitVenue.trim();
  } else {
    // 3. Parse "… at VenueName" out of a descriptive name
    const parsed = extractVenueFromPhrase(nameField);
    if (parsed) {
      venueCandidate = parsed;
    }
  }

  // 4. Fallback to the raw name/title
  if (!venueCandidate) {
    venueCandidate = nameField.trim();
  }

  // Only append city if the venue candidate doesn't already contain it
  // (rough substring check; avoids "Paris Paris" style duplication).
  const normalizedVenue = venueCandidate.toLowerCase();
  const normalizedCity = city.toLowerCase();
  const shouldAppendCity =
    city.length > 0 &&
    normalizedCity.length > 1 &&
    !normalizedVenue.includes(normalizedCity);

  return shouldAppendCity
    ? `${venueCandidate} ${city}`.trim()
    : venueCandidate;
}

/**
 * Convenience wrapper that returns the full Google Maps search URL.
 */
export function buildMapsUrl(
  item: VenueItemLike,
  cityFallback?: string,
): string {
  const query = buildMapsQuery(item, cityFallback);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

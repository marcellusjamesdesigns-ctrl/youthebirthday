import type { Activity } from "@/lib/db/schema";

/**
 * Activity verifier — mirror of verifyRestaurantsWithGooglePlaces but
 * tuned for the activity card. Three quality gates beyond the restaurant
 * version:
 *
 *  1. Business must be `OPERATIONAL` (drop closed / no-status places).
 *  2. Rating ≥ MIN_RATING (4.0) — drop low-quality venues. Skipped only
 *     when Google returns no rating at all (e.g. brand-new listings).
 *  3. Fuzzy name match so Places' fuzzy search doesn't substitute
 *     unrelated venues for hallucinated names.
 *
 * When the gates pass, we enrich the Activity with `googlePlaceId` so
 * the UI can deep-link to that exact business page on Maps instead of
 * a search results list.
 *
 * If GOOGLE_PLACES_API_KEY is not set, returns the input unchanged.
 */
const MIN_RATING = 4.0;

function nameResemblesMatch(aiName: string, matchedName: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3);

  const aiWords = new Set(normalize(aiName));
  const matchedWords = new Set(normalize(matchedName));

  if (aiWords.size === 0) return true;

  for (const w of aiWords) {
    if (matchedWords.has(w)) return true;
  }
  return false;
}

/**
 * Pick the strongest single search candidate for an activity.
 *
 * The AI gives us a descriptive `name` ("Kayaking the Potomac") + a
 * separate `venueName` ("Jack's Boat Rental"). For Places search, the
 * venue name is far more reliable than the experience phrase.
 */
function pickSearchTerm(activity: Activity): string | null {
  const venue = activity.venueName?.trim();
  if (venue && venue.length > 0) return venue;
  // Some legacy records stored the venue inside `name` after an " at ".
  const atIdx = activity.name?.toLowerCase().lastIndexOf(" at ") ?? -1;
  if (atIdx !== -1) {
    const after = activity.name.slice(atIdx + 4).trim().replace(/[.,;:!?]+$/, "");
    if (after.length > 0) return after;
  }
  return activity.name?.trim() || null;
}

export async function verifyActivitiesWithGooglePlaces(
  activities: Activity[],
  city: string,
): Promise<Activity[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    // No API key — skip verification (graceful fallback)
    return activities;
  }

  const verified: Activity[] = [];

  for (const a of activities) {
    try {
      const searchTerm = pickSearchTerm(a);
      if (!searchTerm) {
        // Nothing to search — drop. We don't want a card we can't link.
        console.log(
          JSON.stringify({
            level: "info",
            msg: "activity:no-search-term-dropped",
            name: a.name,
          }),
        );
        continue;
      }

      const query = `${searchTerm} ${city}`;
      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.rating,places.id,places.businessStatus,places.userRatingCount",
          },
          body: JSON.stringify({
            textQuery: query,
            maxResultCount: 1,
          }),
        },
      );

      if (!res.ok) {
        // Places API error — drop the card rather than leave a broken
        // link to a search results page. Conservative on purpose.
        console.warn(
          JSON.stringify({
            level: "warn",
            msg: "activity:places-api-error",
            status: res.status,
            name: a.name,
          }),
        );
        continue;
      }

      const data = await res.json();
      const place = data.places?.[0];

      if (!place) {
        console.log(
          JSON.stringify({
            level: "info",
            msg: "activity:no-match-dropped",
            name: a.name,
            searchTerm,
            city,
          }),
        );
        continue;
      }

      // Operational status check
      const status = place.businessStatus;
      if (status && status !== "OPERATIONAL") {
        console.log(
          JSON.stringify({
            level: "info",
            msg: "activity:not-operational-dropped",
            name: a.name,
            status,
          }),
        );
        continue;
      }

      // Rating floor — 4.0 minimum. Skip the check only when Google
      // returns no rating at all (e.g. a brand-new listing with zero
      // reviews); we'd rather show those than drop them all.
      const rating = typeof place.rating === "number" ? place.rating : null;
      if (rating !== null && rating < MIN_RATING) {
        console.log(
          JSON.stringify({
            level: "info",
            msg: "activity:low-rating-dropped",
            name: a.name,
            rating,
            min: MIN_RATING,
          }),
        );
        continue;
      }

      // Name resemblance check
      const matchedName = place.displayName?.text ?? "";
      if (matchedName && !nameResemblesMatch(searchTerm, matchedName)) {
        console.log(
          JSON.stringify({
            level: "info",
            msg: "activity:name-mismatch-dropped",
            aiName: a.name,
            searchTerm,
            googleMatch: matchedName,
          }),
        );
        continue;
      }

      verified.push({
        ...a,
        // Don't overwrite the AI's descriptive `name` (it's editorial
        // copy like "Kayaking the Potomac"). Update the venueName
        // instead — that's the canonical business string.
        venueName: matchedName || a.venueName,
        address: place.formattedAddress ?? a.address,
        rating: rating ?? a.rating,
        googlePlaceId: place.id,
      });
    } catch (err) {
      console.warn(
        JSON.stringify({
          level: "warn",
          msg: "activity:verify-error",
          name: a.name,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      // On exception, drop. Same conservative posture as the API-error
      // branch — better one fewer card than a misleading link.
    }
  }

  return verified;
}

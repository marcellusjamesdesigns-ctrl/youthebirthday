import type { Restaurant } from "@/lib/db/schema";

/**
 * Reject a Google Places match that doesn't meaningfully resemble the
 * AI-suggested name. Places Text Search is fuzzy and will "helpfully"
 * match nonsense to unrelated real places — this gate stops that.
 */
function nameResemblesMatch(aiName: string, matchedName: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3); // skip tiny words like "& the"

  const aiWords = new Set(normalize(aiName));
  const matchedWords = new Set(normalize(matchedName));

  if (aiWords.size === 0) return true; // can't judge — trust it

  // Require at least one significant word in common
  for (const w of aiWords) {
    if (matchedWords.has(w)) return true;
  }
  return false;
}

/**
 * Verify AI-generated restaurant suggestions against Google Places.
 *
 * For each AI-suggested restaurant:
 *  - Search Google Places Text Search for "{name} {city}"
 *  - If no match, or businessStatus !== "OPERATIONAL", drop it
 *  - If match found, enrich with the real rating, address, and googlePlaceId
 *
 * If GOOGLE_PLACES_API_KEY is not set, returns the input unchanged.
 * This is a best-effort enrichment — failures never block generation.
 */
export async function verifyRestaurantsWithGooglePlaces(
  restaurants: Restaurant[],
  city: string,
): Promise<Restaurant[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    // No API key — skip verification (graceful fallback)
    return restaurants;
  }

  const verified: Restaurant[] = [];

  for (const r of restaurants) {
    try {
      const query = `${r.name} ${city}`;
      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.rating,places.id,places.businessStatus,places.priceLevel",
          },
          body: JSON.stringify({
            textQuery: query,
            maxResultCount: 1,
          }),
        },
      );

      if (!res.ok) {
        // Places API error — keep the AI suggestion (can't verify either way)
        verified.push(r);
        continue;
      }

      const data = await res.json();
      const place = data.places?.[0];

      if (!place) {
        // No match found — AI likely hallucinated the name. Drop it.
        console.log(
          JSON.stringify({
            level: "info",
            msg: "restaurant:no-match-dropped",
            name: r.name,
            city,
          }),
        );
        continue;
      }

      // Only keep operational places
      const status = place.businessStatus;
      if (status && status !== "OPERATIONAL") {
        console.log(
          JSON.stringify({
            level: "info",
            msg: "restaurant:not-operational-dropped",
            name: r.name,
            status,
          }),
        );
        continue;
      }

      // Reject matches that don't share any significant word with AI name.
      // Prevents "Nonsense Cafe" from being verified as "Cactus Cafe".
      const matchedName = place.displayName?.text ?? "";
      if (matchedName && !nameResemblesMatch(r.name, matchedName)) {
        console.log(
          JSON.stringify({
            level: "info",
            msg: "restaurant:name-mismatch-dropped",
            aiName: r.name,
            googleMatch: matchedName,
          }),
        );
        continue;
      }

      // Enrich with real Google data
      verified.push({
        ...r,
        name: place.displayName?.text ?? r.name,
        address: place.formattedAddress ?? r.address,
        rating: place.rating ?? r.rating,
        googlePlaceId: place.id,
      });
    } catch (err) {
      console.warn(
        JSON.stringify({
          level: "warn",
          msg: "restaurant:verify-error",
          name: r.name,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      // On error, keep the AI suggestion rather than drop it
      verified.push(r);
    }
  }

  return verified;
}

import { NextRequest, NextResponse } from "next/server";

// Google Places Nearby Search (New) endpoint
// Requires GOOGLE_PLACES_API_KEY set server-side
// Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search

const PLACE_TYPES_BY_VIBE: Record<string, string[]> = {
  "Luxury & Indulgence": ["fine_dining_restaurant", "steak_house", "french_restaurant"],
  "Adventure & Travel": ["restaurant", "bar", "cafe"],
  "Intimate & Cozy": ["italian_restaurant", "french_restaurant", "cafe"],
  "Wild & Social": ["bar", "nightclub", "restaurant"],
  "Self-Care & Restoration": ["vegan_restaurant", "cafe", "spa"],
  "Cultural & Intellectual": ["restaurant", "cafe", "wine_bar"],
  "Romantic & Dreamy": ["french_restaurant", "italian_restaurant", "fine_dining_restaurant"],
  "Spiritual & Intentional": ["vegan_restaurant", "vegetarian_restaurant", "cafe"],
};

interface PlaceResult {
  name: string;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  address: string;
  whyItFitsYou: string;
  googlePlaceId: string;
  rating: number | null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");
  const vibe = searchParams.get("vibe") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "5");

  if (!city) {
    return NextResponse.json(
      { error: "city parameter required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    // Fallback: return empty results if no API key configured
    // This ensures restaurants step fails gracefully
    console.log(
      JSON.stringify({
        level: "warn",
        msg: "restaurants:no-api-key",
        city,
      })
    );
    return NextResponse.json({ results: [] });
  }

  try {
    // First, geocode the city to get coordinates
    const geocodeRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`
    );
    const geocodeData = await geocodeRes.json();

    if (!geocodeData.results?.[0]?.geometry?.location) {
      return NextResponse.json({ results: [] });
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Get preferred types based on vibe
    const types = PLACE_TYPES_BY_VIBE[vibe] ?? ["restaurant"];
    const primaryType = types[0];

    // Search nearby places
    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.id,places.primaryType,places.editorialSummary",
        },
        body: JSON.stringify({
          includedTypes: [primaryType],
          maxResultCount: limit,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: 5000, // 5km radius
            },
          },
          rankPreference: "POPULARITY",
        }),
      }
    );

    if (!searchRes.ok) {
      throw new Error(`Places API returned ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    const places = searchData.places ?? [];

    const results: PlaceResult[] = places.map(
      (place: {
        displayName?: { text: string };
        formattedAddress?: string;
        priceLevel?: string;
        rating?: number;
        id?: string;
        primaryType?: string;
        editorialSummary?: { text: string };
      }) => {
        const priceLevelMap: Record<string, PlaceResult["priceRange"]> = {
          PRICE_LEVEL_FREE: "$",
          PRICE_LEVEL_INEXPENSIVE: "$",
          PRICE_LEVEL_MODERATE: "$$",
          PRICE_LEVEL_EXPENSIVE: "$$$",
          PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
        };

        return {
          name: place.displayName?.text ?? "Unknown",
          cuisine: place.primaryType?.replace(/_/g, " ") ?? "restaurant",
          priceRange: priceLevelMap[place.priceLevel ?? ""] ?? "$$",
          address: place.formattedAddress ?? "",
          whyItFitsYou:
            place.editorialSummary?.text ?? "A great spot for your birthday.",
          googlePlaceId: place.id ?? "",
          rating: place.rating ?? null,
        };
      }
    );

    return NextResponse.json({ results });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "restaurants:fetch-failed",
        city,
        error: err instanceof Error ? err.message : String(err),
      })
    );
    return NextResponse.json({ results: [] });
  }
}

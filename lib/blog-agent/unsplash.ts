/**
 * Fetch a relevant Unsplash image URL for a given search query.
 *
 * Uses the Unsplash API (free tier: 50 req/hr) to find a real photo
 * matching the agent's suggestedSearchQuery. Falls back to a curated
 * default if the API key is missing or the search returns nothing.
 *
 * The returned URL is a direct Unsplash image with proper UTM params
 * for attribution compliance.
 */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2400&auto=format&fit=crop";

interface UnsplashResult {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
}

export async function searchUnsplashImage(
  query: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
): Promise<UnsplashResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return {
      src: FALLBACK_IMAGE,
      alt: query,
      credit: "Unsplash",
      creditUrl: "https://unsplash.com",
    };
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", orientation);
    url.searchParams.set("content_filter", "high"); // safe content only

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!res.ok) {
      console.warn(`[unsplash] search failed (${res.status}): ${query}`);
      return fallback(query);
    }

    const data = await res.json();
    const photo = data.results?.[0];

    if (!photo) {
      console.warn(`[unsplash] no results for: ${query}`);
      return fallback(query);
    }

    // Unsplash attribution: use utm_source=youthebirthday&utm_medium=referral
    const imgUrl = `${photo.urls.regular}&utm_source=youthebirthday&utm_medium=referral`;
    const credit = photo.user?.name ?? "Unsplash";
    const creditUrl = photo.user?.links?.html
      ? `${photo.user.links.html}?utm_source=youthebirthday&utm_medium=referral`
      : "https://unsplash.com";

    return {
      src: imgUrl,
      alt: photo.alt_description ?? query,
      credit: `Photo by ${credit} on Unsplash`,
      creditUrl,
    };
  } catch (err) {
    console.warn("[unsplash] fetch error:", err instanceof Error ? err.message : String(err));
    return fallback(query);
  }
}

function fallback(query: string): UnsplashResult {
  return {
    src: FALLBACK_IMAGE,
    alt: query,
    credit: "Unsplash",
    creditUrl: "https://unsplash.com",
  };
}

/**
 * Resolve all image sections in a blog draft by fetching real Unsplash
 * photos for each suggestedSearchQuery. Also resolves heroImage and
 * pinterestImage.
 */
export async function resolveImages(draft: {
  heroImage: { suggestedSearchQuery: string; alt: string };
  pinterestImage?: { suggestedSearchQuery: string; alt: string } | null;
  sections: Array<Record<string, unknown>>;
}): Promise<{
  heroImage: { src: string; alt: string; credit: string; creditUrl: string };
  pinterestImage?: { src: string; alt: string };
  sections: Array<Record<string, unknown>>;
}> {
  // Resolve hero image
  const hero = await searchUnsplashImage(draft.heroImage.suggestedSearchQuery, "landscape");

  // Resolve pinterest image
  let pinterest: { src: string; alt: string } | undefined;
  if (draft.pinterestImage?.suggestedSearchQuery) {
    const pin = await searchUnsplashImage(draft.pinterestImage.suggestedSearchQuery, "portrait");
    pinterest = { src: pin.src, alt: pin.alt };
  }

  // Resolve image sections
  const resolvedSections = await Promise.all(
    draft.sections.map(async (section) => {
      if (section.type !== "image") return section;
      const query =
        (section.suggestedSearchQuery as string) ??
        (section.alt as string) ??
        "birthday celebration";
      const img = await searchUnsplashImage(query, "landscape");
      return {
        ...section,
        src: img.src,
        alt: img.alt,
        credit: img.credit,
        creditUrl: img.creditUrl,
      };
    }),
  );

  return {
    heroImage: hero,
    pinterestImage: pinterest,
    sections: resolvedSections,
  };
}

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

/**
 * Distill a long, descriptive query down to its strongest visual keywords.
 * Unsplash works best with 2-4 concrete nouns, not full sentences.
 */
function shortenQuery(query: string): string {
  return query
    .toLowerCase()
    // drop common filler words
    .replace(/\b(a|an|the|of|with|and|or|on|in|at|for|to|from|including|featuring|that|this|some|any)\b/g, " ")
    // drop punctuation
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");
}

async function unsplashSearch(query: string, orientation: string, accessKey: string) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("content_filter", "high");
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0] ?? null;
}

export async function searchUnsplashImage(
  query: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
): Promise<UnsplashResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return fallback(query);
  }

  try {
    // 1st attempt: exact query
    let photo = await unsplashSearch(query, orientation, accessKey);

    // 2nd attempt: shortened keywords (drops filler, keeps top 4 nouns)
    if (!photo) {
      const short = shortenQuery(query);
      if (short && short !== query.toLowerCase()) {
        console.warn(`[unsplash] retrying with shortened query: "${short}"`);
        photo = await unsplashSearch(short, orientation, accessKey);
      }
    }

    // 3rd attempt: very generic birthday fallback
    if (!photo) {
      console.warn(`[unsplash] retrying with generic fallback for: "${query}"`);
      photo = await unsplashSearch("birthday celebration", orientation, accessKey);
    }

    if (!photo) {
      console.warn(`[unsplash] all attempts failed for: ${query}`);
      return fallback(query);
    }

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

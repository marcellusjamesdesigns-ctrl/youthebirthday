import type { ContentPage } from "./types";

// ─── Content Registry ────────────────────────────────────────────────────────
// All content pages register here. The registry is the single source of truth
// for generating routes, sitemaps, internal links, and related content.

const pages: Map<string, ContentPage> = new Map();

export function registerPage(page: ContentPage) {
  pages.set(page.canonicalPath, page);
}

export function getPage(canonicalPath: string): ContentPage | undefined {
  return pages.get(canonicalPath);
}

export function getAllPages(): ContentPage[] {
  return Array.from(pages.values()).filter(
    (p) => p.publishStatus === "published"
  );
}

export function getPagesByCategory(category: string): ContentPage[] {
  return getAllPages().filter((p) => p.category === category);
}

export function getRelatedPages(
  page: ContentPage,
  limit: number = 6
): ContentPage[] {
  // THEME pages use a diversified mix: 2 sibling themes + 1 palette +
  // 1 idea + optionally 1 destination/zodiac. This makes theme pages
  // bridges into the broader ecosystem rather than dead-end islands.
  if (page.category === "themes") {
    return getThemeRelatedPages(page, limit);
  }
  // IDEA pages follow the same diversification pattern as themes: Ideas
  // pages are planning-surface, so we want them to bridge into Themes,
  // Captions, Palettes, and Destinations rather than dead-end in more Ideas.
  if (page.category === "ideas") {
    return getIdeaRelatedPages(page, limit);
  }

  const related: { page: ContentPage; score: number }[] = [];

  for (const candidate of getAllPages()) {
    if (candidate.canonicalPath === page.canonicalPath) continue;

    let score = 0;
    if (candidate.tags.age && candidate.tags.age === page.tags.age) score += 3;
    if (candidate.tags.zodiac && candidate.tags.zodiac === page.tags.zodiac) score += 3;
    if (candidate.tags.vibe && candidate.tags.vibe === page.tags.vibe) score += 2;
    if (candidate.tags.season && candidate.tags.season === page.tags.season) score += 1;
    if (candidate.tags.celebrationType && candidate.tags.celebrationType === page.tags.celebrationType) score += 2;
    if (candidate.category === page.category) score += 1;
    // Cross-category linking: ideas pages should link to related caption pages and vice versa
    if (candidate.category !== page.category) {
      // Planning pages (ideas) link well to caption pages of similar age
      if (candidate.tags.age && page.tags.age && candidate.tags.age === page.tags.age) score += 1;
      // Vibe-matched cross-category links
      if (candidate.tags.vibe && page.tags.vibe && candidate.tags.vibe === page.tags.vibe) score += 1;
    }

    if (score > 0) {
      related.push({ page: candidate, score });
    }
  }

  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.page);
}

/**
 * Theme pages need a diversified related mix so they function as
 * cross-category bridges (theme → idea → palette → etc.) rather
 * than theme-only islands. Picks top-scored within each category.
 */
function getThemeRelatedPages(page: ContentPage, limit: number): ContentPage[] {
  const scored = getAllPages()
    .filter((c) => c.canonicalPath !== page.canonicalPath)
    .map((candidate) => {
      let score = 0;
      if (candidate.tags.vibe && candidate.tags.vibe === page.tags.vibe) score += 3;
      if (candidate.tags.season && candidate.tags.season === page.tags.season) score += 2;
      if (candidate.tags.zodiac && candidate.tags.zodiac === page.tags.zodiac) score += 2;
      if (candidate.tags.age && candidate.tags.age === page.tags.age) score += 1;
      if (candidate.tags.theme && candidate.tags.theme === page.tags.theme) score += 2;
      if (candidate.category === "themes") score += 1;
      return { page: candidate, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // Pick diversified set: 2 themes, 1 palette, 1 idea, fill remaining
  const picked: ContentPage[] = [];
  const pickByCategory = (cat: string, max: number) => {
    for (const r of scored) {
      if (picked.length >= limit) break;
      if (r.page.category === cat && picked.filter((p) => p.category === cat).length < max) {
        if (!picked.includes(r.page)) picked.push(r.page);
      }
    }
  };
  pickByCategory("themes", 2);
  pickByCategory("palettes", 1);
  pickByCategory("ideas", 1);
  pickByCategory("captions", 1);
  pickByCategory("zodiac", 1);
  pickByCategory("destinations", 1);

  // Fill any remaining slots with top-scored candidates
  for (const r of scored) {
    if (picked.length >= limit) break;
    if (!picked.includes(r.page)) picked.push(r.page);
  }

  return picked.slice(0, limit);
}

/**
 * Idea pages need diversified related content so they bridge into
 * Themes, Captions, Palettes, and Destinations rather than dead-ending
 * in more Idea pages. Picks top-scored within each category.
 */
function getIdeaRelatedPages(page: ContentPage, limit: number): ContentPage[] {
  const scored = getAllPages()
    .filter((c) => c.canonicalPath !== page.canonicalPath)
    .map((candidate) => {
      let score = 0;
      if (candidate.tags.vibe && candidate.tags.vibe === page.tags.vibe) score += 3;
      if (candidate.tags.celebrationType && candidate.tags.celebrationType === page.tags.celebrationType) score += 3;
      if (candidate.tags.age && candidate.tags.age === page.tags.age) score += 2;
      if (candidate.tags.season && candidate.tags.season === page.tags.season) score += 1;
      if (candidate.tags.theme && candidate.tags.theme === page.tags.theme) score += 2;
      // Weight by category fit — we want Ideas pages to link OUT more than IN
      if (candidate.category === "themes") score += 2;
      if (candidate.category === "captions") score += 1;
      if (candidate.category === "palettes") score += 1;
      if (candidate.category === "destinations") score += 1;
      if (candidate.category === "ideas") score += 1;
      return { page: candidate, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // Pick a diversified set: 1 theme, 1 idea, 1 caption/palette/destination, fill remaining
  const picked: ContentPage[] = [];
  const pickByCategory = (cat: string, max: number) => {
    for (const r of scored) {
      if (picked.length >= limit) break;
      if (r.page.category === cat && picked.filter((p) => p.category === cat).length < max) {
        if (!picked.includes(r.page)) picked.push(r.page);
      }
    }
  };
  pickByCategory("themes", 1);
  pickByCategory("ideas", 2);
  pickByCategory("captions", 1);
  pickByCategory("palettes", 1);
  pickByCategory("destinations", 1);
  pickByCategory("zodiac", 1);

  // Fill remaining slots
  for (const r of scored) {
    if (picked.length >= limit) break;
    if (!picked.includes(r.page)) picked.push(r.page);
  }

  return picked.slice(0, limit);
}

// ─── Auto-register all content on import ─────────────────────────────────────
// Import the content definitions to populate the registry.
// Each content file calls registerPage() at module scope.

export function initRegistry() {
  // Dynamic imports at build time — Next.js will tree-shake unused content
  require("@/content/captions/_registry");
  require("@/content/ideas/_registry");
  require("@/content/destinations/_registry");
  require("@/content/palettes/_registry");
  require("@/content/themes/_registry");
  require("@/content/zodiac/_registry");
}

// Initialize on first import
let initialized = false;
export function ensureRegistry() {
  if (!initialized) {
    initRegistry();
    initialized = true;
  }
}

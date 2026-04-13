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

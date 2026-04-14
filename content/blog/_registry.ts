import type { BlogPost } from "@/lib/content/types";
import { softLifeDecorationsPost } from "./posts/soft-life-decorations";
import { birthdayDinnerOutfitsPost } from "./posts/birthday-dinner-outfits";
import { mayBirthdayTaurusPost } from "./posts/may-birthday-taurus-season";

/**
 * Static, canonical blog posts. These are the "golden example" posts
 * written manually and locked in as the voice + structure reference.
 *
 * Agent-generated posts live in the database (`blog_drafts` with
 * status = "published") and are merged at render time via functions
 * in `/lib/blog-db.ts`.
 */
export const staticBlogPosts: BlogPost[] = [
  softLifeDecorationsPost,
  birthdayDinnerOutfitsPost,
  mayBirthdayTaurusPost,
];

/** Synchronous lookup against ONLY the static registry. */
export function getStaticBlogPost(slug: string): BlogPost | undefined {
  return staticBlogPosts.find(
    (p) => p.slug === slug && p.publishStatus === "published",
  );
}

export function getStaticBlogPosts(): BlogPost[] {
  return staticBlogPosts
    .filter((p) => p.publishStatus === "published")
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
}

// ─── Back-compat: these async helpers merge TS + DB posts ──────────────
// Async versions live in `/lib/blog-db.ts` so importing this registry
// from server components stays fast. The sync helpers below are kept
// for components that don't need DB posts (admin UI, tests).

export function getRelatedStaticBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = staticBlogPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  return staticBlogPosts
    .filter((p) => p.slug !== currentSlug && p.publishStatus === "published")
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      if (p.tags.vibe && p.tags.vibe === current.tags.vibe) score += 2;
      if (p.tags.zodiac && p.tags.zodiac === current.tags.zodiac) score += 2;
      if (p.tags.season && p.tags.season === current.tags.season) score += 2;
      if (p.tags.theme && p.tags.theme === current.tags.theme) score += 1;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

// ─── Back-compat aliases for existing imports ───────────────────────────

export const blogPosts = staticBlogPosts;
export const getBlogPost = getStaticBlogPost;
export const getPublishedBlogPosts = getStaticBlogPosts;
export const getRelatedBlogPosts = getRelatedStaticBlogPosts;

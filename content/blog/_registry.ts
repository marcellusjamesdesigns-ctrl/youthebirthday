import type { BlogPost } from "@/lib/content/types";
import { softLifeDecorationsPost } from "./posts/soft-life-decorations";
import { birthdayDinnerOutfitsPost } from "./posts/birthday-dinner-outfits";
import { mayBirthdayTaurusPost } from "./posts/may-birthday-taurus-season";

export const blogPosts: BlogPost[] = [
  softLifeDecorationsPost,
  birthdayDinnerOutfitsPost,
  mayBirthdayTaurusPost,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug && p.publishStatus === "published");
}

export function getPublishedBlogPosts(): BlogPost[] {
  return blogPosts
    .filter((p) => p.publishStatus === "published")
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  return blogPosts
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

import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { BlogPost } from "@/lib/content/types";
import {
  staticBlogPosts,
  getStaticBlogPost,
  getStaticBlogPosts,
  getRelatedStaticBlogPosts,
} from "@/content/blog/_registry";

/**
 * Async helpers that merge static TS posts + DB-published agent posts.
 *
 * Use these in server components that render blog pages. They fall back
 * gracefully to static-only if the DB is unavailable.
 */

export async function getAllPublishedBlogPosts(): Promise<BlogPost[]> {
  const dbPosts = await getPublishedDbPosts();
  const combined = [...staticBlogPosts, ...dbPosts];
  return combined
    .filter((p) => p.publishStatus === "published")
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const staticPost = getStaticBlogPost(slug);
  if (staticPost) return staticPost;

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(blogDrafts)
      .where(and(eq(blogDrafts.status, "published")))
      .limit(500);

    for (const row of rows) {
      const post = row.postData as BlogPost | null;
      if (post?.slug === slug && post.publishStatus === "published") {
        return post;
      }
    }
  } catch (err) {
    console.error("[blog-db] fallback to static-only:", err);
  }
  return undefined;
}

export async function getRelatedBlogPostsAsync(
  currentSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  const allPosts = await getAllPublishedBlogPosts();
  const current = allPosts.find((p) => p.slug === currentSlug);
  if (!current) return getRelatedStaticBlogPosts(currentSlug, limit);

  return allPosts
    .filter((p) => p.slug !== currentSlug)
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

// ─── Internal ─────────────────────────────────────────────────────────

async function getPublishedDbPosts(): Promise<BlogPost[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(blogDrafts)
      .where(eq(blogDrafts.status, "published"))
      .orderBy(desc(blogDrafts.publishedAt))
      .limit(500);
    return rows
      .map((r) => r.postData as BlogPost | null)
      .filter((p): p is BlogPost => !!p && p.publishStatus === "published");
  } catch (err) {
    console.error("[blog-db] getPublishedDbPosts failed:", err);
    return [];
  }
}

export async function getDbPostSlugs(): Promise<string[]> {
  const posts = await getPublishedDbPosts();
  return posts.map((p) => p.slug);
}

/** Get existing slugs + titles across both sources for dedup checks. */
export async function getAllBlogIdentifiers(): Promise<{
  slugs: Set<string>;
  titles: string[];
}> {
  const all = await getAllPublishedBlogPosts();
  return {
    slugs: new Set(all.map((p) => p.slug)),
    titles: all.map((p) => p.title),
  };
}

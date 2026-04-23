/**
 * Runtime bridge for DB-published traffic pages.
 *
 * Mirrors lib/blog-db.ts but for ContentPage (category content like
 * /birthday-captions/[slug]) rather than BlogPost.
 *
 * Use these async helpers in server components that render category pages —
 * they merge the static compiled-in registry with agent-generated pages
 * that the admin has approved (kind='traffic-page', status='published').
 *
 * Falls back to static-only if the DB is unavailable.
 */
import { getDb } from "@/lib/db";
import { blogDrafts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import type { ContentPage } from "@/lib/content/types";
import type { ContentCategory } from "@/lib/content/taxonomy";
import {
  getContentPage as getStaticContentPage,
  getContentPagesByCategory as getStaticContentPagesByCategory,
  getAllContentPages as getAllStaticContentPages,
} from "@/lib/content/render";

// ─── DB loaders ─────────────────────────────────────────────────────────

async function fetchPublishedDbTrafficPages(): Promise<ContentPage[]> {
  try {
    const db = getDb();
    const rows = await db
      .select({ postData: blogDrafts.postData, publishedAt: blogDrafts.publishedAt })
      .from(blogDrafts)
      .where(and(eq(blogDrafts.kind, "traffic-page"), eq(blogDrafts.status, "published")));

    const pages: ContentPage[] = [];
    for (const r of rows) {
      const p = r.postData as unknown as ContentPage | null;
      if (!p) continue;
      pages.push({
        ...p,
        publishStatus: "published",
        ...(r.publishedAt ? { publishedAt: r.publishedAt.toISOString().split("T")[0] } : {}),
      });
    }
    return pages;
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "traffic-db:fetch_failed",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }
}

// ─── Public async helpers ──────────────────────────────────────────────

/**
 * Get a content page by canonical path. Checks static registry first, then
 * DB-published pages. Static wins on collision (existing content is the
 * source of truth if both exist).
 */
export async function getContentPageAsync(
  canonicalPath: string,
): Promise<ContentPage | null> {
  const staticPage = getStaticContentPage(canonicalPath);
  if (staticPage) return staticPage;

  const dbPages = await fetchPublishedDbTrafficPages();
  return dbPages.find((p) => p.canonicalPath === canonicalPath) ?? null;
}

/**
 * Get all content pages in a category, merged from static registry + DB.
 * Deduplicates by slug (static wins). Used by hub pages.
 */
export async function getContentPagesByCategoryAsync(
  category: ContentCategory | string,
): Promise<ContentPage[]> {
  const staticPages = getStaticContentPagesByCategory(category);
  const staticSlugs = new Set(staticPages.map((p) => p.slug));
  const dbPages = (await fetchPublishedDbTrafficPages()).filter(
    (p) => p.category === category && !staticSlugs.has(p.slug),
  );
  return [...staticPages, ...dbPages];
}

/**
 * Get every content page across all categories, merged static + DB.
 * Used by the sitemap.
 */
export async function getAllContentPagesAsync(): Promise<ContentPage[]> {
  const staticPages = getAllStaticContentPages();
  const staticByPath = new Set(staticPages.map((p) => p.canonicalPath));
  const dbPages = (await fetchPublishedDbTrafficPages()).filter(
    (p) => !staticByPath.has(p.canonicalPath),
  );
  return [...staticPages, ...dbPages];
}

/**
 * Slug list for generateStaticParams — covers both static and DB pages so
 * DB-published pages pre-render at build when possible.
 */
export async function generateStaticSlugsAsync(
  category: ContentCategory | string,
): Promise<string[]> {
  const pages = await getContentPagesByCategoryAsync(category);
  return pages.map((p) => p.slug);
}

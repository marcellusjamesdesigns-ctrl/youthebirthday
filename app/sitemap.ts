import type { MetadataRoute } from "next";
import { getAllContentPages } from "@/lib/content/render";
import { getPublishedBlogPosts } from "@/content/blog/_registry";

const BASE_URL = "https://youthebirthday.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentPages = getAllContentPages();
  const blogPosts = getPublishedBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date("2026-04-14"), changeFrequency: "weekly", priority: 1 },
    // Hub pages
    { url: `${BASE_URL}/birthday-captions`, lastModified: new Date("2026-04-12"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/birthday-ideas`, lastModified: new Date("2026-04-12"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/birthday-destinations`, lastModified: new Date("2026-04-12"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/birthday-palettes`, lastModified: new Date("2026-04-12"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/birthday-themes`, lastModified: new Date("2026-04-12"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/milestone-birthdays`, lastModified: new Date("2026-04-13"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/zodiac-birthdays`, lastModified: new Date("2026-04-12"), changeFrequency: "weekly", priority: 0.7 },
    // Blog hub
    { url: `${BASE_URL}/blog`, lastModified: new Date("2026-04-14"), changeFrequency: "daily", priority: 0.9 },
  ];

  const contentEntries: MetadataRoute.Sitemap = contentPages.map((page) => ({
    url: `${BASE_URL}${page.canonicalPath}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(page.publishedAt ?? "2026-04-12"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}${post.canonicalPath}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...contentEntries, ...blogEntries];
}

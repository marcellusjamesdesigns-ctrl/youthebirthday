import type { Metadata } from "next";
import { getAllPublishedBlogPosts } from "@/lib/blog-db";
import { BlogHubPage } from "@/components/blog/BlogHubPage";

export const metadata: Metadata = {
  title: "The Journal — Birthday Planning, Decor, Style & Ideas | You The Birthday",
  description:
    "Editorial notes on how to celebrate — decor guides, outfit ideas, seasonal birthday planning, and zodiac timing. From You The Birthday.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Journal | You The Birthday",
    description:
      "Editorial notes on birthday planning, decor, style, and seasonal celebration ideas.",
    url: "https://youthebirthday.app/blog",
    type: "website",
  },
};

// Revalidate every 10 minutes so new DB-published posts show up without a rebuild.
export const revalidate = 600;

export default async function BlogHub() {
  const posts = await getAllPublishedBlogPosts();
  return <BlogHubPage posts={posts} />;
}

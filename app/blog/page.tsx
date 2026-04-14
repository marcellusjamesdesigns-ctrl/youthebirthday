import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/content/blog/_registry";
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

export default function BlogHub() {
  const posts = getPublishedBlogPosts();
  return <BlogHubPage posts={posts} />;
}

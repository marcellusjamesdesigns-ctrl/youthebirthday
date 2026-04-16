import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticBlogPosts } from "@/content/blog/_registry";
import { getBlogPostBySlug, getRelatedBlogPostsAsync } from "@/lib/blog-db";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";

type PageProps = { params: Promise<{ slug: string }> };

// Static-generate golden examples at build. DB-backed posts resolve at runtime.
export async function generateStaticParams() {
  return getStaticBlogPosts().map((p) => ({ slug: p.slug }));
}

// Allow DB-backed posts (slugs unknown at build time) to render on demand.
export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.canonicalPath },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://youthebirthday.app${post.canonicalPath}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.ogImage ?? post.heroImage.src, alt: post.heroImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage ?? post.heroImage.src],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPostsAsync(slug, 2);
  return <BlogPostLayout post={post} related={related} />;
}

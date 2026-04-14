import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPost,
  getPublishedBlogPosts,
  getRelatedBlogPosts,
} from "@/content/blog/_registry";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPublishedBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
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
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(slug, 2);
  return <BlogPostLayout post={post} related={related} />;
}

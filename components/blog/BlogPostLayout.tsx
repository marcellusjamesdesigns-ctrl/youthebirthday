import Link from "next/link";
import { BlogSectionRenderer } from "./BlogSectionRenderer";
import { BlogRelatedPosts } from "./BlogRelatedPosts";
import { Breadcrumbs, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import type { BlogPost } from "@/lib/content/types";

interface BlogPostLayoutProps {
  post: BlogPost;
  related: BlogPost[];
}

const CATEGORY_LABELS: Record<string, string> = {
  planning: "Planning",
  style: "Style",
  seasonal: "Seasonal",
  gifts: "Gifts",
  milestones: "Milestones",
};

export function BlogPostLayout({ post, related }: BlogPostLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Journal", href: "/blog" },
    { label: post.headline, href: post.canonicalPath },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.headline,
    description: post.description,
    image: post.ogImage ?? post.heroImage.src,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: "You The Birthday" },
    publisher: {
      "@type": "Organization",
      name: "You The Birthday",
      logo: { "@type": "ImageObject", url: "https://youthebirthday.app/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://youthebirthday.app${post.canonicalPath}` },
  };

  return (
    <article className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-8 pb-20">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Meta row */}
        <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">
          <span className="text-champagne/60">{CATEGORY_LABELS[post.category]}</span>
          <span>·</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <div className="mt-10">
          <BlogSectionRenderer sections={post.sections} />
        </div>

        {/* Mid-article ad */}
        <AdUnit slot="2856419037" format="auto" className="my-12" />

        {/* Related posts */}
        {related.length > 0 && <BlogRelatedPosts posts={related} />}

        {/* Back to hub */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="text-[11px] uppercase tracking-[0.25em] text-champagne/60 hover:text-champagne/90 transition-colors"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </article>
  );
}

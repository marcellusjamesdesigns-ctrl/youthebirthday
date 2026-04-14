import Link from "next/link";
import { BlogSectionRenderer } from "./BlogSectionRenderer";
import { BlogRelatedPosts } from "./BlogRelatedPosts";
import { BlogEmailCapture } from "./BlogEmailCapture";
import { BlogShareRow } from "./BlogShareRow";
import { Breadcrumbs, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import AdUnit from "@/components/AdUnit";
import { computeReadingTimeMinutes } from "@/lib/content/reading-time";
import type { BlogPost, FAQSection } from "@/lib/content/types";

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

const SITE_URL = "https://youthebirthday.app";

export function BlogPostLayout({ post, related }: BlogPostLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Journal", href: "/blog" },
    { label: post.headline, href: post.canonicalPath },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const readingTime = post.readingTimeMinutes ?? computeReadingTimeMinutes(post.sections);

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
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${post.canonicalPath}` },
  };

  // Build FAQPage schema from any FAQ sections in the post
  const faqSections = post.sections.filter(
    (s): s is FAQSection => s.type === "faq",
  );
  const faqSchema =
    faqSections.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSections.flatMap((s) =>
            s.questions.map((q) => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: q.answer,
              },
            })),
          ),
        }
      : null;

  const postUrl = `${SITE_URL}${post.canonicalPath}`;

  return (
    <article className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-8 pb-20">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">
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
          <span>{readingTime} min read</span>
          {post.author && (
            <>
              <span>·</span>
              <span className="text-muted-foreground/70">By {post.author.name}</span>
            </>
          )}
        </div>

        {/* Share row — top */}
        <div className="mt-4">
          <BlogShareRow
            title={post.title}
            url={postUrl}
            pinterestImage={post.pinterestImage?.src ?? post.heroImage.src}
            description={post.description}
          />
        </div>

        <div className="mt-8">
          <BlogSectionRenderer sections={post.sections} />
        </div>

        {/* Share row — bottom */}
        <div className="mt-10 pt-6 border-t border-border/15">
          <BlogShareRow
            title={post.title}
            url={postUrl}
            pinterestImage={post.pinterestImage?.src ?? post.heroImage.src}
            description={post.description}
          />
        </div>

        {/* Email capture */}
        <BlogEmailCapture source={post.slug} />

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </article>
  );
}

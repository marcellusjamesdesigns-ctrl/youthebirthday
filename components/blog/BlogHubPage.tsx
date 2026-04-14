import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/content/types";
import { Breadcrumbs, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";

interface BlogHubPageProps {
  posts: BlogPost[];
}

const CATEGORY_LABELS: Record<string, string> = {
  planning: "Planning",
  style: "Style",
  seasonal: "Seasonal",
  gifts: "Gifts",
  milestones: "Milestones",
};

export function BlogHubPage({ posts }: BlogHubPageProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Journal", href: "/blog" },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const [feature, ...rest] = posts;

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-5xl px-6 py-8 pb-24">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <header className="py-12 sm:py-16 text-center space-y-4 animate-fade-rise">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
            The Journal
          </p>
          <h1 className="heading-editorial text-4xl sm:text-5xl">
            Birthday planning, decor, style & ideas
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed">
            Editorial notes on how to celebrate — from decor and outfits to
            seasonal planning, zodiac timing, and the small details that
            actually land.
          </p>
        </header>

        {/* Featured post */}
        {feature && (
          <Link
            href={feature.canonicalPath}
            className="group block mt-4 mb-14 rounded-2xl overflow-hidden bg-card/40 hover:bg-card/60 transition-colors"
          >
            <div className="grid sm:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[340px] bg-card">
                <Image
                  src={feature.heroImage.src}
                  alt={feature.heroImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  priority
                  unoptimized
                />
              </div>
              <div className="p-8 sm:p-10 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]">
                  <span className="text-champagne/70">{CATEGORY_LABELS[feature.category]}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-muted-foreground/50">{feature.readingTimeMinutes} min read</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
                  {feature.headline}
                </h2>
                <p className="text-sm text-muted-foreground/75 leading-relaxed">
                  {feature.excerpt}
                </p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-champagne/60 pt-1">
                  Read the piece →
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Rest of the posts — 2 column grid */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={post.canonicalPath}
                className="group block rounded-xl overflow-hidden bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="relative aspect-[16/10] bg-card">
                  <Image
                    src={post.heroImage.src}
                    alt={post.heroImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    unoptimized
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-champagne/60">{CATEGORY_LABELS[post.category]}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-muted-foreground/40">{post.readingTimeMinutes} min</span>
                  </div>
                  <h3 className="font-editorial text-lg text-foreground/85 leading-snug group-hover:text-foreground transition-colors">
                    {post.headline}
                  </h3>
                  <p className="text-[12px] text-muted-foreground/60 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Final CTA */}
        <div className="mt-16 text-center space-y-3">
          <p className="text-sm text-muted-foreground/60">
            Ready to plan your own?
          </p>
          <Link href="/onboarding" className="glow-btn">
            Generate My Birthday
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}

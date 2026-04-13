import Link from "next/link";
import { CTABlock } from "./sections/CTABlock";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "./Breadcrumbs";
import type { ContentPage } from "@/lib/content/types";

interface HubPageProps {
  title: string;
  description: string;
  pages: ContentPage[];
  category?: string;
}

export function HubPage({ title, description, pages, category }: HubPageProps) {
  const breadcrumbItems = category ? breadcrumbsForHub(category) : [{ label: "Home", href: "/" }, { label: title, href: "#" }];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-8 pb-20 space-y-10">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="py-12 sm:py-16 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60 animate-fade-rise">
            you the birthday
          </p>
          <h1 className="heading-editorial text-4xl sm:text-5xl animate-fade-rise stagger-1">
            {title}
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            {description}
          </p>
        </div>

        <div className="space-y-3">
          {pages.map((page, i) => (
            <Link
              key={page.canonicalPath}
              href={page.canonicalPath}
              className={`block luxury-card p-6 space-y-2 hover:border-foreground/15 transition-all animate-fade-rise stagger-${Math.min(i + 1, 8)}`}
            >
              <h2 className="font-editorial text-lg text-foreground">{page.headline}</h2>
              {page.subheadline && (
                <p className="text-sm text-muted-foreground">
                  {page.subheadline}
                </p>
              )}
              <div className="flex gap-2">
                {page.tags.age && (
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40">
                    Age {page.tags.age}
                  </span>
                )}
                {page.tags.zodiac && (
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40">
                    {page.tags.zodiac}
                  </span>
                )}
                {page.tags.vibe && (
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40">
                    {page.tags.vibe}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <CTABlock />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}

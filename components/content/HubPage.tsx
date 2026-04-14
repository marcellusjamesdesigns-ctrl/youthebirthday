import Link from "next/link";
import { CTABlock } from "./sections/CTABlock";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "./Breadcrumbs";
import type { ContentPage } from "@/lib/content/types";
import { HubCards } from "./HubCards";
import AdUnit from "@/components/AdUnit";

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
      <div className="mx-auto max-w-4xl px-6 py-8 pb-20 space-y-10">
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

        <HubCards pages={pages} />

        {/* Ad: between content cards and CTA */}
        <AdUnit slot="2856419037" format="auto" className="my-6" />

        <CTABlock />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}

import type { ContentPage } from "@/lib/content/types";
import { SectionRenderer } from "./SectionRenderer";
import { generateSchemaMarkup, generateFAQSchema } from "@/lib/content/render";
import { Breadcrumbs, breadcrumbsForPage, generateBreadcrumbSchema } from "./Breadcrumbs";

interface ContentPageLayoutProps {
  page: ContentPage;
}

export function ContentPageLayout({ page }: ContentPageLayoutProps) {
  const schema = generateSchemaMarkup(page);
  const faqSchema = generateFAQSchema(page);
  const breadcrumbItems = breadcrumbsForPage(page.category, page.headline);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <article className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-8 pb-20">
        <Breadcrumbs items={breadcrumbItems} />
        <SectionRenderer sections={page.sections} page={page} />
      </div>

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
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

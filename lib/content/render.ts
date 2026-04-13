import { ensureRegistry, getPage, getPagesByCategory, getAllPages } from "./registry";
import type { ContentPage } from "./types";

export function getContentPage(canonicalPath: string): ContentPage | null {
  ensureRegistry();
  return getPage(canonicalPath) ?? null;
}

export function getContentPagesByCategory(category: string): ContentPage[] {
  ensureRegistry();
  return getPagesByCategory(category);
}

export function getAllContentPages(): ContentPage[] {
  ensureRegistry();
  return getAllPages();
}

export function generateContentMetadata(page: ContentPage) {
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article" as const,
      url: `https://youthebirthday.app${page.canonicalPath}`,
      ...(page.ogImage && { images: [{ url: page.ogImage }] }),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.title,
      description: page.description,
    },
    alternates: {
      canonical: page.canonicalPath,
    },
  };
}

export function generateSchemaMarkup(page: ContentPage): object | null {
  if (!page.schemaType) return null;

  const base = {
    "@context": "https://schema.org",
    name: page.headline,
    description: page.description,
    url: `https://youthebirthday.app${page.canonicalPath}`,
    ...(page.publishedAt && { datePublished: page.publishedAt }),
    ...(page.updatedAt && { dateModified: page.updatedAt }),
    publisher: {
      "@type": "Organization",
      name: "You The Birthday",
      url: "https://youthebirthday.app",
    },
  };

  switch (page.schemaType) {
    case "Article":
      return { ...base, "@type": "Article" };
    case "ItemList": {
      const items: object[] = [];
      for (const section of page.sections) {
        if (section.type === "caption-list") {
          let position = 1;
          for (const cat of section.categories) {
            for (const caption of cat.captions) {
              items.push({
                "@type": "ListItem",
                position: position++,
                name: caption,
              });
            }
          }
        }
        if (section.type === "idea-list") {
          section.ideas.forEach((idea, i) => {
            items.push({
              "@type": "ListItem",
              position: i + 1,
              name: idea.title,
              description: idea.description,
            });
          });
        }
        if (section.type === "destination-list") {
          section.destinations.forEach((dest, i) => {
            items.push({
              "@type": "ListItem",
              position: i + 1,
              name: `${dest.city}, ${dest.country}`,
              description: dest.description,
            });
          });
        }
      }
      return { ...base, "@type": "ItemList", itemListElement: items };
    }
    case "HowTo":
      return { ...base, "@type": "HowTo" };
    default:
      return null;
  }
}

export function generateFAQSchema(page: ContentPage): object | null {
  const faqSections = page.sections.filter((s) => s.type === "faq");
  if (faqSections.length === 0) return null;

  const questions: object[] = [];
  for (const section of faqSections) {
    if (section.type === "faq") {
      for (const q of section.questions) {
        questions.push({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        });
      }
    }
  }

  if (questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions,
  };
}

export function generateStaticSlugs(category: string): string[] {
  ensureRegistry();
  return getPagesByCategory(category).map((p) => p.slug);
}

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const categoryLabels: Record<string, string> = {
  captions: "Birthday Captions",
  ideas: "Birthday Ideas",
  destinations: "Birthday Destinations",
  palettes: "Color Palettes",
  themes: "Birthday Themes",
  zodiac: "Zodiac Birthdays",
};

const categoryHrefs: Record<string, string> = {
  captions: "/birthday-captions",
  ideas: "/birthday-ideas",
  destinations: "/birthday-destinations",
  palettes: "/birthday-palettes",
  themes: "/birthday-themes",
  zodiac: "/zodiac-birthdays",
};

export function breadcrumbsForPage(category: string, pageTitle: string): BreadcrumbItem[] {
  return [
    { label: "Home", href: "/" },
    { label: categoryLabels[category] ?? category, href: categoryHrefs[category] ?? "/" },
    { label: pageTitle, href: "#" },
  ];
}

export function breadcrumbsForHub(category: string): BreadcrumbItem[] {
  return [
    { label: "Home", href: "/" },
    { label: categoryLabels[category] ?? category, href: "#" },
  ];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-[11px] text-muted-foreground/65">
        {items.map((item, i) => (
          <li key={item.href + i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/25">/</span>}
            {i < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-foreground/60 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-muted-foreground/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href !== "#" && {
        item: `https://youthebirthday.app${item.href}`,
      }),
    })),
  };
}

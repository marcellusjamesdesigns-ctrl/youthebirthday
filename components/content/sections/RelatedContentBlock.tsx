import Link from "next/link";
import { getRelatedPages, ensureRegistry } from "@/lib/content/registry";
import type { ContentPage } from "@/lib/content/types";

interface RelatedContentBlockProps {
  page: ContentPage;
}

export function RelatedContentBlock({ page }: RelatedContentBlockProps) {
  ensureRegistry();
  const related = getRelatedPages(page, 4);

  if (related.length === 0) return null;

  return (
    <section className="space-y-5">
      <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
        Related Birthday Content
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((r) => (
          <Link
            key={r.canonicalPath}
            href={r.canonicalPath}
            className="lift-card p-5 space-y-2"
          >
            <p className="text-sm font-medium text-foreground/80 leading-tight">
              {r.headline}
            </p>
            <div className="flex gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">
                {r.category}
              </span>
              {r.tags.age && (
                <span className="text-[10px] text-muted-foreground/50">
                  · {r.tags.age}th
                </span>
              )}
              {r.tags.zodiac && (
                <span className="text-[10px] text-muted-foreground/50">
                  · {r.tags.zodiac}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * QuickTakeBlock — skimmer skeleton for theme/idea pages.
 *
 * Appears after the thesis paragraph. Gives a 4-6 row summary of
 * the key facts (best for / works best / budget / dress code /
 * avoid) so users can decide in 5 seconds whether this theme fits them.
 *
 * Also great for featured-snippet eligibility — Google rewards
 * structured key:value content.
 */

export interface QuickTakeRow {
  label: string;
  value: string;
}

interface QuickTakeBlockProps {
  heading?: string;
  rows: QuickTakeRow[];
}

export function QuickTakeBlock({
  heading = "Quick Take",
  rows,
}: QuickTakeBlockProps) {
  return (
    <aside
      aria-label={heading}
      className="beam-card px-6 py-6 sm:px-8 sm:py-7 space-y-4"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/60">
        {heading}
      </p>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
        {rows.map((row, i) => (
          <div
            key={i}
            className="contents"
          >
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 sm:pt-0.5 sm:min-w-[110px]">
              {row.label}
            </dt>
            <dd className="text-[14px] text-foreground/80 leading-relaxed">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

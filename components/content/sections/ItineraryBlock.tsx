/**
 * ItineraryBlock — sample multi-day trip schedule for city pages.
 *
 * Renders a vertical timeline of days, with optional theme tags and
 * timed/untimed activities per day. Follows the editorial voice of the
 * destinations cluster: short labels, one-sentence editorial color.
 */

import type { ItinerarySection } from "@/lib/content/types";

type ItineraryBlockProps = Omit<ItinerarySection, "type">;

export function ItineraryBlock({
  heading,
  subheading,
  days,
}: ItineraryBlockProps) {
  return (
    <section aria-label={heading} className="space-y-5">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/60">
          Itinerary
        </p>
        <h2 className="heading-editorial text-xl sm:text-2xl">{heading}</h2>
        {subheading && (
          <p className="text-[13px] text-muted-foreground/75 leading-relaxed">
            {subheading}
          </p>
        )}
      </div>

      <ol className="space-y-4">
        {days.map((day, i) => (
          <li
            key={i}
            className="lift-card p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-mono tracking-wider text-champagne/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-editorial text-base sm:text-lg text-foreground/90 leading-snug">
                  {day.title}
                </h3>
              </div>
              {day.theme && (
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/65 border border-border/40 rounded-full px-2.5 py-0.5">
                  {day.theme}
                </span>
              )}
            </div>

            <ul className="space-y-2.5 pl-1">
              {day.activities.map((a, j) => (
                <li
                  key={j}
                  className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] gap-3 items-baseline"
                >
                  <span className="text-[10px] uppercase tracking-[0.15em] text-champagne/55 font-mono">
                    {a.time ?? ""}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-[13px] text-foreground/85">{a.label}</p>
                    {a.description && (
                      <p className="text-[12px] text-muted-foreground/70 leading-relaxed">
                        {a.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

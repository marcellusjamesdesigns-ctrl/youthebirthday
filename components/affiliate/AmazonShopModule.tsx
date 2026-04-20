"use client";

import { useCallback } from "react";
import { affiliateUrls } from "@/lib/affiliate/config";

/**
 * An editorial, non-spammy Amazon product recommendation module.
 *
 * Renders as a curated grid of shoppable items. Links go to Amazon search
 * results with our affiliate tag — no specific ASINs needed (safer, no
 * broken-link risk, no hallucinated products).
 */

export interface AmazonShopItem {
  /** Search query sent to Amazon (e.g. "linen tablecloth neutral") */
  query: string;
  /** Display name shown to the user */
  label: string;
  /** Optional one-line description */
  description?: string;
  /** Optional emoji or symbol for visual variety */
  icon?: string;
}

interface AmazonShopModuleProps {
  /** Section title — e.g. "Set the Soft Life Mood" */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Products to recommend (3-6 works best) */
  items: AmazonShopItem[];
  /** Placement context for analytics */
  placement: string;
  /** Visual format — grid is the default, list is more subtle */
  format?: "grid" | "list" | "checklist";
}

export function AmazonShopModule({
  title,
  subtitle,
  items,
  placement,
  format = "grid",
}: AmazonShopModuleProps) {
  const trackClick = useCallback(
    (item: AmazonShopItem) => {
      if (typeof window !== "undefined" && "posthog" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).posthog?.capture("affiliate_clicked", {
          provider: "amazon",
          placement,
          query: item.query,
          label: item.label,
        });
      }
    },
    [placement]
  );

  return (
    <section
      className="space-y-5 pt-6 border-t border-border/25"
      aria-label={title}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-champagne/60">
            {title}
          </p>
          {subtitle && (
            <p className="text-[12px] text-muted-foreground/60 mt-1.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {format === "grid" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AmazonItemCard
              key={item.query}
              item={item}
              onClick={() => trackClick(item)}
            />
          ))}
        </div>
      )}

      {format === "list" && (
        <div className="space-y-2">
          {items.map((item) => (
            <AmazonItemRow
              key={item.query}
              item={item}
              onClick={() => trackClick(item)}
            />
          ))}
        </div>
      )}

      {format === "checklist" && (
        <div className="space-y-1.5">
          {items.map((item) => (
            <AmazonChecklistItem
              key={item.query}
              item={item}
              onClick={() => trackClick(item)}
            />
          ))}
        </div>
      )}

      <p className="text-[11px] not-italic text-muted-foreground/65 leading-relaxed">
        As an Amazon Associate we earn from qualifying purchases. Prices and
        availability may vary.
      </p>
    </section>
  );
}

/* ── Card variants ────────────────────────────────────────────────────── */

function AmazonItemCard({
  item,
  onClick,
}: {
  item: AmazonShopItem;
  onClick: () => void;
}) {
  return (
    <a
      href={affiliateUrls.amazon(item.query)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={onClick}
      className="lift-card p-4 space-y-2 group bg-foreground/[0.015]"
    >
      <div className="flex items-start gap-2.5">
        {item.icon && (
          <span className="text-base opacity-50 group-hover:opacity-80 transition-opacity">
            {item.icon}
          </span>
        )}
        <p className="text-sm font-medium text-foreground/85 leading-tight">
          {item.label}
        </p>
      </div>
      {item.description && (
        <p className="text-[12px] text-muted-foreground/55 leading-relaxed">
          {item.description}
        </p>
      )}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] uppercase tracking-[0.15em] text-champagne/55 group-hover:text-champagne/80 transition-colors">
          Shop on Amazon
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="text-champagne/50 group-hover:translate-x-0.5 transition-transform"
        >
          <path
            d="M2 8l6-6M3 2h5v5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </a>
  );
}

function AmazonItemRow({
  item,
  onClick,
}: {
  item: AmazonShopItem;
  onClick: () => void;
}) {
  return (
    <a
      href={affiliateUrls.amazon(item.query)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={onClick}
      className="lift-card p-3.5 flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.icon && (
          <span className="text-sm opacity-50 shrink-0">{item.icon}</span>
        )}
        <div className="min-w-0">
          <p className="text-sm text-foreground/85 truncate">{item.label}</p>
          {item.description && (
            <p className="text-[11px] text-muted-foreground/50 truncate">
              {item.description}
            </p>
          )}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.15em] text-champagne/55 group-hover:text-champagne/80 transition-colors shrink-0">
        Shop →
      </span>
    </a>
  );
}

function AmazonChecklistItem({
  item,
  onClick,
}: {
  item: AmazonShopItem;
  onClick: () => void;
}) {
  return (
    <a
      href={affiliateUrls.amazon(item.query)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={onClick}
      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-foreground/[0.03] transition-colors group"
    >
      <span className="w-4 h-4 rounded border border-champagne/30 group-hover:border-champagne/60 transition-colors shrink-0" />
      <span className="text-sm text-foreground/75 group-hover:text-foreground/95 transition-colors flex-1">
        {item.label}
      </span>
      <span className="text-[10px] uppercase tracking-[0.15em] text-champagne/40 group-hover:text-champagne/70 transition-colors">
        Shop
      </span>
    </a>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentPage } from "@/lib/content/types";

type ThemeGroup = {
  id: string;
  label: string;
  intro: string;
  themes: string[]; // slugs
  comingSoon?: string[];
};

type TabId = "vibe" | "season" | "color" | "budget" | "occasion";

interface ThemeFinderProps {
  themeLookup: Record<string, ContentPage>;
  byVibe: ThemeGroup[];
  bySeason: ThemeGroup[];
  byColor: ThemeGroup[];
  byBudget: ThemeGroup[];
  byOccasion: ThemeGroup[];
}

const TABS: { id: TabId; label: string; intro: string }[] = [
  { id: "vibe", label: "By Vibe", intro: "The fastest way to pick: what energy do you want the night to have?" },
  { id: "season", label: "By Season", intro: "Themes that actually work for the time of year you're celebrating." },
  { id: "color", label: "By Color", intro: "If you already know your palette, start here." },
  { id: "budget", label: "By Budget", intro: "Some themes work anywhere. Others need real investment." },
  { id: "occasion", label: "By Occasion", intro: "Different formats, different themes." },
];

function ThemeCard({ page }: { page: ContentPage }) {
  return (
    <Link href={page.canonicalPath} className="lift-card p-6 space-y-3 block group">
      <h3 className="font-editorial text-xl text-foreground group-hover:text-champagne transition-colors">
        {page.headline}
      </h3>
      <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
        {page.subheadline}
      </p>
      {(page.tags.vibe || page.tags.zodiac) && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {page.tags.vibe && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 border border-border/40 rounded-full px-2 py-0.5">
              {page.tags.vibe}
            </span>
          )}
          {page.tags.zodiac && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 border border-border/40 rounded-full px-2 py-0.5">
              {page.tags.zodiac}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function GroupPanel({
  group,
  themeLookup,
}: {
  group: ThemeGroup;
  themeLookup: Record<string, ContentPage>;
}) {
  const themes = group.themes
    .map((slug) => themeLookup[slug])
    .filter(Boolean);

  if (themes.length === 0 && (!group.comingSoon || group.comingSoon.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-editorial text-lg sm:text-xl text-foreground">
          {group.label}
        </h3>
        <p className="text-[13px] text-muted-foreground/65 mt-1">{group.intro}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((t) => (
          <ThemeCard key={t.canonicalPath} page={t} />
        ))}
      </div>
      {group.comingSoon && group.comingSoon.length > 0 && (
        <p className="text-[12px] text-muted-foreground/70 pt-1 leading-relaxed">
          <span className="uppercase tracking-[0.2em] text-champagne/75 mr-2 text-[10px] font-medium">
            Coming soon
          </span>
          {group.comingSoon.join(" · ")}
        </p>
      )}
    </div>
  );
}

export function ThemeFinder({
  themeLookup,
  byVibe,
  bySeason,
  byColor,
  byBudget,
  byOccasion,
}: ThemeFinderProps) {
  const [activeTab, setActiveTab] = useState<TabId>("vibe");

  const groupsByTab: Record<TabId, ThemeGroup[]> = {
    vibe: byVibe,
    season: bySeason,
    color: byColor,
    budget: byBudget,
    occasion: byOccasion,
  };

  const activeTabMeta = TABS.find((t) => t.id === activeTab)!;
  const activeGroups = groupsByTab[activeTab];

  return (
    <section className="space-y-8">
      {/* Tab pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.15em] transition-all ${
                isActive
                  ? "border-champagne/50 bg-champagne/15 text-champagne"
                  : "border-border/50 bg-transparent text-muted-foreground/70 hover:border-champagne/30 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="space-y-10 animate-fade-rise" key={activeTab}>
        <div className="text-center space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
            {activeTabMeta.label}
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto">
            {activeTabMeta.intro}
          </p>
        </div>

        {activeGroups.map((group) => (
          <GroupPanel key={group.id} group={group} themeLookup={themeLookup} />
        ))}

        {activeTab === "color" && (
          <div className="text-center pt-2">
            <Link
              href="/birthday-palettes"
              className="text-[12px] uppercase tracking-[0.2em] text-champagne/50 hover:text-champagne transition-colors"
            >
              Browse all color palettes →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

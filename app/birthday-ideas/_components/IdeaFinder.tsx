"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentPage } from "@/lib/content/types";

export type IdeaGroup = {
  id: string;
  label: string;
  intro: string;
  ideas: string[]; // slugs or canonical paths
  comingSoon?: string[];
};

type TabId = "format" | "age" | "vibe" | "budget" | "who";

interface IdeaFinderProps {
  ideaLookup: Record<string, ContentPage>;
  byFormat: IdeaGroup[];
  byAge: IdeaGroup[];
  byVibe: IdeaGroup[];
  byBudget: IdeaGroup[];
  byWho: IdeaGroup[];
}

const TABS: { id: TabId; label: string; intro: string }[] = [
  { id: "format", label: "By Format", intro: "The fastest way to pick: how do you want to celebrate?" },
  { id: "age", label: "By Age", intro: "Different birthdays want different energy. Start with the milestone." },
  { id: "vibe", label: "By Vibe", intro: "The feeling comes first — the format can follow." },
  { id: "budget", label: "By Budget", intro: "Great birthdays work at every price point. Start with yours." },
  { id: "who", label: "By Who", intro: "Planning for someone else? Start with who they are." },
];

function IdeaCard({ page }: { page: ContentPage }) {
  return (
    <Link href={page.canonicalPath} className="lift-card p-6 space-y-3 block group">
      <h3 className="font-editorial text-xl text-foreground group-hover:text-champagne transition-colors">
        {page.headline}
      </h3>
      <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
        {page.subheadline ?? page.description}
      </p>
      {(page.tags.vibe || page.tags.celebrationType) && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {page.tags.vibe && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 border border-border/40 rounded-full px-2 py-0.5">
              {page.tags.vibe}
            </span>
          )}
          {page.tags.celebrationType && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 border border-border/40 rounded-full px-2 py-0.5">
              {page.tags.celebrationType}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function GroupPanel({
  group,
  ideaLookup,
}: {
  group: IdeaGroup;
  ideaLookup: Record<string, ContentPage>;
}) {
  const ideas = group.ideas
    .map((slug) => ideaLookup[slug])
    .filter(Boolean);

  if (ideas.length === 0 && (!group.comingSoon || group.comingSoon.length === 0)) {
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
      {ideas.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((t) => (
            <IdeaCard key={t.canonicalPath} page={t} />
          ))}
        </div>
      )}
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

export function IdeaFinder({
  ideaLookup,
  byFormat,
  byAge,
  byVibe,
  byBudget,
  byWho,
}: IdeaFinderProps) {
  const [activeTab, setActiveTab] = useState<TabId>("format");

  const groupsByTab: Record<TabId, IdeaGroup[]> = {
    format: byFormat,
    age: byAge,
    vibe: byVibe,
    budget: byBudget,
    who: byWho,
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
          <GroupPanel key={group.id} group={group} ideaLookup={ideaLookup} />
        ))}
      </div>
    </section>
  );
}

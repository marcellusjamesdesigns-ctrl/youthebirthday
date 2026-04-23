/**
 * Traffic-page quality gates — leaner than the blog gates.
 *
 * Blog gates enforce pull-quote / mid-article-cta / amazon-shop — none of
 * those apply to category content pages, which have a programmatic shape
 * driven by the seed's requiredSections.
 *
 * These gates are additive to the seed-driven structural requirement
 * (already enforced at generation time by the schema + sectionRenderer).
 */
import type { ContentPage } from "@/lib/content/types";
import type { GateReport, GateResult } from "./quality-gates";
import type { TrafficSeed } from "./traffic-seeds";

export function runTrafficQualityGates(
  page: ContentPage,
  seed: TrafficSeed,
  existingSlugsInCategory: Set<string>,
): GateReport {
  const results: GateResult[] = [];

  // 1. Slug matches seed exactly (never trust the model to respect this).
  results.push({
    gate: "slug-matches-seed",
    passed: page.slug === seed.slug,
    details: page.slug === seed.slug ? `Slug "${page.slug}" matches seed.` : `Slug "${page.slug}" ≠ seed "${seed.slug}".`,
  });

  // 2. Slug unique within the category.
  results.push({
    gate: "slug-unique-in-category",
    passed: !existingSlugsInCategory.has(page.slug),
    details: existingSlugsInCategory.has(page.slug) ? `Slug "${page.slug}" already exists.` : `Slug "${page.slug}" is unique.`,
  });

  // 3. Title diverges from the seed's titleHint (model reworked it).
  const titleMatchesHint = page.title.trim().toLowerCase() === seed.titleHint.trim().toLowerCase();
  results.push({
    gate: "title-hint-divergence",
    passed: !titleMatchesHint,
    details: titleMatchesHint ? `Title matches titleHint verbatim — rework.` : `Title diverges from titleHint.`,
  });

  // 4. Title ≠ headline.
  const titleEqualsHeadline = page.title.trim().toLowerCase() === page.headline.trim().toLowerCase();
  results.push({
    gate: "title-headline-divergence",
    passed: !titleEqualsHeadline,
    details: titleEqualsHeadline ? `Title and headline are identical.` : `Title ≠ headline.`,
  });

  // 5. Description present, 80–170 chars.
  const descLen = page.description?.length ?? 0;
  results.push({
    gate: "description-length",
    passed: descLen >= 80 && descLen <= 170,
    details: `Meta description is ${descLen} chars. Required: 80–170.`,
  });

  // 6. All required sections present, in order.
  const presentTypes = page.sections.map((s) => s.type);
  const requiredOrderSatisfied = requiredInOrder(presentTypes, seed.requiredSections);
  const missing = seed.requiredSections.filter((t) => !presentTypes.includes(t));
  results.push({
    gate: "required-sections-present-in-order",
    passed: missing.length === 0 && requiredOrderSatisfied,
    details: missing.length
      ? `Missing required section type(s): ${missing.join(", ")}.`
      : requiredOrderSatisfied
        ? `All required sections present in order.`
        : `Required sections present but out of order.`,
  });

  // 7. Category-specific content-density gates.
  const catGate = categoryDensityGate(page, seed);
  if (catGate) results.push(catGate);

  // 8. At least some tag field populated (for related-content surfacing).
  const tagValues = Object.values(page.tags ?? {}).filter((v) => v !== undefined && v !== null && v !== "");
  results.push({
    gate: "tag-coverage",
    passed: tagValues.length >= 1,
    details: `${tagValues.length} tag field(s) populated. Required: 1+.`,
  });

  // 9. Canonical path shape.
  const expectedPrefix = `/${seed.category === "zodiac" ? "zodiac-birthdays" : `birthday-${seed.category}`}/`;
  results.push({
    gate: "canonical-path-shape",
    passed: page.canonicalPath === `${expectedPrefix}${page.slug}`,
    details: `canonicalPath="${page.canonicalPath}". Expected "${expectedPrefix}${page.slug}".`,
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    results,
    passed,
    total: results.length,
    allPassed: passed === results.length,
  };
}

function requiredInOrder(present: string[], required: string[]): boolean {
  let idx = 0;
  for (const type of present) {
    if (idx < required.length && type === required[idx]) idx++;
  }
  return idx === required.length;
}

function categoryDensityGate(page: ContentPage, seed: TrafficSeed): GateResult | null {
  // Find section of expected type and check counts.
  const find = <T extends { type: string }>(t: string) => page.sections.find((s) => s.type === t) as T | undefined;

  if (seed.category === "captions") {
    const s = find<{ type: "caption-list"; categories: Array<{ name: string; captions: string[] }> }>("caption-list");
    if (!s) return { gate: "caption-density", passed: false, details: `caption-list section missing.` };
    const totalCaptions = s.categories.reduce((a, c) => a + (Array.isArray(c.captions) ? c.captions.length : 0), 0);
    return {
      gate: "caption-density",
      passed: s.categories.length >= 3 && totalCaptions >= 15,
      details: `${s.categories.length} mood categories, ${totalCaptions} captions total. Required: 3+ moods, 15+ captions.`,
    };
  }

  if (seed.category === "ideas") {
    const s = find<{ type: "idea-list"; ideas: Array<unknown> }>("idea-list");
    if (!s) return { gate: "idea-density", passed: false, details: `idea-list missing.` };
    return {
      gate: "idea-density",
      passed: s.ideas.length >= 8,
      details: `${s.ideas.length} ideas. Required: 8+.`,
    };
  }

  if (seed.category === "destinations") {
    // Category pages require a dense destination-list. City pages require a
    // dense itinerary. Route on the seed's requiredSections.
    if (seed.requiredSections.includes("destination-list")) {
      const s = find<{ type: "destination-list"; destinations: Array<unknown> }>("destination-list");
      if (!s) return { gate: "destination-density", passed: false, details: `destination-list missing.` };
      return {
        gate: "destination-density",
        passed: s.destinations.length >= 8,
        details: `${s.destinations.length} destinations. Required: 8+.`,
      };
    }
    if (seed.requiredSections.includes("itinerary")) {
      const s = find<{ type: "itinerary"; days: Array<{ activities: Array<unknown> }> }>("itinerary");
      if (!s) return { gate: "itinerary-density", passed: false, details: `itinerary section missing.` };
      const minActivities = s.days.every((d) => d.activities.length >= 3);
      return {
        gate: "itinerary-density",
        passed: s.days.length >= 3 && minActivities,
        details: `${s.days.length} days, each with 3+ activities? ${minActivities}. Required: 3+ days, 3+ activities/day.`,
      };
    }
    return null;
  }

  if (seed.category === "palettes") {
    const s = find<{ type: "palette-showcase"; palettes: Array<{ colors: Array<{ hex: string }> }> }>("palette-showcase");
    if (!s) return { gate: "palette-density", passed: false, details: `palette-showcase missing.` };
    const hexOk = s.palettes.every((p) => p.colors.length === 5 && p.colors.every((c) => /^#[0-9a-fA-F]{6}$/.test(c.hex)));
    return {
      gate: "palette-density",
      passed: s.palettes.length >= 3 && hexOk,
      details: `${s.palettes.length} palettes. All 5 colors with 6-digit hex? ${hexOk}.`,
    };
  }

  if (seed.category === "themes") {
    const s = find<{ type: "palette-showcase"; palettes: Array<unknown> }>("palette-showcase");
    return {
      gate: "theme-has-palette",
      passed: !!s,
      details: s ? `Theme includes a palette-showcase.` : `Theme missing palette-showcase.`,
    };
  }

  return null;
}

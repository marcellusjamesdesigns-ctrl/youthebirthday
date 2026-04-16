import type { CleanBlogDraft } from "./schemas";

export interface GateResult {
  gate: string;
  passed: boolean;
  details: string;
}

export interface GateReport {
  results: GateResult[];
  passed: number;
  total: number;
  allPassed: boolean;
}

/**
 * Validate a cleaned draft against all 15 quality gates.
 *
 * Gates 1–12: structural / content checks (original polish sprint).
 * Gates 13–15: editorial divergence + taxonomy coverage (tightening sprint).
 *
 * Drafts that fail gates are still saved to the review queue with failure
 * details — the reviewer decides next steps.
 *
 * @param seedTitleHint — the seed's original titleHint, used to enforce
 *   divergence (agent must rework it, not copy it verbatim).
 */
export function runQualityGates(
  draft: CleanBlogDraft,
  existingSlugs: Set<string>,
  existingTitles: string[],
  seedTitleHint?: string,
): GateReport {
  const results: GateResult[] = [];

  const byType = (t: string) => draft.sections.filter((s) => s.type === t);
  const countByType = (t: string) => byType(t).length;

  // 1. Hero section — exactly one
  const heroCount = countByType("hero");
  results.push({
    gate: "hero-section",
    passed: heroCount === 1,
    details: `Found ${heroCount} hero section(s). Required: 1.`,
  });

  // 2. Image density — at least 2
  const imageCount = countByType("image");
  results.push({
    gate: "image-density",
    passed: imageCount >= 2,
    details: `Found ${imageCount} image section(s). Required: 2+.`,
  });

  // 3. Pull quote — at least 1
  const pullQuoteCount = countByType("pull-quote");
  results.push({
    gate: "pull-quote",
    passed: pullQuoteCount >= 1,
    details: `Found ${pullQuoteCount} pull-quote(s). Required: 1+.`,
  });

  // 4. Mid-article CTA — at least 1
  const midCTACount = countByType("mid-article-cta");
  results.push({
    gate: "mid-article-cta",
    passed: midCTACount >= 1,
    details: `Found ${midCTACount} mid-article-cta(s). Required: 1+.`,
  });

  // 5. Inline CTA
  const inlineCTACount = countByType("inline-cta");
  results.push({
    gate: "inline-cta",
    passed: inlineCTACount >= 1,
    details: `Found ${inlineCTACount} inline-cta(s). Required: 1+.`,
  });

  // 6. Bottom CTA
  const bottomCTACount = countByType("cta");
  results.push({
    gate: "bottom-cta",
    passed: bottomCTACount >= 1,
    details: `Found ${bottomCTACount} bottom cta(s). Required: 1+.`,
  });

  // 7. FAQ section with 3+ questions.
  // Defensive: the agent may emit an `faq` section without `questions`,
  // so we runtime-check rather than trusting the static type.
  const faqQuestionCount = draft.sections.reduce((acc, s) => {
    if (s.type !== "faq") return acc;
    const qs = (s as { questions?: unknown }).questions;
    return acc + (Array.isArray(qs) ? qs.length : 0);
  }, 0);
  results.push({
    gate: "faq-section",
    passed: faqQuestionCount >= 3,
    details: `Found ${faqQuestionCount} FAQ question(s). Required: 3+.`,
  });

  // 8. Amazon module cap (if present). Defensive: `items` may be missing
  // or non-array on a misshapen section.
  const amazonSection = draft.sections.find((s) => s.type === "amazon-shop");
  if (amazonSection && amazonSection.type === "amazon-shop") {
    const items = (amazonSection as { items?: unknown }).items;
    const itemCount = Array.isArray(items) ? items.length : 0;
    results.push({
      gate: "amazon-item-cap",
      passed: itemCount >= 4 && itemCount <= 8,
      details: `Amazon module has ${itemCount} items. Required: 4-8.`,
    });
  } else {
    results.push({
      gate: "amazon-item-cap",
      passed: true,
      details: "No Amazon module — cap not applicable.",
    });
  }

  // 9. Internal links in paragraph body or inline-cta text
  const internalLinkCount = countInternalLinks(draft);
  results.push({
    gate: "internal-links",
    passed: internalLinkCount >= 3,
    details: `Found ${internalLinkCount} internal <a> link(s). Required: 3+.`,
  });

  // 10. Unique slug
  results.push({
    gate: "unique-slug",
    passed: !existingSlugs.has(draft.slug),
    details: existingSlugs.has(draft.slug)
      ? `Slug "${draft.slug}" already exists.`
      : `Slug "${draft.slug}" is unique.`,
  });

  // 11. Title uniqueness
  const titleOverlap = maxTitleOverlap(draft.title, existingTitles);
  results.push({
    gate: "title-uniqueness",
    passed: titleOverlap < 0.7,
    details: `Max title word-overlap with existing: ${(titleOverlap * 100).toFixed(
      0,
    )}%. Required: <70%.`,
  });

  // 12. Metadata populated
  const hasAuthor = !!draft.author?.name;
  const hasExcerpt = !!draft.excerpt && draft.excerpt.length >= 40;
  const hasTags =
    draft.tags &&
    Object.values(draft.tags).some((v) => v !== undefined && v !== null);
  const hasHeroImage = !!draft.heroImage?.suggestedSearchQuery;
  const metadataOk = hasAuthor && hasExcerpt && hasTags && hasHeroImage;
  results.push({
    gate: "metadata-populated",
    passed: metadataOk,
    details: `author:${hasAuthor} excerpt:${hasExcerpt} tags:${hasTags} heroImage:${hasHeroImage}`,
  });

  // ─── Tightening sprint gates (13–15) ──────────────────────────────────

  // 13. Title must not be a verbatim copy of the seed's titleHint.
  if (seedTitleHint) {
    const titleMatchesHint =
      draft.title.trim().toLowerCase() === seedTitleHint.trim().toLowerCase();
    results.push({
      gate: "title-hint-divergence",
      passed: !titleMatchesHint,
      details: titleMatchesHint
        ? `Title "${draft.title}" is identical to the seed titleHint. Rework it.`
        : `Title diverges from titleHint. Good.`,
    });
  }

  // 14. Title (meta) must differ from headline (H1).
  const titleEqualsHeadline =
    draft.title.trim().toLowerCase() === draft.headline.trim().toLowerCase();
  results.push({
    gate: "title-headline-divergence",
    passed: !titleEqualsHeadline,
    details: titleEqualsHeadline
      ? `Title and headline are identical ("${draft.title}"). H1 should be more expressive.`
      : `Title ≠ headline. Good.`,
  });

  // 15. At least 3 tag fields populated.
  const tagValues = Object.values(draft.tags).filter(
    (v) => v !== undefined && v !== null && v !== "",
  );
  results.push({
    gate: "tag-coverage",
    passed: tagValues.length >= 3,
    details: `${tagValues.length} tag field(s) populated. Required: 3+.`,
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    results,
    passed,
    total: results.length,
    allPassed: passed === results.length,
  };
}

function countInternalLinks(draft: CleanBlogDraft): number {
  const re = /<a\s[^>]*href\s*=\s*["']\/[^"']+["']/gi;
  let count = 0;
  for (const section of draft.sections) {
    if (section.type === "paragraph") {
      const body = (section as { body?: unknown }).body;
      if (typeof body === "string") count += (body.match(re) ?? []).length;
    } else if (section.type === "inline-cta") {
      const text = (section as { text?: unknown }).text;
      if (typeof text === "string") count += (text.match(re) ?? []).length;
    }
  }
  return count;
}

function maxTitleOverlap(newTitle: string, existingTitles: string[]): number {
  if (existingTitles.length === 0) return 0;
  const newWords = new Set(
    newTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  );
  if (newWords.size === 0) return 0;
  let max = 0;
  for (const existing of existingTitles) {
    const existingWords = new Set(
      existing.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
    );
    const overlap = [...newWords].filter((w) => existingWords.has(w)).length;
    max = Math.max(max, overlap / newWords.size);
  }
  return max;
}

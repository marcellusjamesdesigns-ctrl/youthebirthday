import type { BlogDraft } from "./schemas";

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
 * Validate a draft against all 12 quality gates locked in during the polish sprint.
 * Drafts that fail gates are still saved to the review queue with failure details —
 * the reviewer decides whether to regenerate, edit, or reject.
 */
export function runQualityGates(
  draft: BlogDraft,
  existingSlugs: Set<string>,
  existingTitles: string[],
): GateReport {
  const results: GateResult[] = [];

  const countByType = (type: string) =>
    draft.sections.filter((s) => s.type === type).length;

  // 1. Hero section exactly once
  const heroCount = countByType("hero");
  results.push({
    gate: "hero-section",
    passed: heroCount === 1,
    details: `Found ${heroCount} hero section(s). Required: 1.`,
  });

  // 2. Image sections — at least 2 (hero + 1 mid-article)
  const imageCount = countByType("image");
  results.push({
    gate: "image-density",
    passed: imageCount >= 2,
    details: `Found ${imageCount} image section(s). Required: 2+.`,
  });

  // 3. Pull quote present
  const pullQuoteCount = countByType("pull-quote");
  results.push({
    gate: "pull-quote",
    passed: pullQuoteCount >= 1,
    details: `Found ${pullQuoteCount} pull-quote section(s). Required: 1+.`,
  });

  // 4. Mid-article CTA
  const midCTACount = countByType("mid-article-cta");
  results.push({
    gate: "mid-article-cta",
    passed: midCTACount >= 1,
    details: `Found ${midCTACount} mid-article-cta section(s). Required: 1+.`,
  });

  // 5. Inline CTA
  const inlineCTACount = countByType("inline-cta");
  results.push({
    gate: "inline-cta",
    passed: inlineCTACount >= 1,
    details: `Found ${inlineCTACount} inline-cta section(s). Required: 1+.`,
  });

  // 6. Bottom CTA (type: "cta")
  const bottomCTACount = countByType("cta");
  results.push({
    gate: "bottom-cta",
    passed: bottomCTACount >= 1,
    details: `Found ${bottomCTACount} bottom cta section(s). Required: 1+.`,
  });

  // 7. FAQ section with 3+ questions
  const faqSection = draft.sections.find((s) => s.type === "faq");
  const faqQuestionCount =
    faqSection && faqSection.type === "faq" ? faqSection.questions.length : 0;
  results.push({
    gate: "faq-section",
    passed: faqQuestionCount >= 3,
    details: `Found ${faqQuestionCount} FAQ questions. Required: 3+.`,
  });

  // 8. Amazon module cap (if present, ≤ 8 items)
  const amazonSection = draft.sections.find((s) => s.type === "amazon-shop");
  if (amazonSection && amazonSection.type === "amazon-shop") {
    const itemCount = amazonSection.items.length;
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

  // 9. Internal links — count <a href="..."> in all paragraph bodies + inline-cta text
  const internalLinkCount = countInternalLinks(draft);
  results.push({
    gate: "internal-links",
    passed: internalLinkCount >= 3,
    details: `Found ${internalLinkCount} internal <a> link(s) in body copy. Required: 3+.`,
  });

  // 10. Unique slug
  results.push({
    gate: "unique-slug",
    passed: !existingSlugs.has(draft.slug),
    details: existingSlugs.has(draft.slug)
      ? `Slug "${draft.slug}" already exists.`
      : `Slug "${draft.slug}" is unique.`,
  });

  // 11. Title not a near-duplicate of existing
  const titleOverlap = maxTitleOverlap(draft.title, existingTitles);
  results.push({
    gate: "title-uniqueness",
    passed: titleOverlap < 0.7,
    details: `Max title word-overlap with existing posts: ${(titleOverlap * 100).toFixed(0)}%. Required: <70%.`,
  });

  // 12. Required metadata populated
  const hasAuthor = !!draft.author?.name;
  const hasExcerpt = !!draft.excerpt && draft.excerpt.length >= 40;
  const hasTags = Object.keys(draft.tags).some(
    (k) => draft.tags[k as keyof typeof draft.tags] !== undefined,
  );
  const hasHeroImage = !!draft.heroImage?.suggestedSearchQuery;
  const metadataOk = hasAuthor && hasExcerpt && hasTags && hasHeroImage;
  results.push({
    gate: "metadata-populated",
    passed: metadataOk,
    details: `author:${hasAuthor} excerpt:${hasExcerpt} tags:${hasTags} heroImage:${hasHeroImage}`,
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    results,
    passed,
    total: results.length,
    allPassed: passed === results.length,
  };
}

function countInternalLinks(draft: BlogDraft): number {
  let count = 0;
  for (const section of draft.sections) {
    if (section.type === "paragraph") {
      count += (section.body.match(/<a\s[^>]*href\s*=\s*["']\/[^"']+["']/gi) ?? []).length;
    }
    if (section.type === "inline-cta") {
      count += (section.text.match(/<a\s[^>]*href\s*=\s*["']\/[^"']+["']/gi) ?? []).length;
    }
  }
  return count;
}

function maxTitleOverlap(newTitle: string, existingTitles: string[]): number {
  if (existingTitles.length === 0) return 0;
  const newWords = new Set(
    newTitle
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
  if (newWords.size === 0) return 0;
  let max = 0;
  for (const existing of existingTitles) {
    const existingWords = new Set(
      existing
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3),
    );
    const overlap = [...newWords].filter((w) => existingWords.has(w)).length;
    max = Math.max(max, overlap / newWords.size);
  }
  return max;
}

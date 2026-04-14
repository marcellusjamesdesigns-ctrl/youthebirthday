import type { ContentSection } from "./types";

const WORDS_PER_MINUTE = 225;

/**
 * Recursively estimate word count for a blog post by walking its sections.
 * Used to compute reading time without requiring manual upkeep.
 */
export function estimateWordCount(sections: ContentSection[]): number {
  let words = 0;
  for (const s of sections) {
    switch (s.type) {
      case "hero":
        words += countWords(s.headline) + countWords(s.subheadline);
        break;
      case "paragraph":
        words += countWords(s.heading) + countWords(s.body);
        break;
      case "pull-quote":
        words += countWords(s.quote) + countWords(s.attribution);
        break;
      case "tip-list":
        words += countWords(s.heading);
        for (const t of s.tips) words += countWords(t.title) + countWords(t.body);
        break;
      case "idea-list":
        words += countWords(s.heading) + countWords(s.subheading);
        for (const i of s.ideas) words += countWords(i.title) + countWords(i.description);
        break;
      case "destination-list":
        words += countWords(s.heading) + countWords(s.subheading);
        for (const d of s.destinations)
          words += countWords(d.city) + countWords(d.country) + countWords(d.description);
        break;
      case "caption-list":
        words += countWords(s.heading) + countWords(s.subheading);
        for (const c of s.categories) {
          words += countWords(c.name);
          for (const caption of c.captions) words += countWords(caption);
        }
        break;
      case "palette-showcase":
        words += countWords(s.heading) + countWords(s.subheading);
        for (const p of s.palettes) words += countWords(p.name) + countWords(p.mood);
        break;
      case "faq":
        words += countWords(s.heading);
        for (const q of s.questions) words += countWords(q.question) + countWords(q.answer);
        break;
      case "amazon-shop":
        words += countWords(s.title) + countWords(s.subtitle);
        for (const item of s.items)
          words += countWords(item.label) + countWords(item.description);
        break;
      case "cta":
        words += countWords(s.headline) + countWords(s.subheadline) + countWords(s.buttonText);
        break;
      case "inline-cta":
        words += countWords(s.text);
        break;
      case "image":
        words += countWords(s.caption);
        break;
      case "element-signs":
        words += countWords(s.element) + countWords(s.currentSign);
        for (const sign of s.signs) words += countWords(sign);
        break;
    }
  }
  return words;
}

export function computeReadingTimeMinutes(sections: ContentSection[]): number {
  const words = estimateWordCount(sections);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function countWords(value: string | undefined | null): number {
  if (!value) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
}

import type { ContentSection } from "@/lib/content/types";
import { HeroSection } from "./sections/HeroSection";
import { CaptionListSection } from "./sections/CaptionListSection";
import { IdeaListSection } from "./sections/IdeaListSection";
import { DestinationListSection } from "./sections/DestinationListSection";
import { PaletteShowcaseSection } from "./sections/PaletteShowcaseSection";
import { ParagraphSection } from "./sections/ParagraphSection";
import { TipListSection } from "./sections/TipListSection";
import { FAQSection } from "./sections/FAQSection";
import { RelatedContentBlock } from "./sections/RelatedContentBlock";
import { CTABlock } from "./sections/CTABlock";
import { InlineCTA } from "./sections/InlineCTA";
import { ElementSignsBlock } from "./sections/ElementSignsBlock";
import { Reveal } from "@/components/ui/reveal";
import AdUnit from "@/components/AdUnit";
import type { ContentPage } from "@/lib/content/types";

interface SectionRendererProps {
  sections: ContentSection[];
  page: ContentPage; // for related content resolution
}

export function SectionRenderer({ sections, page }: SectionRendererProps) {
  return (
    <div className="space-y-12">
      {sections.map((section, i) => {
        const content = (() => {
          switch (section.type) {
            case "hero":
              return <HeroSection key={i} {...section} />;
            case "caption-list":
              return <CaptionListSection key={i} {...section} />;
            case "idea-list":
              return <IdeaListSection key={i} {...section} />;
            case "destination-list":
              return <DestinationListSection key={i} {...section} />;
            case "palette-showcase":
              return <PaletteShowcaseSection key={i} {...section} />;
            case "paragraph":
              return <ParagraphSection key={i} {...section} />;
            case "tip-list":
              return <TipListSection key={i} {...section} />;
            case "faq":
              return <FAQSection key={i} {...section} />;
            case "related-content":
              return <RelatedContentBlock key={i} page={page} />;
            case "cta":
              return <CTABlock key={i} {...section} />;
            case "inline-cta":
              return <InlineCTA key={i} {...section} />;
            case "element-signs":
              return <ElementSignsBlock key={i} {...section} />;
            default:
              return null;
          }
        })();

        // Hero renders immediately, everything else reveals on scroll
        if (section.type === "hero" || !content) return content;

        // Insert a mid-content ad after the 3rd section
        const showMidAd = i === 3 && sections.length > 5;

        return (
          <Reveal key={i} delay={i > 2 ? 0 : i * 80}>
            {showMidAd && (
              <AdUnit slot="3782501964" format="auto" className="mb-12" />
            )}
            {content}
          </Reveal>
        );
      })}
    </div>
  );
}

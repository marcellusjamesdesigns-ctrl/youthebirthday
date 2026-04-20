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
import { AmazonShopModule } from "@/components/affiliate/AmazonShopModule";
import { ImageBlock } from "./sections/ImageBlock";
import { PullQuoteBlock } from "./sections/PullQuoteBlock";
import { QuickTakeBlock } from "./sections/QuickTakeBlock";
import type { ContentPage } from "@/lib/content/types";

interface SectionRendererProps {
  sections: ContentSection[];
  page: ContentPage; // for related content resolution
}

export function SectionRenderer({ sections, page }: SectionRendererProps) {
  // Mid-content ad placement: push the ad past the entire opening sequence
  // (hero → image → thesis → Quick Take → "Who this is for" → "When it
  // works") so that when AdSense doesn't fill the slot, the ~138px of
  // reserved height reads as a natural section break rather than a
  // loading failure inside the introduction.
  //
  // Strategy: land the ad right before the first heavy "scannable"
  // section (palette-showcase / tip-list / idea-list / caption-list /
  // destination-list / amazon-shop). Fall back to an index deep enough
  // to clear the intro on long editorial pages.
  const heavyTypes = new Set([
    "palette-showcase",
    "tip-list",
    "idea-list",
    "caption-list",
    "destination-list",
    "amazon-shop",
  ]);
  const firstHeavyIndex = sections.findIndex((s) => heavyTypes.has(s.type));
  const midAdIndex = firstHeavyIndex >= 0 ? firstHeavyIndex : 6;

  return (
    <div className="space-y-8">
      {sections.map((section, i) => {
        const content = (() => {
          switch (section.type) {
            case "hero":
              return <HeroSection key={i} {...section} />;
            case "quick-take":
              return <QuickTakeBlock key={i} {...section} />;
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
            case "amazon-shop":
              return (
                <AmazonShopModule
                  key={i}
                  title={section.title}
                  subtitle={section.subtitle}
                  placement={section.placement}
                  format={section.format}
                  items={section.items}
                />
              );
            case "image":
              return (
                <ImageBlock
                  key={i}
                  src={section.src}
                  alt={section.alt}
                  caption={section.caption}
                  credit={section.credit}
                  creditUrl={section.creditUrl}
                  ratio={section.ratio}
                />
              );
            case "pull-quote":
              return <PullQuoteBlock key={i} quote={section.quote} attribution={section.attribution} />;
            default:
              return null;
          }
        })();

        // Hero renders immediately, everything else reveals on scroll
        if (section.type === "hero" || !content) return content;

        // Insert a mid-content ad after the Quick Take (or after the 3rd
        // section on pages without one).
        const showMidAd = i === midAdIndex && sections.length > 5;

        return (
          <Reveal key={i} delay={i > 2 ? 0 : i * 80}>
            {showMidAd && (
              <AdUnit slot="3782501964" format="auto" className="mb-8" />
            )}
            {content}
          </Reveal>
        );
      })}
    </div>
  );
}

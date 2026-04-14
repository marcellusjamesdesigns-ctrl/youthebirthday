import type { ContentSection } from "@/lib/content/types";
import { HeroSection } from "@/components/content/sections/HeroSection";
import { CaptionListSection } from "@/components/content/sections/CaptionListSection";
import { IdeaListSection } from "@/components/content/sections/IdeaListSection";
import { DestinationListSection } from "@/components/content/sections/DestinationListSection";
import { PaletteShowcaseSection } from "@/components/content/sections/PaletteShowcaseSection";
import { ParagraphSection } from "@/components/content/sections/ParagraphSection";
import { TipListSection } from "@/components/content/sections/TipListSection";
import { FAQSection } from "@/components/content/sections/FAQSection";
import { CTABlock } from "@/components/content/sections/CTABlock";
import { InlineCTA } from "@/components/content/sections/InlineCTA";
import { AmazonShopModule } from "@/components/affiliate/AmazonShopModule";
import { ImageBlock } from "@/components/content/sections/ImageBlock";
import { PullQuoteBlock } from "@/components/content/sections/PullQuoteBlock";
import { MidArticleCTA } from "./MidArticleCTA";
import { Reveal } from "@/components/ui/reveal";

export function BlogSectionRenderer({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="space-y-10">
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
            case "cta":
              return <CTABlock key={i} {...section} />;
            case "inline-cta":
              return <InlineCTA key={i} {...section} />;
            case "mid-article-cta":
              return (
                <MidArticleCTA
                  key={i}
                  eyebrow={section.eyebrow}
                  headline={section.headline}
                  description={section.description}
                  buttonText={section.buttonText}
                  buttonHref={section.buttonHref}
                />
              );
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

        if (section.type === "hero" || section.type === "image" || !content) return content;

        return <Reveal key={i}>{content}</Reveal>;
      })}
    </div>
  );
}

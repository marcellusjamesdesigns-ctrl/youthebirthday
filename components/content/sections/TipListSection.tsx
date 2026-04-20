interface TipListSectionProps {
  heading: string;
  tips: { title: string; body: string }[];
}

export function TipListSection({ heading, tips }: TipListSectionProps) {
  return (
    <section className="space-y-5">
      <h2 className="heading-editorial text-xl sm:text-2xl">{heading}</h2>
      <div className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="border-l-2 border-champagne/25 pl-4 py-1"
          >
            <h3 className="text-sm font-medium text-foreground">{tip.title}</h3>
            <p
              className="text-sm text-muted-foreground mt-1.5 leading-relaxed prose-links max-w-[62ch]"
              dangerouslySetInnerHTML={{ __html: tip.body }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

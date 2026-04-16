interface TipListSectionProps {
  heading: string;
  tips: { title: string; body: string }[];
}

export function TipListSection({ heading, tips }: TipListSectionProps) {
  return (
    <section className="space-y-5">
      <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
      <div className="space-y-3">
        {tips.map((tip) => (
          <div key={tip.title} className="lift-card p-5">
            <h3 className="text-sm font-medium text-foreground">{tip.title}</h3>
            <p
              className="text-sm text-muted-foreground mt-1.5 leading-relaxed prose-links"
              dangerouslySetInnerHTML={{ __html: tip.body }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

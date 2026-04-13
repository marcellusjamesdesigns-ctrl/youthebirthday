interface IdeaListSectionProps {
  heading: string;
  subheading?: string;
  ideas: {
    title: string;
    description: string;
    vibeTag?: string;
    budgetTag?: string;
  }[];
}

export function IdeaListSection({
  heading,
  subheading,
  ideas,
}: IdeaListSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
        {subheading && (
          <p className="mt-2 text-muted-foreground">{subheading}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ideas.map((idea) => (
          <div key={idea.title} className="luxury-card p-5 space-y-3">
            <h3 className="font-medium text-foreground">{idea.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {idea.description}
            </p>
            <div className="flex gap-2">
              {idea.vibeTag && (
                <span className="text-[10px] uppercase tracking-[0.1em] rounded-full border border-champagne/15 px-2.5 py-0.5 text-champagne/50">
                  {idea.vibeTag}
                </span>
              )}
              {idea.budgetTag && (
                <span className="text-[10px] uppercase tracking-[0.1em] rounded-full border border-border/60 px-2.5 py-0.5 text-muted-foreground/50">
                  {idea.budgetTag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

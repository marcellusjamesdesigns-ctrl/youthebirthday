interface DestinationListSectionProps {
  heading: string;
  subheading?: string;
  destinations: {
    city: string;
    country: string;
    description: string;
    bestFor: string[];
    season?: string;
  }[];
}

export function DestinationListSection({
  heading,
  subheading,
  destinations,
}: DestinationListSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
        {subheading && (
          <p className="mt-2 text-muted-foreground">{subheading}</p>
        )}
      </div>

      <div className="space-y-4">
        {destinations.map((dest) => (
          <div key={dest.city} className="luxury-card p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="font-editorial text-lg text-foreground">
                {dest.city}, {dest.country}
              </h3>
              {dest.season && (
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
                  Best in {dest.season}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dest.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {dest.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-[0.1em] rounded-full border border-border/60 px-2.5 py-0.5 text-muted-foreground/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

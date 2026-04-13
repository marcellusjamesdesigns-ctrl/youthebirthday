interface HeroSectionProps {
  headline: string;
  subheadline?: string;
}

export function HeroSection({ headline, subheadline }: HeroSectionProps) {
  return (
    <div className="py-16 sm:py-20 text-center space-y-5">
      <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60 animate-fade-rise">
        you the birthday
      </p>
      <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl animate-fade-rise stagger-1">
        {headline}
      </h1>
      {subheadline && (
        <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
          {subheadline}
        </p>
      )}
    </div>
  );
}

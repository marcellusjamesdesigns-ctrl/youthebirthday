import Link from "next/link";

interface CTABlockProps {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTABlock({
  headline = "Get your personalized birthday experience",
  subheadline = "Our generator creates a complete birthday dashboard — titles, captions, colors, destinations, and more — tailored to you.",
  buttonText = "Generate My Birthday",
  buttonHref = "/onboarding",
}: CTABlockProps) {
  return (
    <section className="animated-border-card p-8 sm:p-10 text-center space-y-5 glow-champagne">
      <h2 className="heading-editorial text-xl sm:text-2xl">{headline}</h2>
      <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
        {subheadline}
      </p>
      <Link
        href={buttonHref}
        className="inline-block rounded-full bg-foreground px-8 py-3 text-[14px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)]"
      >
        {buttonText}
      </Link>
    </section>
  );
}

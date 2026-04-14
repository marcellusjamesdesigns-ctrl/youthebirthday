import Link from "next/link";

interface MidArticleCTAProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

/**
 * A stronger, more visual mid-article CTA than a plain text inline-cta.
 * Placed roughly halfway through a post to convert engaged readers.
 */
export function MidArticleCTA({
  eyebrow = "You The Birthday",
  headline,
  description,
  buttonText = "Generate My Birthday",
  buttonHref = "/onboarding",
}: MidArticleCTAProps) {
  return (
    <aside className="my-12 rounded-2xl bg-card/35 px-6 sm:px-10 py-10 text-center space-y-4 glow-champagne">
      <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/60">
        {eyebrow}
      </p>
      <h3 className="heading-editorial text-xl sm:text-2xl text-foreground/90">
        {headline}
      </h3>
      {description && (
        <p className="mx-auto max-w-md text-sm text-muted-foreground/65 leading-relaxed">
          {description}
        </p>
      )}
      <div className="pt-1">
        <Link href={buttonHref} className="glow-btn">
          {buttonText}
        </Link>
      </div>
    </aside>
  );
}

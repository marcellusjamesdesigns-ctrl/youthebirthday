import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ birthday?: string; session_id?: string }>;
}

export default async function PremiumSuccessPage({ searchParams }: PageProps) {
  const { birthday } = await searchParams;
  const resumeHref = birthday ? `/birthday/${birthday}` : "/onboarding";
  const resumeLabel = birthday ? "Open your birthday" : "Generate a birthday";

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md animate-fade-rise">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
          Premium unlocked
        </p>
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          You&apos;re in
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {birthday
            ? "Your full report is unlocked — destinations, captions, palettes, and the full celebration plan. Your report is on its way to your inbox too."
            : "Welcome to the full experience. Create a birthday dashboard any time from the home page."}
        </p>

        {/* Primary + secondary actions — matched button metrics for
            visual balance. Primary is solid; secondary is outline. */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href={resumeHref}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-[14px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.3)]"
          >
            {resumeLabel} →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border/60 px-7 py-3 text-[14px] font-medium text-muted-foreground tracking-wide transition-all hover:text-foreground hover:border-foreground/30"
          >
            Back to home
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground/40 pt-6 leading-relaxed">
          Having trouble? Check your inbox for the report email, or click
          the dashboard link to view everything online.
        </p>
      </div>
    </div>
  );
}

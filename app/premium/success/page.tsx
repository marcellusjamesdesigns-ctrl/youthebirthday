import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ birthday?: string; session_id?: string }>;
}

export default async function PremiumSuccessPage({ searchParams }: PageProps) {
  const { birthday } = await searchParams;
  const resumeHref = birthday ? `/birthday/${birthday}` : "/onboarding";
  const resumeLabel = birthday
    ? "Go to Your Birthday"
    : "Generate a Birthday";

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
            ? "Your report is unlocked. Pick up right where you left off."
            : "Unlimited birthday generations, extra palette packs, and priority processing are now yours. Go make something beautiful."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href={resumeHref}
            className="glow-btn inline-flex justify-center"
          >
            {resumeLabel}
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-6 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all inline-flex justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

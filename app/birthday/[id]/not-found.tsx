import Link from "next/link";

export default function BirthdayNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-luxury px-6">
      <div className="text-center space-y-6 animate-fade-rise">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60">
          you the birthday
        </p>
        <h1 className="heading-editorial text-3xl sm:text-4xl">
          This birthday experience doesn&apos;t exist
        </h1>
        <p className="text-sm text-muted-foreground/60 max-w-sm mx-auto">
          The link may have expired or the URL might be incorrect.
        </p>
        <Link
          href="/onboarding"
          className="inline-block rounded-full bg-foreground px-8 py-3 text-[14px] font-medium text-background tracking-wide transition-all hover:bg-foreground/90"
        >
          Create Your Own
        </Link>
      </div>
    </div>
  );
}

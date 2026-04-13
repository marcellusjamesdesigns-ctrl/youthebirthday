"use client";

interface BirthdayHeroProps {
  name: string;
  ageTurning: number;
  title?: string | null;
  archetype?: string | null;
  era?: string | null;
  narrative?: string | null;
}

export function BirthdayHero({
  name,
  ageTurning,
  title,
  archetype,
  era,
  narrative,
}: BirthdayHeroProps) {
  return (
    <div className="text-center space-y-5 py-16 sm:py-20 relative">
      {/* Reveal glow behind title */}
      {title && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-champagne/[0.03] blur-[100px] pointer-events-none" aria-hidden="true" />
      )}

      <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60 animate-fade-rise relative">
        you the birthday
      </p>

      {title ? (
        <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-rise stagger-1 relative">
          {title}
        </h1>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="skeleton-luxury h-12 w-72 sm:w-96" />
          <div className="skeleton-luxury h-12 w-56 sm:w-72" />
        </div>
      )}

      <div className="flex items-center justify-center gap-3 animate-fade-rise stagger-2 relative">
        {archetype ? (
          <span className="text-[11px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-champagne/25 text-champagne/70 bg-champagne/5">
            {archetype}
          </span>
        ) : (
          <div className="skeleton-luxury h-7 w-36" />
        )}
        {era ? (
          <span className="text-[11px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-border/60 text-muted-foreground/60">
            {era}
          </span>
        ) : (
          <div className="skeleton-luxury h-7 w-40" />
        )}
      </div>

      <p className="text-[13px] text-muted-foreground/65 tracking-wide animate-fade-rise stagger-3 relative">
        {name} · turning {ageTurning}
      </p>

      {narrative ? (
        <p className="mx-auto max-w-xl text-[15px] text-muted-foreground/70 leading-relaxed animate-fade-rise stagger-4 relative font-editorial italic">
          {narrative}
        </p>
      ) : (
        <div className="mx-auto max-w-xl space-y-2.5 flex flex-col items-center">
          <div className="skeleton-luxury h-4 w-full max-w-md" />
          <div className="skeleton-luxury h-4 w-full max-w-sm" />
          <div className="skeleton-luxury h-4 w-full max-w-xs" />
        </div>
      )}
    </div>
  );
}

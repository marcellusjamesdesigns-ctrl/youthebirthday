interface PullQuoteBlockProps {
  quote: string;
  attribution?: string;
}

export function PullQuoteBlock({ quote, attribution }: PullQuoteBlockProps) {
  return (
    <blockquote className="relative py-6 px-6 sm:px-10 border-l border-champagne/30">
      <p className="font-editorial italic text-xl sm:text-2xl leading-snug text-foreground/85">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <footer className="mt-3 text-[11px] uppercase tracking-[0.2em] text-champagne/60">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}

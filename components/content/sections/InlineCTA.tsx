import Link from "next/link";

interface InlineCTAProps {
  text: string;
  href?: string;
}

/**
 * An inline CTA. If `text` contains an inline <a> tag, we render the raw
 * HTML (avoiding nested anchors). Otherwise we wrap the whole line in a
 * Next.js Link to `href` (defaults to /onboarding).
 */
export function InlineCTA({ text, href = "/onboarding" }: InlineCTAProps) {
  const containsLink = /<a\s/i.test(text);

  return (
    <div className="my-6 py-4 border-y border-border/20 text-center">
      {containsLink ? (
        <p
          className="inline-flex items-center gap-2 text-[13px] text-champagne/70 prose-links"
          dangerouslySetInnerHTML={{
            __html: `<span class="text-champagne/30">→</span> ${text}`,
          }}
        />
      ) : (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-[13px] text-champagne/70 hover:text-champagne transition-colors"
        >
          <span className="text-champagne/30">→</span>
          {text}
        </Link>
      )}
    </div>
  );
}

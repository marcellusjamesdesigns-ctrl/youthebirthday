import Link from "next/link";

interface InlineCTAProps {
  text: string;
  href?: string;
}

export function InlineCTA({
  text,
  href = "/onboarding",
}: InlineCTAProps) {
  return (
    <div className="my-6 py-4 border-y border-border/20 text-center">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[13px] text-champagne/70 hover:text-champagne transition-colors"
      >
        <span className="text-champagne/30">→</span>
        {text}
      </Link>
    </div>
  );
}

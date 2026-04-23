/**
 * TravelInquiryCTABlock — handoff CTA to the sister travel business.
 *
 * MVP is a branded mailto so we can ship without a form/inbox. Replace
 * the action later with a Postgres-backed inquiry form without changing
 * the section type or authoring pattern.
 *
 * Recipient is controlled by NEXT_PUBLIC_TRAVEL_INQUIRY_EMAIL (inlined at
 * build time, safe to expose — it's just a destination inbox). Falls back
 * to `trips@youthebirthday.app`.
 */
import type { TravelInquiryCTASection } from "@/lib/content/types";

type Props = Omit<TravelInquiryCTASection, "type">;

const DEFAULT_RECIPIENT = "trips@youthebirthday.app";

function buildMailto(opts: {
  recipient: string;
  subject: string;
  destinationSlug?: string;
}): string {
  const bodyLines = [
    "Hi —",
    "",
    opts.destinationSlug
      ? `I'd like help planning a birthday trip to ${opts.destinationSlug.replace(/-birthday-trip$/, "").replace(/-/g, " ")}.`
      : "I'd like help planning a birthday trip.",
    "",
    "A few quick details:",
    "",
    "Travel window:",
    "Group size:",
    "Budget range:",
    "What I want the trip to feel like:",
    "",
    "Thanks!",
  ];
  const body = bodyLines.join("\n");
  const params = new URLSearchParams({
    subject: opts.subject,
    body,
  });
  // URLSearchParams uses + for spaces; mailto works better with %20.
  return `mailto:${opts.recipient}?${params.toString().replace(/\+/g, "%20")}`;
}

export function TravelInquiryCTABlock({
  eyebrow = "Plan it for me",
  headline,
  body,
  buttonText = "Start a trip inquiry",
  subject = "Birthday trip inquiry",
  destinationSlug,
}: Props) {
  const recipient =
    process.env.NEXT_PUBLIC_TRAVEL_INQUIRY_EMAIL || DEFAULT_RECIPIENT;

  const href = buildMailto({ recipient, subject, destinationSlug });

  return (
    <aside className="animated-border-card p-7 sm:p-8 glow-champagne space-y-3 text-center">
      {eyebrow && (
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/70">
          {eyebrow}
        </p>
      )}
      <h2 className="heading-editorial text-xl sm:text-2xl">{headline}</h2>
      {body && (
        <p className="mx-auto max-w-xl text-[14px] text-muted-foreground/75 leading-relaxed">
          {body}
        </p>
      )}
      <div className="pt-2">
        <a
          href={href}
          className="inline-block rounded-full bg-foreground px-7 py-2.5 text-[14px] font-medium text-background tracking-wide hover:bg-foreground/90 transition-all"
        >
          {buttonText}
        </a>
        <p className="text-[10px] text-muted-foreground/45 mt-3">
          Opens your email. A human reads every inquiry.
        </p>
      </div>
    </aside>
  );
}

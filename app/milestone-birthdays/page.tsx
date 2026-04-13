import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, breadcrumbsForHub, generateBreadcrumbSchema } from "@/components/content/Breadcrumbs";
import { CTABlock } from "@/components/content/sections/CTABlock";

export const metadata: Metadata = {
  title: "Milestone Birthday Ideas & Captions by Age (2026) | You The Birthday",
  description:
    "Birthday ideas, captions, and celebration guides for every milestone age — 21st, 25th, 30th, 35th, 40th, and 50th. Personalized plans and inspiration for the birthdays that matter most.",
  alternates: { canonical: "/milestone-birthdays" },
};

const milestones = [
  {
    age: 21,
    label: "21st Birthday",
    tagline: "Finally legal. Still unmanageable.",
    captionHref: "/birthday-captions/21st-birthday-captions",
    ideaHref: null,
  },
  {
    age: 25,
    label: "25th Birthday",
    tagline: "Quarter century. Full momentum.",
    captionHref: "/birthday-captions/25th-birthday-captions",
    ideaHref: null,
  },
  {
    age: 30,
    label: "30th Birthday",
    tagline: "The birthday that actually means something.",
    captionHref: "/birthday-captions/30th-birthday-captions",
    ideaHref: "/birthday-ideas/30th-birthday-ideas",
  },
  {
    age: 35,
    label: "35th Birthday",
    tagline: "The quiet flex.",
    captionHref: "/birthday-captions/35th-birthday-captions",
    ideaHref: null,
  },
  {
    age: 40,
    label: "40th Birthday",
    tagline: "Forty and finally unbothered.",
    captionHref: "/birthday-captions/40th-birthday-captions",
    ideaHref: null,
  },
  {
    age: 50,
    label: "50th Birthday",
    tagline: "Half a century, fully arrived.",
    captionHref: "/birthday-captions/50th-birthday-captions",
    ideaHref: null,
  },
];

export default function MilestoneBirthdaysPage() {
  const breadcrumbItems = breadcrumbsForHub("milestones");
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-8 pb-20 space-y-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Milestone Birthdays", href: "#" }]} />

        <div className="py-12 sm:py-16 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/60 animate-fade-rise">
            you the birthday
          </p>
          <h1 className="heading-editorial text-4xl sm:text-5xl animate-fade-rise stagger-1">
            Milestone Birthdays
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
            The birthdays that change how you see yourself. Captions, ideas, and celebration plans for the ages that actually matter.
          </p>
        </div>

        {/* Early milestones: 21 & 25 */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/40">Coming of age</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {milestones.filter(m => m.age <= 25).map((m) => (
              <MilestoneCard key={m.age} {...m} />
            ))}
          </div>
        </div>

        {/* Peak milestones: 30 & 35 */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/40">The defining decade</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {milestones.filter(m => m.age >= 30 && m.age <= 35).map((m) => (
              <MilestoneCard key={m.age} {...m} />
            ))}
          </div>
        </div>

        {/* Legacy milestones: 40 & 50 */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-champagne/40">The arrival</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {milestones.filter(m => m.age >= 40).map((m) => (
              <MilestoneCard key={m.age} {...m} />
            ))}
          </div>
        </div>

        <CTABlock
          headline="Get a personalized milestone birthday experience"
          subheadline="Our generator creates a complete birthday dashboard — title, captions, palettes, destinations — tailored to your exact age, vibe, and style."
          buttonText="Generate My Birthday"
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}

function MilestoneCard({ age, label, tagline, captionHref, ideaHref }: {
  age: number;
  label: string;
  tagline: string;
  captionHref: string | null;
  ideaHref: string | null;
}) {
  return (
    <div className="luxury-card p-6 space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-editorial text-lg">{label}</h2>
        <span className="text-2xl font-editorial text-champagne/30">{age}</span>
      </div>
      <p className="text-sm text-muted-foreground/60 italic">{tagline}</p>
      <div className="flex gap-2 pt-1">
        {captionHref && (
          <Link
            href={captionHref}
            className="text-[11px] uppercase tracking-[0.1em] rounded-full border border-border/60 px-3 py-1 text-muted-foreground/50 hover:text-foreground hover:border-foreground/20 transition-all"
          >
            Captions
          </Link>
        )}
        {ideaHref && (
          <Link
            href={ideaHref}
            className="text-[11px] uppercase tracking-[0.1em] rounded-full border border-border/60 px-3 py-1 text-muted-foreground/50 hover:text-foreground hover:border-foreground/20 transition-all"
          >
            Ideas
          </Link>
        )}
        <Link
          href="/onboarding"
          className="text-[11px] uppercase tracking-[0.1em] rounded-full border border-champagne/20 px-3 py-1 text-champagne/50 hover:text-champagne hover:border-champagne/30 transition-all"
        >
          Generate
        </Link>
      </div>
    </div>
  );
}

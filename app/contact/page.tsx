import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | You The Birthday",
  description:
    "Get in touch with You The Birthday — for press, partnerships, feedback, or privacy inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | You The Birthday",
    description: "Reach out to the You The Birthday team.",
    url: "https://youthebirthday.app/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-2xl px-6 py-16 pb-24 space-y-10">

        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">Contact</p>
          <h1 className="heading-editorial text-4xl sm:text-5xl">Get In Touch</h1>
          <p className="text-base text-muted-foreground/80 leading-relaxed">
            We read everything. Response time is typically 2–3 business days.
          </p>
        </div>

        <div className="space-y-6">
          <ContactCard
            label="General"
            description="Questions about the platform, feedback, or anything else."
            email="hello@youthebirthday.app"
          />
          <ContactCard
            label="Press & Partnerships"
            description="Media inquiries, collaboration opportunities, or brand partnerships."
            email="hello@youthebirthday.app"
          />
          <ContactCard
            label="Privacy"
            description="Data deletion requests or privacy-related questions."
            email="privacy@youthebirthday.app"
          />
        </div>

        <div className="pt-2 text-[13px] text-muted-foreground/50 leading-relaxed">
          You The Birthday is based in New York, NY.
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  label,
  description,
  email,
}: {
  label: string;
  description: string;
  email: string;
}) {
  return (
    <div className="lift-card p-6 space-y-2">
      <p className="text-[10px] uppercase tracking-[0.3em] text-champagne/60">{label}</p>
      <p className="text-[13px] text-muted-foreground/70 leading-relaxed">{description}</p>
      <a
        href={`mailto:${email}`}
        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors underline underline-offset-2"
      >
        {email}
      </a>
    </div>
  );
}

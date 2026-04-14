import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | You The Birthday",
  description: "How You The Birthday handles your data, privacy, and personal information.",
  robots: { index: false },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="mx-auto max-w-3xl px-6 py-16 pb-24 space-y-8">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">Legal</p>
          <h1 className="heading-editorial text-3xl sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: April 14, 2026</p>
        </div>

        <div className="prose-luxury space-y-6 text-[15px] text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">What We Collect</h2>
            <p>When you use You The Birthday, we collect the following information to generate your personalized birthday experience:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground/80">Birthday information:</strong> your name, birth date, birth year, and optionally your birth time and birth city (for cosmic mode).</li>
              <li><strong className="text-foreground/80">Location:</strong> your current city and celebration city, used to personalize destination and restaurant recommendations.</li>
              <li><strong className="text-foreground/80">Preferences:</strong> celebration vibe, budget, group size, and aesthetic preferences.</li>
              <li><strong className="text-foreground/80">Email address:</strong> only if you choose to provide it for bonus generations or premium purchases.</li>
              <li><strong className="text-foreground/80">Payment information:</strong> processed securely by Stripe. We never see or store your credit card number.</li>
              <li><strong className="text-foreground/80">Device identifiers:</strong> anonymous device tokens for rate limiting. These are not linked to your identity.</li>
              <li><strong className="text-foreground/80">Analytics:</strong> anonymized usage data via PostHog to improve the product.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To generate your personalized birthday dashboard using AI (Claude by Anthropic).</li>
              <li>To send your birthday report via email if you purchase premium.</li>
              <li>To enforce generation limits and prevent abuse.</li>
              <li>To improve the product through anonymized analytics.</li>
              <li>To display relevant advertisements via Google AdSense on content pages.</li>
            </ul>
            <p>We do <strong className="text-foreground/80">not</strong> sell your personal data to third parties. We do not use your birthday information for marketing purposes beyond the service you requested.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">AI-Generated Content</h2>
            <p>Your birthday dashboard is generated using artificial intelligence (Claude by Anthropic). AI-generated content may contain inaccuracies. Restaurant recommendations, travel destinations, and cosmic readings are for inspiration and entertainment purposes. Always verify practical details independently.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Data Storage</h2>
            <p>Your birthday session data is stored in a secure database hosted on Neon (PostgreSQL). Share card images are stored on Vercel Blob. Rate limiting data is stored in Upstash Redis with a 30-day expiration.</p>
            <p>Generated dashboards are accessible via their unique URL. These URLs are not indexed by search engines and are private-by-obscurity. Do not share your dashboard URL if you want to keep your birthday information private.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground/80">Stripe:</strong> payment processing</li>
              <li><strong className="text-foreground/80">Anthropic (Claude):</strong> AI generation</li>
              <li><strong className="text-foreground/80">Vercel:</strong> hosting and infrastructure</li>
              <li><strong className="text-foreground/80">Neon:</strong> database</li>
              <li><strong className="text-foreground/80">Upstash:</strong> rate limiting</li>
              <li><strong className="text-foreground/80">Resend:</strong> email delivery</li>
              <li><strong className="text-foreground/80">PostHog:</strong> analytics</li>
              <li><strong className="text-foreground/80">Google AdSense:</strong> advertising on content pages</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Cookies</h2>
            <p>We use minimal cookies and local storage for device identification (rate limiting) and session persistence. Google AdSense and PostHog may set their own cookies. You can disable cookies in your browser settings, but this may affect functionality.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Your Rights</h2>
            <p>You can request deletion of your data by contacting us. Since we do not require accounts, most data is already ephemeral and expires automatically.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Contact</h2>
            <p>For privacy-related inquiries, contact us at <strong className="text-foreground/80">privacy@youthebirthday.app</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

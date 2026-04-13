import Link from "next/link";

const SIGNS = [
  { name: "Aries",       slug: "aries",       symbol: "♈" },
  { name: "Taurus",      slug: "taurus",      symbol: "♉" },
  { name: "Gemini",      slug: "gemini",      symbol: "♊" },
  { name: "Cancer",      slug: "cancer",      symbol: "♋" },
  { name: "Leo",         slug: "leo",         symbol: "♌" },
  { name: "Virgo",       slug: "virgo",       symbol: "♍" },
  { name: "Libra",       slug: "libra",       symbol: "♎" },
  { name: "Scorpio",     slug: "scorpio",     symbol: "♏" },
  { name: "Sagittarius", slug: "sagittarius", symbol: "♐" },
  { name: "Capricorn",   slug: "capricorn",   symbol: "♑" },
  { name: "Aquarius",    slug: "aquarius",    symbol: "♒" },
  { name: "Pisces",      slug: "pisces",      symbol: "♓" },
];

export function ZodiacBar() {
  return (
    <section className="relative py-20 px-6 border-t border-border/20 overflow-hidden">
      {/* Ambient rotating ring in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className="zodiac-ring w-[600px] h-[600px] rounded-full opacity-[0.025]"
          style={{
            border: "1px solid rgba(212,175,55,0.8)",
            boxShadow: "0 0 80px 0 rgba(212,175,55,0.05) inset",
          }}
        />
        <div
          className="zodiac-ring absolute w-[420px] h-[420px] rounded-full opacity-[0.015]"
          style={{
            border: "1px solid rgba(245,240,235,0.5)",
            animationDirection: "reverse",
            animationDuration: "90s",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl text-center space-y-10">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50">
            Cosmic Layer
          </p>
          <h2 className="heading-editorial text-2xl sm:text-3xl">
            What sign runs your birthday?
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {SIGNS.map((sign) => (
            <Link
              key={sign.slug}
              href={`/zodiac-birthdays/${sign.slug}`}
              className="group flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-[13px] text-muted-foreground/60 hover:text-champagne hover:border-champagne/30 hover:bg-champagne/5 transition-all duration-200"
            >
              <span className="text-base group-hover:text-champagne/70 transition-colors">
                {sign.symbol}
              </span>
              {sign.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowsHorizontal,
  StarFour,
  Scales,
  Waves,
  Infinity,
  Fish,
  Mountains,
  Wind,
  Drop,
  Fire,
} from "@phosphor-icons/react/dist/ssr";

const SIGNS: {
  name: string;
  slug: string;
  Icon: React.ElementType;
  dates: string;
}[] = [
  { name: "Aries",       slug: "aries",       Icon: Fire,             dates: "Mar 21 – Apr 19" },
  { name: "Taurus",      slug: "taurus",      Icon: Mountains,        dates: "Apr 20 – May 20" },
  { name: "Gemini",      slug: "gemini",      Icon: ArrowsHorizontal, dates: "May 21 – Jun 20" },
  { name: "Cancer",      slug: "cancer",      Icon: Moon,             dates: "Jun 21 – Jul 22" },
  { name: "Leo",         slug: "leo",         Icon: Sun,              dates: "Jul 23 – Aug 22" },
  { name: "Virgo",       slug: "virgo",       Icon: Infinity,         dates: "Aug 23 – Sep 22" },
  { name: "Libra",       slug: "libra",       Icon: Scales,           dates: "Sep 23 – Oct 22" },
  { name: "Scorpio",     slug: "scorpio",     Icon: Waves,            dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", slug: "sagittarius", Icon: Wind,             dates: "Nov 22 – Dec 21" },
  { name: "Capricorn",   slug: "capricorn",   Icon: StarFour,         dates: "Dec 22 – Jan 19" },
  { name: "Aquarius",    slug: "aquarius",    Icon: Drop,             dates: "Jan 20 – Feb 18" },
  { name: "Pisces",      slug: "pisces",      Icon: Fish,             dates: "Feb 19 – Mar 20" },
];

export function ZodiacBar() {
  return (
    <section className="relative py-20 px-6 border-t border-border/20 overflow-hidden">
      {/* Ambient rotating rings */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
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
          {SIGNS.map((sign) => {
            const Icon = sign.Icon;
            return (
              <Link
                key={sign.slug}
                href={`/zodiac-birthdays/${sign.slug}`}
                className="group flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-[13px] text-muted-foreground/60 hover:text-champagne hover:border-champagne/30 hover:bg-champagne/5 transition-all duration-200"
              >
                <Icon
                  size={15}
                  weight="duotone"
                  className="text-muted-foreground/50 group-hover:text-champagne/70 transition-colors"
                />
                {sign.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

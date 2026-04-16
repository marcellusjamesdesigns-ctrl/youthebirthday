import Link from "next/link";

/**
 * Personalized content discovery section shown after dashboard generation
 * completes. Connects the generator product to the SEO/content ecosystem
 * by surfacing relevant pages based on the user's age, zodiac sign, and vibe.
 *
 * This closes the "dashboard → content" loop that was previously missing.
 */

// Zodiac lookup from birthdate (MM-DD)
const ZODIAC_DATES: { sign: string; slug: string; start: [number, number]; end: [number, number] }[] = [
  { sign: "Capricorn",   slug: "capricorn",    start: [12, 22], end: [1, 19] },
  { sign: "Aquarius",    slug: "aquarius",     start: [1, 20],  end: [2, 18] },
  { sign: "Pisces",      slug: "pisces",       start: [2, 19],  end: [3, 20] },
  { sign: "Aries",       slug: "aries",        start: [3, 21],  end: [4, 19] },
  { sign: "Taurus",      slug: "taurus",       start: [4, 20],  end: [5, 20] },
  { sign: "Gemini",      slug: "gemini",       start: [5, 21],  end: [6, 20] },
  { sign: "Cancer",      slug: "cancer",       start: [6, 21],  end: [7, 22] },
  { sign: "Leo",         slug: "leo",          start: [7, 23],  end: [8, 22] },
  { sign: "Virgo",       slug: "virgo",        start: [8, 23],  end: [9, 22] },
  { sign: "Libra",       slug: "libra",        start: [9, 23],  end: [10, 22] },
  { sign: "Scorpio",     slug: "scorpio",      start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", slug: "sagittarius",  start: [11, 22], end: [12, 21] },
];

function getZodiacFromBirthdate(mmdd: string): { sign: string; slug: string } | null {
  const [mm, dd] = mmdd.split("-").map(Number);
  if (!mm || !dd) return null;

  for (const z of ZODIAC_DATES) {
    if (z.sign === "Capricorn") {
      if ((mm === 12 && dd >= 22) || (mm === 1 && dd <= 19)) return z;
    } else {
      const [sm, sd] = z.start;
      const [em, ed] = z.end;
      if ((mm === sm && dd >= sd) || (mm === em && dd <= ed)) return z;
    }
  }
  return null;
}

// Age → milestone caption/idea pages
const MILESTONE_AGES: Record<number, { captions?: string; ideas?: string }> = {
  21: { captions: "/birthday-captions/21st-birthday-captions" },
  25: { captions: "/birthday-captions/25th-birthday-captions" },
  30: { captions: "/birthday-captions/30th-birthday-captions", ideas: "/birthday-ideas/30th-birthday-ideas" },
  35: { captions: "/birthday-captions/35th-birthday-captions" },
  40: { captions: "/birthday-captions/40th-birthday-captions" },
  50: { captions: "/birthday-captions/50th-birthday-captions" },
};

// Vibe → content page mapping
const VIBE_LINKS: Record<string, { label: string; href: string }[]> = {
  luxury: [
    { label: "Old Money Birthday Theme", href: "/birthday-themes/old-money-birthday-theme" },
    { label: "Luxury Birthday Destinations", href: "/birthday-destinations/luxury-birthday-destinations" },
  ],
  "soft-life": [
    { label: "Soft Life Birthday Theme", href: "/birthday-themes/soft-life-birthday-theme" },
    { label: "Solo Birthday Ideas", href: "/birthday-ideas/solo-birthday-ideas" },
  ],
  intimate: [
    { label: "Dark Feminine Birthday Theme", href: "/birthday-themes/dark-feminine-birthday-theme" },
    { label: "Birthday Dinner Ideas", href: "/birthday-ideas/birthday-dinner-ideas" },
    { label: "Romantic Birthday Ideas", href: "/birthday-ideas/romantic-birthday-ideas" },
  ],
  "turn-up": [
    { label: "Maximalist Birthday Theme", href: "/birthday-themes/maximalist-birthday-theme" },
    { label: "Birthday Weekend Ideas", href: "/birthday-ideas/birthday-weekend-ideas" },
  ],
  adventurous: [
    { label: "Birthday Trip Ideas", href: "/birthday-ideas/birthday-trip-ideas" },
    { label: "Beach Birthday Destinations", href: "/birthday-destinations/beach-birthday-destinations" },
  ],
  nostalgic: [
    { label: "Y2K Birthday Theme", href: "/birthday-themes/y2k-birthday-theme" },
  ],
  romantic: [
    { label: "Romantic Birthday Ideas", href: "/birthday-ideas/romantic-birthday-ideas" },
    { label: "Birthday Dinner Ideas", href: "/birthday-ideas/birthday-dinner-ideas" },
  ],
};

interface ContentDiscoveryProps {
  birthdate: string; // "MM-DD"
  ageTurning: number;
  celebrationVibe: string;
}

export function ContentDiscovery({
  birthdate,
  ageTurning,
  celebrationVibe,
}: ContentDiscoveryProps) {
  const links: { label: string; href: string; tag?: string }[] = [];

  // Zodiac page
  const zodiac = getZodiacFromBirthdate(birthdate);
  if (zodiac) {
    links.push({
      label: `${zodiac.sign} Birthday Ideas`,
      href: `/zodiac-birthdays/${zodiac.slug}-birthday-ideas`,
      tag: "your sign",
    });
  }

  // Milestone age
  const milestone = MILESTONE_AGES[ageTurning];
  if (milestone?.ideas) {
    links.push({ label: `${ageTurning}th Birthday Ideas`, href: milestone.ideas, tag: "your age" });
  }
  if (milestone?.captions) {
    links.push({ label: `${ageTurning}th Birthday Captions`, href: milestone.captions, tag: "your age" });
  }

  // Vibe-matched content
  const vibeKey = celebrationVibe?.toLowerCase().replace(/\s+/g, "-");
  const vibeMatches = VIBE_LINKS[vibeKey] ?? [];
  for (const v of vibeMatches.slice(0, 2)) {
    // Avoid duplicates
    if (!links.some((l) => l.href === v.href)) {
      links.push({ ...v, tag: "your vibe" });
    }
  }

  // Always include palettes + Journal as fallback
  if (links.length < 4) {
    links.push({
      label: "Birthday Color Palettes",
      href: "/birthday-palettes/birthday-color-palette-inspiration",
      tag: "decor",
    });
  }
  if (links.length < 5) {
    links.push({ label: "The Journal", href: "/blog", tag: "editorial" });
  }

  // Cap at 6 links
  const shown = links.slice(0, 6);

  if (shown.length === 0) return null;

  return (
    <section className="mt-14 animate-fade-rise">
      <div className="text-center space-y-2 mb-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne/50">
          Keep exploring
        </p>
        <p className="text-sm text-muted-foreground/60">
          Curated for your birthday — ideas, themes, and inspiration that match your results.
        </p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {shown.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="lift-card p-4 flex items-center justify-between gap-3 group"
          >
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {link.label}
            </span>
            {link.tag && (
              <span className="text-[9px] uppercase tracking-[0.15em] text-champagne/40 border border-champagne/15 rounded-full px-2 py-0.5 shrink-0">
                {link.tag}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

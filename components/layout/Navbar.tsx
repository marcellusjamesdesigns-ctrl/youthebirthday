import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="font-editorial text-lg tracking-tight text-foreground/90 hover:text-foreground transition-colors"
        >
          you the birthday
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/birthday-captions"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block uppercase tracking-widest"
          >
            Captions
          </Link>
          <Link
            href="/birthday-ideas"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block uppercase tracking-widest"
          >
            Ideas
          </Link>
          <Link
            href="/zodiac-birthdays"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block uppercase tracking-widest"
          >
            Zodiac
          </Link>
          <Link
            href="/onboarding"
            className="glow-nav-btn"
          >
            Start
          </Link>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/birthday-captions", label: "Captions" },
  { href: "/birthday-ideas", label: "Ideas" },
  { href: "/birthday-themes", label: "Themes" },
  { href: "/birthday-destinations", label: "Destinations" },
  { href: "/zodiac-birthdays", label: "Zodiac" },
  { href: "/blog", label: "Journal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="font-editorial text-lg tracking-tight text-foreground/90 hover:text-foreground transition-colors"
        >
          You the Birthday
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hidden sm:block uppercase tracking-widest"
            >
              {link.label}
            </Link>
          ))}

          <Link href="/onboarding" className="glow-nav-btn hidden sm:inline-flex">
            Start
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden relative w-8 h-8 flex items-center justify-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <div className="flex flex-col gap-[5px] w-[18px]">
              <span
                className={`block h-[1.5px] bg-foreground/70 transition-all duration-300 ${
                  open ? "rotate-45 translate-y-[3.25px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-foreground/70 transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-[3.25px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl animate-fade-rise">
          <div className="mx-auto max-w-6xl px-6 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm tracking-wide transition-colors ${
                  pathname === link.href
                    ? "text-champagne"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/20">
              <Link
                href="/onboarding"
                onClick={() => setOpen(false)}
                className="glow-btn inline-flex w-full justify-center"
              >
                Start Your Birthday
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

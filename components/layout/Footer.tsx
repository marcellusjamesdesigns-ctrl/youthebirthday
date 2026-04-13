"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  return (
    <footer className="border-t border-border/20 mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        {/* Desktop */}
        <div className="hidden sm:grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-editorial text-base text-foreground/80">you the birthday</p>
            <p className="text-xs text-muted-foreground/60 mt-1.5 leading-relaxed">
              Your personalized birthday experience.
            </p>
          </div>
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              Explore
            </p>
            <div className="flex flex-col gap-1.5">
              <FooterLink href="/birthday-captions">Birthday Captions</FooterLink>
              <FooterLink href="/birthday-ideas">Birthday Ideas</FooterLink>
              <FooterLink href="/birthday-destinations">Destinations</FooterLink>
              <FooterLink href="/birthday-palettes">Color Palettes</FooterLink>
            </div>
          </div>
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              More
            </p>
            <div className="flex flex-col gap-1.5">
              <FooterLink href="/birthday-themes">Themes</FooterLink>
              <FooterLink href="/zodiac-birthdays">Zodiac Birthdays</FooterLink>
              <FooterLink href="/onboarding">Generate My Birthday</FooterLink>
            </div>
          </div>
        </div>

        {/* Mobile — compact accordion */}
        <div className="sm:hidden space-y-4">
          <div className="text-center">
            <p className="font-editorial text-base text-foreground/80">you the birthday</p>
          </div>
          <MobileFooterGroup title="Explore">
            <FooterLink href="/birthday-captions">Captions</FooterLink>
            <FooterLink href="/birthday-ideas">Ideas</FooterLink>
            <FooterLink href="/birthday-destinations">Destinations</FooterLink>
            <FooterLink href="/birthday-palettes">Palettes</FooterLink>
          </MobileFooterGroup>
          <MobileFooterGroup title="More">
            <FooterLink href="/birthday-themes">Themes</FooterLink>
            <FooterLink href="/zodiac-birthdays">Zodiac</FooterLink>
            <FooterLink href="/onboarding">Generate</FooterLink>
          </MobileFooterGroup>
        </div>

        <div className="mt-6 pt-4 border-t border-border/10 text-center">
          <p className="text-[10px] text-muted-foreground/25 tracking-wide">
            &copy; {new Date().getFullYear()} You The Birthday
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[13px] text-muted-foreground/60 hover:text-foreground/60 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileFooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border/10 pt-3">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60"
      >
        {title}
        <svg
          className={`w-2.5 h-2.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 10 6"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

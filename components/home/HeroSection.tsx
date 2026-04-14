"use client";

import { useRef } from "react";
import Link from "next/link";
import { ParticleField } from "./ParticleField";
import { HeroGemLoader } from "./HeroGemLoader";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-champagne/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-plum/[0.03] blur-[120px]" />
      </div>

      {/* Particle field */}
      <ParticleField />

      {/* 3D gold ring */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <HeroGemLoader heroRef={sectionRef} />
      </div>

      <div className="max-w-3xl text-center space-y-10 relative z-10">
        <div className="space-y-6 animate-fade-rise">
          <p className="text-[11px] uppercase tracking-[0.35em] text-champagne/60 font-medium">
            You the Birthday
          </p>

          <h1
            className="heading-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-[90px] text-foreground"
            style={{ textShadow: "0 0 40px rgba(10,10,11,0.8), 0 0 80px rgba(10,10,11,0.5)" }}
          >
            Your birthday,
            <br />
            <span className="shimmer-gold italic">personalized</span>
            <br />
            like an experience.
          </h1>
        </div>

        <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed animate-fade-rise stagger-2">
          Birthday titles, captions, color palettes, destinations,
          and celebration style — curated for you, powered by your
          vibe and your story.
        </p>

        <div className="space-y-4 animate-fade-rise stagger-3">
          <Link href="/onboarding" className="glow-btn">
            Start Your Birthday
          </Link>
          <p className="text-xs text-muted-foreground/60 tracking-wide">
            No account needed. Takes 2 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}

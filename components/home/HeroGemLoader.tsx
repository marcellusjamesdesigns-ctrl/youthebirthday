"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import { useMouseParallax } from "@/components/hooks/useMouseParallax";
import { useScrollProgress } from "@/components/hooks/useScrollProgress";

const HeroGem = dynamic(
  () => import("./HeroGem").then((mod) => mod.HeroGem),
  { ssr: false }
);

export function HeroGemLoader({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>;
}) {
  const mouse = useMouseParallax();
  const scroll = useScrollProgress(heroRef);

  return <HeroGem mouse={mouse} scroll={scroll} />;
}

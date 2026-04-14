"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Returns a ref (0–1) representing how far the hero has scrolled off-screen. */
export function useScrollProgress(containerRef: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    let raf: number;

    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const h = rect.height;
        // 0 when top of section at top of viewport, 1 when bottom of section reaches top
        progress.current = Math.max(0, Math.min(1, -rect.top / h));
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [containerRef]);

  return progress;
}

"use client";

import { useEffect, useRef } from "react";

/** Returns a ref with smoothly interpolated mouse position (0–1, centered at 0.5). */
export function useMouseParallax() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const target = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = e.clientY / window.innerHeight;
    };

    // Lerp loop for smooth following
    let raf: number;
    const lerp = () => {
      mouse.current.x += (target.current.x - mouse.current.x) * 0.05;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.05;
      raf = requestAnimationFrame(lerp);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return mouse;
}

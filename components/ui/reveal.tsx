"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts after intersection */
  delay?: number;
  /** Animation variant */
  variant?: "rise" | "fade" | "slide-left" | "slide-right";
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const variants: Record<string, string> = {
    rise: "translate-y-5 opacity-0",
    fade: "opacity-0",
    "slide-left": "-translate-x-5 opacity-0",
    "slide-right": "translate-x-5 opacity-0",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0 translate-x-0 opacity-100" : variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: "div" | "button" | "article";
}

export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--spotlight-x", `${x}px`);
    ref.current.style.setProperty("--spotlight-y", `${y}px`);
  }, []);

  return (
    <Tag
      ref={ref as any}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card", className)}
      {...(props as any)}
    >
      {children}
    </Tag>
  );
}

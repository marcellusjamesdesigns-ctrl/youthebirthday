"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  opacitySpeed: number;
  opacityDir: number;
  color: [number, number, number]; // rgb
}

const COLORS: [number, number, number][] = [
  [212, 175, 55],  // champagne gold
  [212, 175, 55],  // champagne gold (weighted heavier)
  [212, 175, 55],  // champagne gold
  [212, 160, 160], // rose
  [155, 114, 207], // plum
  [232, 131, 107], // coral
  [184, 169, 201], // lavender
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(width: number, height: number): Particle {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    radius: randomBetween(1, 2.5),
    opacity: randomBetween(0.3, 0.9),
    speedX: randomBetween(-0.18, 0.18),
    speedY: randomBetween(-0.22, 0.1),
    opacitySpeed: randomBetween(0.003, 0.008),
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    color,
  };
}

const PARTICLE_COUNT = 55;

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function init() {
      resize();
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(width, height)
      );
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Breathe opacity
        p.opacity += p.opacitySpeed * p.opacityDir;
        if (p.opacity >= 0.9) { p.opacity = 0.9; p.opacityDir = -1; }
        if (p.opacity <= 0.15) { p.opacity = 0.15; p.opacityDir = 1; }

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw — point with soft glow
        const [r, g, b] = p.color;

        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 6);
        glow.addColorStop(0, `rgba(${r},${g},${b},${(p.opacity * 0.35).toFixed(3)})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity.toFixed(3)})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.85 }}
    />
  );
}

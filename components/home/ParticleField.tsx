"use client";

// Particle positions are fixed to avoid hydration mismatch
const PARTICLES: { cls: string; top: string; left: string }[] = [
  { cls: "particle particle-1",  top: "12%",  left: "8%"  },
  { cls: "particle particle-2",  top: "28%",  left: "18%" },
  { cls: "particle particle-3",  top: "55%",  left: "5%"  },
  { cls: "particle particle-4",  top: "72%",  left: "14%" },
  { cls: "particle particle-5",  top: "18%",  left: "88%" },
  { cls: "particle particle-6",  top: "35%",  left: "92%" },
  { cls: "particle particle-7",  top: "62%",  left: "85%" },
  { cls: "particle particle-8",  top: "80%",  left: "78%" },
  { cls: "particle particle-9",  top: "8%",   left: "45%" },
  { cls: "particle particle-10", top: "42%",  left: "32%" },
  { cls: "particle particle-11", top: "88%",  left: "55%" },
  { cls: "particle particle-12", top: "50%",  left: "68%" },
];

export function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={p.cls}
          style={{ top: p.top, left: p.left }}
        />
      ))}
    </div>
  );
}

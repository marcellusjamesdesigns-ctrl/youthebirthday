"use client";

import { useEffect, useRef, useState } from "react";
import type { Destination } from "@/lib/db/schema";

// ─── Static city coordinate lookup ──────────────────────────────────────────
const C: Record<string, [number, number]> = {
  Paris:[48.86,2.35],Rome:[41.9,12.5],Barcelona:[41.39,2.17],Amsterdam:[52.37,4.9],
  Lisbon:[38.72,-9.14],Prague:[50.08,14.44],Vienna:[48.21,16.37],Budapest:[47.5,19.04],
  Santorini:[36.39,25.46],Athens:[37.98,23.73],Amalfi:[40.63,14.6],Florence:[43.77,11.26],
  Venice:[45.44,12.32],Dubrovnik:[42.65,18.09],Copenhagen:[55.68,12.57],Stockholm:[59.33,18.07],
  Edinburgh:[55.95,-3.19],London:[51.51,-0.13],Reykjavik:[64.14,-21.9],Seville:[37.39,-5.98],
  Madrid:[40.42,-3.7],Porto:[41.16,-8.63],Monaco:[43.74,7.42],Nice:[43.71,7.26],
  Mykonos:[37.45,25.33],Positano:[40.63,14.49],Split:[43.51,16.44],Berlin:[52.52,13.41],
  Munich:[48.14,11.58],Milan:[45.46,9.19],Zurich:[47.38,8.54],Salzburg:[47.81,13.06],
  "New York":[40.71,-74.01],"Los Angeles":[34.05,-118.24],Miami:[25.76,-80.19],
  "New Orleans":[29.95,-90.07],"San Francisco":[37.77,-122.42],Chicago:[41.88,-87.63],
  Nashville:[36.16,-86.78],Austin:[30.27,-97.74],"Las Vegas":[36.17,-115.14],
  Havana:[23.11,-82.37],"Mexico City":[19.43,-99.13],Tulum:[20.21,-87.47],
  Cartagena:[10.4,-75.51],"Buenos Aires":[-34.6,-58.38],"Rio de Janeiro":[-22.91,-43.17],
  Medellín:[6.24,-75.58],Cancún:[21.16,-86.85],Lima:[-12.05,-77.04],Santiago:[-33.45,-70.67],
  Atlanta:[33.75,-84.39],"Washington DC":[38.91,-77.04],Denver:[39.74,-104.99],
  Seattle:[47.61,-122.33],Portland:[45.52,-122.68],Savannah:[32.08,-81.09],
  Charleston:[32.78,-79.93],Montréal:[45.5,-73.57],Toronto:[43.65,-79.38],
  Vancouver:[49.28,-123.12],Tokyo:[35.68,139.65],Kyoto:[35.01,135.77],Bali:[-8.34,115.09],
  Bangkok:[13.76,100.5],Singapore:[1.35,103.82],Seoul:[37.57,126.98],
  "Hong Kong":[22.32,114.17],Taipei:[25.03,121.57],"Chiang Mai":[18.79,98.99],
  Phuket:[7.88,98.39],Hanoi:[21.03,105.85],Osaka:[34.69,135.5],
  Jaipur:[26.91,75.79],Udaipur:[24.59,73.71],Mumbai:[19.08,72.88],Goa:[15.3,74.12],
  Ubud:[-8.51,115.26],Marrakech:[31.63,-7.98],"Cape Town":[-33.92,18.42],
  Zanzibar:[-6.17,39.2],Cairo:[30.04,31.24],Nairobi:[-1.29,36.82],Accra:[5.6,-0.19],
  Dubai:[25.2,55.27],Istanbul:[41.01,28.98],Oaxaca:[17.07,-96.73],Tbilisi:[41.69,44.8],
  Bologna:[44.49,11.34],Catskills:[42.1,-74.38],Asheville:[35.6,-82.55],
  Cusco:[-13.53,-71.97],"San Miguel de Allende":[20.91,-100.74],"Lake Como":[46.02,9.27],
  Cappadocia:[38.64,34.83],Palermo:[38.12,13.36],Kraków:[50.06,19.94],
  Essaouira:[31.51,-9.77],"Da Nang":[16.05,108.22],Nara:[34.69,135.8],
  Sydney:[-33.87,151.21],Melbourne:[-37.81,144.96],Auckland:[-36.85,174.76],
  Queenstown:[-45.03,168.66],Honolulu:[21.31,-157.86],Maui:[20.8,-156.33],
  "St. Lucia":[13.91,-60.98],Barbados:[13.19,-59.54],Ibiza:[38.91,1.42],
  "Bora Bora":[-16.5,-151.74],Fiji:[-17.71,178.07],Crete:[35.24,24.81],
  "Tel Aviv":[32.09,34.78],Fez:[34.02,-5.01],Bogotá:[4.71,-74.07],
};

const DEFAULT_SEASON: [number, number, number] = [0.831, 0.686, 0.216]; // champagne
const DEFAULT_DREAM: [number, number, number] = [0.608, 0.447, 0.812]; // plum

function hexToCobeColor(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

interface MarkerEntry { lat: number; lng: number; dest: Destination }

interface DestinationGlobeProps {
  destinations: Destination[];
  seasonColor?: string; // hex from user's palette primary
  dreamColor?: string;  // hex from user's palette accent
}

export function DestinationGlobe({ destinations, seasonColor, dreamColor }: DestinationGlobeProps) {
  const seasonCobe = seasonColor ? hexToCobeColor(seasonColor) : DEFAULT_SEASON;
  const dreamCobe = dreamColor ? hexToCobeColor(dreamColor) : DEFAULT_DREAM;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const globeRef = useRef<{ update: (s: Record<string, unknown>) => void; destroy: () => void } | null>(null);
  const rafRef = useRef<number>(0);
  const [hovered, setHovered] = useState<{ dest: Destination; x: number; y: number } | null>(null);

  const markers: MarkerEntry[] = destinations
    .map((d) => { const co = C[d.city]; return co ? { lat: co[0], lng: co[1], dest: d } : null; })
    .filter(Boolean) as MarkerEntry[];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || markers.length === 0) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const size = 600;

    import("cobe").then(({ default: createGlobe }) => {
      const cobeMarkers = markers.map((m) => ({
        location: [m.lat, m.lng] as [number, number],
        size: m.dest.section === "dream" ? 0.05 : 0.07,
        color: m.dest.section === "dream" ? dreamCobe : seasonCobe,
      }));

      const globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 20000,
        mapBrightness: 4.5,
        baseColor: [0.12, 0.12, 0.13],
        markerColor: seasonCobe,
        glowColor: [0.08, 0.07, 0.06],
        markers: cobeMarkers,
      });

      globeRef.current = globe;

      // Auto-rotate via requestAnimationFrame
      function animate() {
        phiRef.current += 0.0025;
        globe.update({ phi: phiRef.current });
        rafRef.current = requestAnimationFrame(animate);
      }
      rafRef.current = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      globeRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Pointer projection for tooltip hit-testing ─────────────────────────
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    const W = 600 * dpr;
    const scale = W / rect.width;
    const cx = (e.clientX - rect.left) * scale;
    const cy = (e.clientY - rect.top) * scale;
    const HIT = W * 0.04;

    for (const m of markers) {
      const lr = (m.lng * Math.PI) / 180;
      const la = (m.lat * Math.PI) / 180;
      const cl = Math.cos(la);
      const x = cl * Math.sin(lr - phiRef.current);
      const y = Math.sin(la) * Math.cos(0.25) - cl * Math.cos(lr - phiRef.current) * Math.sin(0.25);
      const z = Math.sin(la) * Math.sin(0.25) + cl * Math.cos(lr - phiRef.current) * Math.cos(0.25);
      if (z < 0) continue;
      const px = (0.5 + x / 2) * W;
      const py = (0.5 - y / 2) * W;
      if (Math.hypot(px - cx, py - cy) < HIT) {
        setHovered({ dest: m.dest, x: e.clientX - rect.left, y: e.clientY - rect.top });
        return;
      }
    }
    setHovered(null);
  }

  if (markers.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[440px] aspect-square"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHovered(null)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ borderRadius: "50%" }}
        aria-label="Destination globe"
      />

      {hovered && (
        <div className="absolute z-20 pointer-events-none" style={{ left: hovered.x + 16, top: hovered.y - 8, maxWidth: 200 }}>
          <div className="luxury-card p-3 space-y-1.5 shadow-xl">
            <p className="text-sm font-medium text-foreground leading-tight">{hovered.dest.city}</p>
            <p className="text-[11px] text-muted-foreground/60">{hovered.dest.country}</p>
            <span className={`inline-block text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border bg-transparent ${
              hovered.dest.section === "dream" ? "border-plum/25 text-plum/70" : "border-champagne/25 text-champagne/80"
            }`}>
              {hovered.dest.timingFit === "perfect" || hovered.dest.timingFit === "good"
                ? "Great around your birthday"
                : `Best in ${(hovered.dest.bestMonths ?? []).slice(0, 2).join(" & ")}`}
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seasonColor || "#d4af37", boxShadow: `0 0 5px ${seasonColor || "#d4af37"}80` }} />
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/55">Season match</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dreamColor || "#9b72cf", boxShadow: `0 0 5px ${dreamColor || "#9b72cf"}70` }} />
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">Dream pick</span>
        </div>
      </div>
    </div>
  );
}

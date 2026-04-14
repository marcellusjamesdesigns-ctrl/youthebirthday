"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

interface HeroGemProps {
  mouse: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
}

/* ── Gold ring model ─────────────────────────────────────────────────────── */

function GoldRing({
  mouse,
  scroll,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
}) {
  const { scene } = useGLTF("/models/gold-ring.glb");
  const ref = useRef<THREE.Group>(null!);
  const [entered, setEntered] = useState(false);
  const entranceStart = useRef(0);

  // Center the model (its bbox is offset)
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  // Boost materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.metalness !== undefined) {
          mat.metalness = 0.85;
          mat.roughness = 0.12;
        }
        mat.envMapIntensity = 2;
        mat.needsUpdate = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const m = mouse.current;
    const s = scroll.current;

    // Entrance
    if (entered && entranceStart.current === 0) entranceStart.current = t;
    const entranceT = entered ? Math.min(1, (t - entranceStart.current) / 2) : 0;
    const ease = 1 - Math.pow(1 - entranceT, 3);

    const currentScale = THREE.MathUtils.lerp(0.1, 0.22, ease);
    ref.current.scale.setScalar(currentScale - s * 0.05);

    // Cursor-reactive tilt
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      (m.x - 0.5) * 0.5 + t * 0.08,
      0.03
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      (m.y - 0.5) * -0.2 + 0.3,
      0.03
    );

    // Scroll parallax
    ref.current.position.y = THREE.MathUtils.lerp(0, 0.8, s);
    ref.current.position.z = -s * 1;
  });

  return (
    <group ref={ref} scale={0.22}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Cursor-following warm highlight ─────────────────────────────────────── */

function CursorLight({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const m = mouse.current;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, (m.x - 0.5) * 4, 0.04);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, (m.y - 0.5) * -2 + 1, 0.04);
  });

  return <pointLight ref={ref} position={[0, 1, 3]} intensity={4} color="#f5e6c8" distance={10} />;
}

/* ── Scene ────────────────────────────────────────────────────────────────── */

function Scene({ mouse, scroll }: { mouse: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#f5f0eb" />
      <directionalLight position={[4, 5, 4]} intensity={2.5} color="#fff5e6" />
      <directionalLight position={[-3, 3, 3]} intensity={1.2} color="#e8e0f0" />
      <pointLight position={[-1, 3, -3]} intensity={6} color="#d4af37" distance={10} />
      <pointLight position={[2, -1, 2]} intensity={2} color="#f0d060" distance={6} />
      <CursorLight mouse={mouse} />
      <Environment preset="city" environmentIntensity={0.6} />

      <Float speed={0.8} rotationIntensity={0.04} floatIntensity={0.2}>
        <GoldRing mouse={mouse} scroll={scroll} />
      </Float>
    </>
  );
}

/* ── Export ────────────────────────────────────────────────────────────────── */

export function HeroGem({ mouse, scroll }: HeroGemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "opacity-[0.38]" : "opacity-0"
      }`}
      style={{
        maskImage: "radial-gradient(ellipse 60% 50% at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,1) 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 50% at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,1) 100%)",
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 35 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.3,
          }}
          dpr={[1, 1.5]}
          style={{ background: "transparent" }}
        >
          <Scene mouse={mouse} scroll={scroll} />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/models/gold-ring.glb");

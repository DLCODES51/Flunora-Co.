"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh } from "three";

function YarnBall() {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.08;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} castShadow>
        <torusKnotGeometry args={[1, 0.34, 220, 28, 2, 5]} />
        <meshStandardMaterial
          color="#E8D3B0"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
    </Float>
  );
}

export function CrochetScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} color="#FFF4DE" />
        <directionalLight position={[-3, -2, 2]} intensity={0.35} color="#DDE7D8" />
        <YarnBall />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}
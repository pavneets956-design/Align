"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ALIGN palette
const ALIGN_BLUE = "#4A6CF7";
const GOLDEN_ACTION = "#F4C947";
const SLATE = "#1C1F26";

function FloatingOrbGroup() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;
    // gentle float + subtle rotation
    group.current.position.y = 0.1 + Math.sin(t * 1.2) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.4) * 0.25;
  });

  return (
    <group ref={group}>
      {/* Rising Sun / Orb */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshStandardMaterial
          color={GOLDEN_ACTION}
          emissive={GOLDEN_ACTION}
          emissiveIntensity={0.35}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Horizon line */}
      <mesh position={[0, -0.15, 0]}>
        {/* thin, wide box to feel like a line */}
        <boxGeometry args={[1.8, 0.06, 0.12]} />
        <meshStandardMaterial
          color={ALIGN_BLUE}
          emissive={ALIGN_BLUE}
          emissiveIntensity={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* Subtle base / ground for shadow feeling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <circleGeometry args={[2, 64]} />
        <meshStandardMaterial
          color={SLATE}
          transparent
          opacity={0.65}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

const AlignOrbCanvas: React.FC = () => {
  return (
    <div className="w-full h-72 md:h-80 rounded-3xl bg-[#05060A] border border-slate-800/80 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.6, 3.3], fov: 40 }}
        dpr={[1, 2]}
      >
        {/* Lights */}
        <ambientLight intensity={0.25} />
        <directionalLight
          intensity={0.9}
          position={[2, 3, 4]}
          color={0xffffff}
        />
        <spotLight
          intensity={0.7}
          angle={0.4}
          penumbra={0.5}
          position={[-2, 4, 3]}
          castShadow
        />

        {/* Background gradient using a big plane */}
        <mesh position={[0, 0, -4]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            color={SLATE}
          />
        </mesh>

        <FloatingOrbGroup />

        {/* Controls – restricted so user can nudge it, not spin like crazy */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
        />
      </Canvas>
    </div>
  );
};

export default AlignOrbCanvas;


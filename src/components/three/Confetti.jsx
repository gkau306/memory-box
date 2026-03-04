import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 200;
const COLORS = [0xf2a8a8, 0x8fad88, 0xffe080, 0xd4a96a, 0xf5efe6];

export default function Confetti({ active, onDone }) {
  const meshRef = useRef();
  const startTime = useRef(null);
  const prevActive = useRef(false);

  useEffect(() => {
    if (!active) prevActive.current = false;
  }, [active]);

  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const velocities = [];
    const color = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      color.setHex(COLORS[Math.floor(Math.random() * COLORS.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      velocities.push({
        vx: (Math.random() - 0.5) * 0.08,
        vy: 0.04 + Math.random() * 0.06,
        vz: (Math.random() - 0.5) * 0.08,
        rot: (Math.random() - 0.5) * 0.2,
      });
    }
    return { positions, colors, velocities };
  }, []);

  useFrame((state) => {
    if (!active || !meshRef.current) return;
    if (!prevActive.current) startTime.current = null;
    prevActive.current = true;
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startTime.current;
    const pos = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const v = velocities[i];
      pos[i * 3] += v.vx;
      pos[i * 3 + 1] += v.vy;
      pos[i * 3 + 2] += v.vz;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    if (t > 3 && onDone) {
      onDone();
    }
  });

  if (!active) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

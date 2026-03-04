import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBoxStore } from '../../store/boxStore';

const COUNT = 8;
const BASE_Y = 1.8;
const BASE_Z = -1.2;

export default function FairyLights() {
  const lightsRef = useRef([]);
  const { lidOpen } = useBoxStore();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    lightsRef.current.forEach((light, i) => {
      if (!light) return;
      const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.8);
      light.intensity = lidOpen ? 0.4 + twinkle * 0.5 : 0.1;
    });
  });

  return (
    <group position={[-2.7, 0, 0]}>
      {Array.from({ length: COUNT }).map((_, i) => (
        <pointLight
          key={i}
          ref={(el) => (lightsRef.current[i] = el)}
          color={0xffe080}
          intensity={0.8}
          distance={4}
          position={[i * 0.72, BASE_Y, BASE_Z]}
          decay={2}
        />
      ))}
    </group>
  );
}

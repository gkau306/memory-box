import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { assetUrls } from '../../utils/textures';
import { useBoxStore } from '../../store/boxStore';

const BOX_W = 6;
const BOX_D = 5;
const BOX_H = 1.2;
const LID_H = 0.2;

export default function Box3D() {
  const lidRef = useRef();
  const { lidOpen } = useBoxStore();

  const floralTexture = useTexture(assetUrls.boxFloral);
  floralTexture.wrapS = floralTexture.wrapT = THREE.RepeatWrapping;
  floralTexture.colorSpace = THREE.SRGBColorSpace;

  const cardboard = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4a96a,
        roughness: 0.9,
        metalness: 0,
      }),
    []
  );

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floralTexture,
        roughness: 0.8,
        metalness: 0,
      }),
    [floralTexture]
  );

  const lidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floralTexture.clone(),
        roughness: 0.8,
        metalness: 0,
      }),
    [floralTexture]
  );

  useFrame((_, delta) => {
    if (!lidRef.current) return;
    const targetX = lidOpen ? -Math.PI * 0.75 : 0;
    lidRef.current.rotation.x += (targetX - lidRef.current.rotation.x) * Math.min(1, delta * 4);
  });

  return (
    <group position={[0, BOX_H / 2, 0]}>
      {/* Base / floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -BOX_H / 2, 0]}
        material={floorMat}
      >
        <planeGeometry args={[BOX_W, BOX_D]} />
      </mesh>

      {/* Walls — cardboard */}
      <mesh
        position={[0, 0, BOX_D / 2]}
        material={cardboard}
      >
        <boxGeometry args={[BOX_W + 0.2, BOX_H, 0.2]} />
      </mesh>
      <mesh position={[0, 0, -BOX_D / 2]} material={cardboard}>
        <boxGeometry args={[BOX_W + 0.2, BOX_H, 0.2]} />
      </mesh>
      <mesh position={[BOX_W / 2, 0, 0]} material={cardboard}>
        <boxGeometry args={[0.2, BOX_H, BOX_D + 0.2]} />
      </mesh>
      <mesh position={[-BOX_W / 2, 0, 0]} material={cardboard}>
        <boxGeometry args={[0.2, BOX_H, BOX_D + 0.2]} />
      </mesh>

      {/* Lid — hinged at back edge; pivot at group origin */}
      <group ref={lidRef} position={[0, BOX_H / 2 + LID_H / 2, -BOX_D / 2]}>
        <mesh position={[0, 0, (BOX_D + 0.2) / 2]} material={lidMat}>
          <boxGeometry args={[BOX_W + 0.2, LID_H, BOX_D + 0.2]} />
        </mesh>
      </group>
    </group>
  );
}

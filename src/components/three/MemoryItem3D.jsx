import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { assetUrls } from '../../utils/textures';
import { useBoxStore } from '../../store/boxStore';

const TYPE_TO_ASSET = {
  song: assetUrls.cassette,
  letter: assetUrls.envelope,
  polaroid: assetUrls.polaroid,
  gift: assetUrls.gift,
  trinket: assetUrls.trinket,
};

const W = 1.3;
const H = 1.05;

export default function MemoryItem3D({ item }) {
  const groupRef = useRef();
  const targetY = useRef(0.02);
  const { isCreator, selectedItemId, setSelectedItemId, lidOpen } = useBoxStore();
  const customTrinketUrl = item.type === 'trinket' && item.data?.imageDataUrl ? item.data.imageDataUrl : null;
  const url = customTrinketUrl || TYPE_TO_ASSET[item.type] || assetUrls.envelope;
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;

  if (!item.position) item.position = { x: 0, z: 0 };
  const x = item.position.x ?? 0;
  const z = item.position.z ?? 0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    targetY.current = isCreator ? 0.02 : lidOpen ? 0.5 : -0.2;
    groupRef.current.position.y += (targetY.current - groupRef.current.position.y) * Math.min(1, delta * 5);
  });

  return (
    <group
      ref={groupRef}
      position={[x, 0.02, z]}
      rotation={[-Math.PI / 2, 0, item.rotation || 0]}
    >
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation();
          setSelectedItemId(isCreator ? item.id : null);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = isCreator ? 'grab' : 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          roughness={0.9}
          metalness={0}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
}

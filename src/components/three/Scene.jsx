import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Box3D from './Box3D';
import FairyLights from './FairyLights';
import Confetti from './Confetti';
import MemoryItem3D from './MemoryItem3D';
import { useBoxStore } from '../../store/boxStore';

const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const FLOOR_ORIGIN = new THREE.Vector3();
const FLOOR_RAY = new THREE.Raycaster();
const FLOOR_MOUSE = new THREE.Vector2();

function CameraRig({ isCreator }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isCreator) {
      camera.position.lerp(new THREE.Vector3(0, 5, 8), delta * 2);
      camera.lookAt(0, 0, -1);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 4, 6), delta * 1.5);
      camera.lookAt(0, 0.3, -0.6);
    }
  });

  return null;
}

function DragController() {
  const { camera, gl, size } = useThree();
  const { selectedItemId, setSelectedItemId, updateItemPosition } = useBoxStore();

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e) => {
      if (!selectedItemId) return;
      const ndc = (e.clientX / size.width) * 2 - 1;
      const ndcY = -(e.clientY / size.height) * 2 + 1;
      FLOOR_MOUSE.set(ndc, ndcY);
      FLOOR_RAY.setFromCamera(FLOOR_MOUSE, camera);
      FLOOR_RAY.ray.intersectPlane(FLOOR_PLANE, FLOOR_ORIGIN);
      const x = THREE.MathUtils.clamp(FLOOR_ORIGIN.x, -2.6, 2.6);
      const z = THREE.MathUtils.clamp(FLOOR_ORIGIN.z, -2.2, 2.2);
      updateItemPosition(selectedItemId, { x, z });
    };
    const onUp = () => {
      setSelectedItemId(null);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointerleave', onUp);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointerleave', onUp);
    };
  }, [selectedItemId, setSelectedItemId, updateItemPosition, camera, gl, size]);

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color={0xfff5e0} />
      <directionalLight
        position={[0, 10, 5]}
        intensity={1.2}
        color={0xfff0d0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <FairyLights />
    </>
  );
}

function ItemsGroup() {
  const { boxData } = useBoxStore();

  return (
    <group>
      {boxData.items.map((item) => (
        <MemoryItem3D key={item.id} item={item} />
      ))}
    </group>
  );
}

export default function Scene3D({ mode = 'creator', confettiActive = false, onConfettiDone }) {

  return (
    <div style={{ width: '100%', height: '100vh', background: '#b8864e' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#b8864e']} />
        <Suspense fallback={null}>
          <Lights />
          <Box3D />
          <ItemsGroup />
          <Confetti active={confettiActive} onDone={onConfettiDone} />
          <CameraRig isCreator={mode === 'creator'} />
          {mode === 'creator' && <DragController />}
          {mode === 'creator' && (
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={4}
              maxDistance={15}
              maxPolarAngle={Math.PI / 2 - 0.2}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

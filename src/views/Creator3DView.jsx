import { useEffect } from 'react';
import Scene3D from '../components/three/Scene';
import CreatorUI from '../components/three/CreatorUI';
import { useBoxStore } from '../store/boxStore';

export default function Creator3DView() {
  const setIsCreator = useBoxStore((s) => s.setIsCreator);

  useEffect(() => {
    setIsCreator(true);
  }, [setIsCreator]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', isolation: 'isolate' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Scene3D mode="creator" />
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        <CreatorUI />
      </div>
    </div>
  );
}

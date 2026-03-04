import { useEffect } from 'react';
import Scene3D from '../components/three/Scene';
import RecipientUI from '../components/three/RecipientUI';
import { useBoxStore } from '../store/boxStore';

export default function Recipient3DView({ boxData }) {
  const hydrate = useBoxStore((s) => s.hydrate);
  const setConfettiActive = useBoxStore((s) => s.setConfettiActive);
  const confettiActive = useBoxStore((s) => s.confettiActive);

  useEffect(() => {
    if (boxData) hydrate(boxData);
  }, [boxData, hydrate]);

  const handleConfettiDone = () => {
    setConfettiActive(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', isolation: 'isolate' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Scene3D
        mode="recipient"
        confettiActive={confettiActive}
        onConfettiDone={handleConfettiDone}
      />
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <RecipientUI />
      </div>
    </div>
  );
}

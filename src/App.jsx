import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useBoxState } from './hooks/useBoxState';
import { useShareLink, useDecodeBoxFromHash } from './hooks/useShareLink';
import LandingPage from './components/LandingPage';
import CreatorCanvas from './components/CreatorCanvas';
import BoxReveal from './components/BoxReveal';
import backImg from './assets/back.png';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hasHash = !!location.hash;
  const decodedBox = useDecodeBoxFromHash();
  const {
    boxData,
    setMeta,
    addItem,
    updateItemPosition,
    removeItem,
  } = useBoxState();
  const { shareURL } = useShareLink(boxData);

  if (hasHash && decodedBox) {
    return <BoxReveal boxData={decodedBox} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage setMeta={setMeta} />} />
      <Route
        path="/create"
        element={
          <CreatorCanvas
            boxData={boxData}
            setMeta={setMeta}
            addItem={addItem}
            updateItemPosition={updateItemPosition}
            removeItem={removeItem}
            shareURL={shareURL}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrap">
        <div
          className="app-bg"
          style={{ backgroundImage: `url(${backImg})` }}
          aria-hidden
        />
        <div className="app-content">
          <AppContent />
        </div>
      </div>
    </BrowserRouter>
  );
}

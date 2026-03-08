import { HashRouter, Routes, Route } from 'react-router-dom';
import { useBoxState } from './hooks/useBoxState';
import { useShareLink, useDecodeBoxFromURL } from './hooks/useShareLink';
import LandingPage from './components/LandingPage';
import CreatorCanvas from './components/CreatorCanvas';
import BoxReveal from './components/BoxReveal';
import backImg from './assets/back.png';
import './App.css';

function AppContent() {
  const decodedBox = useDecodeBoxFromURL();
  const {
    boxData,
    setMeta,
    addItem,
    updateItemPosition,
    removeItem,
  } = useBoxState();
  const { shareURL } = useShareLink(boxData);

  if (decodedBox) {
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
    <HashRouter>
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
    </HashRouter>
  );
}

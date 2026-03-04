import { useState } from 'react';
import { itemTypes, itemTypeKeys } from '../../utils/itemTypes';
import { useBoxStore } from '../../store/boxStore';
import { useShareLink } from '../../hooks/useShareLink';
import { encodeBoxData } from '../../utils/encoder';
import AddItemModal from '../AddItemModal';

export default function CreatorUI() {
  const [modalType, setModalType] = useState(null);
  const [sealed, setSealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { boxData, addItem, setMeta, setIsCreator } = useBoxStore();
  const shareURL = (() => {
    if (!boxData?.meta?.to) return '';
    const encoded = encodeBoxData(boxData);
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  })();

  const handleAddConfirm = (data) => {
    if (modalType) addItem(modalType, data);
    setModalType(null);
  };

  const handleCopy = async () => {
    if (!shareURL) return;
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      {/* Top bar only – so middle stays clickable for 3D canvas */}
      <header className="creator-ui-header creator-ui-bar">
        <span className="font-display creator-ui-title">for {boxData.meta?.to || '…'}</span>
        <div className="creator-ui-add-buttons">
          {itemTypeKeys.map((key) => (
            <button
              key={key}
              type="button"
              className="creator-ui-add-btn font-display"
              onClick={() => setModalType(key)}
              title={`Add ${itemTypes[key].label}`}
            >
              + {itemTypes[key].label}
            </button>
          ))}
        </div>
      </header>

      {/* Bottom bar only */}
      <footer className="creator-ui-footer creator-ui-bar">
        <button
          type="button"
          className="creator-ui-seal font-display"
          onClick={() => shareURL && setSealed(true)}
          disabled={!shareURL}
        >
          Seal & Send 💌
        </button>
        {sealed && shareURL && (
          <div className="creator-ui-link-wrap">
            <input readOnly value={shareURL} className="creator-ui-link-input" />
            <button
              type="button"
              className="creator-ui-copy font-display"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        )}
      </footer>

      <AddItemModal
        isOpen={!!modalType}
        type={modalType}
        onClose={() => setModalType(null)}
        onConfirm={handleAddConfirm}
      />
    </>
  );
}

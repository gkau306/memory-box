import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { itemTypes, itemTypeKeys } from '../utils/itemTypes';
import MemoryItem from './MemoryItem';
import AddItemModal from './AddItemModal';
import ExportBar from './ExportBar';
import RecordPlayerView from './RecordPlayerView';
import boxOpenImg from '../assets/box.png';

export default function CreatorCanvas({
  boxData,
  setMeta,
  addItem,
  updateItemPosition,
  removeItem,
  shareURL,
}) {
  const [modalType, setModalType] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const draggedIdRef = useRef(null);

  const handleAddConfirm = (type, data) => {
    addItem(type, data);
    setModalType(null);
  };

  const handleItemClick = (item) => {
    if (draggedIdRef.current === item.id) {
      draggedIdRef.current = null;
      return;
    }
    setExpandedItem(item);
  };

  return (
    <div className="creator-layout">
      <header className="creator-header">
        <span className="font-display creator-title">
          for {boxData.meta.to || '…'}
        </span>
        <div className="creator-add-buttons">
          {itemTypeKeys.map((key) => (
            <motion.button
              key={key}
              type="button"
              className="add-type-btn"
              onClick={() => setModalType(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Add ${itemTypes[key].label}`}
            >
              <img src={itemTypes[key].asset} alt="" className="add-type-icon" />
              <span className="font-display">+ {itemTypes[key].label}</span>
            </motion.button>
          ))}
        </div>
      </header>

      <div className="creator-canvas">
        <div
          className="canvas-inner canvas-inner-box"
          style={{ backgroundImage: `url(${boxOpenImg})` }}
        >
          <AnimatePresence mode="popLayout">
            {boxData.items.map((item) => (
              <motion.div
                key={item.id}
                className="memory-item-outer"
                style={{
                  position: 'absolute',
                  left: item.position.x,
                  top: item.position.y,
                }}
                initial={{ y: -300, opacity: 0, rotate: 0, scale: 0.6 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotate: item.rotation,
                  scale: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 18,
                  delay: 0,
                }}
                drag={true}
                dragMomentum={false}
                dragElastic={0}
                onDragStart={() => { draggedIdRef.current = item.id; }}
                onDragEnd={(_, info) => {
                  updateItemPosition(item.id, {
                    x: item.position.x + info.offset.x,
                    y: item.position.y + info.offset.y,
                  });
                }}
              >
                <MemoryItem
                  item={item}
                  isCreator
                  onRemove={removeItem}
                  onClick={handleItemClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ExportBar shareURL={shareURL} />

      <AddItemModal
        isOpen={!!modalType}
        type={modalType}
        onClose={() => setModalType(null)}
        onConfirm={(data) => modalType && handleAddConfirm(modalType, data)}
      />

      <AnimatePresence>
        {expandedItem && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedItem(null)}
          >
            <motion.div
              className={`modal-paper expand-modal ${expandedItem.type === 'song' ? 'expand-modal--wide' : ''}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="expand-close"
                onClick={() => setExpandedItem(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <h3 className="font-display">{getPreviewTitle(expandedItem)}</h3>
              <div className="expand-body">
                {expandedItem.type === 'song' ? (
                  <RecordPlayerView item={expandedItem} />
                ) : (
                  renderExpandContent(expandedItem)
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getPreviewTitle(item) {
  const d = item.data ?? {};
  return d.title ?? d.name ?? item.type ?? 'Memory';
}

function renderExpandContent(item) {
  const d = item.data ?? {};
  switch (item.type) {
    case 'song':
      return (
        <>
          {d.note && <p className="expand-note">{d.note}</p>}
          {d.link && (
            <a href={d.link} target="_blank" rel="noopener noreferrer" className="expand-link">
              Listen →
            </a>
          )}
        </>
      );
    case 'letter':
      return <p className="expand-letter">{d.body}</p>;
    case 'polaroid':
      return (
        <div className="expand-polaroid">
          {d.imageDataUrl && (
            <div
              className="expand-polaroid-photo"
              style={{ backgroundImage: `url(${d.imageDataUrl})` }}
            />
          )}
          {d.emoji && <span className="expand-emoji">{d.emoji}</span>}
          {d.caption && <p>{d.caption}</p>}
        </div>
      );
    case 'gift':
      return (
        <>
          <p>{[d.type, d.amount].filter(Boolean).join(' — ')}</p>
          {d.note && <p className="expand-note">{d.note}</p>}
        </>
      );
    case 'trinket':
      return (
        <>
          {d.emoji && <span className="expand-emoji">{d.emoji}</span>}
          {d.name && <p><strong>{d.name}</strong></p>}
          {d.note && <p className="expand-note">{d.note}</p>}
        </>
      );
    default:
      return <pre>{JSON.stringify(d, null, 2)}</pre>;
  }
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryItem from './MemoryItem';
import ReplyModal from './ReplyModal';
import RecordPlayerView from './RecordPlayerView';
import boxOpenImg from '../assets/box.png';

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

export default function RecipientView({ boxData }) {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <div className="recipient-layout">
      <header className="recipient-header">
        <span className="font-display">for {boxData.meta?.to}</span>
        <span className="font-display from-label">from {boxData.meta?.from}</span>
      </header>

      <div className="creator-canvas recipient-canvas">
        <div
          className="canvas-inner canvas-inner-box"
          style={{ backgroundImage: `url(${boxOpenImg})` }}
        >
          {boxData.items.map((item, i) => (
            <motion.div
              key={item.id}
              className="memory-item-outer"
              style={{
                position: 'absolute',
                left: item.position.x,
                top: item.position.y,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 200, damping: 18 }}
            >
              <MemoryItem
                item={item}
                isCreator={false}
                onClick={setExpandedItem}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="recipient-footer">
        {boxData.reply ? (
          <div className="reply-display">
            <p className="font-display reply-display-label">They wrote back:</p>
            <p className="reply-display-text">{boxData.reply}</p>
          </div>
        ) : (
          <motion.button
            type="button"
            className="reply-btn font-display"
            onClick={() => setReplyModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Write back 💌
          </motion.button>
        )}
      </footer>

      <ReplyModal
        isOpen={replyModalOpen}
        boxData={boxData}
        onClose={() => setReplyModalOpen(false)}
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

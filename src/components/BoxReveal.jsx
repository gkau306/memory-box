import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipientView from './RecipientView';
import boxOpenImg from '../assets/box.png';
import boxClosedImg from '../assets/box_close.png';

export default function BoxReveal({ boxData, onOpenComplete }) {
  const [opened, setOpened] = useState(false);
  const [phase, setPhase] = useState('closed'); // closed | opening | open

  const handleOpen = () => {
    setOpened(true);
    setPhase('opening');
    setTimeout(() => {
      setPhase('open');
      onOpenComplete?.();
    }, 1200);
  };

  return (
    <div className="box-reveal">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="closed"
            className="box-reveal-closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={boxClosedImg}
              alt="Closed memory box"
              className="box-reveal-img"
            />
            <p className="font-display box-reveal-for">for {boxData.meta?.to}</p>
            <motion.button
              type="button"
              className="box-reveal-open-btn font-display"
              onClick={handleOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open 🎀
            </motion.button>
          </motion.div>
        ) : phase === 'opening' ? (
          <motion.div
            key="opening"
            className="box-reveal-opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={boxOpenImg}
              alt="Open memory box"
              className="box-reveal-img box-reveal-img-open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
            <motion.div
              className="box-reveal-sparkles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[...Array(12)].map((_, i) => (
                <span key={i} className="sparkle" style={{ '--i': i }}>✦</span>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="box-reveal-done"
          >
            <RecipientView boxData={boxData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

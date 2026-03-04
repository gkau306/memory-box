import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ExportBar({ shareURL }) {
  const [copied, setCopied] = useState(false);
  const [sealed, setSealed] = useState(false);

  const handleCopy = async () => {
    if (!shareURL) return;
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select and show
    }
  };

  const handleSeal = () => {
    if (shareURL) setSealed(true);
  };

  return (
    <footer className="export-bar">
      <div className="export-bar-inner">
        <motion.button
          type="button"
          className="export-seal-btn font-display"
          onClick={handleSeal}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!shareURL}
        >
          Seal & Send 💌
        </motion.button>
        {shareURL && sealed && (
          <div className="export-link-wrap">
            <input
              readOnly
              value={shareURL}
              className="export-link-input"
            />
            <motion.button
              type="button"
              className="export-copy-btn font-display"
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? 'Copied!' : 'Copy link'}
            </motion.button>
          </div>
        )}
      </div>
    </footer>
  );
}

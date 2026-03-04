import { useState } from 'react';
import { motion } from 'framer-motion';
import { encodeBoxData } from '../utils/encoder';

export default function ReplyModal({ isOpen, boxData, onClose }) {
  const [replyText, setReplyText] = useState(boxData?.reply ?? '');
  const [copied, setCopied] = useState(false);

  const replyURL = (() => {
    if (!replyText.trim() || !boxData) return '';
    const withReply = { ...boxData, reply: replyText.trim() };
    const encoded = encodeBoxData(withReply);
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  })();

  const handleCopy = async () => {
    if (!replyURL) return;
    try {
      await navigator.clipboard.writeText(replyURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-paper"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display modal-title">Write your reply</h2>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="write your reply..."
          className="modal-textarea reply-textarea"
          rows={5}
        />
        <div className="modal-actions">
          <button type="button" className="modal-btn secondary" onClick={onClose}>
            Cancel
          </button>
          {replyURL ? (
            <motion.button
              type="button"
              className="modal-btn primary"
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? 'Copied!' : 'Copy link & send back'}
            </motion.button>
          ) : (
            <button type="button" className="modal-btn primary" disabled>
              Add reply to copy link
            </button>
          )}
        </div>
        {replyURL && (
          <p className="reply-hint">Copy this link and send it back to {boxData?.meta?.from}!</p>
        )}
      </motion.div>
    </motion.div>
  );
}

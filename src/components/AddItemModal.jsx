import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { itemTypes } from '../utils/itemTypes';
import { readAudioAsDataUrl } from './RecordPlayerView';

const typeFields = {
  song: [
    { key: 'title', label: 'Song title', placeholder: 'e.g. Enchanted - Taylor Swift', type: 'text' },
    { key: 'note', label: 'Why this song?', placeholder: 'this song is literally us', type: 'textarea' },
    { key: 'link', label: 'YouTube link (optional)', placeholder: 'https://youtube.com/watch?v=...', type: 'url' },
  ],
  letter: [
    { key: 'title', label: 'Title', placeholder: 'things I love about you', type: 'text' },
    { key: 'body', label: 'Your letter', placeholder: 'okay so where do I even begin...', type: 'textarea' },
  ],
  polaroid: [
    { key: 'emoji', label: 'Scene emoji', placeholder: '🌸', type: 'text' },
    { key: 'caption', label: 'Caption', placeholder: 'that day at the park', type: 'text' },
  ],
  gift: [
    { key: 'type', label: 'Type', placeholder: 'cash / gift card / treat', type: 'text' },
    { key: 'amount', label: 'Amount or description', placeholder: 'coffee on me', type: 'text' },
    { key: 'note', label: 'Note', placeholder: 'for you always', type: 'textarea' },
  ],
  trinket: [
    { key: 'emoji', label: 'Emoji', placeholder: '✨', type: 'text' },
    { key: 'name', label: 'Name', placeholder: 'lucky charm', type: 'text' },
    { key: 'note', label: 'Memory note', placeholder: 'from our trip to...', type: 'textarea' },
  ],
};

const emptyData = (type) => {
  const keys = typeFields[type]?.map((f) => f.key) ?? [];
  const base = Object.fromEntries(keys.map((k) => [k, '']));
  if (type === 'song') base.audioDataUrl = '';
  if (type === 'polaroid' || type === 'trinket') base.imageDataUrl = '';
  return base;
};

const MAX_AUDIO_MB = 2;
const MAX_IMAGE_MB = 1.5;

export default function AddItemModal({ isOpen, type, onClose, onConfirm }) {
  const [data, setData] = useState(() => emptyData(type));
  const [uploadError, setUploadError] = useState(null);
  const config = itemTypes[type];
  const fields = typeFields[type] ?? [];

  useEffect(() => {
    if (isOpen) setUploadError(null);
  }, [isOpen, type]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (key === 'audioDataUrl' || key === 'imageDataUrl') setUploadError(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image (e.g. jpg, png).');
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setUploadError(`Keep image under ${MAX_IMAGE_MB}MB so the link stays shareable.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => handleChange('imageDataUrl', reader.result);
    reader.onerror = () => setUploadError('Could not read file.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith('audio/')) {
      setUploadError('Please choose an audio file (e.g. mp3, m4a, wav).');
      return;
    }
    try {
      const dataUrl = await readAudioAsDataUrl(file);
      handleChange('audioDataUrl', dataUrl);
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(data);
    setData(emptyData(type));
    onClose();
  };

  const handleClose = () => {
    setData(emptyData(type));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-paper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display modal-title">Add {config?.label ?? type}</h2>
            <form onSubmit={handleSubmit}>
              {fields.map(({ key, label, placeholder, type: inputType }) => (
                <label key={key} className="modal-label">
                  <span className="font-display">{label}</span>
                  {inputType === 'textarea' ? (
                    <textarea
                      value={data[key] ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="modal-textarea"
                      rows={4}
                    />
                  ) : (
                    <input
                      type={inputType}
                      value={data[key] ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="modal-input"
                    />
                  )}
                </label>
              ))}
              {type === 'song' && (
                <label className="modal-label record-upload-label">
                  <span className="font-display">Or upload your recording</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="record-upload-input"
                  />
                  <span className="record-upload-hint">mp3, m4a, wav — max {MAX_AUDIO_MB}MB</span>
                  {data.audioDataUrl && <span className="record-upload-done">✓ Recording added</span>}
                  {uploadError && <span className="record-upload-error">{uploadError}</span>}
                </label>
              )}
              {type === 'polaroid' && (
                <label className="modal-label record-upload-label">
                  <span className="font-display">Upload a photo (goes inside the frame)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="record-upload-input"
                  />
                  <span className="record-upload-hint">jpg, png — max {MAX_IMAGE_MB}MB</span>
                  {data.imageDataUrl && <span className="record-upload-done">✓ Photo added</span>}
                  {uploadError && type === 'polaroid' && <span className="record-upload-error">{uploadError}</span>}
                </label>
              )}
              {type === 'trinket' && (
                <label className="modal-label record-upload-label">
                  <span className="font-display">Upload your trinket image (PNG)</span>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleImageUpload}
                    className="record-upload-input"
                  />
                  <span className="record-upload-hint">PNG — max {MAX_IMAGE_MB}MB</span>
                  {data.imageDataUrl && <span className="record-upload-done">✓ Image added</span>}
                  {uploadError && type === 'trinket' && <span className="record-upload-error">{uploadError}</span>}
                </label>
              )}
              <div className="modal-actions">
                <button type="button" className="modal-btn secondary" onClick={handleClose}>
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="modal-btn primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to box ✨
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

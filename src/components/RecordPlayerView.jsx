import { motion } from 'framer-motion';
import { getYouTubeEmbedUrl } from '../utils/youtube';

const MAX_AUDIO_SIZE_MB = 2;

export function readAudioAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      reject(new Error(`Please keep recordings under ${MAX_AUDIO_SIZE_MB}MB so the link stays shareable.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function RecordPlayerView({ item }) {
  const d = item?.data ?? {};
  const embedUrl = getYouTubeEmbedUrl(d.link);
  const hasUpload = !!d.audioDataUrl;

  return (
    <motion.div
      className="record-player-view"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {d.title && (
        <h4 className="record-player-title font-display">{d.title}</h4>
      )}
      {d.note && (
        <p className="record-player-note">{d.note}</p>
      )}

      <div className="record-player-deck">
        {embedUrl ? (
          <div className="record-player-embed-wrap">
            <div className="record-player-vinyl" aria-hidden />
            <iframe
              src={embedUrl}
              title="YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="record-player-iframe"
            />
          </div>
        ) : hasUpload ? (
          <div className="record-player-upload-wrap">
            <div className="record-player-vinyl" aria-hidden />
            <audio
              controls
              src={d.audioDataUrl}
              className="record-player-audio"
              preload="metadata"
            >
              Your browser doesn’t support audio playback.
            </audio>
          </div>
        ) : (
          <div className="record-player-empty">
            <span className="record-player-empty-icon">🎵</span>
            <p>No link or recording yet.</p>
            {d.link && (
              <a href={d.link} target="_blank" rel="noopener noreferrer" className="expand-link">
                Open link →
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

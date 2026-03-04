import { useState } from 'react';
import { useBoxStore } from '../../store/boxStore';
import ReplyModal from '../ReplyModal';

export default function RecipientUI() {
  const [replyOpen, setReplyOpen] = useState(false);
  const { boxData, lidOpen, setLidOpen, setConfettiActive } = useBoxStore();

  const handleOpen = () => {
    setLidOpen(true);
    setConfettiActive(true);
  };

  return (
    <>
      <div className="recipient-ui-overlay">
        {!lidOpen ? (
          <div className="recipient-ui-prompt">
            <p className="font-display recipient-ui-for">for {boxData.meta?.to}</p>
            <button
              type="button"
              className="recipient-ui-open font-display"
              onClick={handleOpen}
            >
              Open me 🎀
            </button>
          </div>
        ) : (
          <div className="recipient-ui-after">
            <button
              type="button"
              className="recipient-ui-reply font-display"
              onClick={() => setReplyOpen(true)}
            >
              Write back 💌
            </button>
            {boxData.reply && (
              <div className="recipient-ui-reply-display">
                <p className="font-display">They wrote back:</p>
                <p>{boxData.reply}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ReplyModal
        isOpen={replyOpen}
        boxData={boxData}
        onClose={() => setReplyOpen(false)}
      />
    </>
  );
}

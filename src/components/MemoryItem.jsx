import { useState } from 'react';
import { motion } from 'framer-motion';
import { getItemType } from '../utils/itemTypes';

export default function MemoryItem({
  item,
  isCreator,
  onRemove,
  onClick,
}) {
  const [isHovered, setHovered] = useState(false);
  const config = getItemType(item.type);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(item);
  };

  return (
    <motion.div
      className="memory-item-wrap"
      style={{ zIndex: isHovered ? 50 : 1 }}
      initial={false}
      animate={{ rotate: item.rotation, x: 0, y: 0 }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      whileHover={isCreator ? { scale: 1.06 } : { scale: 1.02 }}
      onClick={handleClick}
    >
      <div className="memory-item">
        {item.type === 'polaroid' && item.data?.imageDataUrl ? (
          <div className="memory-item-polaroid">
            <div
              className="memory-item-polaroid-photo"
              style={{ backgroundImage: `url(${item.data.imageDataUrl})` }}
            />
            <img
              src={config.asset}
              alt=""
              className="memory-item-polaroid-frame"
              draggable={false}
            />
          </div>
        ) : item.type === 'trinket' && item.data?.imageDataUrl ? (
          <img
            src={item.data.imageDataUrl}
            alt=""
            className="memory-item-asset"
            draggable={false}
          />
        ) : (
          <>
            <img
              src={config.asset}
              alt=""
              className="memory-item-asset"
              draggable={false}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling?.classList.add('visible');
              }}
            />
            <div className="memory-item-placeholder" aria-hidden>
              {config.label}
            </div>
          </>
        )}
        {isCreator && isHovered && (
          <motion.button
            type="button"
            className="memory-item-delete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(item.id);
            }}
            aria-label="Remove"
          >
            ✕
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Config for each memory box item type: asset path, label, accent color.
 * Assets in src/assets/ are imported; others live in public/images/.
 */
import letterImg from '../assets/letter.png';
import cassetteImg from '../assets/cassete.png';
import polaroidImg from '../assets/polaroid.png';

export const itemTypes = {
  song: {
    key: 'song',
    label: 'Song',
    asset: cassetteImg,
    color: '#8fad88',
  },
  letter: {
    key: 'letter',
    label: 'Letter',
    asset: letterImg,
    color: '#f2a8a8',
  },
  polaroid: {
    key: 'polaroid',
    label: 'Polaroid',
    asset: polaroidImg,
    color: '#d4a96a',
  },
  gift: {
    key: 'gift',
    label: 'Gift',
    asset: '/images/giftcard.svg',
    color: '#f2a8a8',
  },
  trinket: {
    key: 'trinket',
    label: 'Trinket',
    asset: '/images/trinket-tag.svg',
    color: '#8fad88',
  },
};

export const itemTypeKeys = Object.keys(itemTypes);

export function getItemType(type) {
  return itemTypes[type] ?? itemTypes.letter;
}

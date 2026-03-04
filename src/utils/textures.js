/**
 * Asset URLs for Three.js texture loading.
 * useTexture(drei) or useLoader(THREE.TextureLoader, url) in components.
 */

// Box interior (floral) — from src/assets
import boxFloral from '../assets/unnamed__2_-removebg-preview.png';

// Item sprites — public or assets
const base = import.meta.env.BASE_URL || '/';
export const assetUrls = {
  boxFloral,
  cassette: `${base}images/cassette.svg`,
  envelope: `${base}images/envelope.svg`,
  polaroid: `${base}images/polaroid.svg`,
  gift: `${base}images/giftcard.svg`,
  trinket: `${base}images/trinket-tag.svg`,
};

export { boxFloral };

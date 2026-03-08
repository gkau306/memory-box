import pako from 'pako';

/**
 * Encode box data to a compressed, URL-safe base64 string (for sharing, no backend).
 * Uses pako (zlib) compression to reduce URL length significantly.
 */

export function encodeBoxData(boxData) {
  const json = JSON.stringify(boxData);
  // Compress using pako deflate
  const compressed = pako.deflate(json);
  // Convert Uint8Array to base64
  const base64 = btoa(String.fromCharCode.apply(null, compressed));
  // Make URL-safe: replace + with -, / with _, remove padding =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBoxData(encoded) {
  if (!encoded) return null;
  try {
    // First try compressed format (new)
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add back padding if needed
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decompressed = pako.inflate(bytes, { to: 'string' });
    return JSON.parse(decompressed);
  } catch {
    // Fallback: try old uncompressed format for backwards compatibility
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

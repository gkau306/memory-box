/**
 * Encode box data to a URL-safe base64 string (for sharing, no backend).
 * Decode on recipient side from hash.
 */

export function encodeBoxData(boxData) {
  const json = JSON.stringify(boxData);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeBoxData(encoded) {
  if (!encoded) return null;
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

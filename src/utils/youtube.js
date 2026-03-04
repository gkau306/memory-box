/**
 * Get YouTube embed URL from a watch or share link.
 */
const YT_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.trim().match(YT_REGEX);
  return m ? m[1] : null;
}

export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

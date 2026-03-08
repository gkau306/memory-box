import { useMemo } from 'react';
import { encodeBoxData, decodeBoxData } from '../utils/encoder';

export function useShareLink(boxData) {
  const shareURL = useMemo(() => {
    if (!boxData?.meta?.to) return '';
    const encoded = encodeBoxData(boxData);
    // Use query param instead of hash to avoid conflict with HashRouter
    return `${window.location.origin}${window.location.pathname}?box=${encoded}`;
  }, [boxData]);

  return { shareURL };
}

export function useDecodeBoxFromURL() {
  // Use window.location.search because HashRouter's location.search
  // refers to search params within the hash, not the actual URL
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('box');
  return useMemo(() => {
    return decodeBoxData(encoded);
  }, [encoded]);
}

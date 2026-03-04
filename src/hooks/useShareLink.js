import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { encodeBoxData, decodeBoxData } from '../utils/encoder';

export function useShareLink(boxData) {
  const shareURL = useMemo(() => {
    if (!boxData?.meta?.to) return '';
    const encoded = encodeBoxData(boxData);
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  }, [boxData]);

  return { shareURL };
}

export function useDecodeBoxFromHash() {
  const location = useLocation();
  return useMemo(() => {
    const hash = location.hash.slice(1);
    return decodeBoxData(hash);
  }, [location.hash]);
}

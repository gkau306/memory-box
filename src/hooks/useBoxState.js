import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'memory-box-draft';

function randomRotation() {
  return Math.round((Math.random() - 0.5) * 12);
}

function uuid() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const initialBoxState = () => ({
  meta: {
    to: '',
    from: '',
    createdAt: new Date().toISOString().slice(0, 10),
  },
  items: [],
  reply: null,
});

export function useBoxState(initial = null) {
  const [boxData, setBoxDataState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (initial) return initial;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialBoxState();
      }
    }
    return initialBoxState();
  });

  const setBoxData = useCallback((updater) => {
    setBoxDataState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!initial) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boxData));
    }
  }, [boxData, initial]);

  const setMeta = useCallback((field, value) => {
    setBoxData((d) => ({
      ...d,
      meta: { ...d.meta, [field]: value },
    }));
  }, [setBoxData]);

  const addItem = useCallback((type, data) => {
    const item = {
      id: uuid(),
      type,
      position: { x: 120 + Math.random() * 280, y: 100 + Math.random() * 200 },
      rotation: randomRotation(),
      data,
    };
    setBoxData((d) => ({ ...d, items: [...d.items, item] }));
    return item;
  }, [setBoxData]);

  const updateItem = useCallback((id, updates) => {
    setBoxData((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    }));
  }, [setBoxData]);

  const updateItemPosition = useCallback((id, position) => {
    setBoxData((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, position } : it)),
    }));
  }, [setBoxData]);

  const removeItem = useCallback((id) => {
    setBoxData((d) => ({
      ...d,
      items: d.items.filter((it) => it.id !== id),
    }));
  }, [setBoxData]);

  const setReply = useCallback((reply) => {
    setBoxData((d) => ({ ...d, reply }));
  }, [setBoxData]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setBoxDataState(initialBoxState());
  }, []);

  return {
    boxData,
    setBoxData,
    setMeta,
    addItem,
    updateItem,
    updateItemPosition,
    removeItem,
    setReply,
    clearDraft,
  };
}

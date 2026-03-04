import { create } from 'zustand';

const STORAGE_KEY = 'memory-box-draft';

function uuid() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const initialBox = () => ({
  meta: { to: '', from: '', createdAt: new Date().toISOString().slice(0, 10) },
  items: [],
  reply: null,
});

function loadDraft() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return initialBox();
}

export const useBoxStore = create((set, get) => ({
  boxData: loadDraft(),

  setBoxData: (updater) =>
    set((state) => {
      const next = typeof updater === 'function' ? updater(state.boxData) : updater;
      if (state.isCreator) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { boxData: next };
    }),

  setMeta: (field, value) =>
    set((state) => {
      const next = {
        ...state.boxData,
        meta: { ...state.boxData.meta, [field]: value },
      };
      if (state.isCreator) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { boxData: next };
    }),

  addItem: (type, data) => {
    const item = {
      id: uuid(),
      type,
      position: { x: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 2.8 },
      rotation: (Math.random() - 0.5) * 0.3,
      data,
    };
    set((state) => {
      const next = { ...state.boxData, items: [...state.boxData.items, item] };
      if (state.isCreator) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { boxData: next };
    });
    return item;
  },

  updateItemPosition: (id, position) =>
    set((state) => {
      const next = {
        ...state.boxData,
        items: state.boxData.items.map((it) =>
          it.id === id ? { ...it, position } : it
        ),
      };
      if (state.isCreator) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { boxData: next };
    }),

  removeItem: (id) =>
    set((state) => {
      const next = {
        ...state.boxData,
        items: state.boxData.items.filter((it) => it.id !== id),
      };
      if (state.isCreator) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { boxData: next };
    }),

  setReply: (reply) =>
    set((state) => ({ boxData: { ...state.boxData, reply } })),

  // 3D scene state
  lidOpen: false,
  setLidOpen: (open) => set({ lidOpen: open }),

  recipientPhase: 'closed', // 'closed' | 'zooming' | 'opening' | 'open'
  setRecipientPhase: (phase) => set({ recipientPhase: phase }),

  isCreator: true,
  setIsCreator: (v) => set({ isCreator: v }),

  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  // Hydrate from decoded URL (recipient)
  hydrate: (boxData) => set({ boxData, isCreator: false, lidOpen: false, recipientPhase: 'closed' }),

  confettiActive: false,
  setConfettiActive: (v) => set({ confettiActive: v }),
}));

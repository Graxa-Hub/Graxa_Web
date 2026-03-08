import { create } from "zustand";

export const useModalStore = create((set, get) => ({
  modals: {},

  openModal: (modalId, props = {}) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: true, props },
      },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: false, props: {} },
      },
    })),

  closeAllModals: () => set({ modals: {} }),

  isModalOpen: (modalId) => get().modals[modalId]?.isOpen || false,
  getModalPorps: (modalId) => get().modals[modalId]?.props || {},
}));

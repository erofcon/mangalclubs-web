import { create } from "zustand";

type UIStore = {
    isCartOpen: boolean;
    isAuthModalOpen: boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    openAuthModal: () => void;
    closeAuthModal: () => void;
    toggleAuthModal: () => void;

    closeAllOverlays: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
    isCartOpen: false,
    isAuthModalOpen: false,

    openCart: () =>
        set({
            isCartOpen: true,
            isAuthModalOpen: false,
        }),

    closeCart: () =>
        set({
            isCartOpen: false,
        }),

    toggleCart: () =>
        set((state) => ({
            isCartOpen: !state.isCartOpen,
            isAuthModalOpen: !state.isCartOpen ? false : state.isAuthModalOpen,
        })),

    openAuthModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: true,
        }),

    closeAuthModal: () =>
        set({
            isAuthModalOpen: false,
        }),

    toggleAuthModal: () =>
        set((state) => ({
            isAuthModalOpen: !state.isAuthModalOpen,
            isCartOpen: !state.isAuthModalOpen ? false : state.isCartOpen,
        })),

    closeAllOverlays: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
        }),
}));

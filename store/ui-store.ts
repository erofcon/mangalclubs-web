import { create } from "zustand";

type UIStore = {
    isCartOpen: boolean;
    isAuthModalOpen: boolean;
    isOrderTypeModalOpen: boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    openAuthModal: () => void;
    closeAuthModal: () => void;
    toggleAuthModal: () => void;

    openOrderTypeModal: () => void;
    closeOrderTypeModal: () => void;
    toggleOrderTypeModal: () => void;

    closeAllOverlays: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
    isCartOpen: false,
    isAuthModalOpen: false,
    isOrderTypeModalOpen: false,

    openCart: () =>
        set({
            isCartOpen: true,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: false,
        }),

    closeCart: () =>
        set({
            isCartOpen: false,
        }),

    toggleCart: () =>
        set((state) => ({
            isCartOpen: !state.isCartOpen,
            isAuthModalOpen: !state.isCartOpen ? false : state.isAuthModalOpen,
            isOrderTypeModalOpen: !state.isCartOpen ? false : state.isOrderTypeModalOpen,
        })),

    openAuthModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: true,
            isOrderTypeModalOpen: false,
        }),

    closeAuthModal: () =>
        set({
            isAuthModalOpen: false,
        }),

    toggleAuthModal: () =>
        set((state) => ({
            isAuthModalOpen: !state.isAuthModalOpen,
            isCartOpen: !state.isAuthModalOpen ? false : state.isCartOpen,
            isOrderTypeModalOpen: !state.isAuthModalOpen ? false : state.isOrderTypeModalOpen,
        })),

    openOrderTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: true,
        }),

    closeOrderTypeModal: () =>
        set({
            isOrderTypeModalOpen: false,
        }),

    toggleOrderTypeModal: () =>
        set((state) => ({
            isOrderTypeModalOpen: !state.isOrderTypeModalOpen,
            isCartOpen: !state.isOrderTypeModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isOrderTypeModalOpen ? false : state.isAuthModalOpen,
        })),

    closeAllOverlays: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: false,
        }),
}));

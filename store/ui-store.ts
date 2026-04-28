import {create} from "zustand";

type UIStore = {
    isCartOpen: boolean;
    isAuthModalOpen: boolean;
    isOrderTypeModalOpen: boolean;
    isRestaurantTypeModalOpen: boolean;
    isDeliveryTypeModalOpen: boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    openAuthModal: () => void;
    closeAuthModal: () => void;
    toggleAuthModal: () => void;

    openOrderTypeModal: () => void;
    closeOrderTypeModal: () => void;
    toggleOrderTypeModal: () => void;

    openRestaurantTypeModal: () => void;
    closeRestaurantTypeModal: () => void;
    toggleRestaurantTypeModal: () => void;

    openDeliveryTypeModal: () => void;
    closeDeliveryTypeModal: () => void;
    toggleDeliveryTypeModal: () => void;

    closeAllOverlays: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
    isCartOpen: false,
    isAuthModalOpen: false,
    isOrderTypeModalOpen: false,
    isRestaurantTypeModalOpen: false,
    isDeliveryTypeModalOpen: false,

    openCart: () =>
        set({
            isCartOpen: true,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
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
            isRestaurantTypeModalOpen: !state.isCartOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isCartOpen ? false : state.isDeliveryTypeModalOpen,
        })),

    openAuthModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: true,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
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
            isRestaurantTypeModalOpen: !state.isAuthModalOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isAuthModalOpen ? false : state.isDeliveryTypeModalOpen,
        })),

    openOrderTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: true,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
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
            isRestaurantTypeModalOpen: !state.isOrderTypeModalOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isOrderTypeModalOpen ? false : state.isDeliveryTypeModalOpen,
        })),

    openRestaurantTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: true,
            isRestaurantTypeModalOpen: true,
            isDeliveryTypeModalOpen: false,
        }),

    closeRestaurantTypeModal: () =>
        set({
            isRestaurantTypeModalOpen: false,
        }),

    toggleRestaurantTypeModal: () =>
        set((state) => ({
            isRestaurantTypeModalOpen: !state.isRestaurantTypeModalOpen,
            isCartOpen: !state.isRestaurantTypeModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isRestaurantTypeModalOpen ? false : state.isAuthModalOpen,
            isOrderTypeModalOpen: !state.isRestaurantTypeModalOpen ? true : state.isOrderTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isRestaurantTypeModalOpen ? false : state.isDeliveryTypeModalOpen,
        })),

    openDeliveryTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: true,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: true,
        }),

    closeDeliveryTypeModal: () =>
        set({
            isDeliveryTypeModalOpen: false,
        }),

    toggleDeliveryTypeModal: () =>
        set((state) => ({
            isDeliveryTypeModalOpen: !state.isDeliveryTypeModalOpen,
            isCartOpen: !state.isDeliveryTypeModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isDeliveryTypeModalOpen ? false : state.isAuthModalOpen,
            isOrderTypeModalOpen: !state.isDeliveryTypeModalOpen ? true : state.isOrderTypeModalOpen,
            isRestaurantTypeModalOpen: !state.isDeliveryTypeModalOpen ? false : state.isRestaurantTypeModalOpen,
        })),

    closeAllOverlays: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
        }),
}));

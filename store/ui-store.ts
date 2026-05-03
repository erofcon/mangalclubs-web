import {create} from "zustand";

type UIStore = {
    isCartOpen: boolean;
    isAuthModalOpen: boolean;
    isAuthCodeConfirmOpen: boolean;
    isOrderTypeModalOpen: boolean;
    isRestaurantTypeModalOpen: boolean;
    isDeliveryTypeModalOpen: boolean;
    isShowOrderModalOpen: boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    openAuthModal: () => void;
    closeAuthModal: () => void;
    toggleAuthModal: () => void;

    openAuthCodeConfirm: () => void;
    closeAuthCodeConfirm: () => void;
    toggleAuthCodeConfirm: () => void;

    openOrderTypeModal: () => void;
    closeOrderTypeModal: () => void;
    toggleOrderTypeModal: () => void;

    openRestaurantTypeModal: () => void;
    closeRestaurantTypeModal: () => void;
    toggleRestaurantTypeModal: () => void;

    openDeliveryTypeModal: () => void;
    closeDeliveryTypeModal: () => void;
    toggleDeliveryTypeModal: () => void;

    openShowOrderModal: () => void;
    closeShowOrderModal: () => void;
    toggleShowOrderModal: () => void;

    closeAllOverlays: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
    isCartOpen: false,
    isAuthModalOpen: false,
    isAuthCodeConfirmOpen: false,
    isOrderTypeModalOpen: false,
    isRestaurantTypeModalOpen: false,
    isDeliveryTypeModalOpen: false,
    isShowOrderModalOpen: false,

    openCart: () =>
        set({
            isCartOpen: true,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: false,
        }),

    closeCart: () => set({isCartOpen: false}),

    toggleCart: () =>
        set((state) => ({
            isCartOpen: !state.isCartOpen,
            isAuthModalOpen: !state.isCartOpen ? false : state.isAuthModalOpen,
            isAuthCodeConfirmOpen: !state.isCartOpen ? false : state.isAuthCodeConfirmOpen,
            isOrderTypeModalOpen: !state.isCartOpen ? false : state.isOrderTypeModalOpen,
            isRestaurantTypeModalOpen: !state.isCartOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isCartOpen ? false : state.isDeliveryTypeModalOpen,
            isShowOrderModalOpen: !state.isCartOpen ? false : state.isShowOrderModalOpen,
        })),

    openAuthModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: true,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: false,
        }),

    closeAuthModal: () => set({isAuthModalOpen: false}),

    toggleAuthModal: () =>
        set((state) => ({
            isAuthModalOpen: !state.isAuthModalOpen,
            isCartOpen: !state.isAuthModalOpen ? false : state.isCartOpen,
            isAuthCodeConfirmOpen: !state.isAuthModalOpen ? false : state.isAuthCodeConfirmOpen,
            isOrderTypeModalOpen: !state.isAuthModalOpen ? false : state.isOrderTypeModalOpen,
            isRestaurantTypeModalOpen: !state.isAuthModalOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isAuthModalOpen ? false : state.isDeliveryTypeModalOpen,
            isShowOrderModalOpen: !state.isAuthModalOpen ? false : state.isShowOrderModalOpen,
        })),

    openAuthCodeConfirm: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: true,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: false,
        }),

    closeAuthCodeConfirm: () => set({isAuthCodeConfirmOpen: false}),

    toggleAuthCodeConfirm: () =>
        set((state) => ({
            isAuthCodeConfirmOpen: !state.isAuthCodeConfirmOpen,
            isCartOpen: !state.isAuthCodeConfirmOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isAuthCodeConfirmOpen ? false : state.isAuthModalOpen,
            isOrderTypeModalOpen: !state.isAuthCodeConfirmOpen ? false : state.isOrderTypeModalOpen,
            isRestaurantTypeModalOpen: !state.isAuthCodeConfirmOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isAuthCodeConfirmOpen ? false : state.isDeliveryTypeModalOpen,
            isShowOrderModalOpen: !state.isAuthCodeConfirmOpen ? false : state.isShowOrderModalOpen,
        })),

    openOrderTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: true,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: false,
        }),

    closeOrderTypeModal: () => set({isOrderTypeModalOpen: false}),

    toggleOrderTypeModal: () =>
        set((state) => ({
            isOrderTypeModalOpen: !state.isOrderTypeModalOpen,
            isCartOpen: !state.isOrderTypeModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isOrderTypeModalOpen ? false : state.isAuthModalOpen,
            isAuthCodeConfirmOpen: !state.isOrderTypeModalOpen ? false : state.isAuthCodeConfirmOpen,
            isRestaurantTypeModalOpen: !state.isOrderTypeModalOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isOrderTypeModalOpen ? false : state.isDeliveryTypeModalOpen,
            isShowOrderModalOpen: !state.isOrderTypeModalOpen ? false : state.isShowOrderModalOpen,
        })),

    openRestaurantTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: true,
            isRestaurantTypeModalOpen: true,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: false,
        }),

    closeRestaurantTypeModal: () => set({isRestaurantTypeModalOpen: false}),

    toggleRestaurantTypeModal: () =>
        set((state) => ({
            isRestaurantTypeModalOpen: !state.isRestaurantTypeModalOpen,
            isCartOpen: !state.isRestaurantTypeModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isRestaurantTypeModalOpen ? false : state.isAuthModalOpen,
            isAuthCodeConfirmOpen: !state.isRestaurantTypeModalOpen ? false : state.isAuthCodeConfirmOpen,
            isOrderTypeModalOpen: !state.isRestaurantTypeModalOpen ? true : state.isOrderTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isRestaurantTypeModalOpen ? false : state.isDeliveryTypeModalOpen,
            isShowOrderModalOpen: !state.isRestaurantTypeModalOpen ? false : state.isShowOrderModalOpen,
        })),

    openDeliveryTypeModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: true,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: true,
            isShowOrderModalOpen: false,
        }),

    closeDeliveryTypeModal: () => set({isDeliveryTypeModalOpen: false}),

    toggleDeliveryTypeModal: () =>
        set((state) => ({
            isDeliveryTypeModalOpen: !state.isDeliveryTypeModalOpen,
            isCartOpen: !state.isDeliveryTypeModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isDeliveryTypeModalOpen ? false : state.isAuthModalOpen,
            isAuthCodeConfirmOpen: !state.isDeliveryTypeModalOpen ? false : state.isAuthCodeConfirmOpen,
            isOrderTypeModalOpen: !state.isDeliveryTypeModalOpen ? true : state.isOrderTypeModalOpen,
            isRestaurantTypeModalOpen: !state.isDeliveryTypeModalOpen ? false : state.isRestaurantTypeModalOpen,
            isShowOrderModalOpen: !state.isDeliveryTypeModalOpen ? false : state.isShowOrderModalOpen,
        })),

    openShowOrderModal: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: true,
        }),

    closeShowOrderModal: () => set({isShowOrderModalOpen: false}),

    toggleShowOrderModal: () =>
        set((state) => ({
            isShowOrderModalOpen: !state.isShowOrderModalOpen,
            isCartOpen: !state.isShowOrderModalOpen ? false : state.isCartOpen,
            isAuthModalOpen: !state.isShowOrderModalOpen ? false : state.isAuthModalOpen,
            isAuthCodeConfirmOpen: !state.isShowOrderModalOpen ? false : state.isAuthCodeConfirmOpen,
            isOrderTypeModalOpen: !state.isShowOrderModalOpen ? false : state.isOrderTypeModalOpen,
            isRestaurantTypeModalOpen: !state.isShowOrderModalOpen ? false : state.isRestaurantTypeModalOpen,
            isDeliveryTypeModalOpen: !state.isShowOrderModalOpen ? false : state.isDeliveryTypeModalOpen,
        })),

    closeAllOverlays: () =>
        set({
            isCartOpen: false,
            isAuthModalOpen: false,
            isAuthCodeConfirmOpen: false,
            isOrderTypeModalOpen: false,
            isRestaurantTypeModalOpen: false,
            isDeliveryTypeModalOpen: false,
            isShowOrderModalOpen: false,
        }),
}));

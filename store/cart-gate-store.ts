import {create} from "zustand";
import {useAuthStore} from "@/store/auth-store";
import {useCartStore} from "@/store/cart-store";
import {useOrderStore} from "@/store/order-store";
import {useUIStore} from "@/store/ui-store";
import type {MenuItem} from "@/types/products";

type PendingCartItem = {
    item: MenuItem;
    quantity: number;
};

type CartGateStore = {
    pendingCartItem: PendingCartItem | null;
    setPendingCartItem: (pendingCartItem: PendingCartItem) => void;
    clearPendingCartItem: () => void;
};

export const useCartGateStore = create<CartGateStore>((set) => ({
    pendingCartItem: null,
    setPendingCartItem: (pendingCartItem) => set({pendingCartItem}),
    clearPendingCartItem: () => set({pendingCartItem: null}),
}));

export const requestCartAddPermission = (item: MenuItem, quantity = 1) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const orderType = useOrderStore.getState().orderType;

    if (isAuthenticated && orderType) {
        return true;
    }

    useCartGateStore.getState().setPendingCartItem({item, quantity});

    if (!isAuthenticated) {
        useUIStore.getState().openAuthModal();
        return false;
    }

    useUIStore.getState().openOrderTypeModal();
    return false;
};

export const continuePendingCartFlow = () => {
    const pendingCartItem = useCartGateStore.getState().pendingCartItem;

    if (!pendingCartItem) {
        return false;
    }

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const orderType = useOrderStore.getState().orderType;

    if (!isAuthenticated) {
        useUIStore.getState().openAuthModal();
        return false;
    }

    if (!orderType) {
        useUIStore.getState().openOrderTypeModal();
        return false;
    }

    useCartStore.getState().addItem(pendingCartItem.item, pendingCartItem.quantity);
    useCartGateStore.getState().clearPendingCartItem();

    return true;
};

export const cancelPendingCartFlow = () => {
    useCartGateStore.getState().clearPendingCartItem();
};

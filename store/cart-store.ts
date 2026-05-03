import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import type {MenuItem} from "@/types/products";

export type CartItem = Pick<MenuItem, "id" | "name" | "price" | "image"> & {
    quantity: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: MenuItem, quantity?: number) => void;
    removeItem: (itemId: string) => void;
    incrementItem: (itemId: string) => void;
    decrementItem: (itemId: string) => void;
    setItemQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
};

const normalizeQuantity = (quantity: number) => Math.max(1, Math.floor(quantity));

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],

            addItem: (item, quantity = 1) =>
                set((state) => {
                    const nextQuantity = normalizeQuantity(quantity);
                    const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

                    if (existingItem) {
                        return {
                            items: state.items.map((cartItem) =>
                                cartItem.id === item.id
                                    ? {...cartItem, quantity: cartItem.quantity + nextQuantity}
                                    : cartItem,
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                quantity: nextQuantity,
                            },
                        ],
                    };
                }),

            removeItem: (itemId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                })),

            incrementItem: (itemId) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId ? {...item, quantity: item.quantity + 1} : item,
                    ),
                })),

            decrementItem: (itemId) =>
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            item.id === itemId ? {...item, quantity: item.quantity - 1} : item,
                        )
                        .filter((item) => item.quantity > 0),
                })),

            setItemQuantity: (itemId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.id !== itemId),
                        };
                    }

                    return {
                        items: state.items.map((item) =>
                            item.id === itemId
                                ? {...item, quantity: normalizeQuantity(quantity)}
                                : item,
                        ),
                    };
                }),

            clearCart: () => set({items: []}),
        }),
        {
            name: "mangalclubs-cart",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

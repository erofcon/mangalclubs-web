import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import type {MenuItem} from "@/types/products";

export type CartModifier = {
    productId: string;
    productGroupId: string;
    name: string;
    amount: number;
    price: number;
};

export type CartItem = Pick<MenuItem, "id" | "name" | "price" | "image"> & {
    cartItemId?: string;
    basePrice?: number;
    productSizeId?: string;
    modifiers?: CartModifier[];
    quantity: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: MenuItem, quantity?: number, modifiers?: CartModifier[]) => void;
    removeItem: (cartItemId: string) => void;
    incrementItem: (cartItemId: string) => void;
    decrementItem: (cartItemId: string) => void;
    setItemQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
};

const normalizeQuantity = (quantity: number) => Math.max(1, Math.floor(quantity));
const normalizeModifierAmount = (amount: number) => Math.max(1, Math.floor(amount));

const getProductSizeId = (item: MenuItem) => item.sizeId ?? item.size_id ?? undefined;

const normalizeCartModifiers = (modifiers: CartModifier[] = []) => (
    modifiers
        .filter((modifier) => modifier.productId && modifier.productGroupId)
        .map((modifier) => ({
            ...modifier,
            amount: normalizeModifierAmount(modifier.amount),
            price: Number.isFinite(modifier.price) ? modifier.price : 0,
        }))
        .sort((firstModifier, secondModifier) => {
            const firstKey = `${firstModifier.productGroupId}:${firstModifier.productId}`;
            const secondKey = `${secondModifier.productGroupId}:${secondModifier.productId}`;

            return firstKey.localeCompare(secondKey);
        })
);

const createCartItemId = (item: MenuItem, modifiers: CartModifier[]) => {
    const productSizeId = getProductSizeId(item);
    const modifiersKey = modifiers
        .map((modifier) => `${modifier.productGroupId}:${modifier.productId}:${modifier.amount}`)
        .join("|");

    return [item.id, productSizeId, modifiersKey].filter(Boolean).join("__");
};

export const getCartItemId = (item: Pick<CartItem, "id" | "cartItemId">) => item.cartItemId ?? item.id;

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],

            addItem: (item, quantity = 1, modifiers = []) =>
                set((state) => {
                    const nextQuantity = normalizeQuantity(quantity);
                    const normalizedModifiers = normalizeCartModifiers(modifiers);
                    const cartItemId = createCartItemId(item, normalizedModifiers);
                    const existingItem = state.items.find((cartItem) => getCartItemId(cartItem) === cartItemId);

                    if (existingItem) {
                        return {
                            items: state.items.map((cartItem) =>
                                getCartItemId(cartItem) === cartItemId
                                    ? {...cartItem, quantity: cartItem.quantity + nextQuantity}
                                    : cartItem,
                            ),
                        };
                    }

                    const modifiersPrice = normalizedModifiers.reduce(
                        (sum, modifier) => sum + modifier.price * modifier.amount,
                        0,
                    );

                    return {
                        items: [
                            ...state.items,
                            {
                                cartItemId,
                                id: item.id,
                                name: item.name,
                                price: item.price + modifiersPrice,
                                basePrice: item.price,
                                image: item.image,
                                productSizeId: getProductSizeId(item),
                                modifiers: normalizedModifiers,
                                quantity: nextQuantity,
                            },
                        ],
                    };
                }),

            removeItem: (cartItemId) =>
                set((state) => ({
                    items: state.items.filter((item) => getCartItemId(item) !== cartItemId),
                })),

            incrementItem: (cartItemId) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        getCartItemId(item) === cartItemId ? {...item, quantity: item.quantity + 1} : item,
                    ),
                })),

            decrementItem: (cartItemId) =>
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            getCartItemId(item) === cartItemId ? {...item, quantity: item.quantity - 1} : item,
                        )
                        .filter((item) => item.quantity > 0),
                })),

            setItemQuantity: (cartItemId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => getCartItemId(item) !== cartItemId),
                        };
                    }

                    return {
                        items: state.items.map((item) =>
                            getCartItemId(item) === cartItemId
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

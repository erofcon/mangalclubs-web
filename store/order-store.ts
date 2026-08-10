import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import type {Coordinates, Organization} from "@/types/organization";
import {useCartStore} from "@/store/cart-store";

export type OrderType = "delivery" | "restaurant";

export type DeliveryOrderDetails = {
    address: string;
    city: string;
    street: string;
    house: string;
    entrance: string;
    floor: string;
    apartment: string;
    comment: string;
    coordinates: Coordinates;
};

export type RestaurantOrderDetails = Pick<
    Organization,
    "id" | "name" | "city" | "address" | "schedule" | "phone" | "whatsapp_phone" | "coordinates"
>;

type DeliveryOrderInput = Omit<DeliveryOrderDetails, "address"> & {
    address: string;
};

type OrderStore = {
    orderType: OrderType | null;
    delivery: DeliveryOrderDetails | null;
    restaurant: RestaurantOrderDetails | null;
    selectDelivery: (delivery: DeliveryOrderInput) => boolean;
    selectRestaurant: (restaurant: RestaurantOrderDetails) => boolean;
    clearOrderType: () => void;
};

const trimDelivery = (delivery: DeliveryOrderInput): DeliveryOrderDetails => ({
    address: delivery.address.trim(),
    city: (delivery.city ?? "").trim(),
    street: (delivery.street ?? "").trim(),
    house: (delivery.house ?? "").trim(),
    entrance: delivery.entrance.trim(),
    floor: delivery.floor.trim(),
    apartment: delivery.apartment.trim(),
    comment: delivery.comment.trim(),
    coordinates: delivery.coordinates,
});

export const useOrderStore = create<OrderStore>()(
    persist(
        (set, get) => ({
            orderType: null,
            delivery: null,
            restaurant: null,

            selectDelivery: (delivery) => {
                const normalizedDelivery = trimDelivery(delivery);

                if (!normalizedDelivery.address) {
                    return false;
                }

                if (get().orderType !== "delivery") {
                    useCartStore.getState().clearCart();
                }

                set({
                    orderType: "delivery",
                    delivery: normalizedDelivery,
                    restaurant: null,
                });

                return true;
            },

            selectRestaurant: (restaurant) => {
                if (!restaurant.name.trim() || !restaurant.address.trim()) {
                    return false;
                }

                const currentOrder = get();
                const hasRestaurantChanged = currentOrder.orderType !== "restaurant" ||
                    currentOrder.restaurant?.id !== restaurant.id;

                if (hasRestaurantChanged) {
                    useCartStore.getState().clearCart();
                }

                set({
                    orderType: "restaurant",
                    delivery: null,
                    restaurant,
                });

                return true;
            },

            clearOrderType: () =>
                set({
                    orderType: null,
                    delivery: null,
                    restaurant: null,
                }),
        }),
        {
            name: "mangalclubs-order",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

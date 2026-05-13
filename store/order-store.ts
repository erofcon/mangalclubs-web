import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import type {Coordinates, Organization} from "@/types/organization";

export type OrderType = "delivery" | "restaurant";

export type DeliveryOrderDetails = {
    address: string;
    entrance: string;
    floor: string;
    apartment: string;
    comment: string;
    coordinates: Coordinates;
};

export type RestaurantOrderDetails = Pick<
    Organization,
    "id" | "name" | "city" | "address" | "schedule" | "phone" | "coordinates"
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
    entrance: delivery.entrance.trim(),
    floor: delivery.floor.trim(),
    apartment: delivery.apartment.trim(),
    comment: delivery.comment.trim(),
    coordinates: delivery.coordinates,
});

export const useOrderStore = create<OrderStore>()(
    persist(
        (set) => ({
            orderType: null,
            delivery: null,
            restaurant: null,

            selectDelivery: (delivery) => {
                const normalizedDelivery = trimDelivery(delivery);

                if (!normalizedDelivery.address) {
                    return false;
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

"use client";

import {MapPin, Pencil} from "lucide-react";
import {useOrderStore} from "@/store/order-store";
import {useUIStore} from "@/store/ui-store";

export function DeliverySelector() {
    const openOrderTypeModal = useUIStore((state) => state.openOrderTypeModal);
    const orderType = useOrderStore((state) => state.orderType);
    const delivery = useOrderStore((state) => state.delivery);
    const restaurant = useOrderStore((state) => state.restaurant);

    const hasDelivery = orderType === "delivery" && Boolean(delivery);
    const hasRestaurant = orderType === "restaurant" && Boolean(restaurant);
    const hasSelectedOrderType = hasDelivery || hasRestaurant;
    const title = hasRestaurant ? "В ресторане" : "Доставка";
    const address =
        hasRestaurant && restaurant
            ? `${restaurant.city}, ${restaurant.address}`
            : hasDelivery && delivery
                ? delivery.address
                : "Выберите адрес и способ получения";

    return (
        <button
            type="button"
            onClick={openOrderTypeModal}
            className="group px-4 pt-4 text-start font-bold leading-tight text-text duration-300 hover:scale-105 hover:text-warning md:px-0 md:pt-0 cursor-pointer"
        >
            <span className="flex items-center gap-2">
                <span className="text-base md:text-lg">
                    {hasSelectedOrderType ? title : "Доставка или в ресторане"}
                </span>
                <Pencil className="h-4 w-4 shrink-0 duration-300 group-hover:scale-110"/>
            </span>

            <span className="mt-1 flex max-w-72 items-center gap-1.5 text-sm font-semibold text-text-secondary duration-300 group-hover:text-warning/80">
                {hasSelectedOrderType && (
                    <MapPin className="h-3.5 w-3.5 shrink-0"/>
                )}
                <span className="truncate">
                    {address}
                </span>
            </span>
        </button>
    );
}

"use client";

import {ChevronDown, MapPin} from "lucide-react";
import {useOrderStore} from "@/store/order-store";
import {useUIStore} from "@/store/ui-store";

export function DeliverySelector() {
    const openOrderTypeModal = useUIStore((state) => state.openOrderTypeModal);
    const orderType = useOrderStore((state) => state.orderType);
    const delivery = useOrderStore((state) => state.delivery);
    const restaurant = useOrderStore((state) => state.restaurant);

    const label =
        orderType === "delivery" && delivery
            ? delivery.address
            : orderType === "restaurant" && restaurant
                ? `${restaurant.city}, ${restaurant.address}`
                : "Доставка/В ресторане";

    return (
        <button
            type="button"
            onClick={openOrderTypeModal}
            className="group inline-flex h-10
            min-w-40 w-full md:max-w-57.5
            font-normal tracking-wider
            items-center justify-between gap-3 rounded-[7px] border border-border
            px-4 text-[13px] transition duration-300 hover:border-primary cursor-pointer hover:scale-101"
        >
            <span className="inline-flex min-w-0 items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0"/>
                <span className="truncate">{label}</span>
            </span>
            <ChevronDown
                className="h-4 w-4 shrink-0 text-primary transition duration-300 group-hover:translate-y-0.5"/>
        </button>
    );
}
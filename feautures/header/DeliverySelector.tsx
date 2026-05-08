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
                : "г. Грозный";

    return (
        <button
            type="button"
            onClick={openOrderTypeModal}
            className="group inline-flex h-10 min-w-[160px] max-w-[230px] items-center justify-between gap-3 rounded-[7px] border border-[#3f3020] bg-[#0b0c0d]/70 px-4 text-[13px] text-[#cfc6ba] transition duration-300 hover:border-[#c99a55] hover:text-[#f5efe5]"
        >
            <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#c99a55]"/>
                <span className="truncate">{label}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#c99a55] transition duration-300 group-hover:translate-y-0.5"/>
        </button>
    );
}

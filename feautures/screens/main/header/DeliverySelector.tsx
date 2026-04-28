"use client";

import {Pencil} from "lucide-react";
import {useUIStore} from "@/store/ui-store";

export function DeliverySelector() {
    const openOrderTypeModal = useUIStore((state) => state.openOrderTypeModal);

    return (
        <button
            onClick={openOrderTypeModal}
            className="group px-4 md:px-0 pt-4 md:pt-0 text-text hover:text-warning hover:scale-105 duration-300 font-bold leading-tight text-start cursor-pointer"
        >
            <span className="flex gap-4 items-end">
                Доставка / В ресторане
                <Pencil className="w-4 group-hover:w-5 duration-300"/>
            </span>

            <span className="mt-1 block font-semibold text-text-secondary">
                Для заказа выбери способ получения
            </span>
        </button>
    );
}

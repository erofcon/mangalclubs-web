"use client";

import {Bike, Check, Utensils} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useOrderStore} from "@/store/order-store";
import {useUIStore} from "@/store/ui-store";

export function OrderTypeModal() {
    const isOpen = useUIStore((state) => state.isOrderTypeModalOpen);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);
    const openRestaurantTypeModal = useUIStore((state) => state.openRestaurantTypeModal);
    const openDeliveryTypeModal = useUIStore((state) => state.openDeliveryTypeModal);
    const orderType = useOrderStore((state) => state.orderType);

    if (!isOpen) return null;

    const isDeliverySelected = orderType === "delivery";
    const isRestaurantSelected = orderType === "restaurant";

    return (
        <ModalSkeleton
            onClose={closeOrderTypeModal}
            className="sm:max-w-md sm:h-70"
        >
            <div className="flex h-full w-full flex-col bg-background px-6 py-8 pb-6 sm:rounded-4xl sm:px-10 sm:py-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-bold text-text">
                            Как хотите получить заказ?
                        </h1>
                        <p className="text-text-secondary">
                            Покажем доступные блюда и актуальные цены
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <button
                        type="button"
                        onClick={openDeliveryTypeModal}
                        className={`
                            flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 font-bold transition
                            ${isDeliverySelected
                            ? "bg-warning text-text-on-primary shadow-lg shadow-warning/20"
                            : "bg-stroke text-text hover:bg-warning hover:text-text-on-primary"}
                        `}
                    >
                        <Bike width={24} height={24}/>
                        Доставка
                        {isDeliverySelected && <Check className="h-4 w-4"/>}
                    </button>

                    <button
                        type="button"
                        onClick={openRestaurantTypeModal}
                        className={`
                            flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 font-bold transition
                            ${isRestaurantSelected
                            ? "bg-warning text-text-on-primary shadow-lg shadow-warning/20"
                            : "bg-stroke text-text hover:bg-warning hover:text-text-on-primary"}
                        `}
                    >
                        <Utensils width={16} height={16}/>
                        В ресторане
                        {isRestaurantSelected && <Check className="h-4 w-4"/>}
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}

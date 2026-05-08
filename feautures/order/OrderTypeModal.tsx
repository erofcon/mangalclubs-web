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
            <div className="flex h-full w-full flex-col border-border bg-background px-6 py-8 pb-6 sm:rounded-[8px] sm:border sm:px-10 sm:py-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Заказ
                        </p>
                        <h1
                            className="text-[28px] font-normal leading-tight text-text"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Как хотите получить заказ?
                        </h1>
                        <p className="text-sm leading-6 text-text/68">
                            Покажем доступные блюда и актуальные цены
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <button
                        type="button"
                        onClick={openDeliveryTypeModal}
                        className={`
                            flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border px-5 text-sm font-semibold transition duration-300
                            ${isDeliverySelected
                            ? "border-primary bg-primary text-on-primary"
                            : "border-border bg-background text-text hover:border-primary hover:text-primary"}
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
                            flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border px-5 text-sm font-semibold transition duration-300
                            ${isRestaurantSelected
                            ? "border-primary bg-primary text-on-primary"
                            : "border-border bg-background text-text hover:border-primary hover:text-primary"}
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

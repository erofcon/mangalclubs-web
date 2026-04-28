"use client";

import {Bike, Utensils} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useUIStore} from "@/store/ui-store";

export function OrderTypeModal() {
    const isOpen = useUIStore((state) => state.isOrderTypeModalOpen);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);

    if (!isOpen) return null;

    return (
        <ModalSkeleton
            onClose={closeOrderTypeModal}
            className="sm:max-w-md sm:h-[280px]"
        >
            <div
                className="flex h-full w-full flex-col bg-background px-6 py-8 pb-6 sm:rounded-[32px] sm:px-10 sm:py-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-text text-2xl font-bold">
                            Как хотите получить заказ?
                        </h1>
                        <h1 className="text-text-secondary">
                            Покажем доступные блюда и актуальные цены
                        </h1>
                    </div>
                </div>

                <div className="flex gap-6">
                    <button
                        className="flex justify-center gap-2 text-text-on-primary font-bold cursor-pointer w-full py-3.5 rounded-full bg-warning">
                        <Bike width={24} height={24}/>
                        Доставка
                    </button>

                    <button
                        className="flex justify-center gap-2 text-text font-bold cursor-pointer w-full py-3.5 rounded-full bg-stroke">
                        <Utensils width={20} height={20}/>
                        В ресторане
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}

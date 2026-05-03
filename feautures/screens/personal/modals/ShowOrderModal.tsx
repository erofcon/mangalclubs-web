"use client";

import Image from "next/image";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {menus} from "@/mocks/mocks-data";
import {useUIStore} from "@/store/ui-store";

export function ShowOrderModal() {
    const isOpen = useUIStore((state) => state.isShowOrderModalOpen);
    const closeShowOrderModal = useUIStore((state) => state.closeShowOrderModal);
    const orderItem = menus[0].items[0];

    if (!isOpen) return null;

    return (
        <ModalSkeleton
            onClose={closeShowOrderModal}
            className="
                w-full
                sm:h-125
                sm:max-w-xl
            "
        >
            <div
                className="
                    flex h-full w-full flex-col
                    overflow-hidden
                    bg-background text-text
                    p-4 sm:p-8
                    sm:rounded-4xl
                "
            >
                <div className="flex justify-center w-full mt-16 md:mt-2">
                    <h1
                        className="
                            text-xl sm:text-2xl
                            text-center font-bold tracking-wide sm:tracking-wider
                            leading-snug
                        "
                    >
                        Заказ
                        <span className="text-success"> W893 </span>
                        выполнено
                    </h1>
                </div>

                <div
                    className="
                        flex flex-col gap-3 sm:gap-4
                        p-2
                        rounded-2xl bg-card
                        mt-5 sm:mt-8
                    "
                >
                    <div
                        className="
                            flex items-center gap-3 sm:gap-4
                            p-3 sm:p-4
                            w-full
                            bg-background
                            border border-border
                            rounded-2xl
                        "
                    >
                        <div
                            className="
                                relative shrink-0
                                size-16 sm:size-18
                                overflow-hidden rounded-xl
                            "
                        >
                            {orderItem.image ? (
                                <Image
                                    src={orderItem.image}
                                    alt={orderItem.name}
                                    fill
                                    className="object-contain"
                                />
                            ) : null}
                        </div>

                        <div className="min-w-0 flex flex-1 flex-col gap-1.5 sm:gap-2">
                            <span
                                className="
                                    text-base sm:text-lg
                                    font-bold tracking-wide sm:tracking-wider
                                    leading-snug
                                    truncate
                                "
                            >
                                {orderItem.name}
                            </span>

                            <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
                                <span className="text-xs font-semibold text-text-secondary">
                                    x2
                                </span>

                                <span className="font-semibold text-sm sm:text-base">
                                    {orderItem.price}
                                </span>
                            </div>
                        </div>
                    </div>

                    <span
                        className="
                            px-1
                            text-sm sm:text-base
                            font-semibold tracking-wide sm:tracking-wider
                            leading-snug
                        "
                    >
                        2 товара на сумму:{" "}
                        <span className="font-bold whitespace-nowrap">
                            1079.98 ₽
                        </span>
                    </span>
                </div>

                <div
                    className="
                        grid grid-cols-1 sm:grid-cols-2
                        gap-4 sm:gap-6
                        text-text
                        mt-5 sm:mt-8
                    "
                >
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        <span className="text-sm text-text-secondary">
                            Время заказа
                        </span>

                        <span
                            className="
                                text-sm sm:text-base
                                font-semibold tracking-wide sm:tracking-wider
                                leading-snug
                            "
                        >
                            22.03.2026 21:14
                        </span>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        <span className="text-sm text-text-secondary">
                            Способ получения
                        </span>

                        <span
                            className="
                                text-sm sm:text-base
                                font-semibold tracking-wide sm:tracking-wider
                                leading-snug
                            "
                        >
                            В ресторане
                        </span>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2 sm:col-span-2">
                        <span className="text-sm text-text-secondary">
                            Адрес ресторана
                        </span>

                        <span
                            className="
                                text-sm sm:text-base
                                font-semibold tracking-wide sm:tracking-wider
                                leading-snug
                            "
                        >
                            ул Цветной Бульвар 13, Цирк Никулина
                        </span>
                    </div>
                </div>
            </div>
        </ModalSkeleton>
    );
}

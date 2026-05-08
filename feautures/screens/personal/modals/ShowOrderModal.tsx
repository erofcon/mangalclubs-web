"use client";

import Image from "next/image";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {menus, PICKUP_POINT} from "@/mocks/mocks-data";
import {useUIStore} from "@/store/ui-store";

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export function ShowOrderModal() {
    const isOpen = useUIStore((state) => state.isShowOrderModalOpen);
    const closeShowOrderModal = useUIStore((state) => state.closeShowOrderModal);
    const orderItem = menus[0].items[0];
    const quantity = 2;
    const total = orderItem.price * quantity;

    if (!isOpen) return null;

    return (
        <ModalSkeleton
            onClose={closeShowOrderModal}
            className="w-full sm:max-w-xl"
        >
            <div className="flex max-h-dvh min-h-dvh w-full flex-col overflow-y-auto bg-background p-5 text-text sm:max-h-[86dvh] sm:min-h-0 sm:rounded-[8px] sm:border sm:border-border/70 sm:p-6">
                <div className="pr-12 sm:pr-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Заказ W893
                    </p>
                    <h2
                        className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Выполнено
                    </h2>
                </div>

                <div className="mt-7 overflow-hidden rounded-[8px] border border-border/70">
                    <div className="flex items-center gap-4 border-b border-border/55 px-4 py-4">
                        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[6px] bg-black/25">
                            {orderItem.image ? (
                                <Image
                                    src={orderItem.image}
                                    alt={orderItem.name}
                                    fill
                                    sizes="72px"
                                    className="object-contain p-1"
                                />
                            ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-semibold leading-6 text-text">
                                {orderItem.name}
                            </p>
                            <p className="mt-1 text-[13px] text-text/58">
                                {quantity} x {formatPrice(orderItem.price)}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-0 sm:grid-cols-2">
                        <OrderDetail label="Сумма" value={formatPrice(total)}/>
                        <OrderDetail label="Время заказа" value="22.03.2026 21:14"/>
                        <OrderDetail label="Способ получения" value="В ресторане"/>
                        <OrderDetail label="Адрес ресторана" value={PICKUP_POINT.address}/>
                    </div>
                </div>
            </div>
        </ModalSkeleton>
    );
}

type OrderDetailProps = {
    label: string;
    value: string;
};

function OrderDetail({label, value}: OrderDetailProps) {
    return (
        <div className="border-b border-border/45 px-4 py-4 last:border-b-0 sm:border-r sm:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(2n)]:border-r-0">
            <p className="text-[12px] leading-none text-text/58">
                {label}
            </p>
            <p className="mt-3 wrap-break-word text-[14px] font-semibold leading-6 text-text">
                {value}
            </p>
        </div>
    );
}

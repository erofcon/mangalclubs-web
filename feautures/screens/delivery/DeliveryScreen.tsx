"use client";

import {useState} from "react";
import {ChevronRight} from "lucide-react";
import {deliveryPickupPoints, deliveryZones} from "@/mocks/mocks-data";
import {RestaurantInfoModal} from "@/feautures/order/RestaurantInfoModal";

const formatPrice = (price: number | null) => (
    price ? `${price.toLocaleString("ru-RU")} ₽` : "без минимума"
);

const pickupFallback = {
    city: "г. Грозный",
    address: "ул. Светлая улица, 105А",
};

const getDeliveryTime = (zoneId: string) => {
    const [, distanceTo] = zoneId.split("-").map(Number);

    if (!distanceTo || distanceTo <= 3) {
        return "от 45 минут";
    }

    return `от ${45 + (distanceTo - 3) * 5} минут`;
};

export function DeliveryScreen() {
    const [isRestaurantInfoOpen, setRestaurantInfoOpen] = useState(false);

    return (
        <>
            <main className="min-h-screen overflow-hidden bg-background text-text">
                <section className="mx-auto w-full max-w-302.5 px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_330px]">
                        <div className="min-w-0">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2
                                        className="mt-2 text-[28px] font-normal leading-tight text-[#f5efe5] sm:text-[34px]"
                                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                    >
                                        Условия доставки
                                    </h2>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[10px] border border-border/70">
                                <div
                                    className="hidden grid-cols-[1.1fr_1fr_1fr_1fr] border-b border-border/60 bg-black/25 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f867b] md:grid">
                                    <span>Расстояние</span>
                                    <span>Минимум</span>
                                    <span>Доставка</span>
                                    <span>Время</span>
                                </div>

                                {deliveryZones.map((zone) => (
                                    <div
                                        key={zone.id}
                                        className="grid gap-4 border-b border-border/45 px-5 py-4 last:border-b-0 md:grid-cols-[1.1fr_1fr_1fr_1fr] md:items-center"
                                    >
                                        <div>
                                            <p className="text-[16px] font-semibold text-[#f5efe5]">
                                                {zone.id} км
                                            </p>
                                            <p className="mt-1 text-[13px] text-[#8f867b] md:hidden">
                                                Расстояние
                                            </p>
                                        </div>

                                        <DeliveryValue label="Минимум" value={formatPrice(zone.minOrder)}/>
                                        <DeliveryValue label="Доставка" value={formatPrice(zone.price)}/>
                                        <DeliveryValue label="Время" value={getDeliveryTime(zone.id)}/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <aside className="min-w-0 mt-0 md:mt-18">
                            <div className="border-t border-border/70 pt-6 lg:sticky lg:top-6">
                                <p className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                    Самовывоз
                                </p>
                                <h2
                                    className="mt-2 text-[20px] md:text-[28px] font-normal leading-tight text-[#f5efe5]"
                                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                >
                                    Забрать в ресторане
                                </h2>
                                <p className="mt-2 md:mt-4 text-[14px] leading-6 text-[#b8afa5]">
                                    Заказ можно забрать самостоятельно.
                                </p>

                                <div className="mt-7 space-y-3">
                                    {deliveryPickupPoints.map((point) => (
                                        <button
                                            type="button"
                                            key={point.id}
                                            onClick={() => setRestaurantInfoOpen(true)}
                                            className="group flex w-full min-w-0 cursor-pointer items-center justify-between gap-4 border-b border-border/55 pb-4 text-left transition duration-300 hover:border-primary/70"
                                        >
                                            <span className="flex min-w-0 gap-3">
                                                <span className="min-w-0">
                                                    <span className="block text-[13px] text-text-secondary">
                                                        {pickupFallback.city}
                                                    </span>
                                                    <span
                                                        className="mt-1 block wrap-break-word text-[15px] leading-6 text-[#f5efe5]">
                                                        {point.address || pickupFallback.address}
                                                    </span>
                                                </span>
                                            </span>

                                            <ChevronRight
                                                className="h-5 w-5 shrink-0 text-primary transition duration-300 group-hover:translate-x-1"
                                                strokeWidth={1.8}/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <RestaurantInfoModal
                isOpen={isRestaurantInfoOpen}
                onClose={() => setRestaurantInfoOpen(false)}
            />
        </>
    );
}

type DeliveryValueProps = {
    label: string;
    value: string;
};

function DeliveryValue({label, value}: DeliveryValueProps) {
    return (
        <div>
            <p className="text-[13px] text-[#8f867b] md:hidden">
                {label}
            </p>
            <p className="mt-1 text-[15px] font-semibold text-text md:mt-0">
                {value}
            </p>
        </div>
    );
}

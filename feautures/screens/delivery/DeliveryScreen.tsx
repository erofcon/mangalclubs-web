"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeftIcon, ChevronDown, MapPin, Truck, BadgeDollarSign} from "lucide-react";
import {deliveryPickupPoints, deliveryZones} from "@/mocks/mocks-data";
import {RestaurantInfoModal} from "@/feautures/order/RestaurantInfoModal";

const formatPrice = (price: number | null) => (
    price ? `${price.toLocaleString("ru-RU")} ₽` : "нет"
);

const minDeliveryPrice = Math.min(...deliveryZones.map((zone) => zone.price));
const lastDeliveryZone = deliveryZones[deliveryZones.length - 1];
const maxDeliveryDistance = lastDeliveryZone ? `0-${lastDeliveryZone.id.split("-")[1]} км` : "";

export function DeliveryScreen() {
    const router = useRouter();
    const [openedZoneId, setOpenedZoneId] = useState(deliveryZones[0]?.id ?? "");
    const [isRestaurantInfoOpen, setRestaurantInfoOpen] = useState(false);

    return (
        <>
        <main className="min-h-screen w-full overflow-x-hidden px-4 pt-2 text-text md:px-7 md:pt-4">
            <div className="mx-auto w-full max-w-270">
                <div className="mb-12.5 flex items-center justify-between gap-6 lg:mb-16">
                    <div className="text-[30px] font-medium lg:text-[40px]">
                        Условия доставки
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center group cursor-pointer"
                    >
                                    <span
                                        className="mr-2 flex h-10 w-10
                                        items-center justify-center rounded-full bg-card
                                        transition-transform duration-300
                                        group-hover:-translate-x-2
                                        "
                                    >
                                        <ArrowLeftIcon/>
                                    </span>
                        <span className="group-hover:scale-115 duration-300">Назад</span>
                    </button>
                </div>

                <section className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div
                            className="mb-4 flex h-12 w-12 items-center
                            justify-center rounded-full
                            bg-background
                            ">
                            <Truck size={28} strokeWidth={2.6}/>
                        </div>
                        <p className="text-sm font-semibold text-text-secondary">Зоны доставки</p>
                        <p className="mt-1 text-lg font-bold tracking-[0.18rem]">{maxDeliveryDistance}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <div
                            className="mb-4 flex h-12 w-12 items-center
                            justify-center rounded-full
                            bg-background
                            ">
                            <BadgeDollarSign size={28} strokeWidth={2.6}/>
                        </div>
                        <p className="text-sm font-semibold text-text-secondary">Стоимость</p>
                        <p className="mt-1 text-lg font-bold tracking-[0.18rem]">от {formatPrice(minDeliveryPrice)}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <div
                            className="mb-4 flex h-12 w-12 items-center
                            justify-center rounded-full
                            bg-background
                            ">
                            <Truck size={28} strokeWidth={2.6}/>
                        </div>
                        <p className="text-sm font-semibold text-text-secondary">Время доставки</p>
                        <p className="mt-1 text-lg font-bold tracking-[0.18rem]">от 45 минут</p>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="min-w-0">
                        <h2 className="text-[20px] font-medium lg:text-[28px] my-4 mb-8">
                            Детали доставки по зонам
                        </h2>

                        <div className="space-y-3">
                            {deliveryZones.map((zone) => {
                                const isOpen = openedZoneId === zone.id;

                                return (
                                    <article
                                        key={zone.id}
                                        className="overflow-hidden rounded-xl border border-border bg-card hover:scale-105
                                        duration-200
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenedZoneId(isOpen ? "" : zone.id)}
                                            aria-expanded={isOpen}
                                            className="flex min-h-18 w-full cursor-pointer
                                            items-center justify-between gap-3 px-4 py-3 text-left
                                            duration-300 hover:bg-surface sm:px-5
                                            "
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span
                                                    className="flex h-10 w-10 shrink-0
                                                    items-center justify-center rounded-full bg-background text-text-secondary
                                                    ">
                                                    <MapPin size={22} strokeWidth={2.8}/>
                                                </span>
                                                <span className="min-w-0">
                                                    <span
                                                        className="block wrap-break-word text-base font-semibold tracking-wider">
                                                        {zone.title}
                                                    </span>
                                                    <span
                                                        className="mt-0.5 block text-sm font-semibold text-text-secondary">
                                                        Доставка {formatPrice(zone.price)}
                                                    </span>
                                                </span>
                                            </span>

                                            <span className="flex shrink-0 items-center gap-3">
                                                <span
                                                    className="hidden rounded-full bg-background
                                                     px-4 py-2 text-sm font-extrabold
                                                     sm:inline-flex">
                                                    {formatPrice(zone.price)}
                                                </span>
                                                <ChevronDown
                                                    size={22}
                                                    strokeWidth={3}
                                                    className={`duration-300 ${isOpen ? "rotate-180 " : ""}`}
                                                />
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div
                                                className="grid gap-3 border-t border-border bg-background/40 p-4 sm:grid-cols-2">
                                                <DeliveryDetail
                                                    label="Минимальная сумма заказа"
                                                    value={formatPrice(zone.minOrder)}
                                                />
                                                <DeliveryDetail
                                                    label="Стоимость доставки"
                                                    value={formatPrice(zone.price)}
                                                />
                                                <DeliveryDetail
                                                    label="Бесплатная доставка"
                                                    value={formatPrice(zone.freeDeliveryFrom)}
                                                />
                                                <DeliveryDetail
                                                    label="Время доставки"
                                                    value={zone.deliveryTime}
                                                />
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <aside className="min-w-0 lg:mt-22">
                        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:sticky lg:top-4">
                            <h2 className="text-lg font-semibold tracking-wider">
                                Самовывоз
                            </h2>

                            <div className="mt-5 space-y-3">
                                {deliveryPickupPoints.map((point) => (
                                    <button
                                        type="button"
                                        key={point.id}
                                        onClick={() => setRestaurantInfoOpen(true)}
                                        className="flex w-full min-w-0 gap-3 rounded-xl items-center bg-background p-4 text-left
                                        hover:scale-105 duration-200 cursor-pointer
                                        "
                                    >
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2.8}/>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-text-secondary">
                                                {point.city}
                                            </p>
                                            <p className="mt-1 wrap-break-word text-base tracking-wider">
                                                {point.address}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
            <RestaurantInfoModal
                isOpen={isRestaurantInfoOpen}
                onClose={() => setRestaurantInfoOpen(false)}
            />
        </>
    );
}

type DeliveryDetailProps = {
    label: string;
    value: string;
};

function DeliveryDetail({label, value}: DeliveryDetailProps) {
    return (
        <div className="rounded-xl bg-card p-4">
            <p className="text-xs font-semibold text-text-secondary">
                {label}
            </p>
            <p className="mt-2 text-base font-semibold text-text">
                {value}
            </p>
        </div>
    );
}

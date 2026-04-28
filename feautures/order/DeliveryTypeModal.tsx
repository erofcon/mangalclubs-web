"use client";

import dynamic from "next/dynamic";
import {ChangeEvent, useState} from "react";
import {LocateFixed} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {PICKUP_POINT} from "@/mocks/mocks-data";
import {useUIStore} from "@/store/ui-store";

const RestaurantMap = dynamic(
    () =>
        import("@/components/maps/RestaurantMap").then(
            (mod) => mod.RestaurantMap
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full animate-pulse bg-card"/>
        ),
    }
);

type DeliveryFormState = {
    address: string;
    entrance: string;
    floor: string;
    apartment: string;
    comment: string;
};

type CoordinatesState = {
    latitude: number;
    longitude: number;
};

const initialForm: DeliveryFormState = {
    address: "",
    entrance: "",
    floor: "",
    apartment: "",
    comment: "",
};

const inputClassName =
    "h-15 w-full rounded-[22px] border border-white/8 bg-card/90 px-5 text-[15px] text-text outline-none transition placeholder:text-text-secondary focus:border-warning";

const textareaClassName =
    "min-h-40 w-full resize-none rounded-[24px] border border-white/8 bg-card/90 px-5 py-4 text-[15px] text-text outline-none transition placeholder:text-text-secondary focus:border-warning";

const floatingLabelClassName =
    "absolute left-5 top-0 z-10 -translate-y-1/2 rounded-full border border-white/8 bg-background px-3 py-1 text-[12px] font-medium text-text-secondary";

export function DeliveryTypeModal() {
    const isOpen = useUIStore((state) => state.isDeliveryTypeModalOpen);
    const closeDeliveryTypeModal = useUIStore((state) => state.closeDeliveryTypeModal);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);

    const [form, setForm] = useState<DeliveryFormState>(initialForm);
    const [isLocating, setIsLocating] = useState(false);
    const [mapCoordinates, setMapCoordinates] = useState<CoordinatesState>({
        latitude: PICKUP_POINT.coordinates.latitude,
        longitude: PICKUP_POINT.coordinates.longitude,
    });

    if (!isOpen) return null;

    const handleChange =
        (field: keyof DeliveryFormState) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((prev) => ({
                    ...prev,
                    [field]: event.target.value,
                }));
            };

    const handleLocate = () => {
        if (!navigator.geolocation || isLocating) return;

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setIsLocating(false);
            },
            () => {
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    };

    const handleSave = () => {
        closeDeliveryTypeModal();
        closeOrderTypeModal();
    };

    return (
        <ModalSkeleton
            onClose={closeDeliveryTypeModal}
            className="h-dvh w-full p-0 sm:h-[760px] sm:w-[calc(100vw-32px)] sm:max-w-7xl"
        >
            <div className="flex h-full w-full flex-col overflow-hidden bg-background sm:rounded-[32px] md:flex-row">
                <div className="order-1 relative h-[40dvh] min-h-[320px] w-full shrink-0 overflow-hidden md:order-2 md:h-full md:flex-1">
                    <RestaurantMap
                        key={`${mapCoordinates.latitude}-${mapCoordinates.longitude}`}
                        name="Адрес доставки"
                        address={form.address.trim() || "Текущее местоположение"}
                        coordinates={mapCoordinates}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/45 to-transparent"/>

                    <div className="absolute inset-x-4 bottom-4 z-[1000] flex justify-center md:justify-start">
                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={isLocating}
                            className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-background/92 px-5 text-sm font-semibold text-text shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-warning/40 hover:text-warning disabled:cursor-default disabled:opacity-70"
                        >
                            <LocateFixed className="h-4 w-4"/>
                            {isLocating ? "Определяем геопозицию" : "Мое местоположение"}
                        </button>
                    </div>
                </div>

                <div className="order-2 flex min-h-0 flex-1 flex-col border-t border-white/6 bg-linear-to-b from-background to-surface px-4 py-5 sm:px-6 sm:py-6 md:order-1 md:w-[44%] md:border-t-0 md:border-r md:px-8 md:py-8 lg:px-10 lg:py-10">
                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold leading-none text-text sm:text-[38px]">
                                Укажи адрес
                            </h2>
                        </div>

                        <div className="mt-8 space-y-5">
                            <div className="relative pt-2">
                                <span className={floatingLabelClassName}>
                                    Город, улица, дом
                                </span>

                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange("address")}
                                    placeholder="Москва, Скаковая улица, 4к1"
                                    className={inputClassName}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="relative pt-2">
                                    <span className={floatingLabelClassName}>
                                        Подъезд
                                    </span>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.entrance}
                                        onChange={handleChange("entrance")}
                                        placeholder="Подъезд"
                                        className={inputClassName}
                                    />
                                </div>

                                <div className="relative pt-2">
                                    <span className={floatingLabelClassName}>
                                        Этаж
                                    </span>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.floor}
                                        onChange={handleChange("floor")}
                                        placeholder="Этаж"
                                        className={inputClassName}
                                    />
                                </div>

                                <div className="relative pt-2">
                                    <span className={floatingLabelClassName}>
                                        Квартира
                                    </span>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.apartment}
                                        onChange={handleChange("apartment")}
                                        placeholder="Квартира"
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <div className="relative pt-2">
                                <span className={floatingLabelClassName}>
                                    Комментарий курьеру
                                </span>

                                <textarea
                                    value={form.comment}
                                    onChange={handleChange("comment")}
                                    placeholder="Комментарий курьеру"
                                    className={textareaClassName}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="mt-6 h-14 w-full rounded-full bg-warning text-base font-bold text-text-on-primary shadow-[0_18px_40px_rgba(252,194,27,0.18)] transition hover:opacity-90 md:mt-8 md:w-[320px]"
                    >
                        Сохранить адрес
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}

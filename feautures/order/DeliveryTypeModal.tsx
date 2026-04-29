"use client";

import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import { LoaderCircle, Navigation } from "lucide-react";
import { ModalSkeleton } from "@/components/ui/ModalSkeleton";
import { PICKUP_POINT } from "@/mocks/mocks-data";
import { useUIStore } from "@/store/ui-store";

const RestaurantMap = dynamic(
    () =>
        import("@/components/maps/RestaurantMap").then(
            (mod) => mod.RestaurantMap
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full animate-pulse bg-card" />
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

function useGeolocation() {
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const locate = (onSuccess: (coordinates: CoordinatesState) => void) => {
        if (isLocating) return;

        if (!navigator.geolocation) {
            setLocationError("Ваш браузер не поддерживает определение местоположения.");
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onSuccess({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setIsLocating(false);
            },
            (error) => {
                let message = "Не удалось определить местоположение. Попробуйте еще раз.";

                if (error.code === error.PERMISSION_DENIED) {
                    message = "Разрешите доступ к геолокации, чтобы мы могли определить ваш адрес.";
                }

                if (error.code === error.POSITION_UNAVAILABLE) {
                    message = "Местоположение сейчас недоступно. Проверьте GPS или интернет.";
                }

                if (error.code === error.TIMEOUT) {
                    message = "Определение местоположения заняло слишком много времени.";
                }

                setLocationError(message);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return {
        locate,
        isLocating,
        locationError,
    };
}

export function DeliveryTypeModal() {
    const isOpen = useUIStore((state) => state.isDeliveryTypeModalOpen);
    const closeDeliveryTypeModal = useUIStore((state) => state.closeDeliveryTypeModal);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);

    const [form, setForm] = useState<DeliveryFormState>(initialForm);
    const [mapCoordinates, setMapCoordinates] = useState<CoordinatesState>({
        latitude: PICKUP_POINT.coordinates.latitude,
        longitude: PICKUP_POINT.coordinates.longitude,
    });

    const { locate, isLocating, locationError } = useGeolocation();

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
        locate((coordinates) => {
            setMapCoordinates(coordinates);

            // Позже здесь можно добавить reverse geocoding:
            // 1. отправить coordinates в API
            // 2. получить адрес
            // 3. записать его в form.address
        });
    };

    const handleSave = () => {
        closeDeliveryTypeModal();
        closeOrderTypeModal();
    };

    return (
        <ModalSkeleton
            onClose={closeDeliveryTypeModal}
            className="h-dvh w-full p-0 sm:h-[560px] sm:w-[calc(100vw-32px)] sm:max-w-8xl"
        >
            <div className="flex h-full w-full flex-col overflow-hidden bg-background sm:rounded-[32px] md:flex-row">
                <div className="order-1 relative h-[40dvh] min-h-[320px] w-full shrink-0 overflow-hidden md:order-2 md:h-full md:flex-1">
                    <RestaurantMap
                        key={`${mapCoordinates.latitude}-${mapCoordinates.longitude}`}
                        name="Адрес доставки"
                        address={form.address.trim() || "Текущее местоположение"}
                        coordinates={mapCoordinates}
                    />

                    <div className="absolute right-5 bottom-5 z-[1000] md:right-10 md:bottom-8">
                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={isLocating}
                            aria-label="Определить местоположение"
                            className="
                                group flex h-14 w-14 items-center justify-center rounded-full
                                border border-white/10 bg-card/95 text-text shadow-xl shadow-black/20
                                backdrop-blur-md transition-all duration-200
                                hover:scale-105
                                active:scale-95 disabled:pointer-events-none disabled:opacity-80
                                cursor-pointer
                            "
                        >
                            {isLocating ? (
                                <LoaderCircle className="h-6 w-6 animate-spin" />
                            ) : (
                                <Navigation className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="order-2 flex min-h-0 flex-1 flex-col border-t border-white/6 bg-linear-to-b from-background to-surface px-4 py-5 sm:px-6 sm:py-6 md:order-1 md:w-[44%] md:border-t-0 md:border-r md:px-8 md:py-8 lg:px-10 lg:py-10">
                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                        <div className="max-w-xl">
                            <h2 className="text-xl font-bold text-text md:text-2xl">
                                Укажи адрес
                            </h2>
                        </div>

                        <div className="mt-8 space-y-5">
                            <div className="relative pt-2">
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange("address")}
                                    placeholder="Город, улица, дом"
                                    className="h-12 w-full rounded-xl border border-border bg-card px-5 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-warning"
                                />

                                {locationError && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {locationError}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <div className="relative pt-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.entrance}
                                        onChange={handleChange("entrance")}
                                        placeholder="Подъезд"
                                        className="h-12 w-full rounded-xl border border-border bg-card px-5 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-warning"
                                    />
                                </div>

                                <div className="relative pt-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.floor}
                                        onChange={handleChange("floor")}
                                        placeholder="Этаж"
                                        className="h-12 w-full rounded-xl border border-border bg-card px-5 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-warning"
                                    />
                                </div>

                                <div className="relative pt-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.apartment}
                                        onChange={handleChange("apartment")}
                                        placeholder="Квартира"
                                        className="h-12 w-full rounded-xl border border-border bg-card px-5 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-warning"
                                    />
                                </div>
                            </div>

                            <div className="relative pt-2">
                                <textarea
                                    value={form.comment}
                                    onChange={handleChange("comment")}
                                    placeholder="Комментарий курьеру"
                                    className="min-h-30 w-full resize-none rounded-xl border border-border bg-card px-5 py-4 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-warning"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="mt-6 h-14 w-full cursor-pointer rounded-full bg-warning text-base font-bold text-text-on-primary"
                    >
                        Сохранить адрес
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}
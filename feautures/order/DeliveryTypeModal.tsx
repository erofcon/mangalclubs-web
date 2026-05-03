"use client";

import dynamic from "next/dynamic";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {LoaderCircle, Navigation} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {PICKUP_POINT} from "@/mocks/mocks-data";
import {useUIStore} from "@/store/ui-store";
import {useOrderStore} from "@/store/order-store";

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

type ResolvedAddress = {
    address: string;
    city: string;
    street: string;
    house: string;
    latitude: number;
    longitude: number;
    hasHouseNumber: boolean;
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

    const getPermissionState = async () => {
        if (!navigator.permissions?.query) {
            return null;
        }

        try {
            const permission = await navigator.permissions.query({
                name: "geolocation" as PermissionName,
            });

            return permission.state;
        } catch {
            return null;
        }
    };

    const locate = useCallback(
        async (onSuccess: (coordinates: CoordinatesState) => void) => {
            if (isLocating) return;

            if (!navigator.geolocation) {
                setLocationError(
                    "Ваш браузер не поддерживает определение местоположения."
                );
                return;
            }

            if (!window.isSecureContext) {
                setLocationError(
                    "Геолокация работает только на HTTPS, localhost или 127.0.0.1. Если открываете сайт с телефона по локальному IP, нужен HTTPS."
                );
                return;
            }

            setIsLocating(true);
            setLocationError(null);

            const permissionState = await getPermissionState();

            if (permissionState === "denied") {
                setLocationError(
                    "Геолокация уже заблокирована для этого сайта. Откройте настройки сайта в браузере и разрешите доступ к геолокации."
                );
                setIsLocating(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    onSuccess({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });

                    setIsLocating(false);
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setLocationError(
                            "Доступ к геолокации запрещен. Разрешите геолокацию в настройках сайта или браузера."
                        );
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        setLocationError(
                            "Местоположение сейчас недоступно. Проверьте GPS или интернет. Если включен VPN, необходимо выключить."
                        );
                    } else if (error.code === error.TIMEOUT) {
                        setLocationError(
                            "Определение местоположения заняло слишком много времени. Если включен VPN, необходимо выключить. Попробуйте еще раз."
                        );
                    } else {
                        setLocationError(
                            "Не удалось определить местоположение. Если включен VPN, необходимо выключить." +
                            " Попробуйте еще раз."
                        );
                    }

                    setIsLocating(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        },
        [isLocating]
    );

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
    const selectedDelivery = useOrderStore((state) => state.delivery);
    const selectDelivery = useOrderStore((state) => state.selectDelivery);

    const [form, setForm] = useState<DeliveryFormState>(() => (
        selectedDelivery
            ? {
                address: selectedDelivery.address,
                entrance: selectedDelivery.entrance,
                floor: selectedDelivery.floor,
                apartment: selectedDelivery.apartment,
                comment: selectedDelivery.comment,
            }
            : initialForm
    ));
    const [mapCoordinates, setMapCoordinates] = useState<CoordinatesState>({
        latitude: PICKUP_POINT.coordinates.latitude,
        longitude: PICKUP_POINT.coordinates.longitude,
    });
    const [addressError, setAddressError] = useState<string | null>(null);
    const [isAddressResolving, setIsAddressResolving] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState("");

    const lastResolvedAddressRef = useRef("");
    const addressAbortRef = useRef<AbortController | null>(null);

    const {locate, isLocating, locationError} = useGeolocation();

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!isOpen) return;

        if (!selectedDelivery) {
            lastResolvedAddressRef.current = "";
            setResolvedAddress("");
            setAddressError(null);
            setForm(initialForm);
            setMapCoordinates({
                latitude: PICKUP_POINT.coordinates.latitude,
                longitude: PICKUP_POINT.coordinates.longitude,
            });
            return;
        }

        lastResolvedAddressRef.current = selectedDelivery.address;
        setResolvedAddress(selectedDelivery.address);
        setAddressError(null);
        setForm({
            address: selectedDelivery.address,
            entrance: selectedDelivery.entrance,
            floor: selectedDelivery.floor,
            apartment: selectedDelivery.apartment,
            comment: selectedDelivery.comment,
        });
        setMapCoordinates({
            latitude: selectedDelivery.coordinates.latitude,
            longitude: selectedDelivery.coordinates.longitude,
        });
    }, [isOpen, selectedDelivery]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const applyResolvedAddress = useCallback((resolved: ResolvedAddress) => {
        lastResolvedAddressRef.current = resolved.address;
        setResolvedAddress(resolved.address);

        setForm((prev) => ({
            ...prev,
            address: resolved.address,
        }));

        setMapCoordinates({
            latitude: resolved.latitude,
            longitude: resolved.longitude,
        });

        setAddressError(
            resolved.hasHouseNumber ? null : "Укажите номер дома"
        );
    }, []);

    const reverseGeocodeCoordinates = useCallback(
        async (coordinates: CoordinatesState) => {
            setAddressError(null);
            setIsAddressResolving(true);

            try {
                const params = new URLSearchParams({
                    lat: String(coordinates.latitude),
                    lon: String(coordinates.longitude),
                });

                const response = await fetch(`/api/geocode/reverse?${params}`);

                if (!response.ok) {
                    const error = await response.json().catch(() => null);
                    throw new Error(
                        error?.message || "Не удалось определить адрес. Если включен VPN, необходимо выключить."
                    );
                }

                const resolved = (await response.json()) as ResolvedAddress;
                applyResolvedAddress(resolved);
            } catch (error) {
                setAddressError(
                    error instanceof Error
                        ? error.message
                        : "Не удалось определить адрес. Если включен VPN, необходимо выключить."
                );
            } finally {
                setIsAddressResolving(false);
            }
        },
        [applyResolvedAddress]
    );

    const geocodeAddress = useCallback(
        async (address: string, signal: AbortSignal) => {
            setAddressError(null);
            setIsAddressResolving(true);

            try {
                const params = new URLSearchParams({
                    text: address,
                    lat: String(mapCoordinates.latitude),
                    lon: String(mapCoordinates.longitude),
                });

                const response = await fetch(`/api/geocode/search?${params}`, {
                    signal,
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => null);
                    throw new Error(error?.message || "Не удалось найти адрес. Если включен VPN, необходимо выключить.");
                }

                const resolved = (await response.json()) as ResolvedAddress;

                if (signal.aborted) return;

                applyResolvedAddress(resolved);
            } catch (error) {
                if (signal.aborted) return;

                setAddressError(
                    error instanceof Error
                        ? error.message
                        : "Не удалось найти адрес. Если включен VPN, необходимо выключить."
                );
            } finally {
                if (!signal.aborted) {
                    setIsAddressResolving(false);
                }
            }
        },
        [
            applyResolvedAddress,
            mapCoordinates.latitude,
            mapCoordinates.longitude,
        ]
    );

    useEffect(() => {
        if (!isOpen) return;

        const address = form.address.trim();

        if (!address || address.length < 6) {
            addressAbortRef.current?.abort();
            return;
        }

        if (address === lastResolvedAddressRef.current) {
            return;
        }

        const controller = new AbortController();
        addressAbortRef.current?.abort();
        addressAbortRef.current = controller;

        const timeoutId = window.setTimeout(() => {
            void geocodeAddress(address, controller.signal);
        }, 700);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [form.address, geocodeAddress, isOpen]);

    if (!isOpen) return null;

    const handleChange =
        (field: keyof DeliveryFormState) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (field === "address") {
                    addressAbortRef.current?.abort();
                    setAddressError(null);
                    setIsAddressResolving(false);
                    lastResolvedAddressRef.current = "";
                    setResolvedAddress("");
                }

                setForm((prev) => ({
                    ...prev,
                    [field]: event.target.value,
                }));
            };

    const handleLocate = () => {
        locate((coordinates) => {
            setMapCoordinates(coordinates);
            void reverseGeocodeCoordinates(coordinates);
        });
    };

    const handleSave = () => {
        const isSelected = selectDelivery({
            ...form,
            address: trimmedAddress,
            coordinates: mapCoordinates,
        });

        if (isSelected) {
            closeDeliveryTypeModal();
            closeOrderTypeModal();
        }
    };

    const isResolvingLocation = isLocating || isAddressResolving;
    const trimmedAddress = form.address.trim();
    const canSaveAddress =
        Boolean(trimmedAddress) &&
        trimmedAddress === resolvedAddress &&
        !addressError &&
        !isAddressResolving;

    return (
        <ModalSkeleton
            onClose={closeDeliveryTypeModal}
            className="h-dvh w-full p-0 sm:h-140 sm:w-[calc(100vw-32px)] sm:max-w-8xl"
        >
            <div className="flex h-full w-full flex-col overflow-hidden bg-background sm:rounded-4xl md:flex-row">
                <div
                    className="order-1 relative h-[40dvh] min-h-80 w-full shrink-0 overflow-hidden md:order-2 md:h-full md:flex-1">
                    <RestaurantMap
                        key={`${mapCoordinates.latitude}-${mapCoordinates.longitude}`}
                        name="Адрес доставки"
                        address={form.address.trim() || "Текущее местоположение"}
                        coordinates={mapCoordinates}
                    />

                    <div className="absolute right-5 bottom-5 z-1000 md:right-10 md:bottom-8">
                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={isResolvingLocation}
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
                            {isResolvingLocation ? (
                                <LoaderCircle className="h-6 w-6 animate-spin"/>
                            ) : (
                                <Navigation className="h-6 w-6"/>
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className="order-2 flex min-h-0 flex-1 flex-col border-t border-white/6 bg-linear-to-b from-background to-surface px-4 py-5 sm:px-6 sm:py-6 md:order-1 md:w-[44%] md:border-t-0 md:border-r md:px-8 md:py-8 lg:px-10 lg:py-10">
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
                                    autoComplete="street-address"
                                    className="h-12 w-full rounded-xl border border-border bg-card px-5 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-warning"
                                />

                                {(locationError || addressError) && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {locationError || addressError}
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
                        disabled={!canSaveAddress}
                        className="mt-6 h-14 w-full cursor-pointer rounded-full bg-warning text-base font-bold text-text-on-primary transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Сохранить адрес
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}

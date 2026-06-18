"use client";

import dynamic from "next/dynamic";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {LoaderCircle, Navigation} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {apiFetch} from "@/utils/api";
import {useUIStore} from "@/store/ui-store";
import {useOrderStore} from "@/store/order-store";
import {useAppDataStore} from "@/store/app-data-store";
import {getOrganizationAvailability} from "@/utils/availability";
import {continuePendingCartFlow} from "@/store/cart-gate-store";
import {
    checkDeliveryZone,
    type DeliveryCheckResult,
    type DeliverySettings,
    getDeliverySettings,
} from "@/utils/delivery-zones";

const RestaurantMap = dynamic(
    () =>
        import("@/components/maps/RestaurantMap").then(
            (mod) => mod.RestaurantMap
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full animate-pulse bg-background"/>
        ),
    }
);

type DeliveryFormState = {
    address: string;
    city: string;
    street: string;
    house: string;
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
    hasHouseNumber: boolean;
};

type GeocodedAddress = ResolvedAddress & {
    latitude: number;
    longitude: number;
};

const formatDeliveryPrice = (price: number) => (
    `${price.toLocaleString("ru-RU")} ₽`
);

const getDeliveryCheckMessage = (deliveryCheck: DeliveryCheckResult | null) => {
    if (!deliveryCheck) {
        return "";
    }

    if (deliveryCheck.available && deliveryCheck.price !== null) {
        return `Адрес в зоне доставки. Стоимость доставки ${formatDeliveryPrice(deliveryCheck.price)}.`;
    }

    if (deliveryCheck.reason === "outside_delivery_area") {
        return "Адрес вне зоны доставки. Сейчас доставляем только по Грозному.";
    }

    if (deliveryCheck.reason === "delivery_tariff_not_configured") {
        return "Для этого расстояния пока не настроен тариф доставки.";
    }

    return "Не удалось подтвердить доставку по этому адресу.";
};

const normalizeDeliveryCheckAddress = (
    address: DeliveryCheckResult["address"]
): ResolvedAddress | null => {
    if (!address) {
        return null;
    }

    const city = address.city?.trim() ?? "";
    const street = address.street?.trim() ?? "";
    const house = address.house?.trim() ?? "";
    const formatted = address.formatted?.trim() ?? "";
    const normalizedAddress = formatted || [city, street, house].filter(Boolean).join(", ");

    if (!normalizedAddress || !city || !street) {
        return null;
    }

    return {
        address: normalizedAddress,
        city,
        street,
        house,
        hasHouseNumber: Boolean(house),
    };
};

const initialForm: DeliveryFormState = {
    address: "",
    city: "",
    street: "",
    house: "",
    entrance: "",
    floor: "",
    apartment: "",
    comment: "",
};

const DEFAULT_DELIVERY_COORDINATES: CoordinatesState = {
    latitude: 43.318746,
    longitude: 45.698942,
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
    const defaultDeliveryOrganization = useAppDataStore((state) => state.defaultDeliveryOrganization);
    const availabilityByOrganizationId = useAppDataStore((state) => state.availabilityByOrganizationId);
    const deliveryAvailability = defaultDeliveryOrganization
        ? getOrganizationAvailability(defaultDeliveryOrganization, availabilityByOrganizationId)
        : undefined;
    const isDeliveryUnavailable = deliveryAvailability?.orders_available === false;
    const initialMapCoordinates = defaultDeliveryOrganization?.coordinates ?? DEFAULT_DELIVERY_COORDINATES;

    const [form, setForm] = useState<DeliveryFormState>(() => (
        selectedDelivery
            ? {
                address: selectedDelivery.address,
                city: selectedDelivery.city ?? "",
                street: selectedDelivery.street ?? "",
                house: selectedDelivery.house ?? "",
                entrance: selectedDelivery.entrance,
                floor: selectedDelivery.floor,
                apartment: selectedDelivery.apartment,
                comment: selectedDelivery.comment,
            }
            : initialForm
    ));
    const [mapCoordinates, setMapCoordinates] = useState<CoordinatesState>({
        latitude: initialMapCoordinates.latitude,
        longitude: initialMapCoordinates.longitude,
    });
    const [addressError, setAddressError] = useState<string | null>(null);
    const [isAddressResolving, setIsAddressResolving] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState("");
    const [isAddressFromCoordinates, setIsAddressFromCoordinates] = useState(false);
    const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
    const [deliverySettingsError, setDeliverySettingsError] = useState("");
    const [deliveryCheck, setDeliveryCheck] = useState<DeliveryCheckResult | null>(null);
    const [deliveryCheckError, setDeliveryCheckError] = useState("");
    const [isDeliveryChecking, setIsDeliveryChecking] = useState(false);
    const [shouldCheckDelivery, setShouldCheckDelivery] = useState(Boolean(selectedDelivery));

    const lastResolvedAddressRef = useRef("");
    const addressAbortRef = useRef<AbortController | null>(null);
    const deliverySettingsAbortRef = useRef<AbortController | null>(null);
    const deliveryCheckAbortRef = useRef<AbortController | null>(null);

    const {locate, isLocating, locationError} = useGeolocation();

    useEffect(() => {
        return () => {
            addressAbortRef.current?.abort();
            deliverySettingsAbortRef.current?.abort();
            deliveryCheckAbortRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        deliverySettingsAbortRef.current?.abort();
        deliverySettingsAbortRef.current = controller;

        getDeliverySettings(controller.signal)
            .then((settings) => {
                setDeliverySettings(settings);
                setDeliverySettingsError("");
            })
            .catch((error) => {
                if (controller.signal.aborted) return;

                setDeliverySettings(null);
                setDeliverySettingsError(
                    error instanceof Error
                        ? error.message
                        : "Не удалось загрузить зону доставки.",
                );
            });

        return () => controller.abort();
    }, [isOpen]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!isOpen) return;

        if (!selectedDelivery) {
            lastResolvedAddressRef.current = "";
            setResolvedAddress("");
            setIsAddressFromCoordinates(false);
            setAddressError(null);
            setDeliveryCheck(null);
            setDeliveryCheckError("");
            setShouldCheckDelivery(false);
            setForm(initialForm);
            setMapCoordinates({
                latitude: initialMapCoordinates.latitude,
                longitude: initialMapCoordinates.longitude,
            });
            return;
        }

        lastResolvedAddressRef.current = selectedDelivery.address;
        setResolvedAddress(selectedDelivery.address);
        setIsAddressFromCoordinates(false);
        setAddressError(null);
        setDeliveryCheck(null);
        setDeliveryCheckError("");
        setShouldCheckDelivery(true);
        setForm({
            address: selectedDelivery.address,
            city: selectedDelivery.city ?? "",
            street: selectedDelivery.street ?? "",
            house: selectedDelivery.house ?? "",
            entrance: selectedDelivery.entrance,
            floor: selectedDelivery.floor,
            apartment: selectedDelivery.apartment,
            comment: selectedDelivery.comment,
        });
        setMapCoordinates({
            latitude: selectedDelivery.coordinates.latitude,
            longitude: selectedDelivery.coordinates.longitude,
        });
    }, [initialMapCoordinates.latitude, initialMapCoordinates.longitude, isOpen, selectedDelivery]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const applyResolvedAddress = useCallback((resolved: GeocodedAddress) => {
        lastResolvedAddressRef.current = resolved.address;
        setResolvedAddress(resolved.address);
        setIsAddressFromCoordinates(false);
        setDeliveryCheck(null);
        setDeliveryCheckError("");
        setShouldCheckDelivery(resolved.hasHouseNumber);

        setForm((prev) => ({
            ...prev,
            address: resolved.address,
            city: resolved.city,
            street: resolved.street,
            house: resolved.house,
        }));

        setMapCoordinates({
            latitude: resolved.latitude,
            longitude: resolved.longitude,
        });

        setAddressError(
            resolved.hasHouseNumber ? null : "Укажите номер дома"
        );
    }, []);

    const resolveCoordinates = useCallback(
        (coordinates: CoordinatesState) => {
            addressAbortRef.current?.abort();
            deliveryCheckAbortRef.current?.abort();

            lastResolvedAddressRef.current = "";
            setResolvedAddress("");
            setIsAddressFromCoordinates(true);
            setAddressError(null);
            setDeliveryCheck(null);
            setDeliveryCheckError("");
            setShouldCheckDelivery(true);
            setForm((prev) => ({
                ...prev,
                address: "",
                city: "",
                street: "",
                house: "",
            }));
            setMapCoordinates(coordinates);
        },
        []
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

                const resolved = await apiFetch<GeocodedAddress>("/api/v1/geocode/search", {
                    signal,
                    params: Object.fromEntries(params.entries()),
                });

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
        if (isAddressFromCoordinates) return;

        const address = form.address.trim();

        if (!address || address.length < 6) {
            addressAbortRef.current?.abort();
            deliveryCheckAbortRef.current?.abort();
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
    }, [form.address, geocodeAddress, isAddressFromCoordinates, isOpen]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!isOpen || !shouldCheckDelivery || addressError) return;

        const controller = new AbortController();
        deliveryCheckAbortRef.current?.abort();
        deliveryCheckAbortRef.current = controller;
        setIsDeliveryChecking(true);
        setDeliveryCheckError("");

        checkDeliveryZone(
            {
                coordinates: mapCoordinates,
                organizationSlug: defaultDeliveryOrganization?.slug,
            },
            controller.signal,
        )
            .then((result) => {
                if (controller.signal.aborted) return;

                setDeliveryCheck(result);

                if (!isAddressFromCoordinates) {
                    return;
                }

                const resolved = normalizeDeliveryCheckAddress(result.address);

                if (!resolved) {
                    setAddressError(
                        "Не удалось определить адрес по точке. Введите адрес вручную."
                    );
                    setShouldCheckDelivery(false);
                    return;
                }

                lastResolvedAddressRef.current = resolved.address;
                setResolvedAddress(resolved.address);
                setIsAddressFromCoordinates(false);
                setShouldCheckDelivery(false);
                setForm((prev) => ({
                    ...prev,
                    address: resolved.address,
                    city: resolved.city,
                    street: resolved.street,
                    house: resolved.house,
                }));
                setAddressError(
                    resolved.hasHouseNumber ? null : "Укажите номер дома"
                );
            })
            .catch((error) => {
                if (controller.signal.aborted) return;

                setDeliveryCheck(null);
                setDeliveryCheckError(
                    error instanceof Error
                        ? error.message
                        : "Не удалось проверить адрес доставки.",
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsDeliveryChecking(false);
                }
            });

        return () => controller.abort();
    }, [
        addressError,
        defaultDeliveryOrganization?.slug,
        isAddressFromCoordinates,
        isOpen,
        mapCoordinates,
        shouldCheckDelivery,
    ]);
    /* eslint-enable react-hooks/set-state-in-effect */

    if (!isOpen) return null;

    const handleChange =
        (field: keyof DeliveryFormState) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (field === "address") {
                    addressAbortRef.current?.abort();
                    deliveryCheckAbortRef.current?.abort();
                    setAddressError(null);
                    setIsAddressResolving(false);
                    setIsAddressFromCoordinates(false);
                    setDeliveryCheck(null);
                    setDeliveryCheckError("");
                    setShouldCheckDelivery(false);
                    lastResolvedAddressRef.current = "";
                    setResolvedAddress("");
                }

                setForm((prev) => ({
                    ...prev,
                    [field]: event.target.value,
                    ...(field === "address"
                        ? {
                            city: "",
                            street: "",
                            house: "",
                        }
                        : {}),
                }));
            };

    const handleLocate = () => {
        locate(resolveCoordinates);
    };

    const handleMapSelect = (coordinates: CoordinatesState) => {
        resolveCoordinates(coordinates);
    };

    const handleSave = () => {
        if (isDeliveryUnavailable) return;
        if (isDeliveryChecking || !deliveryCheck?.available) {
            setDeliveryCheckError(
                deliveryCheck
                    ? getDeliveryCheckMessage(deliveryCheck)
                    : "Дождитесь проверки адреса доставки.",
            );
            return;
        }

        const isSelected = selectDelivery({
            ...form,
            address: trimmedAddress,
            coordinates: mapCoordinates,
        });

        if (isSelected) {
            closeDeliveryTypeModal();
            closeOrderTypeModal();
            continuePendingCartFlow();
        }
    };

    const isResolvingLocation = isLocating || isAddressResolving;
    const trimmedAddress = form.address.trim();
    const deliveryCheckMessage = getDeliveryCheckMessage(deliveryCheck);
    const isDeliveryCheckFailed = Boolean(deliveryCheck && !deliveryCheck.available);
    const canSaveAddress =
        Boolean(trimmedAddress) &&
        !isAddressResolving &&
        !isDeliveryChecking &&
        trimmedAddress === resolvedAddress &&
        !addressError &&
        deliveryCheck?.available === true &&
        !isDeliveryUnavailable;

    return (
        <ModalSkeleton
            onClose={closeDeliveryTypeModal}
            className="h-dvh w-full p-0 sm:h-140 sm:w-[calc(100vw-32px)] sm:max-w-[900px]"
        >
            <div className="flex h-full w-full flex-col overflow-hidden border-border bg-background sm:rounded-lg sm:border md:flex-row">
                <div
                    className="order-1 relative h-[40dvh] min-h-80 w-full shrink-0 overflow-hidden md:order-2 md:h-full md:flex-1">
                    <RestaurantMap
                        name="Адрес доставки"
                        address={form.address.trim() || "Текущее местоположение"}
                        coordinates={mapCoordinates}
                        deliveryArea={deliverySettings?.deliveryArea}
                        onSelectCoordinates={handleMapSelect}
                    />

                    <div className="absolute right-5 bottom-5 z-1000 md:right-10 md:bottom-8">
                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={isResolvingLocation}
                            aria-label="Определить местоположение"
                            className="
                                group flex h-12 w-12 items-center justify-center rounded-[6px]
                                border border-border bg-background text-text
                                backdrop-blur-md transition-all duration-200
                                hover:border-primary hover:text-primary
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
                    className="order-2 flex min-h-0 flex-1 flex-col border-t border-border bg-background px-4 py-5 sm:px-6 sm:py-6 md:order-1
                    md:w-[50%] md:flex-none md:border-t-0 md:border-r md:px-8 md:py-8 lg:px-10 lg:py-10">
                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                        <div className="max-w-xl">
                            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Доставка
                            </p>
                            <h2
                                className="text-[28px] font-normal leading-tight text-text"
                            >
                                Укажи адрес
                            </h2>
                        </div>

                        <div className="mt-8 space-y-5">
                            {isDeliveryUnavailable && (
                                <div className="rounded-[6px] border border-primary/45 bg-primary/10 px-4 py-3 text-sm font-medium leading-6 text-text">
                                    {deliveryAvailability.message || "Доставка временно недоступна. Попробуйте позже."}
                                </div>
                            )}

                            <div className="rounded-[6px] border border-border/65 bg-black/20 px-4 py-3 text-sm leading-6 text-text/78">
                                Зона доставки ограничена Грозным. Выберите точку внутри подсвеченной области на карте.
                                {deliverySettingsError && (
                                    <span className="mt-1 block font-medium text-primary">
                                        {deliverySettingsError}
                                    </span>
                                )}
                            </div>

                            <div className="relative pt-2">
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange("address")}
                                    placeholder="Город, улица, дом"
                                    autoComplete="street-address"
                                    className="h-12 w-full rounded-[6px] border border-border bg-background px-5 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                                />

                                {(locationError || addressError) && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {locationError || addressError}
                                    </p>
                                )}

                                {(isDeliveryChecking || deliveryCheckMessage || deliveryCheckError) && (
                                    <p
                                        className={`mt-2 text-sm font-medium ${
                                            isDeliveryCheckFailed || deliveryCheckError
                                                ? "text-red-500"
                                                : "text-text/78"
                                        }`}
                                    >
                                        {isDeliveryChecking
                                            ? "Проверяем адрес в зоне доставки..."
                                            : deliveryCheckError || deliveryCheckMessage}
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
                                        className="h-12 w-full rounded-[6px] border border-border bg-background px-5 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                                    />
                                </div>

                                <div className="relative pt-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.floor}
                                        onChange={handleChange("floor")}
                                        placeholder="Этаж"
                                        className="h-12 w-full rounded-[6px] border border-border bg-background px-5 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                                    />
                                </div>

                                <div className="relative pt-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={form.apartment}
                                        onChange={handleChange("apartment")}
                                        placeholder="Квартира"
                                        className="h-12 w-full rounded-[6px] border border-border bg-background px-5 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="relative pt-2">
                                <textarea
                                    value={form.comment}
                                    onChange={handleChange("comment")}
                                    placeholder="Комментарий курьеру"
                                    className="min-h-30 w-full resize-none rounded-[6px] border border-border bg-background px-5 py-4 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!canSaveAddress}
                        className="mt-6 h-12 w-full cursor-pointer rounded-[6px] bg-primary text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Сохранить адрес
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}

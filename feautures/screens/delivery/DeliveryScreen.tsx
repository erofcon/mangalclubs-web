"use client";

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import Link from "next/link";
import {ChevronRight} from "lucide-react";
import {
    type DeliverySettings,
    type DeliveryZone,
    getDeliveryMapApiKey,
    getDeliverySettings,
} from "@/utils/delivery-zones";
import {formatOrganizationAddress, getOrganizationHref} from "@/utils/organizations";
import {useAppDataStore} from "@/store/app-data-store";

const RestaurantMap = dynamic(
    () =>
        import("@/components/maps/RestaurantMap").then(
            (mod) => mod.RestaurantMap,
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full animate-pulse bg-background"/>
        ),
    },
);

const formatPrice = (price: number) => (
    `${price.toLocaleString("ru-RU")} ₽`
);

const formatDistance = (zone: DeliveryZone) => {
    if (zone.distance_to_km === null) {
        return `от ${zone.distance_from_km.toLocaleString("ru-RU")} км`;
    }

    return `${zone.distance_from_km.toLocaleString("ru-RU")}-${zone.distance_to_km.toLocaleString("ru-RU")} км`;
};

export function DeliveryScreen() {
    const organizations = useAppDataStore((state) => state.organizations);
    const defaultDeliveryOrganization = useAppDataStore((state) => state.defaultDeliveryOrganization);
    const deliveryOrganization =
        defaultDeliveryOrganization ??
        organizations.find((organization) => organization.accepts_delivery !== false) ??
        organizations[0];
    const pickupOrganizations = organizations.filter((organization) => organization.accepts_pickup !== false);
    const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
    const [isDeliveryZonesLoading, setIsDeliveryZonesLoading] = useState(true);
    const [deliveryZonesError, setDeliveryZonesError] = useState("");
    const deliveryZones = deliverySettings?.pricingZones ?? [];

    useEffect(() => {
        const abortController = new AbortController();

        getDeliverySettings(abortController.signal)
            .then((settings) => {
                setDeliverySettings({
                    ...settings,
                    pricingZones: [...settings.pricingZones].sort((first, second) => (
                        first.distance_from_km - second.distance_from_km ||
                        (first.distance_to_km ?? Number.POSITIVE_INFINITY) -
                        (second.distance_to_km ?? Number.POSITIVE_INFINITY)
                    )),
                });
            })
            .catch((error) => {
                if (abortController.signal.aborted) return;

                setDeliveryZonesError(
                    error instanceof Error ? error.message : "Не удалось загрузить условия доставки",
                );
            })
            .finally(() => {
                if (!abortController.signal.aborted) {
                    setIsDeliveryZonesLoading(false);
                }
            });

        return () => abortController.abort();
    }, []);

    return (
        <main className="min-h-screen overflow-hidden bg-background text-text">
            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_330px]">
                    <div className="min-w-0">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="mt-2 text-[28px] font-normal leading-tight text-[#f5efe5] sm:text-[34px]">
                                    Условия доставки
                                </h2>
                                <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[#b8afa5]">
                                    Доставляем по Грозному. Зона на карте подсвечена, стоимость считается по расстоянию от ресторана.
                                </p>
                            </div>
                        </div>

                        {deliveryOrganization && (
                            <div className="mb-8 h-[360px] overflow-hidden rounded-[10px] border border-border/70">
                                <RestaurantMap
                                    name="Зона доставки"
                                    address="Грозный"
                                    coordinates={deliveryOrganization.coordinates}
                                    deliveryArea={deliverySettings?.deliveryArea}
                                    yandexMapsApiKey={getDeliveryMapApiKey(deliverySettings)}
                                    showOpenInYandexMaps
                                />
                            </div>
                        )}

                        <div className="overflow-hidden rounded-[10px] border border-border/70">
                            <div className="hidden grid-cols-[1.1fr_1fr_1fr] border-b border-border/60 bg-black/25 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f867b] md:grid">
                                <span>Расстояние</span>
                                <span>Доставка</span>
                                <span>Время</span>
                            </div>

                            {isDeliveryZonesLoading ? (
                                <div className="px-4 py-5 text-[14px] font-semibold leading-6 text-text/72 md:px-5">
                                    Загружаем условия доставки...
                                </div>
                            ) : deliveryZonesError ? (
                                <div className="px-4 py-5 text-[14px] font-semibold leading-6 text-primary md:px-5">
                                    {deliveryZonesError}
                                </div>
                            ) : deliveryZones.length === 0 ? (
                                <div className="px-4 py-5 text-[14px] font-semibold leading-6 text-text/72 md:px-5">
                                    Условия доставки пока не заданы.
                                </div>
                            ) : (
                                deliveryZones.map((zone) => (
                                    <div
                                        key={zone.id}
                                        className="grid grid-cols-2 gap-x-3 gap-y-3 border-b border-border/45 px-4 py-3 last:border-b-0 md:grid-cols-[1.1fr_1fr_1fr] md:items-center md:gap-4 md:px-5 md:py-4"
                                    >
                                        <div>
                                            <p className="text-[16px] font-semibold text-[#f5efe5]">
                                                {formatDistance(zone)}
                                            </p>
                                            <p className="sr-only">Расстояние</p>
                                        </div>

                                        <DeliveryValue label="Доставка" value={formatPrice(zone.price)}/>
                                        <DeliveryValue label="Время" value={zone.delivery_time}/>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <aside className="min-w-0 mt-0 md:mt-18">
                        <div className="border-t border-border/70 pt-6 lg:sticky lg:top-6">
                            <p className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Самовывоз
                            </p>
                            <h2 className="mt-2 text-[20px] md:text-[28px] font-normal leading-tight text-[#f5efe5]">
                                Забрать в ресторане
                            </h2>
                            <p className="mt-2 md:mt-4 text-[14px] leading-6 text-[#b8afa5]">
                                Заказ можно забрать самостоятельно.
                            </p>

                            <div className="mt-7 space-y-3">
                                {pickupOrganizations.map((organization) => (
                                    <Link
                                        key={organization.id}
                                        href={getOrganizationHref(organization)}
                                        className="group flex w-full min-w-0 cursor-pointer items-center justify-between gap-4 border-b border-border/55 pb-4 text-left transition duration-300 hover:border-primary/70"
                                    >
                                        <span className="flex min-w-0 gap-3">
                                            <span className="min-w-0">
                                                <span className="block text-[13px] font-semibold text-primary">
                                                    {organization.name}
                                                </span>
                                                <span className="mt-1 block wrap-break-word text-[15px] leading-6 text-[#f5efe5]">
                                                    {formatOrganizationAddress(organization)}
                                                </span>
                                                <span className="mt-1 block text-[13px] text-text-secondary">
                                                    {organization.phone}
                                                </span>
                                            </span>
                                        </span>

                                        <ChevronRight
                                            className="h-5 w-5 shrink-0 text-primary transition duration-300 group-hover:translate-x-1"
                                            strokeWidth={1.8}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

type DeliveryValueProps = {
    label: string;
    value: string;
};

function DeliveryValue({label, value}: DeliveryValueProps) {
    return (
        <div className="min-w-0">
            <p className="text-[12px] leading-4 text-[#8f867b] md:hidden">
                {label}
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[14px] font-semibold leading-5 text-text md:mt-0 md:text-[15px] md:leading-normal">
                {value}
            </p>
        </div>
    );
}

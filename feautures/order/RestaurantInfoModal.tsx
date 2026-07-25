"use client";

import Image from "next/image";
import {ReactNode} from "react";
import clsx from "clsx";
import {MapPinned} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import type {Organization} from "@/types/organization";

const YANDEX_MAPS_TERMS_URL = "https://yandex.ru/legal/maps_api/ru/";

type RestaurantInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    organization: Organization;
    action?: ReactNode;
    size?: "default" | "delivery";
};

export function RestaurantInfoModal({
                                        isOpen,
                                        onClose,
                                        organization,
                                        action,
                                        size = "default",
                                    }: RestaurantInfoModalProps) {
    if (!isOpen) return null;

    const mapSrc = getRestaurantMapSrc(organization);

    return (
        <ModalSkeleton
            onClose={onClose}
            className={clsx(
                "h-dvh w-full p-0 sm:w-[calc(100vw-32px)]",
                size === "delivery"
                    ? "sm:h-140 sm:max-w-225"
                    : "sm:h-120 sm:max-w-4xl",
            )}
        >
            <div
                className={clsx(
                    "flex h-full flex-col w-full overflow-hidden border-border bg-background",
                    size === "delivery"
                        ? "sm:rounded-lg sm:border md:flex-row"
                        : "sm:flex-row sm:rounded-[8px] sm:border",
                )}
            >
                <div
                    className={clsx(
                        "order-2 flex min-h-0 flex-1 flex-col",
                        size === "delivery"
                            ? "border-t border-border px-4 py-5 sm:px-6 sm:py-6 md:order-1 md:w-[50%] md:flex-none md:border-t-0 md:border-r md:px-8 md:py-8 lg:px-10 lg:py-10"
                            : "p-5 sm:order-1 sm:w-[42%] sm:flex-none sm:p-8",
                    )}
                >
                    <div className="space-y-5 text-text">
                        <div>
                            <div className="flex items-end gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="logo"
                                    width={473}
                                    height={284}
                                    className="h-10 w-auto"
                                />
                                <span
                                    className="translate-y-1 text-xl font-normal md:text-2xl"
                                >
                                    {organization.name}
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-text/68">
                                {organization.city}
                            </p>
                        </div>
                    </div>

                    {action ? (
                        <div className="flex min-h-0 flex-1 flex-col pt-6">
                            {action}
                        </div>
                    ) : null}
                </div>

                <div
                    className={clsx(
                        "relative order-1 w-full shrink-0",
                        size === "delivery"
                            ? "h-[40dvh] min-h-80 md:order-2 md:h-full md:flex-1"
                            : "h-[60dvh] min-h-80 sm:order-2 sm:h-full sm:min-h-0 sm:flex-1",
                    )}
                >
                    <iframe
                        key={organization.id}
                        title={`Карта ${organization.name}`}
                        src={mapSrc}
                        className="h-full w-full border-0"
                        loading="lazy"
                    />
                    <a
                        href={getYandexMapsUrl(organization)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 top-2 inline-flex h-10 items-center gap-2 rounded-[4px] bg-background/90 px-3 text-[12px] font-semibold text-text shadow-sm transition duration-300 hover:text-primary"
                    >
                        <MapPinned className="h-4 w-4" strokeWidth={1.8}/>
                        Открыть в Яндекс Картах
                    </a>
                    <a
                        href={YANDEX_MAPS_TERMS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 left-2 rounded-[4px] bg-background/90 px-2 py-1 text-[11px] font-semibold leading-none text-text/72 shadow-sm transition duration-300 hover:text-primary"
                    >
                        Условия использования Яндекс Карт
                    </a>
                </div>
            </div>
        </ModalSkeleton>
    );
}

function getRestaurantMapSrc(organization: Organization) {
    const {latitude, longitude} = organization.coordinates;

    return `https://yandex.com/map-widget/v1/?ll=${longitude}%2C${latitude}&z=16&pt=${longitude}%2C${latitude}%2Cpm2rdm`;
}

function getYandexMapsUrl(organization: Organization) {
    const {latitude, longitude} = organization.coordinates;

    return `https://yandex.ru/maps/?ll=${longitude}%2C${latitude}&z=16&pt=${longitude}%2C${latitude}%2Cpm2rdm`;
}

"use client";

import Image from "next/image";
import {ReactNode} from "react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import type {Organization} from "@/types/organization";

type RestaurantInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    organization: Organization;
    action?: ReactNode;
};

export function RestaurantInfoModal({
                                        isOpen,
                                        onClose,
                                        organization,
                                        action,
                                    }: RestaurantInfoModalProps) {
    if (!isOpen) return null;

    const mapSrc = getRestaurantMapSrc(organization);

    return (
        <ModalSkeleton
            onClose={onClose}
            className="h-dvh w-full max-w-4xl p-0 sm:h-120 sm:w-[calc(100vw-32px)]"
        >
            <div
                className="flex h-full flex-col overflow-hidden border-border bg-background sm:flex-row sm:rounded-[8px] sm:border">
                <div className="order-2 flex min-h-0 flex-1 flex-col p-5 sm:order-1 sm:w-[42%] sm:flex-none sm:p-8">
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

                <div className="order-1 h-[60dvh] min-h-80 w-full shrink-0 sm:order-2 sm:h-full sm:min-h-0 sm:flex-1">
                    <iframe
                        key={organization.id}
                        title={`Карта ${organization.name}`}
                        src={mapSrc}
                        className="h-full w-full border-0"
                        loading="lazy"
                    />
                </div>
            </div>
        </ModalSkeleton>
    );
}

function getRestaurantMapSrc(organization: Organization) {
    const {latitude, longitude} = organization.coordinates;

    return `https://yandex.com/map-widget/v1/?ll=${longitude}%2C${latitude}&z=16&pt=${longitude}%2C${latitude}%2Cpm2rdm`;
}

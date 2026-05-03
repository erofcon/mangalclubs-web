"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import {ReactNode} from "react";
import {Clock, MapPin, Phone} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {PICKUP_POINT} from "@/mocks/mocks-data";

const RestaurantMap = dynamic(
    () =>
        import("@/components/maps/RestaurantMap").then(
            (mod) => mod.RestaurantMap
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full animate-pulse rounded-2xl bg-muted"/>
        ),
    }
);

type RestaurantInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    action?: ReactNode;
};

export function RestaurantInfoModal({
                                        isOpen,
                                        onClose,
                                        action,
                                    }: RestaurantInfoModalProps) {
    if (!isOpen) return null;

    return (
        <ModalSkeleton
            onClose={onClose}
            className="h-155 w-[calc(100vw-32px)] max-w-4xl p-0 sm:h-120"
        >
            <div className="flex h-full flex-col overflow-hidden bg-background md:rounded-2xl sm:flex-row">
                <div className="order-2 flex flex-[0_0_45%] flex-col p-5 sm:order-1 sm:w-[42%] sm:flex-none sm:p-8">
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
                                <span className="translate-y-1 text-xl font-bold md:text-2xl">
                                    {PICKUP_POINT.name}
                                </span>
                            </div>

                            <p className="mt-4 text-sm">
                                {PICKUP_POINT.city}
                            </p>
                        </div>

                        <div className="space-y-4 text-sm md:mt-10 md:space-y-6">
                            <div className="flex items-center gap-4">
                                <MapPin className="mt-0.5 size-5 shrink-0"/>
                                <div>
                                    <p className="hidden font-medium md:block">Адрес</p>
                                    <p>
                                        {PICKUP_POINT.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Clock className="mt-0.5 size-5 shrink-0"/>
                                <div>
                                    <p className="hidden font-medium md:block">Время работы</p>
                                    <p>
                                        {PICKUP_POINT.schedule}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Phone className="mt-0.5 size-5 shrink-0"/>
                                <div>
                                    <p className="hidden font-medium md:block">Телефон</p>
                                    <a
                                        href={`tel:${PICKUP_POINT.phone.replace(/\D/g, "")}`}
                                        className="hover:text-warning underline"
                                    >
                                        {PICKUP_POINT.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {action ? (
                        <div className="mt-auto pt-6">
                            {action}
                        </div>
                    ) : null}
                </div>

                <div className="order-1 flex-[0_0_55%] shrink-0 sm:order-2 sm:h-full sm:flex-1">
                    <RestaurantMap
                        name={PICKUP_POINT.name}
                        address={`${PICKUP_POINT.city}, ${PICKUP_POINT.address}`}
                        coordinates={PICKUP_POINT.coordinates}
                    />
                </div>
            </div>
        </ModalSkeleton>
    );
}

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
            <div className="h-full w-full animate-pulse bg-background"/>
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
            <div className="flex h-full flex-col overflow-hidden border-border bg-background sm:flex-row sm:rounded-[8px] sm:border">
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
                                <span
                                    className="translate-y-1 text-xl font-normal md:text-2xl"
                                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                >
                                    {PICKUP_POINT.name}
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-text/68">
                                {PICKUP_POINT.city}
                            </p>
                        </div>

                        <div className="space-y-4 text-sm md:mt-10 md:space-y-6">
                            <div className="flex items-center gap-4">
                                <MapPin className="mt-0.5 size-5 shrink-0 text-primary"/>
                                <div>
                                    <p className="hidden text-text/55 md:block">Адрес</p>
                                    <p className="font-semibold">
                                        {PICKUP_POINT.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Clock className="mt-0.5 size-5 shrink-0 text-primary"/>
                                <div>
                                    <p className="hidden text-text/55 md:block">Время работы</p>
                                    <p className="font-semibold">
                                        {PICKUP_POINT.schedule}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Phone className="mt-0.5 size-5 shrink-0 text-primary"/>
                                <div>
                                    <p className="hidden text-text/55 md:block">Телефон</p>
                                    <a
                                        href={`tel:${PICKUP_POINT.phone.replace(/\D/g, "")}`}
                                        className="font-semibold underline transition duration-300 hover:text-primary"
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

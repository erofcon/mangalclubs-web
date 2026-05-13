"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import {ReactNode} from "react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import type {Organization} from "@/types/organization";
import {formatOrganizationAddress} from "@/utils/organizations";

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

    return (
        <ModalSkeleton
            onClose={onClose}
            className="h-155 w-[calc(100vw-32px)] max-w-4xl p-0 sm:h-120"
        >
            <div
                className="flex h-full flex-col overflow-hidden border-border bg-background sm:flex-row sm:rounded-[8px] sm:border">
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
                        <div className="flex flex-1 flex-col pt-6">
                            {action}
                        </div>
                    ) : null}
                </div>

                <div className="order-1 flex-[0_0_55%] shrink-0 sm:order-2 sm:h-full sm:flex-1">
                    <RestaurantMap
                        key={organization.id}
                        name={organization.name}
                        address={formatOrganizationAddress(organization)}
                        coordinates={organization.coordinates}
                    />
                </div>
            </div>
        </ModalSkeleton>
    );
}

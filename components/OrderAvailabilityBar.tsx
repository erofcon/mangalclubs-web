"use client";

import {AlertTriangle} from "lucide-react";
import {usePathname} from "next/navigation";
import {useAppDataStore} from "@/store/app-data-store";
import {DEFAULT_UNAVAILABLE_MESSAGE, getUnavailableOrganizations} from "@/utils/availability";

export function OrderAvailabilityBar() {
    const pathname = usePathname();
    const organizations = useAppDataStore((state) => state.organizations);
    const availabilityByOrganizationId = useAppDataStore((state) => state.availabilityByOrganizationId);
    const unavailableOrganizations = getUnavailableOrganizations(organizations, availabilityByOrganizationId);

    if (pathname !== "/") {
        return null;
    }

    if (unavailableOrganizations.length === 0) {
        return null;
    }

    const isEveryOrganizationUnavailable = unavailableOrganizations.length === organizations.length;
    const unavailableNames = unavailableOrganizations.map((organization) => organization.name).join(", ");
    const firstMessage = unavailableOrganizations
        .map((organization) => availabilityByOrganizationId[organization.id]?.message)
        .find(Boolean);
    const message = isEveryOrganizationUnavailable
        ? firstMessage || DEFAULT_UNAVAILABLE_MESSAGE
        : `Онлайн-заказы временно недоступны в ${unavailableNames}. В других ресторанах можно оформить заказ.`;

    return (
        <div className="border-b border-primary/35 bg-[#2a1c0a] text-[#ffe5b0]">
            <div className="mx-auto flex min-h-9 w-full max-w-302.5 items-center gap-2 px-5 py-2 text-[13px] font-semibold leading-5 sm:px-6 lg:px-0">
                <AlertTriangle className="h-4 w-4 shrink-0 text-primary" strokeWidth={2}/>
                <span>{message}</span>
            </div>
        </div>
    );
}

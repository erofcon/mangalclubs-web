import {apiFetch} from "@/utils/api";
import type {WorkingHour} from "@/types/organization";

export type OrderTimeSlot = {
    startsAt: string;
    endsAt: string;
};

export type OrderTimeWindow = OrderTimeSlot;

export type OrganizationOrderTimeSlots = {
    organization_id: string;
    slug: string;
    date: string;
    timezone: string;
    isClosed: boolean;
    stepMinutes: number;
    workingHours: WorkingHour[];
    windows: OrderTimeWindow[];
    slots: OrderTimeSlot[];
};

export const getOrganizationOrderTimeSlots = (
    organizationSlug: string,
    targetDate?: string,
    stepMinutes = 30,
    signal?: AbortSignal,
) => (
    apiFetch<OrganizationOrderTimeSlots>(
        `/api/v1/organizations/${encodeURIComponent(organizationSlug)}/order-time-slots`,
        {
            signal,
            params: {
                date: targetDate,
                stepMinutes: String(stepMinutes),
            },
        },
    )
);

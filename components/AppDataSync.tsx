"use client";

import {useEffect, useRef} from "react";
import {useAppDataStore} from "@/store/app-data-store";
import {useOrderStore} from "@/store/order-store";

const AVAILABILITY_POLL_INTERVAL = 60000;
const AVAILABILITY_STALE_AFTER = 45000;

export function AppDataSync() {
    const orderType = useOrderStore((state) => state.orderType);
    const restaurantId = useOrderStore((state) => state.restaurant?.id ?? null);
    const refreshMenuForCurrentOrder = useAppDataStore((state) => state.refreshMenuForCurrentOrder);
    const refreshOrganizationAvailability = useAppDataStore((state) => state.refreshOrganizationAvailability);
    const isFirstRun = useRef(true);
    const lastAvailabilityCheckRef = useRef(0);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        void refreshMenuForCurrentOrder();
    }, [orderType, refreshMenuForCurrentOrder, restaurantId]);

    useEffect(() => {
        let controller: AbortController | null = null;

        const refreshAvailability = () => {
            controller?.abort();
            controller = new AbortController();
            lastAvailabilityCheckRef.current = Date.now();

            void refreshOrganizationAvailability(controller.signal);
        };

        refreshAvailability();

        const intervalId = window.setInterval(refreshAvailability, AVAILABILITY_POLL_INTERVAL);

        const handleVisibilityChange = () => {
            if (document.visibilityState !== "visible") return;

            const isStale = Date.now() - lastAvailabilityCheckRef.current > AVAILABILITY_STALE_AFTER;

            if (isStale) {
                refreshAvailability();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            controller?.abort();
        };
    }, [refreshOrganizationAvailability]);

    return null;
}

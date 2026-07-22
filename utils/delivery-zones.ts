import {apiFetch} from "@/utils/api";

export type DeliveryZone = {
    id: string;
    distance_from_km: number;
    distance_to_km: number | null;
    price: number;
};

export type DeliveryArea = {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
};

export type DeliverySettings = {
    deliveryArea: DeliveryArea;
    pricingZones: DeliveryZone[];
    yandexMapsApiKey?: string | null;
    yandex_maps_api_key?: string | null;
    mapApiKey?: string | null;
};

export type DeliveryCoordinates = {
    latitude: number;
    longitude: number;
};

export type DeliveryCheckPayload = {
    coordinates: DeliveryCoordinates;
    organizationSlug?: string;
};

export type DeliveryCheckReason =
    | "outside_delivery_area"
    | "delivery_tariff_not_configured"
    | string;

export type DeliveryCheckAddress = {
    formatted: string;
    countryCode?: string | null;
    city?: string | null;
    street?: string | null;
    house?: string | null;
    postcode?: string | null;
    placeId?: string | null;
    source?: string | null;
};

export type DeliveryCheckResult = {
    available: boolean;
    reason: DeliveryCheckReason | null;
    distanceKm: number;
    price: number | null;
    zone: DeliveryZone | null;
    address: DeliveryCheckAddress | null;
};

export const getDeliveryZones = (signal?: AbortSignal) => (
    apiFetch<DeliveryZone[]>("/api/v1/delivery-zones", {signal})
);

export const getDeliverySettings = (signal?: AbortSignal) => (
    apiFetch<DeliverySettings>("/api/v1/delivery-zones/settings", {signal})
);

export const getDeliveryMapApiKey = (settings?: DeliverySettings | null) => (
    settings?.yandexMapsApiKey?.trim() ||
    settings?.yandex_maps_api_key?.trim() ||
    settings?.mapApiKey?.trim() ||
    ""
);

export const checkDeliveryZone = (
    payload: DeliveryCheckPayload,
    signal?: AbortSignal,
) => (
    apiFetch<DeliveryCheckResult>("/api/v1/delivery-zones/check", {
        method: "POST",
        signal,
        body: JSON.stringify(payload),
    })
);

type GeoapifyAddressLike = {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    street?: string;
    name?: string;
    housenumber?: string;
    lat?: number;
    lon?: number;
};

export type NormalizedAddress = {
    address: string;
    city: string;
    street: string;
    house: string;
    latitude: number;
    longitude: number;
    hasHouseNumber: boolean;
};

export function normalizeGeoapifyAddress(
    raw: GeoapifyAddressLike,
    fallbackLatitude?: number,
    fallbackLongitude?: number
): NormalizedAddress | null {
    const city =
        raw.city ||
        raw.town ||
        raw.village ||
        raw.municipality ||
        raw.county ||
        raw.state ||
        "";

    const street = raw.street || raw.name || "";
    const house = raw.housenumber || "";

    const latitude = typeof raw.lat === "number" ? raw.lat : fallbackLatitude;
    const longitude = typeof raw.lon === "number" ? raw.lon : fallbackLongitude;

    if (!city || !street || latitude == null || longitude == null) {
        return null;
    }

    return {
        address: [city, street, house].filter(Boolean).join(", "),
        city,
        street,
        house,
        latitude,
        longitude,
        hasHouseNumber: Boolean(house),
    };
}

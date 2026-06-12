export type Coordinates = {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
};

export type WorkingHour = {
    weekday: number;
    is_closed: boolean;
    opens_at: string;
    closes_at: string;
    closes_next_day: boolean;
};

export type Organization = {
    id: string;
    slug?: string;
    name: string;
    city: string;
    address: string;
    schedule: string;
    phone: string;
    intro: string;
    coordinates: Coordinates;
    photo_url?: string | null;
    iiko_organization_id?: string | null;
    accepts_pickup?: boolean;
    accepts_delivery?: boolean;
    is_default_delivery?: boolean;
    working_hours?: WorkingHour[];
};

export type OrganizationAvailability = {
    organization_id: string;
    slug: string;
    orders_available: boolean;
    iiko_status: string | null;
    reason: string | null;
    message: string;
    checked_at: string;
};

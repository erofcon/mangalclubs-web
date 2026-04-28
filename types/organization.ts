export type Coordinates = {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
};

export type Orientation = {
    name: string;
    city: string;
    address: string;
    schedule: string;
    phone: string;
    coordinates: Coordinates;
};

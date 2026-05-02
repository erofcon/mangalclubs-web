export type Coordinates = {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
};

export type Organization = {
    name: string;
    city: string;
    address: string;
    schedule: string;
    phone: string;
    intro: string,
    coordinates: Coordinates;
};

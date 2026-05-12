export type Booking = {
    id: string | number;
    categoryId?: string;
    categoryTitle?: string;
    title?: string;
    description?: string;
    longDescription?: string;
    image?: string;
    images?: string[];
    capacity?: string;
    time?: string;
    priceNote?: string;
    features?: string[];
    details?: {
        label: string;
        value: string;
    }[];
}

export type BookingCategory = {
    id: string;
    title: string;
    description: string;
    image?: string;
};

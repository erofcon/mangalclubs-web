import type {Organization} from "@/types/organization";

export type BookingOrganization = Pick<Organization, "id" | "slug" | "name" | "phone">;

export type BookingImage = {
    id: string;
    url: string;
    orientation?: "horizontal" | "vertical" | null;
    altText?: string | null;
    sortOrder?: number;
};

export type Booking = {
    id: string | number;
    organizationId?: Organization["id"];
    categoryId?: string;
    title?: string;
    description?: string;
    longDescription?: string;
    image?: string;
    images?: string[] | BookingImage[];
    horizontalImages?: string[] | BookingImage[];
    verticalImages?: string[] | BookingImage[];
    organization?: BookingOrganization;
    category?: BookingCategory;
    sortOrder?: number;
    isActive?: boolean;
}

export type BookingCategory = {
    id: string;
    organizationId?: Organization["id"];
    title: string;
    description: string;
    previewUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
    organization?: BookingOrganization;
};

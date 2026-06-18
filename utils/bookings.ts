import {apiFetch} from "@/utils/api";
import type {Booking, BookingCategory, BookingImage, BookingOrganization} from "@/types/booking";

type ApiBookingOrganization = {
    id: string;
    slug?: string | null;
    name: string;
    phone: string;
};

type ApiBookingCategory = {
    id: string;
    organization_id: string;
    title: string;
    description?: string | null;
    preview_url?: string | null;
    sort_order?: number | null;
    is_active?: boolean | null;
    organization?: ApiBookingOrganization | null;
};

type ApiBookingImage = {
    id: string;
    url: string;
    orientation?: "horizontal" | "vertical" | null;
    alt_text?: string | null;
    sort_order?: number | null;
};

type ApiBooking = {
    id: string;
    organization_id: string;
    category_id: string;
    title: string;
    description?: string | null;
    long_description?: string | null;
    preview_url?: string | null;
    images?: ApiBookingImage[] | null;
    horizontal_images?: ApiBookingImage[] | null;
    vertical_images?: ApiBookingImage[] | null;
    sort_order?: number | null;
    is_active?: boolean | null;
    organization?: ApiBookingOrganization | null;
    category?: ApiBookingCategory | null;
};

type BookingListParams = {
    organizationId?: string | null;
    organizationSlug?: string | null;
    categoryId?: string | null;
    signal?: AbortSignal;
};

const normalizeImageUrl = (url?: string | null) => {
    const value = url?.trim();

    if (!value) return undefined;

    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
        return value;
    }

    return `/${value.replace(/^\/+/, "")}`;
};

const normalizeOrganization = (organization?: ApiBookingOrganization | null): BookingOrganization | undefined => {
    if (!organization) return undefined;

    return {
        id: organization.id,
        slug: organization.slug ?? undefined,
        name: organization.name,
        phone: organization.phone,
    };
};

export const normalizeBookingCategory = (category: ApiBookingCategory): BookingCategory => ({
    id: category.id,
    organizationId: category.organization_id,
    title: category.title,
    description: category.description ?? "",
    previewUrl: normalizeImageUrl(category.preview_url),
    sortOrder: category.sort_order ?? 0,
    isActive: category.is_active ?? true,
    organization: normalizeOrganization(category.organization),
});

const normalizeBookingImage = (image: ApiBookingImage): BookingImage | null => {
    const url = normalizeImageUrl(image.url);

    if (!url) return null;

    return {
        id: image.id,
        url,
        orientation: image.orientation ?? null,
        altText: image.alt_text ?? null,
        sortOrder: image.sort_order ?? 0,
    };
};

const normalizeBookingImages = (images?: ApiBookingImage[] | null) => (
    (images ?? [])
        .map(normalizeBookingImage)
        .filter((image): image is BookingImage => Boolean(image))
        .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
);

export const normalizeBooking = (booking: ApiBooking): Booking => ({
    id: booking.id,
    organizationId: booking.organization_id,
    categoryId: booking.category_id,
    title: booking.title,
    description: booking.description ?? "",
    longDescription: booking.long_description ?? "",
    image: normalizeImageUrl(booking.preview_url),
    images: normalizeBookingImages(booking.images),
    horizontalImages: normalizeBookingImages(booking.horizontal_images),
    verticalImages: normalizeBookingImages(booking.vertical_images),
    sortOrder: booking.sort_order ?? 0,
    isActive: booking.is_active ?? true,
    organization: normalizeOrganization(booking.organization),
    category: booking.category ? normalizeBookingCategory(booking.category) : undefined,
});

const getBookingParams = (params: BookingListParams = {}) => ({
    organization_id: params.organizationId,
    organization_slug: params.organizationSlug,
    category_id: params.categoryId,
});

export const loadBookingCategories = async (params: BookingListParams = {}) => {
    const categories = await apiFetch<ApiBookingCategory[]>("/api/v1/bookings/categories", {
        signal: params.signal,
        params: getBookingParams(params),
    });

    return categories
        .map(normalizeBookingCategory)
        .filter((category) => category.isActive !== false)
        .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));
};

export const loadBookings = async (params: BookingListParams = {}) => {
    const bookings = await apiFetch<ApiBooking[]>("/api/v1/bookings", {
        signal: params.signal,
        params: getBookingParams(params),
    });

    return bookings
        .map(normalizeBooking)
        .filter((booking) => booking.isActive !== false)
        .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));
};

export const loadBooking = async (bookingId: string, signal?: AbortSignal) => {
    const booking = await apiFetch<ApiBooking>(`/api/v1/bookings/${encodeURIComponent(bookingId)}`, {signal});

    return normalizeBooking(booking);
};

export const getBookingGalleryImages = (booking?: Booking | null) => {
    if (!booking) return [];

    const galleryImages = (booking.images ?? []).map((image) => (
        typeof image === "string" ? image : image.url
    ));

    return Array.from(
        new Set([
            booking.image,
            ...galleryImages,
        ].filter((image): image is string => Boolean(image)))
    );
};

export const getBookingResponsiveImages = (booking?: Booking | null) => {
    const legacyImages = getBookingGalleryImages(booking);

    if (!booking) {
        return {
            mobileImages: legacyImages,
            desktopImages: legacyImages,
        };
    }

    const getImages = (images?: string[] | BookingImage[]) => (
        (images ?? []).map((image) => (
            typeof image === "string" ? image : image.url
        ))
    );
    const uniqueImages = (images: (string | undefined)[]) => (
        Array.from(new Set(images.filter((image): image is string => Boolean(image))))
    );
    const horizontalImages = uniqueImages(getImages(booking.horizontalImages));
    const verticalImages = uniqueImages(getImages(booking.verticalImages));

    return {
        mobileImages: horizontalImages.length > 0 ? horizontalImages : legacyImages,
        desktopImages: verticalImages.length > 0 ? verticalImages : legacyImages,
    };
};

import {Organizations} from "@/mocks/mocks-data";
import type {Booking} from "@/types/booking";
import type {Organization} from "@/types/organization";

export const primaryOrganization = Organizations[0];

export const getOrganizationById = (
    organizationId?: Organization["id"] | null,
    organizations: Organization[] = Organizations,
) => {
    return organizations.find((organization) => organization.id === organizationId) ?? organizations[0] ?? primaryOrganization;
};

export const getOrganizationByIdOrSlug = (
    organizationIdOrSlug?: string | null,
    organizations: Organization[] = Organizations,
) => {
    return organizations.find((organization) => (
        organization.id === organizationIdOrSlug || organization.slug === organizationIdOrSlug
    )) ?? null;
};

export const getBookingOrganization = (
    booking?: Pick<Booking, "organizationId"> | null,
    organizations: Organization[] = Organizations,
) => {
    return (
        organizations.find((organization) => (
            organization.id === booking?.organizationId || organization.slug === booking?.organizationId
        )) ??
        getOrganizationById(booking?.organizationId, organizations)
    );
};

export const isBookingInOrganization = (
    booking: Pick<Booking, "organizationId">,
    organization: Pick<Organization, "id" | "slug">,
) => (
    booking.organizationId === organization.id || booking.organizationId === organization.slug
);

export const formatOrganizationAddress = (organization: Pick<Organization, "city" | "address">) => (
    `${organization.city}, ${organization.address}`
);

export const getOrganizationHref = (organization: Pick<Organization, "id" | "slug">) => (
    `/organization/${organization.slug ?? organization.id}`
);

export const getPhoneHref = (phone: string) => (
    `tel:${phone.replace(/\D/g, "")}`
);

export const getWhatsappHref = (phone: string) => (
    `https://wa.me/${phone.replace(/\D/g, "")}`
);

export const getOrganizationWhatsappHref = (organization: Pick<Organization, "phone" | "whatsapp_phone">) => (
    getWhatsappHref(organization.whatsapp_phone || organization.phone)
);

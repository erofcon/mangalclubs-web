import {Organizations} from "@/mocks/mocks-data";
import type {Booking} from "@/types/booking";
import type {Organization} from "@/types/organization";

export const primaryOrganization = Organizations[0];

export const getOrganizationById = (
    organizationId?: Organization["id"] | null,
) => {
    return Organizations.find((organization) => organization.id === organizationId) ?? primaryOrganization;
};

export const getBookingOrganization = (
    booking?: Pick<Booking, "organizationId"> | null,
) => {
    return getOrganizationById(booking?.organizationId);
};

export const formatOrganizationAddress = (organization: Pick<Organization, "city" | "address">) => (
    `${organization.city}, ${organization.address}`
);

export const getPhoneHref = (phone: string) => (
    `tel:${phone.replace(/\D/g, "")}`
);

export const getWhatsappHref = (phone: string) => (
    `https://wa.me/${phone.replace(/\D/g, "")}`
);

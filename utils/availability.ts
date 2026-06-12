import type {OrderType, RestaurantOrderDetails} from "@/store/order-store";
import type {Organization, OrganizationAvailability} from "@/types/organization";

export const DEFAULT_UNAVAILABLE_MESSAGE = "Онлайн-заказы временно недоступны. Попробуйте позже.";

type OrderAvailabilityInput = {
    orderType: OrderType | null;
    restaurant: RestaurantOrderDetails | null;
    organizations: Organization[];
    defaultDeliveryOrganization: Organization | null;
    availabilityByOrganizationId: Record<string, OrganizationAvailability>;
};

export const getOrganizationAvailability = (
    organization: Pick<Organization, "id" | "slug"> | null | undefined,
    availabilityByOrganizationId: Record<string, OrganizationAvailability>,
) => {
    if (!organization) return null;

    return availabilityByOrganizationId[organization.id] ??
        (organization.slug ? availabilityByOrganizationId[organization.slug] : null) ??
        null;
};

export const isOrganizationUnavailable = (
    organization: Pick<Organization, "id" | "slug"> | null | undefined,
    availabilityByOrganizationId: Record<string, OrganizationAvailability>,
) => {
    const availability = getOrganizationAvailability(organization, availabilityByOrganizationId);

    return availability?.orders_available === false;
};

export const getUnavailableOrganizations = (
    organizations: Organization[],
    availabilityByOrganizationId: Record<string, OrganizationAvailability>,
) => (
    organizations.filter((organization) => (
        isOrganizationUnavailable(organization, availabilityByOrganizationId)
    ))
);

export const getCurrentOrderOrganization = ({
                                               orderType,
                                               restaurant,
                                               organizations,
                                               defaultDeliveryOrganization,
                                           }: Omit<OrderAvailabilityInput, "availabilityByOrganizationId">) => {
    if (orderType === "restaurant" && restaurant) {
        return organizations.find((organization) => (
            organization.id === restaurant.id || organization.slug === restaurant.id
        )) ?? null;
    }

    if (orderType === "delivery") {
        return defaultDeliveryOrganization;
    }

    return null;
};

export const getCurrentOrderAvailability = (input: OrderAvailabilityInput) => {
    const organization = getCurrentOrderOrganization(input);
    const availability = getOrganizationAvailability(organization, input.availabilityByOrganizationId);
    const isUnavailable = availability?.orders_available === false;

    return {
        organization,
        availability,
        isUnavailable,
        message: isUnavailable
            ? availability?.message || DEFAULT_UNAVAILABLE_MESSAGE
            : "",
    };
};

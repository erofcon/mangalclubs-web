"use client";

import {useState} from "react";
import {Check} from "lucide-react";
import {useUIStore} from "@/store/ui-store";
import {useOrderStore} from "@/store/order-store";
import {useAppDataStore} from "@/store/app-data-store";
import {RestaurantInfoModal} from "@/feautures/order/RestaurantInfoModal";
import {formatOrganizationAddress, getOrganizationById} from "@/utils/organizations";
import {getOrganizationAvailability, isOrganizationUnavailable} from "@/utils/availability";
import {continuePendingCartFlow} from "@/store/cart-gate-store";

export function RestaurantTypeModal() {
    const isOpen = useUIStore((state) => state.isRestaurantTypeModalOpen);
    const closeRestaurantTypeModal = useUIStore((state) => state.closeRestaurantTypeModal);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);
    const selectedRestaurant = useOrderStore((state) => state.restaurant);
    const selectRestaurant = useOrderStore((state) => state.selectRestaurant);
    const organizations = useAppDataStore((state) => state.organizations);
    const availabilityByOrganizationId = useAppDataStore((state) => state.availabilityByOrganizationId);
    const pickupOrganizations = organizations.filter((organization) => organization.accepts_pickup !== false);
    const firstAvailablePickupOrganization = pickupOrganizations.find((organization) => (
        !isOrganizationUnavailable(organization, availabilityByOrganizationId)
    ));

    const [draftOrganizationId, setDraftOrganizationId] = useState<string | null>(null);
    const activeOrganizationId = draftOrganizationId ??
        selectedRestaurant?.id ??
        firstAvailablePickupOrganization?.id ??
        pickupOrganizations[0]?.id;
    const activeOrganization = getOrganizationById(activeOrganizationId, pickupOrganizations);
    const activeAvailability = getOrganizationAvailability(activeOrganization, availabilityByOrganizationId);
    const isActiveUnavailable = activeAvailability?.orders_available === false;

    const handleClose = () => {
        setDraftOrganizationId(null);
        closeRestaurantTypeModal();
    };

    const handleSelect = () => {
        if (isActiveUnavailable) return;

        const isSelected = selectRestaurant(activeOrganization);

        if (isSelected) {
            setDraftOrganizationId(null);
            closeRestaurantTypeModal();
            closeOrderTypeModal();
            continuePendingCartFlow();
        }
    };

    return (
        <RestaurantInfoModal
            isOpen={isOpen}
            onClose={handleClose}
            organization={activeOrganization}
            action={(
                <div className="flex min-h-0 flex-1 flex-col">
                    <div
                        className="organization-choice-grid min-h-0 flex-1 content-start items-start overflow-y-auto pr-1">
                        {pickupOrganizations.map((organization) => {
                            const isActive = organization.id === activeOrganization.id;
                            const availability = getOrganizationAvailability(organization, availabilityByOrganizationId);
                            const isUnavailable = availability?.orders_available === false;

                            return (
                                <button
                                    key={organization.id}
                                    type="button"
                                    disabled={isUnavailable}
                                    onClick={() => setDraftOrganizationId(organization.id)}
                                    className={`organization-choice ${isActive ? "organization-choice-active" : ""} ${isUnavailable ? "opacity-55" : ""}`}
                                >
                                    <span className="flex min-w-0 items-start gap-3">
                                        <span className="min-w-0">
                                            <span className="block text-[14px] font-semibold leading-5 text-text">
                                                {organization.name}
                                            </span>
                                            <span
                                                className="mt-1 block wrap-break-word text-[12px] leading-5 text-text/62">
                                                {formatOrganizationAddress(organization)}
                                            </span>
                                            {isUnavailable && (
                                                <span className="mt-2 block text-[12px] font-medium leading-5 text-primary">
                                                    {availability.message || "Онлайн-заказы временно недоступны"}
                                                </span>
                                            )}
                                        </span>
                                    </span>

                                    {isActive && (
                                        <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleSelect}
                        disabled={isActiveUnavailable}
                        className="mt-4 h-12 w-full shrink-0 cursor-pointer rounded-[6px] bg-primary text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        Выбрать ресторан
                    </button>
                </div>
            )}
        />
    );
}

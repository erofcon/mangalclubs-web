"use client";

import {Bike, Check, Utensils} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useOrderStore} from "@/store/order-store";
import {useUIStore} from "@/store/ui-store";
import {useAppDataStore} from "@/store/app-data-store";
import {getOrganizationAvailability, getUnavailableOrganizations} from "@/utils/availability";
import {cancelPendingCartFlow} from "@/store/cart-gate-store";

export function OrderTypeModal() {
    const isOpen = useUIStore((state) => state.isOrderTypeModalOpen);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);
    const openRestaurantTypeModal = useUIStore((state) => state.openRestaurantTypeModal);
    const openDeliveryTypeModal = useUIStore((state) => state.openDeliveryTypeModal);
    const orderType = useOrderStore((state) => state.orderType);
    const organizations = useAppDataStore((state) => state.organizations);
    const defaultDeliveryOrganization = useAppDataStore((state) => state.defaultDeliveryOrganization);
    const availabilityByOrganizationId = useAppDataStore((state) => state.availabilityByOrganizationId);
    const isInitialized = useAppDataStore((state) => state.isInitialized);

    if (!isOpen) return null;

    const handleClose = () => {
        cancelPendingCartFlow();
        closeOrderTypeModal();
    };

    const isDeliverySelected = orderType === "delivery";
    const isRestaurantSelected = orderType === "restaurant";
    const deliveryAvailability = getOrganizationAvailability(defaultDeliveryOrganization, availabilityByOrganizationId);
    const isDeliveryDisabled = !isInitialized || deliveryAvailability?.orders_available === false;
    const pickupOrganizations = organizations.filter((organization) => organization.accepts_pickup !== false);
    const isRestaurantDisabled = !isInitialized || getUnavailableOrganizations(
        pickupOrganizations,
        availabilityByOrganizationId,
    ).length === pickupOrganizations.length;

    return (
        <ModalSkeleton
            onClose={handleClose}
            className="sm:max-w-md sm:h-70"
        >
            <div
                className="flex h-full w-full flex-col border-border bg-background px-6 py-8 pb-6 sm:rounded-[8px] sm:border sm:px-10 sm:py-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Заказ
                        </p>
                        <h1
                            className="text-[28px] font-normal leading-tight text-text"
                        >
                            Как хотите получить заказ?
                        </h1>
                        <p className="text-sm leading-6 text-text/68">
                            Покажем доступные блюда и актуальные цены
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <button
                        type="button"
                        onClick={openDeliveryTypeModal}
                        disabled={isDeliveryDisabled}
                        className={`
                            flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border px-5 text-sm font-semibold transition duration-300
                            ${isDeliverySelected
                            ? "border-primary bg-primary text-on-primary"
                            : "border-border bg-background text-text hover:border-primary hover:text-primary"}
                            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:text-text
                        `}
                    >
                        <Bike width={24} height={24}/>
                        Доставка
                        {isDeliverySelected && <Check className="h-4 w-4"/>}
                    </button>

                    <button
                        type="button"
                        onClick={openRestaurantTypeModal}
                        disabled={isRestaurantDisabled}
                        className={`
                            flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border px-5 text-sm font-semibold transition duration-300
                            ${isRestaurantSelected
                            ? "border-primary bg-primary text-on-primary"
                            : "border-border bg-background text-text hover:border-primary hover:text-primary"}
                            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:text-text
                        `}
                    >
                        <Utensils width={16} height={16}/>
                        Самовывоз
                        {isRestaurantSelected && <Check className="h-4 w-4"/>}
                    </button>
                </div>
            </div>
        </ModalSkeleton>
    );
}

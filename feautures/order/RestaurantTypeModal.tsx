"use client";

import {useState} from "react";
import {Check} from "lucide-react";
import {Organizations} from "@/mocks/mocks-data";
import {useUIStore} from "@/store/ui-store";
import {useOrderStore} from "@/store/order-store";
import {RestaurantInfoModal} from "@/feautures/order/RestaurantInfoModal";
import {formatOrganizationAddress, getOrganizationById} from "@/utils/organizations";

export function RestaurantTypeModal() {
    const isOpen = useUIStore((state) => state.isRestaurantTypeModalOpen);
    const closeRestaurantTypeModal = useUIStore((state) => state.closeRestaurantTypeModal);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);
    const selectedRestaurant = useOrderStore((state) => state.restaurant);
    const selectRestaurant = useOrderStore((state) => state.selectRestaurant);

    const [draftOrganizationId, setDraftOrganizationId] = useState<string | null>(null);
    const activeOrganizationId = draftOrganizationId ?? selectedRestaurant?.id ?? Organizations[0].id;
    const activeOrganization = getOrganizationById(activeOrganizationId);

    const handleClose = () => {
        setDraftOrganizationId(null);
        closeRestaurantTypeModal();
    };

    const handleSelect = () => {
        const isSelected = selectRestaurant(activeOrganization);

        if (isSelected) {
            setDraftOrganizationId(null);
            closeRestaurantTypeModal();
            closeOrderTypeModal();
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
                        {Organizations.map((organization) => {
                            const isActive = organization.id === activeOrganization.id;

                            return (
                                <button
                                    key={organization.id}
                                    type="button"
                                    onClick={() => setDraftOrganizationId(organization.id)}
                                    className={`organization-choice ${isActive ? "organization-choice-active" : ""}`}
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
                        className="mt-4 h-12 w-full shrink-0 cursor-pointer rounded-[6px] bg-primary text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                    >
                        Выбрать ресторан
                    </button>
                </div>
            )}
        />
    );
}

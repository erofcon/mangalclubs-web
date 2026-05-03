"use client";

import {PICKUP_POINT} from "@/mocks/mocks-data";
import {useUIStore} from "@/store/ui-store";
import {useOrderStore} from "@/store/order-store";
import {RestaurantInfoModal} from "@/feautures/order/RestaurantInfoModal";

export function RestaurantTypeModal() {
    const isOpen = useUIStore((state) => state.isRestaurantTypeModalOpen);
    const closeRestaurantTypeModal = useUIStore((state) => state.closeRestaurantTypeModal);
    const closeOrderTypeModal = useUIStore((state) => state.closeOrderTypeModal);
    const selectRestaurant = useOrderStore((state) => state.selectRestaurant);

    const handleSelect = () => {
        const isSelected = selectRestaurant(PICKUP_POINT);

        if (isSelected) {
            closeRestaurantTypeModal();
            closeOrderTypeModal();
        }
    };

    return (
        <RestaurantInfoModal
            isOpen={isOpen}
            onClose={closeRestaurantTypeModal}
            action={(
                <button
                    onClick={handleSelect}
                    className="h-12 w-full cursor-pointer rounded-full bg-warning text-base font-semibold text-text-on-primary"
                >
                    Выбрать
                </button>
            )}
        />
    );
}

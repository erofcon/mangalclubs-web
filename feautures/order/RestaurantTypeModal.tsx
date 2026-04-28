"use client"


import {ModalSkeleton} from "@/components/ui/ModalSkeleton";


export function RestaurantTypeModal() {
    return (
        <ModalSkeleton
            onClose={() => {
            }}
            className="sm:max-w-md sm:h-[280px]"
        >
            <div>
                Hello nigers!
                <button>Выбрать</button>
            </div>
        </ModalSkeleton>
    )
}
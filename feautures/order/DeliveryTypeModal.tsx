"use client"

import {ModalSkeleton} from "@/components/ui/ModalSkeleton";


export function DeliveryTypeModal() {
    return (
        <ModalSkeleton
            onClose={() => {
            }}
            className="h-155 w-[calc(100vw-32px)] max-w-4xl p-0 sm:h-120"
        >
            <div
                className="flex h-full w-full flex-col bg-background px-6 py-8 pb-6 sm:rounded-4xl sm:px-10 sm:py-10"
            >


            </div>
        </ModalSkeleton>
    )
}
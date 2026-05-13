"use client";

import dynamic from "next/dynamic";
import {ScrollToTop} from "@/feautures/floating-buttons/ScrollToTop";
import {useUIStore} from "@/store/ui-store";

const CartDrawer = dynamic(
    () => import("@/feautures/screens/main/cart/CartDrawer").then((mod) => mod.CartDrawer),
    {ssr: false},
);

const OrderTypeModal = dynamic(
    () => import("@/feautures/order/OrderTypeModal").then((mod) => mod.OrderTypeModal),
    {ssr: false},
);

const DeliveryTypeModal = dynamic(
    () => import("@/feautures/order/DeliveryTypeModal").then((mod) => mod.DeliveryTypeModal),
    {ssr: false},
);

const RestaurantTypeModal = dynamic(
    () => import("@/feautures/order/RestaurantTypeModal").then((mod) => mod.RestaurantTypeModal),
    {ssr: false},
);

const AuthModal = dynamic(
    () => import("@/feautures/auth/AuthModal").then((mod) => mod.AuthModal),
    {ssr: false},
);

const AuthCodeConfirm = dynamic(
    () => import("@/feautures/auth/AuthCodeConfirm").then((mod) => mod.AuthCodeConfirm),
    {ssr: false},
);

export function GlobalOverlays() {
    const isCartOpen = useUIStore((state) => state.isCartOpen);
    const isOrderTypeModalOpen = useUIStore((state) => state.isOrderTypeModalOpen);
    const isDeliveryTypeModalOpen = useUIStore((state) => state.isDeliveryTypeModalOpen);
    const isRestaurantTypeModalOpen = useUIStore((state) => state.isRestaurantTypeModalOpen);
    const isAuthModalOpen = useUIStore((state) => state.isAuthModalOpen);
    const isAuthCodeConfirmOpen = useUIStore((state) => state.isAuthCodeConfirmOpen);

    return (
        <>
            {isOrderTypeModalOpen && <OrderTypeModal/>}
            {isDeliveryTypeModalOpen && <DeliveryTypeModal/>}
            {isRestaurantTypeModalOpen && <RestaurantTypeModal/>}
            {isAuthModalOpen && <AuthModal/>}
            {isAuthCodeConfirmOpen && <AuthCodeConfirm/>}
            {isCartOpen && <CartDrawer/>}
            <ScrollToTop/>
        </>
    );
}

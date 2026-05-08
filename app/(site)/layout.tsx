import React from "react";

import {DeliveryTypeModal} from "@/feautures/order/DeliveryTypeModal";
import {AuthModal} from "@/feautures/auth/AuthModal";
import {AuthCodeConfirm} from "@/feautures/auth/AuthCodeConfirm";
import {RestaurantTypeModal} from "@/feautures/order/RestaurantTypeModal";
import {OrderTypeModal} from "@/feautures/order/OrderTypeModal";

export default function SiteLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <OrderTypeModal/>
            <DeliveryTypeModal/>
            <AuthModal/>
            <AuthCodeConfirm/>
            <RestaurantTypeModal/>
            {children}
        </>
    );
}

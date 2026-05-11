import type {Metadata} from "next";
import {Open_Sans} from "next/font/google";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import {Footer} from "@/feautures/footer/Footer";
import Header from "@/feautures/header/Header";
import {CartDrawer} from "@/feautures/screens/main/cart/CartDrawer";
import {DeliveryTypeModal} from "@/feautures/order/DeliveryTypeModal";
import {AuthModal} from "@/feautures/auth/AuthModal";
import {AuthCodeConfirm} from "@/feautures/auth/AuthCodeConfirm";
import {RestaurantTypeModal} from "@/feautures/order/RestaurantTypeModal";
import {OrderTypeModal} from "@/feautures/order/OrderTypeModal";
import {ScrollToTop} from "@/feautures/floating-buttons/ScrollToTop";

import {point} from "@/app/fonts";


export const metadata: Metadata = {
    title: "Mangal Clubs",
    description: "Гриль-ресторан с доставкой и бронированием в Грозном",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body className={`${point.className} min-h-dvh overflow-x-hidden bg-background`}>
        <Header/>
        {children}
        <Footer/>
        <OrderTypeModal/>
        <DeliveryTypeModal/>
        <AuthModal/>
        <AuthCodeConfirm/>
        <RestaurantTypeModal/>
        <CartDrawer/>
        <ScrollToTop/>
        </body>
        </html>
    );
}

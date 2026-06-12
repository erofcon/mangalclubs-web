import type {Metadata} from "next";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import {Footer} from "@/feautures/footer/Footer";
import Header from "@/feautures/header/Header";
import {GlobalOverlays} from "@/feautures/GlobalOverlays";
import {HealthGate} from "@/components/HealthGate";
import {AppDataSync} from "@/components/AppDataSync";
import {OrderAvailabilityBar} from "@/components/OrderAvailabilityBar";

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
        <HealthGate>
            <AppDataSync/>
            <OrderAvailabilityBar/>
            <Header/>
            {children}
            <Footer/>
            <GlobalOverlays/>
        </HealthGate>
        </body>
        </html>
    );
}

import type {Metadata} from "next";
import {Open_Sans} from "next/font/google";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import {Footer} from "@/feautures/footer/Footer";

const myFont = Open_Sans({
    subsets: ["cyrillic"],
    weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
    title: "Grill & Mangal",
    description: "Гриль-ресторан с доставкой и бронированием в Грозном",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body className={`${myFont.className} min-h-dvh overflow-x-hidden bg-[#070808]`}>
        {children}
        <Footer/>
        </body>
        </html>
    );
}

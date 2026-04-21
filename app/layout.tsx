import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/styles/globals.css"
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Мангал Клабс",
    description: "Сеть премиальных мясных ресторанов с индивидуальным отношением к каждому гостю, вкуснейшей едой и незабываемой атмосферой",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ru"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
        <body className={'bg-background min-h-dvh md:max-w-6xl mx-auto'}>{children}</body>
        </html>
    );
}

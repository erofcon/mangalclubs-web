import type {Metadata} from "next";
import {Open_Sans} from "next/font/google";
import "@/styles/globals.css"
import React from "react";

const myFont = Open_Sans({
    subsets: ["cyrillic"],
    weight: ["400", "600", "800"]
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
        >
        {/*<body className={` ${myFont.className} bg-background min-h-dvh md:max-w-6xl mx-auto`}>{children}</body>*/}
        <body className={` ${myFont.className} bg-background min-h-dvh`}>{children}</body>
        </html>
    );
}

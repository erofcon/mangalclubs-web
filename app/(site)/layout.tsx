import React from "react";
import Header from "@/feautures/header/Header";

export default function SiteLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header/>
            {children}
        </>
    );
}

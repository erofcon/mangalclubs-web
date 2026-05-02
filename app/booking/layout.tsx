import React from "react";
import {Header} from "@/feautures/screens/booking/header/Header";


export default function BookingLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header/>
            {children}
        </>
    )
}
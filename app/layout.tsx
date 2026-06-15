import type {Metadata} from "next";
import Script from "next/script";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import {Footer} from "@/feautures/footer/Footer";
import Header from "@/feautures/header/Header";
import {GlobalOverlays} from "@/feautures/GlobalOverlays";
import {HealthGate} from "@/components/HealthGate";
import {AppDataSync} from "@/components/AppDataSync";
import {OrderAvailabilityBar} from "@/components/OrderAvailabilityBar";
import {
    PAYMENT_REDIRECT_STATE_STORAGE_KEY,
    PAYMENT_REDIRECT_URL_STORAGE_KEY,
} from "@/utils/payment-return";

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
        <Script id="payment-return-reload" strategy="beforeInteractive">
            {`
                (function () {
                    var redirectUrlKey = ${JSON.stringify(PAYMENT_REDIRECT_URL_STORAGE_KEY)};
                    var redirectStateKey = ${JSON.stringify(PAYMENT_REDIRECT_STATE_STORAGE_KEY)};

                    var getStorageValue = function (key) {
                        try {
                            return window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
                        } catch (error) {
                            return null;
                        }
                    };

                    var removeStorageValue = function (key) {
                        try {
                            window.sessionStorage.removeItem(key);
                            window.localStorage.removeItem(key);
                        } catch (error) {}
                    };

                    var handlePaymentRedirectPage = function () {
                        if (window.location.pathname !== "/order-payment/redirect") return false;

                        var paymentUrl = getStorageValue(redirectUrlKey);
                        var redirectState = getStorageValue(redirectStateKey);

                        if (redirectState === "left") {
                            removeStorageValue(redirectUrlKey);
                            removeStorageValue(redirectStateKey);
                            window.location.replace("/");
                            return true;
                        }

                        if (!paymentUrl) {
                            window.location.replace("/");
                            return true;
                        }

                        try {
                            window.sessionStorage.setItem(redirectStateKey, "leaving");
                            window.localStorage.setItem(redirectStateKey, "leaving");
                        } catch (error) {}

                        window.addEventListener("pagehide", function () {
                            try {
                                window.sessionStorage.setItem(redirectStateKey, "left");
                                window.localStorage.setItem(redirectStateKey, "left");
                            } catch (error) {}
                        });

                        window.addEventListener("pageshow", function () {
                            if (getStorageValue(redirectStateKey) !== "left") return;

                            removeStorageValue(redirectUrlKey);
                            removeStorageValue(redirectStateKey);
                            window.location.replace("/");
                        });

                        window.location.assign(paymentUrl);
                        return true;
                    };

                    if (handlePaymentRedirectPage()) return;
                })();
            `}
        </Script>
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

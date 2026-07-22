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
import {RouteScrollManager} from "@/components/RouteScrollManager";
import {
    PAYMENT_REDIRECT_STATE_STORAGE_KEY,
    PAYMENT_REDIRECT_URL_STORAGE_KEY,
} from "@/utils/payment-return";

import {point} from "@/app/fonts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mangalclubs.ru";
const siteDescription = "Mangal Clubs - Ресторан в Грозном с доставкой, самовывозом и бронированием столов и приватных зон.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: "Mangal Clubs",
    title: {
        default: "Mangal Clubs | Гриль-ресторан в Грозном",
        template: "%s | Mangal Clubs",
    },
    description: siteDescription,
    keywords: [
        "Mangal Clubs",
        "Мангал Клабс",
        "ресторан Грозный",
        "доставка еды Грозный",
        "бронирование ресторана",
        "гриль ресторан",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "ru_RU",
        url: "/",
        siteName: "Mangal Clubs",
        title: "Mangal Clubs | Гриль-ресторан в Грозном",
        description: siteDescription,
        images: [
            {
                url: "/hero/hero-v2.png",
                width: 1200,
                height: 630,
                alt: "Mangal Clubs",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mangal Clubs | Гриль-ресторан в Грозном",
        description: siteDescription,
        images: ["/hero/hero-v2.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/logo.png",
    },
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
            <RouteScrollManager/>
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

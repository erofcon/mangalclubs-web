"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {BookingMocks} from "@/mocks/mocks-data";

type RestaurantSpan = 2 | 3 | 4 | 6;

type Booking = Readonly<{
    id: string;
    title: string;
    description: string;
    image: string;
}>;

type BookingCard = Booking & {
    span: RestaurantSpan;
};

const TABLET_BREAKPOINT = 1279;
const RESTAURANT_MATRIX_BREAKPOINT = 1280;

const desktopSpanPattern: RestaurantSpan[] = [
    3, 3,
    2, 2, 2,
    3, 3,
    6,
];

const getBookingSpan = (index: number): RestaurantSpan => {
    return desktopSpanPattern[index % desktopSpanPattern.length];
};

const getBookingsRows = (items: BookingCard[]) => {
    const rows: BookingCard[][] = [];
    let currentRow: BookingCard[] = [];
    let currentSum = 0;

    items.forEach((item) => {
        if (currentSum + item.span > 6) {
            rows.push(currentRow);
            currentRow = [];
            currentSum = 0;
        }

        currentRow.push(item);
        currentSum += item.span;
    });

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
};

const restaurantSpanClass: Record<RestaurantSpan, string> = {
    2: "xl:w-1/3",
    3: "xl:w-1/2",
    4: "xl:w-2/3",
    6: "xl:w-full",
};

export function BookingScreen() {
    const rootRef = useRef<HTMLElement | null>(null);
    const matrixRef = useRef<HTMLDivElement | null>(null);

    const [isMobileLayout, setIsMobileLayout] = useState(false);

    const bookings = useMemo<BookingCard[]>(() => {
        return BookingMocks.map((booking, index): BookingCard => ({
            id: String(booking.id),
            title: booking.title ?? "",
            description: booking.description ?? "",
            image: booking.image ?? "",
            span: getBookingSpan(index),
        }));
    }, []);

    const bookingRows = useMemo(() => {
        if (isMobileLayout) {
            return bookings.map((booking) => [booking]);
        }

        return getBookingsRows(bookings);
    }, [bookings, isMobileLayout]);

    useEffect(() => {
        const updateViewportState = () => {
            setIsMobileLayout(window.innerWidth <= TABLET_BREAKPOINT);
        };

        updateViewportState();
        window.addEventListener("resize", updateViewportState);

        return () => window.removeEventListener("resize", updateViewportState);
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || typeof IntersectionObserver === "undefined") return;

        const items = root.querySelectorAll<HTMLElement>(".element-fade");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("fade-in-up");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -8% 0px",
            },
        );

        items.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, [isMobileLayout]);


    useEffect(() => {
        const list = matrixRef.current;
        if (!list) return;

        let frameId = 0;

        const calculateTransform = () => {
            frameId = 0;

            const selector =
                window.innerWidth <= RESTAURANT_MATRIX_BREAKPOINT
                    ? ".js-restaurant-card"
                    : ".js-restaurant-row";

            const nodes = list.querySelectorAll<HTMLElement>(selector);

            nodes.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const height = Math.max(rect.height, 1);
                const percent = Math.floor(((window.innerHeight - rect.top) * 100) / height);

                const scale = Math.max(1, 1.1 - percent * 0.001);
                const translateY = Math.max(0, 50 - percent * 0.5);
                const opacity = Math.max(0, Math.min(1, percent / 100));

                node.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, ${translateY})`;
                node.style.opacity = String(opacity);
            });
        };

        const scheduleTransform = () => {
            if (frameId) return;
            frameId = window.requestAnimationFrame(calculateTransform);
        };

        calculateTransform();
        window.addEventListener("scroll", scheduleTransform, {passive: true});
        window.addEventListener("resize", scheduleTransform);

        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", scheduleTransform);
            window.removeEventListener("resize", scheduleTransform);
        };
    }, [isMobileLayout]);

    return (
        <main
            ref={rootRef}
            className="min-h-screen overflow-hidden scroll-smooth bg-background font-sans text-text"
        >
            <section className="relative mb-5 h-auto pt-14.25 xl:mb-10 xl:h-screen xl:p-0">
                <div className="h-full w-full">
                    <div
                        className="static inset-0 z-0 h-full w-full overflow-hidden bg-background xl:absolute xl:max-h-screen">
                        <video
                            key="/booking/header/header.mp4"
                            className="block h-auto w-full object-fill xl:h-full xl:object-cover"
                            playsInline
                            loop
                            autoPlay
                            muted
                            preload="metadata"
                        >
                            <source src="/booking/header/header.mp4" type="video/mp4"/>
                            Тег video не поддерживается вашим браузером.
                        </video>
                    </div>
                </div>
            </section>

            <section className="py-10 xl:py-17.5 mx-auto w-full max-w-374 px-7">
                <div className="mx-auto w-full max-w-374 px-4 xl:px-7">
                    <div className="element-fade mb-12.5 xl:mb-25">
                        <h1 className="text-[30px] font-medium leading-9.25 tracking-[0.005em] xl:text-[40px] xl:leading-12.25">
                            Наши <span className="text-text-secondary">VIP</span> кабинки
                        </h1>

                        <p className="mt-7.5 text-lg leading-6.25 xl:mt-12.5 xl:text-[21px]">
                            Приватная зона для своей компании — отдых, общение и максимум комфорта без лишних глаз
                        </p>
                    </div>

                    <div ref={matrixRef} className="xl:-mb-20">
                        {bookingRows.map((row, rowIndex) => (
                            <div
                                className="js-restaurant-row -mx-3 flex origin-top flex-wrap will-change-[transform,opacity] xl:-mx-7"
                                key={rowIndex}
                            >
                                {row.map((booking) => (
                                    <article
                                        className={`js-restaurant-card relative mb-7.5 min-h-px w-full px-3 xl:mb-20 xl:px-7 ${
                                            restaurantSpanClass[booking.span]
                                        }`}
                                        key={booking.id}
                                    >
                                        <Link
                                            href={`booking/${booking.id}`}
                                            className="group relative block min-h-60 overflow-hidden rounded-[20px] bg-background text-text xl:min-h-84 2xl:min-h-84 [@media(min-width:1280px)_and_(max-width:1400px)]:min-h-71"
                                        >
                                            <span
                                                className="absolute -inset-px z-0 overflow-hidden transition duration-700 before:absolute before:inset-0 before:z-1 before:bg-linear-to-b before:from-transparent before:from-[58.99%] before:to-black/60 before:content-[''] after:absolute after:inset-0 after:z-1 after:bg-black/30 after:transition-opacity after:duration-300 after:content-[''] group-hover:scale-[1.035] group-hover:after:opacity-70">
                                                <Image
                                                    src={booking.image}
                                                    alt={booking.title}
                                                    fill
                                                    sizes="(max-width: 1279px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                            </span>

                                            <span className="absolute inset-0 z-2 p-8">
                                                <span className="absolute bottom-8 left-8 right-8">
                                                    <span
                                                        className="block text-[26px] font-medium leading-8 xl:text-[30px] xl:leading-9.25">
                                                        {booking.title}
                                                    </span>
                                                </span>
                                            </span>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
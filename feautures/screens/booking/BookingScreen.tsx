"use client";

import Image from "next/image";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {BookingMocks, PICKUP_POINT} from "@/mocks/mocks-data";

const bookingCount = BookingMocks.length;

const heroHighlights = [
    {value: bookingCount, label: "Кабинок"},
    {value: "10:30–01:30", label: "каждый день"},
    {value: "г. Грозный", label: "адрес"},
];

export function BookingScreen() {
    return (
        <main className="min-h-screen overflow-hidden bg-background text-text">
            <section className="relative isolate mx-auto w-full max-w-302.5 overflow-hidden">
                <video
                    className="absolute inset-0 -z-30 h-full w-full object-cover"
                    playsInline
                    loop
                    autoPlay
                    muted
                    preload="metadata"
                >
                    <source src="/booking/header/header.mp4" type="video/mp4"/>
                </video>

                <div
                    className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.36)_28%,rgba(5,5,5,0.32)_56%,rgba(5,5,5,0.2)_100%)]"/>
                <div
                    className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_46%,#070808_100%)]"/>

                <div
                    className="flex min-h-[70vh] sm:min-h-140 items-center sm:items-end px-5 pb-8 sm:pb-12 sm:px-6 lg:px-0">
                    <div className="max-w-165">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            Бронирование
                        </p>

                        <h1
                            className="max-w-162.5 text-[45px] font-normal leading-[0.98] text-text drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Кабинки для спокойного вечера.
                        </h1>

                        <p className="mt-6 max-w-130 text-[15px] leading-7 text-text/82 sm:text-[16px]">
                            Выберите приватную зону, а мы поможем забронировать удобное время в Mangal Club.
                        </p>

                        <div
                            className="mt-9 grid max-w-135 grid-cols-3 overflow-hidden rounded-[10px]
                        border border-white/9 bg-black/30 backdrop-blur-md"
                        >
                            {heroHighlights.map((item, index) => (
                                <div
                                    key={item.label}
                                    className={[
                                        "px-4 py-4 sm:px-5 sm:py-5",
                                        index !== 0 ? "border-l border-white/8" : "",
                                    ].join(" ")}
                                >
                                    <div className="text-[12px] font-semibold leading-none text-text md:text-[19px]">
                                        {item.value}
                                    </div>
                                    <div className="mt-2 text-[12px] leading-none text-text/60">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Выбор зоны
                        </p>
                        <h2
                            className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Наши VIP-кабинки
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {BookingMocks.map((booking) => (
                        <Link
                            key={booking.id}
                            href={`/booking/${booking.id}`}
                            className="group block overflow-hidden rounded-[8px] border border-border/70 transition duration-300 hover:border-primary/70"
                        >
                            <span className="relative block aspect-[1.34] overflow-hidden bg-black">
                                {booking.image && (
                                    <Image
                                        src={booking.image}
                                        alt={booking.title ?? "VIP-кабинка"}
                                        fill
                                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                                        className="object-cover transition duration-500 group-hover:scale-[1.035]"
                                    />
                                )}
                                <span
                                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(0,0,0,0.78)_100%)]"/>
                            </span>

                            <span
                                className="flex min-h-34 items-end justify-between gap-5 border-t border-border/55 px-5 py-5">
                                <span className="min-w-0">
                                    <span
                                        className="block wrap-break-word text-[22px] font-normal leading-7 text-text"
                                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                    >
                                        {booking.title}
                                    </span>
                                    <span className="mt-2 block line-clamp-2 text-[14px] leading-6 text-text/68">
                                        {booking.description}
                                    </span>
                                </span>
                                <span
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/70 text-primary transition duration-300 group-hover:border-primary">
                                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5"
                                                strokeWidth={1.8}/>
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
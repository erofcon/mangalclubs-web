"use client";

import Image from "next/image";
import Link from "next/link";
import {ArrowRight, Flame, Sparkles, Users, Utensils, Waves} from "lucide-react";
import {BookingCategories, BookingMocks} from "@/mocks/mocks-data";
import type {BookingCategory} from "@/types/booking";
import {CategoryNav} from "@/feautures/screens/main/category/CategoryNav";

const bookingCount = BookingMocks.length;
const bookingCategoryNavItems = BookingCategories.map(({id, title}) => ({id, title}));

const heroHighlights = [
    {value: BookingCategories.length, label: "категории"},
    {value: bookingCount, label: "зон"},
    {value: "10:30–01:30", label: "каждый день"},
];

const getCategoryBookings = (categoryId: string) => {
    return BookingMocks.filter((booking) => booking.categoryId === categoryId);
};

export function BookingScreen() {
    return (
        <main className="min-h-screen bg-background text-text">
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
                    className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.5)_30%,rgba(5,5,5,0.34)_62%,rgba(5,5,5,0.18)_100%)]"/>
                <div
                    className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_46%,#070808_100%)]"/>

                <div
                    className="flex min-h-[70vh] items-center px-5 pb-8 sm:min-h-140 sm:items-end sm:px-6 sm:pb-12 lg:px-0">
                    <div className="max-w-170">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            Бронирование
                        </p>

                        <h1
                            className="max-w-175 text-[45px] font-normal leading-[0.98] text-text drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Зоны для отдыха и спокойного вечера.
                        </h1>

                        <p className="mt-6 max-w-135 text-[15px] leading-7 text-text/82 sm:text-[16px]">
                            Выберите VIP-кабинку, сауну с бассейном или столик в зале. Мы подскажем свободное время и
                            поможем забронировать удобный формат в Mangal Club.
                        </p>

                        <div
                            className="mt-9 grid max-w-140 grid-cols-3 overflow-hidden rounded-[10px] border border-white/9 bg-black/30 backdrop-blur-md"
                        >
                            {heroHighlights.map((item, index) => (
                                <div
                                    key={item.label}
                                    className={[
                                        "px-4 py-4 sm:px-5 sm:py-5",
                                        index !== 0 ? "border-l border-white/8" : "",
                                    ].join(" ")}
                                >
                                    <div className="text-[13px] font-semibold leading-none text-text md:text-[19px]">
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

            <section className="mx-auto w-full max-w-302.5 px-5 pt-8 sm:px-6 lg:px-0">
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Выбор зоны
                        </p>
                        <h2
                            className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Бронируйте под настроение вечера
                        </h2>
                    </div>

                    <p className="max-w-105 text-[14px] leading-6 text-text/68">
                        Категории помогают быстро выбрать формат: приватно, расслабленно или ближе к живой атмосфере
                        зала.
                    </p>
                </div>
            </section>

            <CategoryNav
                items={bookingCategoryNavItems}
                sectionIdPrefix="booking-category"
                ariaLabel="Категории бронирования"
                menuTitle="Категории бронирования"
            />

            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-5 lg:grid-cols-3">
                    {BookingCategories.map((category) => (
                        <CategoryPreview
                            key={category.id}
                            category={category}
                            count={getCategoryBookings(category.id).length}
                        />
                    ))}
                </div>

                <div className="mt-14 space-y-14">
                    {BookingCategories.map((category) => {
                        const categoryBookings = getCategoryBookings(category.id);

                        return (
                            <section
                                key={category.id}
                                id={`booking-category-${category.id}`}
                                className="booking-section-anchor"
                            >
                                <div
                                    className="mb-5 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                            {category.title}
                                        </p>
                                        <h3
                                            className="mt-2 text-[26px] font-normal leading-tight text-text sm:text-[32px]"
                                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                        >
                                            {categoryBookings.length} {getZoneWord(categoryBookings.length)}
                                        </h3>
                                    </div>

                                    <p className="max-w-110 text-[14px] leading-6 text-text/68">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {categoryBookings.map((booking) => (
                                        <Link
                                            key={booking.id}
                                            href={`/booking/${booking.id}`}
                                            className="booking-zone-card group block overflow-hidden rounded-[8px] border border-border/70 transition duration-300 hover:-translate-y-0.5 hover:border-primary/70"
                                        >
                                            <span className="relative block aspect-[1.34] overflow-hidden bg-black">
                                                {booking.image && (
                                                    <Image
                                                        src={booking.image}
                                                        alt={booking.title ?? "Зона бронирования"}
                                                        fill
                                                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                                                        className="object-cover transition duration-500 group-hover:scale-[1.035]"
                                                    />
                                                )}
                                                <span
                                                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_24%,rgba(0,0,0,0.82)_100%)]"/>
                                                <span
                                                    className="absolute left-4 top-4 rounded-[5px] border border-white/12 bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur">
                                                    {booking.categoryTitle ?? category.title}
                                                </span>
                                                {booking.capacity && (
                                                    <span
                                                        className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-[13px] font-semibold text-text">
                                                        <Users className="h-4 w-4 text-primary" strokeWidth={1.8}/>
                                                        {booking.capacity}
                                                    </span>
                                                )}
                                            </span>

                                            <span
                                                className="flex min-h-52 flex-col justify-between gap-5 border-t border-border/55 px-5 py-5">
                                                <span className="min-w-0">
                                                    <span
                                                        className="block wrap-break-word text-[22px] font-normal leading-7 text-text"
                                                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                                    >
                                                        {booking.title}
                                                    </span>
                                                    <span
                                                        className="mt-2 block line-clamp-2 text-[14px] leading-6 text-text/68">
                                                        {booking.description}
                                                    </span>
                                                </span>

                                                <span className="flex items-end justify-between gap-5">
                                                    <span className="flex min-w-0 flex-wrap gap-2">
                                                        {booking.time && (
                                                            <span
                                                                className="rounded-[5px] border border-border/55 px-2.5 py-1 text-[12px] text-text/68">
                                                                {booking.time}
                                                            </span>
                                                        )}
                                                        {booking.priceNote && (
                                                            <span
                                                                className="rounded-[5px] border border-border/55 px-2.5 py-1 text-[12px] text-text/68">
                                                                {booking.priceNote}
                                                            </span>
                                                        )}
                                                    </span>

                                                    <span
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/70 text-primary transition duration-300 group-hover:border-primary">
                                                        <ArrowRight
                                                            className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5"
                                                            strokeWidth={1.8}/>
                                                    </span>
                                                </span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

type CategoryPreviewProps = {
    category: BookingCategory;
    count: number;
};

function CategoryPreview({category, count}: CategoryPreviewProps) {
    return (
        <Link
            href={`#booking-category-${category.id}`}
            className="booking-surface group grid min-h-62 overflow-hidden rounded-[8px] border border-border/70 transition duration-300 hover:border-primary/70 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1"
        >
            <span className="relative block min-h-42 overflow-hidden bg-black lg:aspect-[1.35]">
                {category.image && (
                    <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        sizes="(max-width: 1023px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.035]"
                    />
                )}
                <span
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_20%,rgba(0,0,0,0.74)_100%)]"/>
            </span>

            <span className="flex min-w-0 flex-col justify-between gap-6 px-5 py-5">
                <span>
                    <span
                        className="mb-4 flex h-11 w-11 items-center justify-center rounded-[6px] border border-border/70 text-primary">
                        <CategoryIcon categoryId={category.id} className="h-5 w-5"/>
                    </span>
                    <span
                        className="block text-[24px] font-normal leading-7 text-text"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        {category.title}
                    </span>
                    <span className="mt-3 block text-[14px] leading-6 text-text/68">
                        {category.description}
                    </span>
                </span>

                <span className="flex items-center justify-between gap-4">
                    <span className="text-[13px] font-semibold text-primary">
                        {count} {getZoneWord(count)}
                    </span>
                    <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] border border-border/70 text-primary transition duration-300 group-hover:border-primary">
                        <ArrowRight className="h-4 w-4" strokeWidth={1.8}/>
                    </span>
                </span>
            </span>
        </Link>
    );
}

type CategoryIconProps = {
    categoryId: string;
    className: string;
};

function CategoryIcon({categoryId, className}: CategoryIconProps) {
    if (categoryId === "vip") {
        return <Flame className={className} strokeWidth={1.8}/>;
    }

    if (categoryId === "sauna-pool") {
        return <Waves className={className} strokeWidth={1.8}/>;
    }

    if (categoryId === "tables") {
        return <Utensils className={className} strokeWidth={1.8}/>;
    }

    return <Sparkles className={className} strokeWidth={1.8}/>;
}

function getZoneWord(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) return "зона";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "зоны";

    return "зон";
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Flame,
    MapPin,
    Sparkles,
    Users,
    Utensils,
    Waves,
    Wifi,
    CreditCard,
    SquareParking,
} from "lucide-react";
import {BookingCategories, BookingMocks} from "@/mocks/mocks-data";
import {CategoryNav} from "@/feautures/screens/main/category/CategoryNav";
import {formatOrganizationAddress, getBookingOrganization} from "@/utils/organizations";


const getCategoryBookings = (categoryId: string) => {
    return BookingMocks.filter((booking) => booking.categoryId === categoryId);
};

const bookingCategoryNavItems = BookingCategories.map((category) => {
    const count = getCategoryBookings(category.id).length;

    return {
        id: category.id,
        title: category.title,
        meta: `${count} ${getBookingOptionWord(count)}`,
        icon: <CategoryIcon categoryId={category.id} className="h-4 w-4"/>,
    };
});

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
                    className="flex min-h-[70vh] mt-4 items-center px-5 pb-8 sm:min-h-140 sm:items-end sm:px-6 sm:pb-12 lg:px-0">
                    <div className="max-w-170">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            Бронирование
                        </p>

                        <h1
                            className="max-w-140 mt-8 text-[42px] font-semibold leading-[0.92] tracking-normal
                        text-text drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:text-[68px] lg:text-[68px]"
                        >
                            Выберите место для вечера в Mangal Club.
                        </h1>

                        <p className="mt-8 max-w-125 text-[14px] font-semibold tracking-normal
                     leading-[1.4] text-text sm:text-[16px]">
                            VIP-кабинка для приватной встречи, сауна с бассейном для отдыха или столик в зале. Напишите
                            нам, и мы уточним свободное время, посадку и условия брони.
                        </p>

                        <div className="max-w-120">
                            <div
                                className="mt-9 ps-1.5 flex flex-col md:flex-row gap-4
                            justify-between max-w-160 overflow-hidden rounded-[10px]"
                            >
                                <div className="flex gap-2 items-center justify-start">
                                    <div className="border p-1 rounded-lg border-border bg-background">
                                        <Wifi className="w-6 h-auto text-primary"/>
                                    </div>
                                    <span>Wi-Fi</span>
                                </div>
                                <div className="flex gap-2 items-center justify-start">
                                    <div className="border p-1 rounded-lg border-border bg-background">
                                        <CreditCard className="w-6 h-auto text-primary"/>
                                    </div>
                                    <span>Оплата картой</span>
                                </div>
                                <div className="flex gap-2 items-center justify-start">
                                    <div className="border p-1 rounded-lg border-border bg-background">
                                        <SquareParking className="w-6 h-auto text-primary"/>
                                    </div>
                                    <span>Парковка</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-302.5 px-5 pt-8 sm:px-6 lg:px-0">
                <div className="mb-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Выбор зоны
                    </p>
                    <h2
                        className="mt-2 text-[28px] font-normal leading-[0.92] text-text md:text-[32px]"
                    >
                        Подберите формат под ваш вечер
                    </h2>
                </div>
            </section>

            <CategoryNav
                items={bookingCategoryNavItems}
                sectionIdPrefix="booking-category"
                ariaLabel="Категории бронирования"
                menuTitle="Категории бронирования"
                variant="booking"
                showMenuButton={false}
                scrollOffset={-118}
                activeThreshold={170}
            />

            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                <div className="mt-4 space-y-14">
                    {BookingCategories.map((category) => {
                        const categoryBookings = getCategoryBookings(category.id);

                        return (
                            <section
                                key={category.id}
                                id={`booking-category-${category.id}`}
                                className="booking-section-anchor"
                            >
                                <div
                                    className="mb-8 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row  items-start sm:justify-between">
                                    <div>
                                        <p className="text-[22px] font-semibold uppercase tracking-[0.22em] text-text">
                                            {category.title}
                                        </p>
                                    </div>

                                    <p className="max-w-140 text-[16px] leading-6 text-text-secondary">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {categoryBookings.map((booking) => {
                                        const organization = getBookingOrganization(booking);

                                        return (
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
                                                    className="flex min-h-42 flex-col justify-between gap-5 border-t border-border/55 px-5 py-5">
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

                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                             <span
                                                                 className="mt-3 flex min-w-0 items-start gap-2 text-[12px] font-semibold leading-5 text-primary"
                                                             >
                                                                 <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                                                         strokeWidth={1.8}/>
                                                                 <span className="line-clamp-2 text-text/70">
                                                                     {organization.name} · {formatOrganizationAddress(organization)}
                                                                 </span>
                                                             </span>
                                                        </div>
                                                        <span
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70 text-primary transition duration-300 group-hover:border-primary">
                                                            <ArrowRight
                                                                className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5"
                                                                strokeWidth={1.8}/>
                                                        </span>
                                                    </div>
                                                </span>
                                            </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </section>
        </main>
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

function getBookingOptionWord(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) return "вариант";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "варианта";

    return "вариантов";
}

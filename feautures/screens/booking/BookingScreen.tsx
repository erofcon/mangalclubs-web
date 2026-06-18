"use client";

import {type ReactNode, useEffect, useMemo, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    CreditCard,
    LoaderCircle,
    MapPin,
    RefreshCcw,
    SlidersHorizontal,
    Sparkles,
    SquareParking,
    Wifi,
} from "lucide-react";
import {CategoryNav, type CategoryNavItem} from "@/feautures/screens/main/category/CategoryNav";
import {formatOrganizationAddress} from "@/utils/organizations";
import type {Organization} from "@/types/organization";
import {useAppDataStore} from "@/store/app-data-store";
import {getBookingResponsiveImages, loadBookingCategories, loadBookings} from "@/utils/bookings";
import type {Booking, BookingCategory} from "@/types/booking";

type BookingLoadStatus = "loading" | "ready" | "error";

const getCategoryBookings = (categoryId: string, bookings: Booking[]) => (
    bookings.filter((booking) => booking.categoryId === categoryId)
);

export function BookingScreen() {
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<Organization["id"] | null>(null);
    const [categories, setCategories] = useState<BookingCategory[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [status, setStatus] = useState<BookingLoadStatus>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const organizations = useAppDataStore((state) => state.organizations);
    const selectedOrganization = useMemo(() => (
        organizations.find((organization) => organization.id === selectedOrganizationId) ?? null
    ), [organizations, selectedOrganizationId]);
    const restaurantFilterNavItems: CategoryNavItem[] = useMemo(() => (
        organizations.map((organization) => ({
            id: organization.id,
            title: organization.name,
            meta: `${formatOrganizationAddress(organization)}`,
            icon: <MapPin className="h-4 w-4" strokeWidth={1.8}/>,
        }))
    ), [organizations]);

    useEffect(() => {
        const controller = new AbortController();

        const loadBookingData = async () => {
            setStatus("loading");
            setErrorMessage("");

            try {
                const bookingRequestParams = {
                    organizationId: selectedOrganization?.id,
                    signal: controller.signal,
                };
                const [loadedCategories, loadedBookings] = await Promise.all([
                    loadBookingCategories({signal: controller.signal}),
                    loadBookings(bookingRequestParams),
                ]);

                setCategories(loadedCategories);
                setBookings(loadedBookings);
                setStatus("ready");
            } catch (error) {
                if (controller.signal.aborted) return;

                setStatus("error");
                setErrorMessage(error instanceof Error ? error.message : "Не удалось загрузить бронирование");
            }
        };

        void loadBookingData();

        return () => {
            controller.abort();
        };
    }, [reloadKey, selectedOrganization]);

    const visibleBookingCategories = useMemo(() => {
        return categories.filter((category) => (
            getCategoryBookings(category.id, bookings).length > 0
        ));
    }, [bookings, categories]);

    const bookingCategoryNavItems = useMemo(() => {
        return categories.map((category) => {
            const count = getCategoryBookings(category.id, bookings).length;

            return {
                id: category.id,
                title: category.title,
                meta: `${count} ${getBookingOptionWord(count)}`,
            };
        });
    }, [bookings, categories]);

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
                        className="mt-4 text-[28px] font-normal leading-[0.92] text-text"
                    >
                        Подберите формат под ваш вечер
                    </h2>
                </div>
            </section>

            {bookingCategoryNavItems.length > 0 && (
                <CategoryNav
                    items={bookingCategoryNavItems}
                    menuItems={restaurantFilterNavItems}
                    menuActiveId={selectedOrganizationId}
                    sectionIdPrefix="booking-category"
                    ariaLabel="Категории бронирования"
                    menuTitle="Рестораны"
                    menuButtonIcon={<SlidersHorizontal className="h-5 w-5" strokeWidth={2.2}/>}
                    menuButtonLabel="Выбрать ресторан"
                    closeMenuLabel="Закрыть выбор ресторана"
                    variant="booking"
                    onMenuItemSelect={(item) => {
                        const organizationId = String(item.id) as Organization["id"];

                        setSelectedOrganizationId((currentOrganizationId) => (
                            currentOrganizationId === organizationId ? null : organizationId
                        ));
                    }}
                    scrollOffset={-118}
                    activeThreshold={170}
                />
            )}

            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                {status === "loading" && (
                    <BookingState
                        icon={<LoaderCircle className="h-8 w-8 animate-spin text-primary"/>}
                        title="Загружаем варианты бронирования"
                        text="Сейчас подтянем актуальные зоны и рестораны."
                    />
                )}

                {status === "error" && (
                    <BookingState
                        icon={<RefreshCcw className="h-8 w-8 text-primary"/>}
                        title="Не удалось загрузить бронирование"
                        text={errorMessage || "Попробуйте обновить список чуть позже."}
                        actionLabel="Повторить"
                        onAction={() => setReloadKey((current) => current + 1)}
                    />
                )}

                {status === "ready" && visibleBookingCategories.length === 0 && (
                    <BookingState
                        icon={<Sparkles className="h-8 w-8 text-primary"/>}
                        title="Пока нет доступных зон"
                        text={selectedOrganization ? "Для выбранного ресторана нет активных вариантов бронирования." : "Активные варианты бронирования скоро появятся."}
                    />
                )}

                {status === "ready" && visibleBookingCategories.length > 0 && (
                    <div className="mt-4 space-y-14">
                        {visibleBookingCategories.map((category) => {
                            const categoryBookings = getCategoryBookings(category.id, bookings);

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

                                        {category.description && (
                                            <p className="max-w-140 text-[16px] leading-6 text-text-secondary">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {categoryBookings.map((booking) => {
                                            const organization = getBookingOrganizationInfo(booking, organizations);
                                            const {mobileImages, desktopImages} = getBookingResponsiveImages(booking);
                                            const mobileImage = mobileImages[0] ?? desktopImages[0];
                                            const desktopImage = desktopImages[0] ?? mobileImages[0];

                                            return (
                                                <Link
                                                    key={booking.id}
                                                    href={`/booking/${booking.id}`}
                                                    className="booking-zone-card group block overflow-hidden rounded-[8px] border border-border/70 transition duration-300 hover:-translate-y-0.5 hover:border-primary/70"
                                                >
                                                    <span className="relative block aspect-[1.34] overflow-hidden bg-black">
                                                        {mobileImage && (
                                                            <Image
                                                                src={mobileImage}
                                                                alt={booking.title ?? "Зона бронирования"}
                                                                fill
                                                                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                                                                className="object-cover transition duration-500 group-hover:scale-[1.035] lg:hidden"
                                                            />
                                                        )}
                                                        {desktopImage && (
                                                            <Image
                                                                src={desktopImage}
                                                                alt={booking.title ?? "Зона бронирования"}
                                                                fill
                                                                sizes="(max-width: 1279px) 50vw, 33vw"
                                                                className="hidden object-cover transition duration-500 group-hover:scale-[1.035] lg:block"
                                                            />
                                                        )}
                                                        <span
                                                            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_24%,rgba(0,0,0,0.82)_100%)]"/>
                                                    </span>

                                                    <span
                                                        className="flex min-h-42 flex-col justify-between gap-5 border-t border-border/55 px-5 py-5">
                                                        <span className="min-w-0">
                                                            <span
                                                                className="block wrap-break-word text-[22px] font-normal leading-7 text-text"
                                                            >
                                                                {booking.title}
                                                            </span>
                                                            {booking.description && (
                                                                <span
                                                                    className="mt-2 block line-clamp-2 text-[14px] leading-6 text-text/68">
                                                                    {booking.description}
                                                                </span>
                                                            )}

                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <span
                                                                        className="mt-3 flex min-w-0 items-start gap-2 text-[12px] font-semibold leading-5 text-primary"
                                                                    >
                                                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                                                                strokeWidth={1.8}/>
                                                                        <span className="line-clamp-2 text-text/70">
                                                                            {organization.address
                                                                                ? `${organization.name} · ${organization.address}`
                                                                                : organization.name}
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
                )}
            </section>
        </main>
    );
}

function getBookingOptionWord(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) return "вариант";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "варианта";

    return "вариантов";
}

type BookingStateProps = {
    icon: ReactNode;
    title: string;
    text: string;
    actionLabel?: string;
    onAction?: () => void;
};

function BookingState({icon, title, text, actionLabel, onAction}: BookingStateProps) {
    return (
        <div className="booking-surface mt-6 rounded-[8px] border border-border/70 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[8px] border border-border/70 bg-background">
                {icon}
            </div>
            <h3 className="mt-5 text-[26px] font-normal leading-tight text-text">
                {title}
            </h3>
            <p className="mx-auto mt-3 max-w-115 text-[14px] leading-6 text-text/68">
                {text}
            </p>
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-border px-5 text-[14px] font-semibold text-text transition duration-300 hover:border-primary hover:text-primary"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

function getBookingOrganizationInfo(booking: Booking, organizations: Organization[]) {
    const apiOrganization = booking.organization;
    const organization = organizations.find((item) => (
        item.id === booking.organizationId ||
        item.slug === booking.organizationId ||
        item.id === apiOrganization?.id ||
        item.slug === apiOrganization?.slug
    ));

    return {
        name: apiOrganization?.name ?? organization?.name ?? "Mangal Club",
        address: organization ? formatOrganizationAddress(organization) : undefined,
    };
}

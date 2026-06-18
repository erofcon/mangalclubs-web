"use client";

import Image from "next/image";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {ArrowLeft, LoaderCircle, type LucideIcon, MapPin, MessageCircle, Phone, RefreshCcw} from "lucide-react";
import {
    formatOrganizationAddress,
    getOrganizationWhatsappHref,
    getPhoneHref,
} from "@/utils/organizations";
import {useImageLightbox} from "@/hooks/useImageLightbox";
import {useAppDataStore} from "@/store/app-data-store";
import {getBookingResponsiveImages, loadBooking} from "@/utils/bookings";
import type {Booking} from "@/types/booking";
import type {Organization} from "@/types/organization";

type BookingLoadStatus = "loading" | "ready" | "error" | "not-found";

type BookingFact = {
    icon: LucideIcon;
    label: string;
    value: string;
};

export function BookingSelectedScreen() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params?.id as string | undefined;
    const organizations = useAppDataStore((state) => state.organizations);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [status, setStatus] = useState<BookingLoadStatus>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const isDesktopGallery = useMediaQuery("(min-width: 1024px)");
    const responsiveImages = useMemo(() => getBookingResponsiveImages(booking), [booking]);
    const galleryImages = isDesktopGallery ? responsiveImages.desktopImages : responsiveImages.mobileImages;
    const normalizedSelectedImageIndex = Math.min(selectedImageIndex, Math.max(galleryImages.length - 1, 0));
    const selectedImage = galleryImages[normalizedSelectedImageIndex] ?? galleryImages[0];
    const imageLightbox = useImageLightbox({
        images: galleryImages,
        alt: booking?.title ?? "Зона бронирования",
    });

    useEffect(() => {
        if (!bookingId) return;

        const controller = new AbortController();

        const loadBookingData = async () => {
            setStatus("loading");
            setErrorMessage("");

            try {
                const loadedBooking = await loadBooking(bookingId, controller.signal);

                setBooking(loadedBooking);
                setSelectedImageIndex(0);
                setStatus(loadedBooking.isActive === false ? "not-found" : "ready");
            } catch (error) {
                if (controller.signal.aborted) return;

                const statusCode = typeof error === "object" && error && "status" in error ? error.status : undefined;

                if (statusCode === 404) {
                    setBooking(null);
                    setStatus("not-found");
                    return;
                }

                setStatus("error");
                setErrorMessage(error instanceof Error ? error.message : "Не удалось загрузить бронирование");
            }
        };

        void loadBookingData();

        return () => {
            controller.abort();
        };
    }, [bookingId, reloadKey]);

    if (!bookingId) {
        return (
            <BookingPageState
                icon={<MapPin className="h-8 w-8 text-primary"/>}
                title="Зона не найдена"
                text="Возможно, ссылка устарела или вариант бронирования уже убрали с сайта."
                backLabel="Назад к выбору зоны"
            />
        );
    }

    if (status === "loading") {
        return (
            <BookingPageState
                icon={<LoaderCircle className="h-8 w-8 animate-spin text-primary"/>}
                title="Загружаем зону"
                text="Подтягиваем описание, фото и контакты ресторана."
                backLabel="Назад к выбору зоны"
            />
        );
    }

    if (status === "error") {
        return (
            <BookingPageState
                icon={<RefreshCcw className="h-8 w-8 text-primary"/>}
                title="Не удалось загрузить зону"
                text={errorMessage || "Попробуйте открыть страницу еще раз."}
                backLabel="Назад к выбору зоны"
                actionLabel="Повторить"
                onAction={() => setReloadKey((current) => current + 1)}
            />
        );
    }

    if (status === "not-found" || !booking) {
        return (
            <BookingPageState
                icon={<MapPin className="h-8 w-8 text-primary"/>}
                title="Зона не найдена"
                text="Возможно, ссылка устарела или вариант бронирования уже убрали с сайта."
                backLabel="Назад к выбору зоны"
            />
        );
    }

    const organization = getBookingOrganizationInfo(booking, organizations);
    const categoryTitle = booking.category?.title ?? "Зона";
    const phoneHref = getPhoneHref(organization.phone);
    const whatsappHref = getOrganizationWhatsappHref(organization);
    const bookingFacts = [
        {icon: MapPin, label: "Ресторан", value: organization.name},
    ].filter((fact): fact is BookingFact => Boolean(fact.value));

    return (
        <main className="min-h-screen bg-background text-text">
            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="group inline-flex w-fit items-center gap-3 text-[14px] font-semibold text-text/75 transition duration-300 hover:text-primary"
                >
                    <span
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-border/70 bg-background transition duration-300 group-hover:border-primary/70">
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                    </span>
                    Назад к выбору зоны
                </button>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                    <div className="min-w-0">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            {categoryTitle}
                        </p>
                        <h1
                            className="max-w-[760px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                        >
                            {booking.title}
                        </h1>
                        {booking.description && (
                            <p className="mt-6 max-w-[680px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                                {booking.description}
                            </p>
                        )}

                        {selectedImage && (
                            <button
                                type="button"
                                onClick={() => imageLightbox.open(normalizedSelectedImageIndex)}
                                className="relative mt-10 block aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-border/70 bg-black text-left"
                                aria-label="Открыть фото на весь экран"
                            >
                                <Image
                                    src={selectedImage}
                                    alt={booking.title ?? "Зона бронирования"}
                                    fill
                                    priority
                                    sizes="(max-width: 1023px) 100vw, 790px"
                                    className="object-cover"
                                />
                            </button>
                        )}

                        {galleryImages.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                {galleryImages.map((image, index) => {
                                    const isSelected = normalizedSelectedImageIndex === index;

                                    return (
                                        <button
                                            key={image}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`relative aspect-[1.2] overflow-hidden rounded-[6px] border transition duration-300 ${
                                                isSelected
                                                    ? "border-primary"
                                                    : "border-border/70 opacity-70 hover:border-primary/70 hover:opacity-100"
                                            }`}
                                            aria-label={`Показать фото ${index + 1}`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${booking.title ?? "Зона бронирования"} ${index + 1}`}
                                                fill
                                                sizes="160px"
                                                className="object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <section className="mt-10 border-t border-border/70 pt-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                О зоне
                            </p>
                            <h2
                                className="mt-2 max-w-[640px] text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                            >
                                Кому подойдет
                            </h2>

                            <p className="mt-5 max-w-[780px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                                {booking.longDescription || booking.description || "Команда ресторана подскажет детали бронирования, посадку и свободное время."}
                            </p>
                        </section>
                    </div>

                    <aside className="booking-surface rounded-[8px] border border-border/70 p-5 lg:sticky lg:top-6">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Бронирование
                        </p>
                        <h2
                            className="mt-2 text-[28px] font-normal leading-tight text-text"
                        >
                            Уточнить свободное время
                        </h2>
                        <p className="mt-4 text-[14px] leading-6 text-text/68">
                            Позвоните или напишите в WhatsApp. Команда проверит свободные слоты и закрепит зону за вами.
                        </p>

                        <div className="mt-7 space-y-3">
                            <a
                                href={phoneHref}
                                className="flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                            >
                                <Phone className="h-4 w-4" strokeWidth={1.8}/>
                                Позвонить
                            </a>

                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 items-center justify-center gap-3 rounded-[6px] border border-border bg-background px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                            >
                                <MessageCircle className="h-4 w-4" strokeWidth={1.8}/>
                                WhatsApp
                            </a>
                        </div>

                        <div className="mt-7 space-y-3 border-t border-border/55 pt-6">
                            {bookingFacts.map((fact) => (
                                <BookingMeta
                                    key={`${fact.label}-${fact.value}`}
                                    icon={fact.icon}
                                    label={fact.label}
                                    value={fact.value}
                                />
                            ))}
                        </div>

                        <div className="mt-7 border-t border-border/55 pt-6">
                            {organization.address && (
                                <div className="flex gap-3">
                                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8}/>
                                    <div className="min-w-0">
                                        <p className="text-[12px] leading-none text-text/55">
                                            Адрес
                                        </p>
                                        <p className="mt-2 wrap-break-word text-[14px] leading-6 text-text/82">
                                            {organization.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="mt-5">
                                <BookingMeta
                                    icon={Phone}
                                    label={organization.name}
                                    value={organization.phone}
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {imageLightbox.lightbox}
        </main>
    );
}

type BookingMetaProps = {
    icon: LucideIcon;
    label: string;
    value: string;
};

function BookingMeta({icon: Icon, label, value}: BookingMetaProps) {
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
            <div className="min-w-0">
                <p className="text-[12px] leading-none text-text/55">
                    {label}
                </p>
                <p className="mt-2 wrap-break-word text-[14px] font-semibold leading-5 text-text">
                    {value}
                </p>
            </div>
        </div>
    );
}

type BookingPageStateProps = {
    icon: React.ReactNode;
    title: string;
    text: string;
    backLabel: string;
    actionLabel?: string;
    onAction?: () => void;
};

function BookingPageState({icon, title, text, backLabel, actionLabel, onAction}: BookingPageStateProps) {
    return (
        <main className="min-h-screen bg-background px-5 text-text sm:px-6">
            <div className="mx-auto w-full max-w-302.5 py-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Бронирование
                </p>
                <div className="booking-surface mt-5 max-w-[560px] rounded-[8px] border border-border/70 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[8px] border border-border/70 bg-background">
                        {icon}
                    </div>
                    <h1
                        className="mt-5 text-[34px] font-normal leading-tight text-text"
                    >
                        {title}
                    </h1>
                    <p className="mt-4 text-[15px] leading-7 text-text/68">
                        {text}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/booking"
                            className="inline-flex h-12 items-center gap-3 rounded-[6px] border border-border px-5 text-[14px] font-semibold text-text transition duration-300 hover:border-primary hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                            {backLabel}
                        </Link>
                        {actionLabel && onAction && (
                            <button
                                type="button"
                                onClick={onAction}
                                className="inline-flex h-12 items-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                            >
                                {actionLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
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
    const phone = apiOrganization?.phone ?? organization?.phone ?? "";
    const whatsappPhone = apiOrganization?.whatsapp_phone ?? organization?.whatsapp_phone ?? null;

    return {
        name: apiOrganization?.name ?? organization?.name ?? "Mangal Club",
        phone,
        whatsapp_phone: whatsappPhone,
        address: organization ? formatOrganizationAddress(organization) : undefined,
    };
}

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQueryList.matches);

        handleChange();
        mediaQueryList.addEventListener("change", handleChange);

        return () => {
            mediaQueryList.removeEventListener("change", handleChange);
        };
    }, [query]);

    return matches;
}

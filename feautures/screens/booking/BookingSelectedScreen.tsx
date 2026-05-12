"use client";

import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import {ArrowLeft, Check, Clock3, MapPin, MessageCircle, Phone, Tag, Users} from "lucide-react";
import {BookingCategories, BookingMocks, PICKUP_POINT} from "@/mocks/mocks-data";

const phoneHref = `tel:${PICKUP_POINT.phone}`;
const whatsappHref = `https://wa.me/${String(PICKUP_POINT.phone).replace(/\D/g, "")}`;

type BookingWithGallery = (typeof BookingMocks)[number] & {
    images?: string[];
};

const getBookingImages = (booking?: BookingWithGallery) => {
    if (!booking) return [];

    return Array.from(
        new Set([
            booking.image,
            ...(booking.images ?? []),
        ].filter((image): image is string => Boolean(image)))
    );
};

export function BookingSelectedScreen() {
    const router = useRouter();
    const params = useParams();

    const bookingId = params?.id as string;
    const booking = BookingMocks.find((item) => String(item.id) === bookingId) as BookingWithGallery | undefined;
    const category = BookingCategories.find((item) => item.id === booking?.categoryId);
    const categoryTitle = booking?.categoryTitle ?? category?.title ?? "Зона";
    const galleryImages = useMemo(() => getBookingImages(booking), [booking]);

    const [gallerySelection, setGallerySelection] = useState({
        bookingId: "",
        imageIndex: 0,
    });
    const selectedImageIndex = gallerySelection.bookingId === bookingId ? gallerySelection.imageIndex : 0;
    const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0];

    if (!booking) {
        return (
            <main className="min-h-screen bg-background px-5 text-text sm:px-6">
                <div className="mx-auto w-full max-w-302.5 py-10">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Бронирование
                    </p>
                    <h1
                        className="mt-3 text-[34px] font-normal leading-tight text-text"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Зона не найдена
                    </h1>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mt-8 inline-flex h-12 items-center gap-3 rounded-[6px] border border-border px-5 text-[14px] font-semibold text-text transition duration-300 hover:border-primary hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                        Назад
                    </button>
                </div>
            </main>
        );
    }

    const details = booking.details?.length
        ? booking.details
        : [
            {label: "Формат", value: categoryTitle},
            {label: "Гости", value: booking.capacity ?? "уточним по телефону"},
            {label: "Время", value: booking.time ?? PICKUP_POINT.schedule},
        ];

    return (
        <main className="min-h-screen bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-9 pt-8 sm:px-6 lg:px-0">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="group inline-flex w-fit items-center gap-3 text-[14px] font-semibold text-text/75 transition duration-300 hover:text-primary"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border/70 bg-background transition duration-300 group-hover:border-primary/70">
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                    </span>
                    Назад
                </button>

                <div className="mt-12 grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
                    <div>
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            {categoryTitle}
                        </p>
                        <h1
                            className="max-w-[720px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {booking.title}
                        </h1>
                    </div>

                    <div className="max-w-[390px]">
                        <p className="text-[15px] leading-7 text-text/72 sm:text-[16px]">
                            {booking.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {booking.capacity && (
                                <QuickDetail icon={Users} label={booking.capacity}/>
                            )}
                            {booking.time && (
                                <QuickDetail icon={Clock3} label={booking.time}/>
                            )}
                            {booking.priceNote && (
                                <QuickDetail icon={Tag} label={booking.priceNote}/>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_390px]">
                    <div className="min-w-0">
                        <div className="border-t border-border/70 pt-6">
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                        Фотографии
                                    </p>
                                    <h2
                                        className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                    >
                                        Галерея зоны
                                    </h2>
                                </div>

                                {galleryImages.length > 1 && (
                                    <p className="text-[13px] text-text/60">
                                        {selectedImageIndex + 1} / {galleryImages.length}
                                    </p>
                                )}
                            </div>

                            {selectedImage && (
                                <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-border/70 bg-black">
                                    <Image
                                        src={selectedImage}
                                        alt={booking.title ?? "Зона бронирования"}
                                        fill
                                        priority
                                        sizes="(max-width: 1023px) 100vw, 790px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {galleryImages.length > 1 && (
                                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                    {galleryImages.map((image, index) => {
                                        const isSelected = selectedImageIndex === index;

                                        return (
                                            <button
                                                key={image}
                                                type="button"
                                                onClick={() => setGallerySelection({
                                                    bookingId,
                                                    imageIndex: index,
                                                })}
                                                className={`relative aspect-[1.2] overflow-hidden rounded-[6px] border transition duration-300 ${
                                                    isSelected
                                                        ? "border-primary"
                                                        : "border-border/70 opacity-70 hover:border-primary/70 hover:opacity-100"
                                                }`}
                                                aria-label={`Открыть фото ${index + 1}`}
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
                        </div>

                        <div className="mt-10">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Детали
                            </p>
                            <h2
                                className="mt-2 max-w-[640px] text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                            >
                                О зоне
                            </h2>

                            <p className="mt-5 max-w-[780px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                                {booking.longDescription ?? PICKUP_POINT.intro}
                            </p>

                            {!!booking.features?.length && (
                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    {booking.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="booking-surface flex min-h-13 items-center gap-3 rounded-[6px] border border-border/60 px-4 py-3"
                                        >
                                            <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                            <span className="text-[14px] leading-5 text-text/78">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-9 grid overflow-hidden rounded-[8px] border border-border/70 md:grid-cols-3">
                                {details.map((detail) => (
                                    <InfoItem
                                        key={`${detail.label}-${detail.value}`}
                                        label={detail.label}
                                        value={detail.value}
                                    />
                                ))}
                            </div>

                            <div className="mt-4 grid overflow-hidden rounded-[8px] border border-border/70 md:grid-cols-3">
                                <InfoItem label="Адрес" value={PICKUP_POINT.address}/>
                                <InfoItem label="Город" value={PICKUP_POINT.city}/>
                                <InfoItem label="График" value={PICKUP_POINT.schedule}/>
                            </div>

                            <div className="mt-9 overflow-hidden rounded-[8px] border border-border/70">
                                <iframe
                                    title={`Карта: ${PICKUP_POINT.address}`}
                                    src={`https://yandex.com/map-widget/v1/?ll=${PICKUP_POINT.coordinates.longitude}%2C${PICKUP_POINT.coordinates.latitude}&z=15&pt=${PICKUP_POINT.coordinates.longitude}%2C${PICKUP_POINT.coordinates.latitude}%2Cpm2rdm`}
                                    className="h-[360px] w-full border-0 grayscale md:h-[420px]"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    <aside className="min-w-0 lg:self-start">
                        <div className="border-t border-border/70 pt-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Связь
                            </p>
                            <h2
                                className="mt-2 text-[28px] font-normal leading-tight text-text"
                                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                            >
                                Забронировать
                            </h2>
                            <p className="mt-4 text-[14px] leading-6 text-text/68">
                                Позвоните нам или напишите в WhatsApp. Подскажем свободное время и закрепим выбранную зону.
                            </p>

                            <div className="mt-7 space-y-3">
                                <a
                                    href={phoneHref}
                                    className="group flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                                >
                                    <Phone className="h-4 w-4" strokeWidth={1.8}/>
                                    {PICKUP_POINT.phone}
                                </a>

                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-12 items-center justify-center gap-3 rounded-[6px] border border-border bg-background px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                >
                                    <MessageCircle className="h-4 w-4" strokeWidth={1.8}/>
                                    WhatsApp
                                </a>
                            </div>

                            <div className="mt-9 grid gap-3 border-t border-border/55 pt-6">
                                <AsideMeta icon={Users} label="Формат" value={categoryTitle}/>
                                {booking.capacity && (
                                    <AsideMeta icon={Users} label="Гости" value={booking.capacity}/>
                                )}
                                {booking.time && (
                                    <AsideMeta icon={Clock3} label="Время" value={booking.time}/>
                                )}
                                {booking.priceNote && (
                                    <AsideMeta icon={Tag} label="Условия" value={booking.priceNote}/>
                                )}
                            </div>

                            <div className="mt-9 border-t border-border/55 pt-6">
                                <div className="flex gap-3">
                                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8}/>
                                    <div>
                                        <p className="text-[13px] text-text/60">
                                            {PICKUP_POINT.name}
                                        </p>
                                        <p className="mt-1 text-[15px] leading-6 text-text">
                                            {PICKUP_POINT.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

type QuickDetailProps = {
    icon: typeof Users;
    label: string;
};

function QuickDetail({icon: Icon, label}: QuickDetailProps) {
    return (
        <span className="inline-flex h-9 items-center gap-2 rounded-[5px] border border-border/60 bg-black/20 px-3 text-[12px] font-semibold text-text/72">
            <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8}/>
            {label}
        </span>
    );
}

type AsideMetaProps = {
    icon: typeof Users;
    label: string;
    value: string;
};

function AsideMeta({icon: Icon, label, value}: AsideMetaProps) {
    return (
        <div className="booking-surface flex gap-3 rounded-[6px] border border-border/55 px-4 py-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
            <div className="min-w-0">
                <p className="text-[12px] leading-none text-text/55">
                    {label}
                </p>
                <p className="mt-2 text-[14px] font-semibold leading-5 text-text">
                    {value}
                </p>
            </div>
        </div>
    );
}

type InfoItemProps = {
    label: string;
    value: string;
};

function InfoItem({label, value}: InfoItemProps) {
    return (
        <div className="border-b border-border/50 px-5 py-5 last:border-b-0 md:border-b-0 md:border-l md:first:border-l-0">
            <p className="text-[12px] leading-none text-text/60">
                {label}
            </p>
            <p className="mt-3 text-[15px] font-semibold leading-6 text-text">
                {value}
            </p>
        </div>
    );
}

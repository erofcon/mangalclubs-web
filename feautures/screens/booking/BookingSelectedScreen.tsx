"use client";

import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import {ArrowLeft, MapPin, MessageCircle, Phone} from "lucide-react";
import {BookingMocks, PICKUP_POINT} from "@/mocks/mocks-data";

const phoneHref = `tel:${PICKUP_POINT.phone}`;
const whatsappHref = `https://wa.me/${String(PICKUP_POINT.phone).replace(/\D/g, "")}`;

type BookingWithGallery = (typeof BookingMocks)[number] & {
    images?: string[];
};

const getBookingImages = (booking?: BookingWithGallery) => {
    if (!booking) return [];

    return Array.from(
        new Set([
            ...(booking.images ?? []),
            booking.image,
        ].filter((image): image is string => Boolean(image)))
    );
};

export function BookingSelectedScreen() {
    const router = useRouter();
    const params = useParams();

    const bookingId = params?.id as string;
    const booking = BookingMocks.find((item) => item.id === bookingId) as BookingWithGallery | undefined;
    const galleryImages = useMemo(() => getBookingImages(booking), [booking]);

    const [gallerySelection, setGallerySelection] = useState({
        bookingId: "",
        imageIndex: 0,
    });
    const selectedImageIndex = gallerySelection.bookingId === bookingId ? gallerySelection.imageIndex : 0;
    const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0];

    if (!booking) {
        return (
            <main className="min-h-screen bg-background px-5 pt-32 text-text sm:px-6">
                <div className="mx-auto w-full max-w-[1210px]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Бронирование
                    </p>
                    <h1
                        className="mt-3 text-[34px] font-normal leading-tight text-text"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Кабинка не найдена
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

    return (
        <main className="min-h-screen overflow-hidden bg-background pt-26 text-text">
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
                            VIP-кабинка
                        </p>
                        <h1
                            className="max-w-[720px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {booking.title}
                        </h1>
                    </div>

                    <p className="max-w-[390px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                        {booking.description}
                    </p>
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
                                        Галерея кабинки
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
                                        alt={booking.title ?? "VIP-кабинка"}
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
                                                    alt={`${booking.title ?? "VIP-кабинка"} ${index + 1}`}
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
                                Приватная зона в Mangal Club
                            </h2>

                            <p className="mt-5 max-w-[780px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                                {PICKUP_POINT.intro}
                            </p>

                            <div className="mt-9 grid overflow-hidden rounded-[8px] border border-border/70 md:grid-cols-3">
                                <InfoItem label="Адрес" value={PICKUP_POINT.address}/>
                                <InfoItem label="Город" value={PICKUP_POINT.city}/>
                                <InfoItem label="Время" value={PICKUP_POINT.schedule}/>
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

                    <aside className="min-w-0">
                        <div className="border-t border-border/70 pt-6 lg:sticky lg:top-28">
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
                                Позвоните нам или напишите в WhatsApp. Подскажем свободное время и закрепим кабинку.
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

"use client";

import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {ArrowLeft, Check, Clock, type LucideIcon, MapPin, MessageCircle, Phone} from "lucide-react";
import {formatOrganizationAddress, getOrganizationByIdOrSlug, getOrganizationWhatsappHref, getPhoneHref} from "@/utils/organizations";
import type {Organization} from "@/types/organization";
import {useImageLightbox} from "@/hooks/useImageLightbox";
import {useAppDataStore} from "@/store/app-data-store";

const YANDEX_MAPS_TERMS_URL = "https://yandex.ru/legal/maps_api/ru/";

type OrganizationPageContent = {
    eyebrow: string;
    description: string;
    highlights: string[];
    details: {
        title: string;
        text: string;
        icon: LucideIcon;
    }[];
};

const getOrganizationImages = (organization: Organization) => {
    return Array.from(new Set([organization.photo_url].filter(Boolean) as string[]));
};

export function OrganizationScreen() {
    const params = useParams();
    const organizationIdOrSlug = params?.id as string | undefined;
    const organizations = useAppDataStore((state) => state.organizations);
    const organization = getOrganizationByIdOrSlug(organizationIdOrSlug, organizations);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const galleryImages = organization ? getOrganizationImages(organization) : [];
    const imageLightbox = useImageLightbox({
        images: galleryImages,
        alt: organization ? `${organization.name} интерьер` : "Ресторан",
    });

    if (!organization) {
        return (
            <main className="min-h-screen bg-background px-5 py-10 text-text sm:px-6">
                <div className="mx-auto w-full max-w-[1210px]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Ресторан
                    </p>
                    <h1
                        className="mt-3 text-[34px] font-normal leading-tight text-text"
                    >
                        Ресторан не найден
                    </h1>
                    <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-text/68">
                        Возможно, ссылка устарела. Вы можете вернуться на главную и выбрать нужный раздел.
                    </p>
                    <Link
                        href="/"
                        className="mt-8 inline-flex h-12 items-center gap-3 rounded-[6px] border border-border px-5 text-[14px] font-semibold text-text transition duration-300 hover:border-primary hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                        На главную
                    </Link>
                </div>
            </main>
        );
    }

    const content = getOrganizationContent(organization);
    const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? "/hero/hero-v2.png";
    const mapSrc = getOrganizationMapSrc(organization);
    const phoneHref = getPhoneHref(organization.phone);
    const whatsappHref = getOrganizationWhatsappHref(organization);

    return (
        <main className="min-h-screen bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-14 pt-8 sm:px-6 lg:px-0">
                <Link
                    href="/about"
                    className="group inline-flex w-fit items-center gap-3 text-[14px] font-semibold text-text/75 transition duration-300 hover:text-primary"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border/70 bg-background transition duration-300 group-hover:border-primary/70">
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                    </span>
                    О нас
                </Link>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                    <div className="min-w-0">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            {content.eyebrow}
                        </p>
                        <h1
                            className="max-w-[820px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                        >
                            {organization.name}
                        </h1>
                        <div className="organization-hero-surface mt-10 overflow-hidden rounded-[8px] border border-border/70 p-3">
                            <button
                                type="button"
                                onClick={() => imageLightbox.open(selectedImageIndex)}
                                className="relative block aspect-[16/10] w-full overflow-hidden rounded-[6px] bg-black text-left"
                                aria-label="Открыть фото на весь экран"
                            >
                                <Image
                                    src={selectedImage}
                                    alt={`${organization.name} интерьер`}
                                    fill
                                    priority
                                    sizes="(max-width: 1023px) 100vw, 790px"
                                    className="object-cover"
                                />
                            </button>

                            {galleryImages.length > 1 && (
                                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                    {galleryImages.map((image, index) => {
                                        const isSelected = selectedImageIndex === index;

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
                                                    alt={`${organization.name} фото ${index + 1}`}
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

                        <section className="mt-10 border-t border-border/70 pt-8">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                О ресторане
                            </p>
                            <p className="mt-4 max-w-[780px] text-[14px] leading-6 text-text/72 sm:text-[15px]">
                                {content.description}
                            </p>
                        </section>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {content.highlights.map((item) => (
                                <span
                                    key={item}
                                    className="inline-flex min-h-10 items-center gap-2 rounded-[6px] border border-border/55 px-3.5 py-2 text-[13px] text-text/76"
                                >
                                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.8}/>
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="mt-10 grid gap-4 md:grid-cols-3">
                            {content.details.map((detail) => (
                                <article key={detail.title} className="organization-page-card p-5">
                                    <detail.icon className="h-5 w-5 text-primary" strokeWidth={1.8}/>
                                    <h3 className="mt-5 text-[18px] font-semibold leading-6 text-text">
                                        {detail.title}
                                    </h3>
                                    <p className="mt-3 text-[14px] leading-6 text-text/66">
                                        {detail.text}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>

                <aside className="booking-surface rounded-[8px] border border-border/70 p-5 lg:sticky lg:top-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Связаться
                    </p>
                    <h2
                        className="mt-2 text-[28px] font-normal leading-tight text-text"
                    >
                        Позвонить или написать
                    </h2>
                    <p className="mt-4 text-[14px] leading-6 text-text/68">
                        Команда подскажет по столам, кабинкам, доставке и удобному времени для визита.
                    </p>

                    <div className="mt-7 space-y-3">
                        <a
                            href={phoneHref}
                            className="flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 hover:bg-hover"
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
                            Написать
                        </a>
                    </div>

                    <div className="mt-7 space-y-4 border-t border-border/55 pt-6">
                        <InfoLine icon={Phone} label="Телефон" value={organization.phone} href={phoneHref}/>
                        <InfoLine icon={MapPin} label="Адрес" value={formatOrganizationAddress(organization)}/>
                        <InfoLine icon={Clock} label="График" value={organization.scheduleLines?.length ? organization.scheduleLines : organization.schedule}/>
                    </div>
                    </aside>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-6 border-t border-border/70 pt-8 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Карта
                        </p>
                        <h2
                            className="mt-3 text-[30px] font-normal leading-tight text-text"
                        >
                            {formatOrganizationAddress(organization)}
                        </h2>
                        <a
                            href={`https://yandex.ru/maps/?ll=${organization.coordinates.longitude}%2C${organization.coordinates.latitude}&z=16`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-[6px] border border-border px-5 text-[14px] font-semibold text-text transition duration-300 hover:border-primary hover:text-primary"
                        >
                            <MapPin className="h-4 w-4" strokeWidth={1.8}/>
                            Открыть карту
                        </a>
                    </div>

                    <div className="overflow-hidden rounded-[8px] border border-border/70">
                        <iframe
                            title={`Карта ${organization.name}`}
                            src={mapSrc}
                            className="h-[360px] w-full border-0 md:h-[470px]"
                            loading="lazy"
                        />
                    </div>
                    <a
                        href={YANDEX_MAPS_TERMS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-semibold text-text/52 transition duration-300 hover:text-primary lg:col-start-2"
                    >
                        Условия использования Яндекс Карт
                    </a>
                </div>
            </section>

            {imageLightbox.lightbox}
        </main>
    );
}

type InfoLineProps = {
    icon: LucideIcon;
    label: string;
    value: string | string[];
    href?: string;
};

function InfoLine({icon: Icon, label, value, href}: InfoLineProps) {
    const content = (
        <>
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
            <span className="min-w-0">
                <span className="block text-[12px] leading-none text-text/55">
                    {label}
                </span>
                {Array.isArray(value) ? (
                    <span className="mt-2 block space-y-1 text-[14px] font-semibold leading-5 text-text">
                        {value.map((line) => (
                            <span key={line} className="block wrap-break-word">
                                {line}
                            </span>
                        ))}
                    </span>
                ) : (
                    <span className="mt-2 block wrap-break-word text-[14px] font-semibold leading-5 text-text">
                        {value}
                    </span>
                )}
            </span>
        </>
    );

    const className = "flex gap-3";

    if (href) {
        return (
            <a href={href} className={`${className} transition duration-300 hover:text-primary`}>
                {content}
            </a>
        );
    }

    return (
        <div className={className}>
            {content}
        </div>
    );
}

function getOrganizationMapSrc(organization: Organization) {
    const {latitude, longitude} = organization.coordinates;

    return `https://yandex.com/map-widget/v1/?ll=${longitude}%2C${latitude}&z=16&pt=${longitude}%2C${latitude}%2Cpm2rdm`;
}

function getOrganizationContent(organization: Organization): OrganizationPageContent {
    return {
        eyebrow: `Ресторан ${organization.name}`,
        description: organization.intro,
        highlights: [
            organization.accepts_pickup === false ? null : "Самовывоз",
            organization.accepts_delivery === false ? null : "Доставка",
            "Бронирование",
        ].filter(Boolean) as string[],
        details: [
            {
                title: "Адрес",
                text: formatOrganizationAddress(organization),
                icon: MapPin,
            },
            {
                title: "График",
                text: organization.schedule,
                icon: Clock,
            },
            {
                title: "Связь",
                text: organization.phone,
                icon: Phone,
            },
        ],
    };
}

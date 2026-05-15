"use client";

import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {ArrowLeft, Check, Clock, type LucideIcon, MapPin, MessageCircle, Phone, Utensils} from "lucide-react";
import {BookingMocks, Organizations} from "@/mocks/mocks-data";
import {formatOrganizationAddress, getPhoneHref, getWhatsappHref} from "@/utils/organizations";
import type {Organization} from "@/types/organization";
import {useImageLightbox} from "@/hooks/useImageLightbox";

type OrganizationPageContent = {
    eyebrow: string;
    title: string;
    lead: string;
    description: string;
    quote: string;
    highlights: string[];
    details: {
        title: string;
        text: string;
    }[];
};

const organizationContent: Record<Organization["id"], OrganizationPageContent> = {
    "fazenda": {
        eyebrow: "Ресторан Fazenda",
        title: "Спокойный ресторан для теплых встреч и приватных ужинов.",
        lead: "Fazenda создана для вечеров без спешки: уютные кабинеты, мягкий свет, блюда с мангала и внимательный сервис рядом, когда он нужен.",
        description: "Здесь удобно собраться семьей, отметить небольшой праздник или провести ужин в своем кругу. Атмосфера камерная и собранная, а кухня держится на понятном вкусе: мясо с огня, свежие салаты, горячие блюда и формат, в котором гостям легко расслабиться.",
        quote: "Лучше всего Fazenda раскрывается в небольших компаниях, когда хочется тишины, красивой подачи и личного пространства.",
        highlights: ["VIP-кабинки", "Семейные ужины", "Мясо с мангала", "Спокойная атмосфера"],
        details: [
            {
                title: "Приватность",
                text: "Кабинки помогают провести вечер отдельно от общего зала и сохранить настроение своей компании.",
            },
            {
                title: "Кухня",
                text: "В меню легко собрать полноценный ужин: закуски, салаты, горячее и блюда с открытого огня.",
            },
            {
                title: "Повод",
                text: "Подойдет для семейной встречи, даты, небольшого дня рождения или спокойного делового ужина.",
            },
        ],
    },
    "mangal-club": {
        eyebrow: "Ресторан Mangal Club",
        title: "Живой ресторан для компаний, брони и вечеров с характером.",
        lead: "Mangal Club сочетает ресторанную кухню, зоны для бронирования, сауну и бассейн. Это адрес для тех, кому нужен насыщенный вечер в одном месте.",
        description: "Сюда удобно приехать на ужин с друзьями, заранее выбрать зону отдыха или забронировать формат под компанию. В центре остается то, за что любят Mangal Clubs: мясо с огня, щедрый стол, понятный сервис и теплая атмосфера.",
        quote: "Mangal Club особенно хорош, когда хочется больше пространства, движения и возможности собрать весь вечер в одном адресе.",
        highlights: ["Большие компании", "VIP-зоны", "Сауна и бассейн", "Бронь столов"],
        details: [
            {
                title: "Форматы",
                text: "Можно выбрать стол в зале, приватную зону, сауну или бассейн и заранее уточнить свободное время.",
            },
            {
                title: "Для компаний",
                text: "Пространство подходит для встреч с друзьями, праздников, отдыха после рабочего дня и длинных ужинов.",
            },
            {
                title: "Сервис",
                text: "Команда поможет с посадкой, заказом и деталями бронирования, чтобы вечер прошел спокойно.",
            },
        ],
    },
};

type BookingWithGallery = (typeof BookingMocks)[number] & {
    images?: string[];
};

const getOrganizationImages = (organizationId: Organization["id"]) => {
    const images = BookingMocks
        .filter((booking) => booking.organizationId === organizationId)
        .flatMap((booking: BookingWithGallery) => [booking.image, ...(booking.images ?? [])])
        .filter((image): image is string => Boolean(image));

    return Array.from(new Set(images)).slice(0, 5);
};

export function OrganizationScreen() {
    const params = useParams();
    const organizationId = params?.id as Organization["id"] | undefined;
    const organization = Organizations.find((item) => item.id === organizationId);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const galleryImages = organization ? getOrganizationImages(organization.id) : [];
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
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Ресторан не найден
                    </h1>
                    <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-text/68">
                        Возможно, ссылка устарела. Вы можете вернуться к контактам и выбрать нужный адрес.
                    </p>
                    <Link
                        href="/contacts"
                        className="mt-8 inline-flex h-12 items-center gap-3 rounded-[6px] border border-border px-5 text-[14px] font-semibold text-text transition duration-300 hover:border-primary hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                        К контактам
                    </Link>
                </div>
            </main>
        );
    }

    const content = organizationContent[organization.id];
    const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? "/hero/hero-v2.png";
    const mapSrc = getOrganizationMapSrc(organization);
    const phoneHref = getPhoneHref(organization.phone);
    const whatsappHref = getWhatsappHref(organization.phone);

    return (
        <main className="min-h-screen overflow-hidden bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-14 pt-8 sm:px-6 lg:px-0">
                <Link
                    href="/contacts"
                    className="group inline-flex w-fit items-center gap-3 text-[14px] font-semibold text-text/75 transition duration-300 hover:text-primary"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border/70 bg-background transition duration-300 group-hover:border-primary/70">
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                    </span>
                    Контакты
                </Link>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
                    <div>
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            {content.eyebrow}
                        </p>
                        <h1
                            className="max-w-[820px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {organization.name}
                        </h1>
                        <p className="mt-6 max-w-[720px] text-[20px] font-semibold leading-8 text-text sm:text-[24px] sm:leading-9">
                            {content.title}
                        </p>
                    </div>

                    <div className="organization-page-card p-5">
                        <div className="space-y-4">
                            <InfoLine icon={Phone} label="Телефон" value={organization.phone} href={phoneHref}/>
                            <InfoLine icon={MapPin} label="Адрес" value={formatOrganizationAddress(organization)}/>
                            <InfoLine icon={Clock} label="График" value={organization.schedule}/>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
                    </div>
                </div>

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
                            sizes="(max-width: 1023px) 100vw, 1210px"
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
            </section>

            <section className="mx-auto grid w-full max-w-[1210px] gap-10 px-5 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-0">
                <div className="min-w-0">
                    <div className="border-t border-border/70 pt-8">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            О ресторане
                        </p>
                        <h2
                            className="mt-3 max-w-[700px] text-[34px] font-normal leading-tight text-text sm:text-[44px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {content.lead}
                        </h2>
                        <p className="mt-6 max-w-[780px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                            {content.description}
                        </p>
                        <p className="mt-6 max-w-[720px] border-l-2 border-primary pl-5 text-[15px] font-semibold leading-7 text-text">
                            {content.quote}
                        </p>
                    </div>

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
                                <Utensils className="h-5 w-5 text-primary" strokeWidth={1.8}/>
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

                <aside className="min-w-0">
                    <div className="organization-page-card p-5 lg:sticky lg:top-6">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Связаться
                        </p>
                        <h2
                            className="mt-2 text-[28px] font-normal leading-tight text-text"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
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
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-6 border-t border-border/70 pt-8 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Карта
                        </p>
                        <h2
                            className="mt-3 text-[30px] font-normal leading-tight text-text"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
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
                            className="h-[360px] w-full border-0 grayscale md:h-[470px]"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {imageLightbox.lightbox}
        </main>
    );
}

type InfoLineProps = {
    icon: LucideIcon;
    label: string;
    value: string;
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
                <span className="mt-2 block wrap-break-word text-[14px] font-semibold leading-5 text-text">
                    {value}
                </span>
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

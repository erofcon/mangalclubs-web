"use client"

import Image from "next/image";
import Link from "next/link";
import {ArrowRight, Clock, MapPin, Phone} from "lucide-react";
import {formatOrganizationAddress, getOrganizationHref, getPhoneHref} from "@/utils/organizations";
import {useAppDataStore} from "@/store/app-data-store";

const principles = [
    {
        title: "Живой огонь",
        text: "В основе кухни — мангал, сочное мясо, стейки и честный вкус блюд, приготовленных на открытом огне.",
    },
    {
        title: "Личное пространство",
        text: "VIP-кабинки и уютные залы подходят для семейных ужинов, деловых встреч и вечеров в кругу своей компании.",
    },
    {
        title: "Внимательный сервис",
        text: "Команда помогает с выбором, быстро ориентирует по меню и создает атмосферу, в которой можно спокойно отдыхать.",
    },
];

const galleryImages = [
    "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
    "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
    "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
];

export function AboutScreen() {
    const organizations = useAppDataStore((state) => state.organizations);
    const stats = [
        {value: `${organizations.length}`, label: "ресторана в Грозном"},
        {value: "VIP", label: "кабинки для приватного отдыха"},
        {value: "бронь", label: "столы и кабинки заранее"},
    ];

    return (
        <main className="min-h-screen bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-14 pt-8 sm:px-6 lg:px-0">
                <div className="mb-8">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                        О ресторане
                    </p>
                    <h1 className="mt-4 max-w-[820px] text-[34px] font-semibold leading-[1.08] text-text sm:text-[48px] lg:text-[58px]">
                        Mangal Clubs — рестораны для теплых встреч, сочного мяса и вечеров у живого огня.
                    </h1>
                </div>

                <div
                    className="relative aspect-[16/11] overflow-hidden rounded-[8px] border border-border/70 bg-black sm:aspect-[16/8] lg:aspect-[16/6]">
                    <Image
                        src="/hero/hero-v2.png"
                        alt="Интерьер Mangal Clubs"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 1210px"
                        className="object-cover object-[62%_center]"
                    />
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                    <div className="max-w-[780px]">
                        <h2 className="text-[22px] font-semibold leading-tight text-text sm:text-[26px]">
                            Мы создали место, где качественная кухня, спокойная атмосфера и приватный формат отдыха
                            соединяются в одном вечере.
                        </h2>

                        <p className="mt-4 text-[15px] leading-7 text-text-secondary sm:text-[16px]">
                            Mangal Clubs — это два ресторана в Грозном для тех, кто ценит вкусную еду,
                            внимательное обслуживание и комфортное пространство. Здесь можно забронировать
                            стол или отдельную кабинку, провести семейный ужин, встретиться с друзьями
                            или принять гостей в уютной обстановке.
                        </p>

                        <p className="mt-5 border-l-2 border-primary pl-5 text-[14px] font-semibold leading-6 text-text">
                            У каждого адреса свой режим работы, но философия остается общей:
                            встретить гостя с уважением, приготовить с душой и сделать вечер по-настоящему приятным.
                        </p>
                    </div>

                    <div className="rounded-[8px] border border-border/70 bg-[#0a0b0b] p-5 pl-14 sm:p-5">
                        {stats.map((item, index) => (
                            <div
                                key={item.label}
                                className={index === 0 ? "pb-5" : "border-t border-border/50 py-5 last:pb-0"}
                            >
                                <p className="text-[34px] font-semibold leading-none text-text">
                                    {item.value}
                                </p>
                                <p className="mt-2 text-[14px] leading-5 text-text-secondary">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1210px] px-5 pb-14 sm:px-6 lg:px-0">
                <div className="grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Наш подход
                        </p>
                        <h2 className="mt-3 text-[28px] font-semibold leading-tight text-text">
                            Детали, из которых складывается правильный вечер.
                        </h2>
                        <Link
                            href="/booking"
                            className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:bg-hover"
                        >
                            Забронировать
                            <ArrowRight className="h-4 w-4" strokeWidth={1.8}/>
                        </Link>
                    </div>

                    <div className="rounded-[8px] border border-border/70">
                        {principles.map((principle) => (
                            <div
                                key={principle.title}
                                className="grid gap-2 border-b border-border/50 px-5 py-5 last:border-b-0 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6"
                            >
                                <h3 className="text-[18px] font-semibold leading-6 text-text">
                                    {principle.title}
                                </h3>
                                <p className="text-[14px] leading-6 text-text-secondary">
                                    {principle.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1210px] px-5 pb-14 sm:px-6 lg:px-0">
                <div
                    className="mb-5 flex flex-col gap-3 border-t border-border/70 pt-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Рестораны
                        </p>
                        <h2 className="mt-3 text-[28px] font-semibold leading-tight text-text">
                            Два адреса в Грозном
                        </h2>
                    </div>
                    <p className="max-w-115 text-[14px] leading-6 text-text-secondary">
                        Выберите удобный ресторан для бронирования, самовывоза или спокойного вечера
                        в зале. Режим работы указан отдельно для каждого адреса.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {organizations.map((organization, index) => (
                        <Link
                            href={getOrganizationHref(organization)}
                            key={organization.id}
                            className="rounded-lg border border-border/70 bg-[#0a0b0b] p-5 hover:scale-102 duration-200"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-[24px] font-semibold leading-tight text-text">
                                    {organization.name}
                                </h3>
                                <span className="text-[12px] font-semibold text-primary">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            <div className="mt-5 space-y-4 text-[14px] leading-6">
                                <p className="flex gap-3 text-text-secondary">
                                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                    <span>{formatOrganizationAddress(organization)}</span>
                                </p>
                                <p className="flex gap-3 text-text-secondary">
                                    <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                    <span className="space-y-1">
                                        {(organization.scheduleLines?.length ? organization.scheduleLines : [organization.schedule]).map((line) => (
                                            <span key={line} className="block">
                                                {line}
                                            </span>
                                        ))}
                                    </span>
                                </p>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = getPhoneHref(organization.phone);
                                    }}
                                    className="flex gap-3 font-semibold text-text transition duration-300 hover:text-primary"
                                >
                                    <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                    <span>{organization.phone}</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-302.5 px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                <div
                    className="mb-5 flex flex-col gap-3 border-t border-border/70 pt-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Атмосфера
                        </p>
                        <h2 className="mt-3 text-[28px] font-semibold leading-tight text-text">
                            Уютные пространства для ужина, отдыха и встреч своей компанией.
                        </h2>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {galleryImages.map((image, index) => (
                        <div
                            key={image}
                            className="relative aspect-[1.16] overflow-hidden rounded-[8px] border border-border/70 bg-black"
                        >
                            <Image
                                src={image}
                                alt={`Пространство Mangal Clubs ${index + 1}`}
                                fill
                                loading="eager"
                                sizes="(max-width: 767px) 100vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

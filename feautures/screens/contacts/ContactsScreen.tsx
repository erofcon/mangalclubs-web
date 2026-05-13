import type {ReactNode} from "react";
import Image from "next/image";
import {Clock, MapPin, MessageCircle, Phone} from "lucide-react";
import {Organizations} from "@/mocks/mocks-data";
import {formatOrganizationAddress, getPhoneHref, getWhatsappHref} from "@/utils/organizations";

const mapSrc = getOrganizationsMapSrc();

export function ContactsScreen() {
    return (
        <main className="min-h-screen overflow-hidden bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
                    <div>
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            Контакты
                        </p>
                        <h1
                            className="max-w-[760px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Мы рядом, когда хочется огня.
                        </h1>
                    </div>

                    <p className="max-w-[390px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                        Позвоните, напишите в WhatsApp или приезжайте в удобный ресторан. Подскажем по доставке, бронированию и самовывозу.
                    </p>
                </div>

                <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_390px]">
                    <div className="min-w-0">
                        <div className="grid gap-4 md:grid-cols-2">
                            {Organizations.map((organization) => (
                                <div key={organization.id} className="organization-card p-5">
                                    <h2
                                        className="text-[24px] font-normal leading-tight text-text"
                                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                    >
                                        {organization.name}
                                    </h2>

                                    <div className="mt-5 space-y-4">
                                        <ContactInfo
                                            icon={<Phone className="h-5 w-5" strokeWidth={1.8}/>}
                                            label="Телефон"
                                            value={organization.phone}
                                            href={getPhoneHref(organization.phone)}
                                        />
                                        <ContactInfo
                                            icon={<MapPin className="h-5 w-5" strokeWidth={1.8}/>}
                                            label="Адрес"
                                            value={formatOrganizationAddress(organization)}
                                        />
                                        <ContactInfo
                                            icon={<Clock className="h-5 w-5" strokeWidth={1.8}/>}
                                            label="График"
                                            value={organization.schedule}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-9 overflow-hidden rounded-[8px] border border-border/70">
                            <iframe
                                title="Карта ресторанов Mangal Clubs"
                                src={mapSrc}
                                className="h-[360px] w-full border-0 grayscale md:h-[470px]"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <aside className="min-w-0">
                        <div className="border-t border-border/70 pt-6 lg:sticky lg:top-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Быстрая связь
                            </p>
                            <h2
                                className="mt-2 text-[28px] font-normal leading-tight text-text"
                                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                            >
                                Напишите нам
                            </h2>
                            <p className="mt-4 text-[14px] leading-6 text-text/68">
                                Для бронирования лучше звонить или писать в WhatsApp. Для новостей и фото можно заглянуть в Instagram.
                            </p>

                            <div className="mt-7 space-y-5">
                                {Organizations.map((organization) => (
                                    <div key={organization.id} className="space-y-3 border-b border-border/55 pb-5 last:border-b-0 last:pb-0">
                                        <p className="text-[14px] font-semibold text-text">
                                            {organization.name}
                                        </p>

                                        <a
                                            href={getPhoneHref(organization.phone)}
                                            className="flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                                        >
                                            <Phone className="h-4 w-4" strokeWidth={1.8}/>
                                            Позвонить
                                        </a>

                                        <a
                                            href={getWhatsappHref(organization.phone)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 items-center justify-center gap-3 rounded-[6px] border border-border bg-background px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                        >
                                            <MessageCircle className="h-4 w-4" strokeWidth={1.8}/>
                                            WhatsApp
                                        </a>
                                    </div>
                                ))}

                                <a
                                    href="https://www.instagram.com/mangalclubs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-12 items-center justify-center gap-3 rounded-[6px] border border-border bg-background px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                >
                                    <Image
                                        src="/icons/Instagram.svg"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="h-4 w-4"
                                    />
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

type ContactInfoProps = {
    icon: ReactNode;
    label: string;
    value: string;
    href?: string;
};

function ContactInfo({icon, label, value, href}: ContactInfoProps) {
    const content = (
        <>
            <span className="mb-5 inline-flex text-primary">
                {icon}
            </span>
            <span className="block text-[12px] leading-none text-text/60">
                {label}
            </span>
            <span className="mt-3 block wrap-break-word text-[15px] font-semibold leading-6 text-text">
                {value}
            </span>
        </>
    );

    const className = "block";

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

function getOrganizationsMapSrc() {
    const center = Organizations.reduce(
        (acc, organization) => ({
            latitude: acc.latitude + organization.coordinates.latitude,
            longitude: acc.longitude + organization.coordinates.longitude,
        }),
        {latitude: 0, longitude: 0},
    );
    const latitude = center.latitude / Organizations.length;
    const longitude = center.longitude / Organizations.length;
    const points = Organizations
        .map((organization) => `${organization.coordinates.longitude}%2C${organization.coordinates.latitude}%2Cpm2rdm`)
        .join("~");

    return `https://yandex.com/map-widget/v1/?ll=${longitude}%2C${latitude}&z=13&pt=${points}`;
}

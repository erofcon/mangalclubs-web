import Image from "next/image";
import Link from "next/link";
import {ArrowRight, MapPin, Phone} from "lucide-react";
import {Organizations} from "@/mocks/mocks-data";
import {formatOrganizationAddress, getPhoneHref, primaryOrganization} from "@/utils/organizations";

const principles = [
    {
        title: "Огонь",
        text: "Мясо, мангал и понятный вкус остаются в центре. Без лишнего шума, с вниманием к продукту.",
    },
    {
        title: "Приватность",
        text: "VIP-кабинки созданы для вечеров, где важны близкие люди, спокойствие и личное пространство.",
    },
    {
        title: "Гостеприимство",
        text: "Мы держим сервис простым и внимательным: встретить, подсказать, приготовить и не мешать отдыху.",
    },
];

const galleryImages = [
    "/stories/rest.png",
    "/stories/rest2.png",
    "/stories/barbecue.png",
];

export function AboutScreen() {
    return (
        <main className="min-h-screen overflow-hidden bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-12 pt-8 sm:px-6 lg:px-0">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
                    <div>
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            О нас
                        </p>
                        <h1
                            className="max-w-[780px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Mangal Club для тех, кто выбирает вкус и спокойствие.
                        </h1>
                    </div>

                    <p className="max-w-[390px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                        {primaryOrganization.intro}
                    </p>
                </div>

                <div
                    className="relative mt-12 aspect-[16/10] overflow-hidden rounded-[8px] border border-border/70 bg-black md:aspect-[16/7]">
                    <Image
                        src="/hero/hero-v2.png"
                        alt="Mangal Club"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 1210px"
                        className="object-cover object-[62%_center]"
                    />
                    <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.62)_100%)]"/>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-12 lg:grid-cols-[390px_minmax(0,1fr)]">
                    <div className="border-t border-border/70 pt-6">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Атмосфера
                        </p>
                        <h2
                            className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            Здесь важны детали
                        </h2>
                        <p className="mt-4 text-[14px] leading-6 text-text/68">
                            Мы не пытаемся быть громче всех. Наша задача проще: сделать вечер вкусным, удобным и
                            цельным.
                        </p>

                        <Link
                            href="/booking"
                            className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                        >
                            Забронировать
                            <ArrowRight className="h-4 w-4" strokeWidth={1.8}/>
                        </Link>
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-[8px] border border-border/70">
                        {principles.map((principle) => (
                            <div
                                key={principle.title}
                                className="grid gap-3 border-b border-border/50 px-5 py-5 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8"
                            >
                                <h3
                                    className="text-[22px] font-normal leading-7 text-text"
                                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                >
                                    {principle.title}
                                </h3>
                                <p className="text-[14px] leading-6 text-text/70">
                                    {principle.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Рестораны
                            </p>
                            <h2
                                className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                            >
                                Два адреса в Грозном
                            </h2>
                        </div>
                        <p className="max-w-[380px] text-[14px] leading-6 text-text/68">
                            Выбирайте ближайший ресторан для самовывоза, брони или спокойного вечера внутри.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {Organizations.map((organization) => (
                            <div key={organization.id} className="organization-card p-5">
                                <h3
                                    className="text-[24px] font-normal leading-tight text-text"
                                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                >
                                    {organization.name}
                                </h3>
                                <div className="mt-5 space-y-4 text-[14px] leading-6 text-text/72">
                                    <p className="flex gap-3">
                                        <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                        <span>{formatOrganizationAddress(organization)}</span>
                                    </p>
                                    <a
                                        href={getPhoneHref(organization.phone)}
                                        className="flex gap-3 font-semibold text-text transition duration-300 hover:text-primary"
                                    >
                                        <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8}/>
                                        <span>{organization.phone}</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Внутри
                            </p>
                            <h2
                                className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                            >
                                Ресторан в кадрах
                            </h2>
                        </div>
                        <p className="max-w-[380px] text-[14px] leading-6 text-text/68">
                            Несколько фрагментов пространства, кухни и настроения Mangal Club.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {galleryImages.map((image, index) => (
                            <div
                                key={image}
                                className="relative aspect-[1.18] overflow-hidden rounded-[8px] border border-border/70 bg-black"
                            >
                                <Image
                                    src={image}
                                    alt={`Mangal Club ${index + 1}`}
                                    fill
                                    sizes="(max-width: 767px) 100vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {topLinks} from "@/utils/constants";
import {getOrganizationHref, getOrganizationWhatsappHref} from "@/utils/organizations";
import {useAppDataStore} from "@/store/app-data-store";

export function Footer() {
    const organizations = useAppDataStore((state) => state.organizations);
    const primaryOrganization = useAppDataStore((state) => state.defaultDeliveryOrganization) ?? organizations[0];
    const whatsappHref = primaryOrganization ? getOrganizationWhatsappHref(primaryOrganization) : "#";

    return (
        <footer className="border-t border-border/70 bg-background text-text">
            <div className="mx-auto w-full max-w-302.5 px-5 py-10 sm:px-6 lg:px-0 lg:py-14">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)_minmax(0,0.95fr)]">
                    <div className="min-w-0">
                        <Link href="/" aria-label="Mangal Club" className="inline-flex">
                            <Image
                                src="/logo.png"
                                alt="Mangal Club"
                                width={473}
                                height={284}
                                className="h-auto w-24 transition duration-300 hover:scale-105"
                            />
                        </Link>

                        <p className="mt-5 max-w-105 text-[14px] leading-6 text-text/70 font-semibold">
                            Мангал Клабс - сеть мясных ресторанов с приватными кабинками,
                            живым огнем и внимательным отношением к каждому гостю.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <a
                                href="https://www.instagram.com/mangalclubs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center gap-3 rounded-md border border-border/70 px-4 text-[14px]
                                font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                            >
                                <Image
                                    src="/icons/Instagram.svg"
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="h-4.5 w-4.5"
                                />
                                Instagram
                            </a>

                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center gap-3 rounded-[6px] border border-border/70 px-4 text-[14px]
                                font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                            >
                                <Image
                                    src="/icons/WhatsappIcon.svg"
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="h-4.5 w-4.5"
                                />
                                WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="min-w-0 border-t border-border/70 pt-6 lg:border-t-0 lg:pt-0">
                        <p className="text-[12px] font-semibold uppercase tracking-widest text-primary">
                            Наши рестораны
                        </p>

                        <div className="mt-5 space-y-5">
                            {organizations.map((organization) => (
                                <div
                                    key={organization.id}
                                >
                                    <Link
                                        href={getOrganizationHref(organization)}
                                        className="group inline-flex items-center gap-2 text-[14px] font-semibold text-text/78 transition duration-300 hover:text-primary"
                                    >
                                        {organization.name}
                                        <ArrowUpRight
                                            className="h-3.5 w-3.5 opacity-0 transition duration-300 group-hover:opacity-100"/>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="grid min-w-0 gap-8 border-t border-border/70 pt-6 sm:grid-cols-2 lg:border-t-0 lg:pt-0">
                        <nav>
                            <p className="text-[12px] font-semibold uppercase tracking-widest text-primary">
                                Разделы
                            </p>

                            <ul className="mt-5 space-y-3">
                                {topLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center gap-2 text-[14px] font-semibold text-text/78 transition duration-300 hover:text-primary"
                                        >
                                            {link.label}
                                            <ArrowUpRight
                                                className="h-3.5 w-3.5 opacity-0 transition duration-300 group-hover:opacity-100"/>
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/legal"
                                        className="group inline-flex items-center gap-2 text-[14px] font-semibold text-text/78 transition duration-300 hover:text-primary"
                                    >
                                        Правовая информация
                                        <ArrowUpRight
                                            className="h-3.5 w-3.5 opacity-0 transition duration-300 group-hover:opacity-100"/>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t
                border-border/55 pt-5 text-[12px] tracking-wide text-text/52 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 ИП Гусейнова Парване Махаррамовна</p>
                    <p>Все права защищены</p>
                </div>
            </div>
        </footer>
    );
}

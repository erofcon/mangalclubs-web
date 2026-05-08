"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {PICKUP_POINT} from "@/mocks/mocks-data";

export function Footer() {
    return (
        <footer className="mt-8 pt-9 text-text">
            <div className="mx-auto w-full max-w-374 px-5 sm:px-7">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:px-10">

                    {/* Левая колонка */}
                    <div className="md:w-79 ">
                        <Link href="/" aria-label="mangal-clubs" className="hidden md:block">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={473}
                                height={284}
                                className="block h-auto w-22 max-w-full md:w-25.5 hover:scale-110 duration-300"
                                priority
                            />
                        </Link>

                        <p className="mt-4.5 text-[14px] leading-relaxed sm:text-[15px]">
                            © 2026 ИП Гусейнова Парване Махаррамовна <br/><br/>
                            Мангал Клабс - сеть премиальных мясных ресторанов с индивидуальным отношением
                            к каждому гостю, вкуснейшей едой и незабываемой атмосферой.
                        </p>

                        <div className="mt-4.5 flex gap-4">
                            <a
                                href="https://www.instagram.com/mangalclubs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-300 hover:scale-110"
                            >
                                <Image
                                    src="/icons/Instagram.svg"
                                    alt="instagram"
                                    width={256}
                                    height={256}
                                    className="w-8"
                                />
                            </a>

                            <a
                                href={`https://wa.me/${String(PICKUP_POINT.phone).replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-300 hover:scale-110"
                            >
                                <Image
                                    src="/icons/WhatsappIcon.svg"
                                    alt="whatsapp"
                                    width={256}
                                    height={258}
                                    className="w-8"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Контакты */}
                    <div className="md:w-79">
                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="text-[12px] text-text-secondary">Телефон:</p>
                                <a
                                    href={`tel:${PICKUP_POINT.phone}`}
                                    className="text-[14px] font-medium hover:text-text-secondary transition-all duration-300 inline-block hover:scale-105"
                                >
                                    {PICKUP_POINT.phone}
                                </a>
                            </div>

                            <div>
                                <p className="text-[12px] text-text-secondary">Адрес:</p>
                                <div className="text-[14px] font-medium">
                                    {PICKUP_POINT.address}
                                </div>
                            </div>

                            <div>
                                <p className="text-[12px] text-text-secondary">График работы:</p>
                                <div className="text-[14px] font-medium">
                                    {PICKUP_POINT.schedule}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Меню + приложения */}
                    <div
                        className="flex w-full flex-col gap-8 text-white sm:flex-row sm:justify-between md:w-auto md:min-w-90 md:gap-12">

                        {/* Навигация */}
                        <ul className="space-y-5">
                            <li>
                                <Link href="/about"
                                      className="text-[15px] hover:text-text-secondary transition hover:scale-110 inline-block duration-300">
                                    О нас
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacts"
                                      className="text-[15px] hover:text-text-secondary transition hover:scale-110 inline-block duration-300">
                                    Контакты
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking"
                                      className="text-[15px] hover:text-text-secondary transition hover:scale-110 inline-block duration-300">
                                    Бронирование
                                </Link>
                            </li>
                            <li>
                                <Link href="/delivery"
                                      className="text-[15px] hover:text-text-secondary transition hover:scale-110 inline-block duration-300">
                                    Доставка
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking"
                                      className="text-[15px] hover:text-text-secondary transition hover:scale-110 inline-block duration-300">
                                    Правовая информация
                                </Link>
                            </li>
                        </ul>

                        {/* Приложения */}
                        <div className="flex flex-col gap-4">
                            <p className="text-[16px] font-medium">Мобильные приложения</p>

                            <div className="flex flex-col gap-4">
                                <a href="#" className="hover:scale-105 duration-300">
                                    <div
                                        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
                                        <Image
                                            src="/icons/GooglePlayIcon.svg"
                                            alt="Google Play"
                                            width={256}
                                            height={283}
                                            className="w-10"
                                        />
                                        <div>
                                            <div className="text-[10px]">Скачать из</div>
                                            <div className="text-[14px] font-semibold">Google Play</div>
                                        </div>
                                    </div>
                                </a>

                                <a href="#" className="hover:scale-105 duration-300">
                                    <div
                                        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
                                        <Image
                                            src="/icons/AppleAppStore.svg"
                                            alt="App Store"
                                            width={256}
                                            height={283}
                                            className="w-10"
                                        />
                                        <div>
                                            <div className="text-[10px]">Доступно в</div>
                                            <div className="text-[14px] font-semibold">App Store</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="mt-7 border-border"/>

                <div className="flex items-center justify-center py-6">
                    <p className="text-center text-[10px] text-white sm:text-[12px]">
                        © Copyright 2026, Все права защищены
                    </p>
                </div>
            </div>
        </footer>
    );
}

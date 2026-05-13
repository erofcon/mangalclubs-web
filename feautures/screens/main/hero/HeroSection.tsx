"use client";

import Link from "next/link";
import {ArrowRight, CalendarDays} from "lucide-react";

const heroHighlights = [
    {value: "10:30–01:30", label: "каждый день"},
    {value: "от 45 мин", label: "доставка"},
    {value: "VIP", label: "кабинки"},
];

export function HeroSection() {
    const scrollToMenu = () => {
        const section =
            document.getElementById("menu-99") ??
            document.querySelector<HTMLElement>('[id^="menu-"]');

        if (!section) return;

        const yOffset = -104;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };

    return (
        <section className="relative isolate mx-auto w-full max-w-302.5 overflow-hidden text-text">
            <video
                className="absolute inset-0 -z-30 h-full w-full object-cover object-[64%_center] sm:object-[68%_center]"
                playsInline
                loop
                autoPlay
                muted
                preload="metadata"
                poster="/hero/hero-v2.png"
            >
                <source src="/booking/header/header.mp4" type="video/mp4"/>
            </video>

            <div
                className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.57)_24%,rgba(5,5,5,0.48)_48%,rgba(5,5,5,0.28)_74%,rgba(5,5,5,0.32)_100%)]"/>

            <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_36%,rgba(214,173,104,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_45%,#050505_100%)]"/>

            <div className="mx-auto flex min-h-155 w-full items-center px-5 py-14 sm:px-6 md:min-h-145 lg:px-0">
                <div className="max-w-147.5">

                    <h1
                        className="max-w-140 text-[42px] font-semibold leading-[0.92] tracking-normal
                        text-text drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:text-[68px] lg:text-[68px]"
                    >
                        Искусство живого огня
                    </h1>

                    <p
                        className="mt-5 text-[18px] font-semibold leading-[1.1] tracking-normal text-[#FCB001]
                        sm:text-[28px]"
                    >
                        Мясо, за которым возвращаются
                    </p>

                    <p className="mt-6 max-w-125 text-[14px] font-semibold tracking-normal
                     leading-[1.3] text-text sm:text-[16px]">
                        Авторские стейки, мангал и приватные залы для тех вечеров,
                        где важны вкус, огонь и спокойная атмосфера
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">

                        <button
                            type="button"
                            onClick={scrollToMenu}
                            className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md
                            bg-primary px-6 text-[14px] font-semibold text-[#111111]
                             cursor-pointer
                              transition duration-300 hover:-translate-y-0.5
                              hover:bg-[#ffc22b]"
                        >
                            Смотреть меню
                            <ArrowRight
                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>
                        </button>

                        <Link
                            href="/booking"
                            className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#f4c15d]/30 bg-[#4a2808]/75 px-6 text-[14px] font-semibold text-[#fff0d0] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ffd071]/60"
                        >
                            Забронировать стол
                            <CalendarDays className="h-4 w-4 text-primary"/>
                        </Link>


                        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">

                            {/*                        <button*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={scrollToMenu}*/}
                            {/*                            className="group relative inline-flex h-12 min-w-52.5 overflow-hidden*/}
                            {/*items-center justify-center gap-4 rounded-md*/}
                            {/*border border-[#8f673b]/35*/}
                            {/*bg-[#9a6b36]*/}
                            {/*px-6 text-[14px] font-semibold text-[#f8ead3]*/}
                            {/*shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_18px_rgba(0,0,0,0.22)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5 hover:bg-[#a7763d]"*/}
                            {/*                        >*/}
                            {/*<span className="absolute inset-0 opacity-[0.07]*/}
                            {/*bg-[radial-gradient(circle_at_20%_30%,#fff_0%,transparent_22%),radial-gradient(circle_at_80%_60%,#000_0%,transparent_18%)]"/>*/}

                            {/*                            <span className="relative z-10 flex items-center gap-4">*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</span>*/}
                            {/*                        </button>*/}

                            {/*                        <Link*/}
                            {/*                            href="/booking"*/}
                            {/*                            className="group relative inline-flex h-12 min-w-57 overflow-hidden*/}
                            {/*items-center justify-center gap-4 rounded-md*/}
                            {/*border border-[#705033]/40*/}
                            {/*bg-[linear-gradient(135deg,#24170f_0%,#18100a_100%)]*/}
                            {/*px-6 text-[14px] font-semibold text-[#f2dfc4]*/}
                            {/*shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_24px_rgba(0,0,0,0.28)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:border-[#95683b]/55"*/}
                            {/*                        >*/}
                            {/*<span className="absolute inset-0 opacity-[0.06]*/}
                            {/*bg-[radial-gradient(circle_at_25%_25%,#fff_0%,transparent_20%),radial-gradient(circle_at_75%_75%,#000_0%,transparent_20%)]"/>*/}

                            {/*                            <span className="relative z-10 flex items-center gap-4">*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-[#c79255]"/>*/}
                            {/*</span>*/}
                            {/*                        </Link>*/}

                            {/*                        <button*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={scrollToMenu}*/}
                            {/*                            className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4*/}
                            {/*rounded-md*/}
                            {/*bg-[#8e6331]*/}
                            {/*px-6 text-[14px] font-semibold text-[#f6e5ca]*/}
                            {/*shadow-[0_6px_16px_rgba(0,0,0,0.18)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:bg-[#9a6d37]"*/}
                            {/*                        >*/}
                            {/*                            Смотреть меню*/}
                            {/*                            <ArrowRight*/}
                            {/*                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*                        </button>*/}

                            {/*                        <Link*/}
                            {/*                            href="/booking"*/}
                            {/*                            className="inline-flex h-12 min-w-57 items-center justify-center gap-4*/}
                            {/*rounded-md*/}
                            {/*border border-[#6d4b2a]/45*/}
                            {/*bg-[linear-gradient(135deg,#2a1b11_0%,#1f140d_100%)]*/}
                            {/*px-6 text-[14px] font-semibold tracking-[0.01em]*/}
                            {/*text-[#f0dcc0]*/}
                            {/*shadow-[0_8px_20px_rgba(0,0,0,0.24)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:bg-[linear-gradient(135deg,#312015_0%,#24170e_100%)]*/}
                            {/*hover:border-[#8f6238]/55"*/}
                            {/*                        >*/}
                            {/*                            Забронировать стол*/}
                            {/*                            <CalendarDays className="h-4 w-4 text-[#be8a4f]"/>*/}
                            {/*                        </Link>*/}

                            {/*                        <button*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={scrollToMenu}*/}
                            {/*                            className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4*/}
                            {/*rounded-md bg-[#b8863f]*/}
                            {/*px-6 text-[14px] font-medium text-[#1d1207]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5 hover:bg-[#c19047]"*/}
                            {/*                        >*/}
                            {/*                            Смотреть меню*/}
                            {/*                            <ArrowRight*/}
                            {/*                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*                        </button>*/}

                            {/*                        <Link*/}
                            {/*                            href="/booking"*/}
                            {/*                            className="inline-flex h-12 min-w-57 items-center justify-center gap-4*/}
                            {/*rounded-md border border-[#6f5333]/40*/}
                            {/*bg-[#1b130d]*/}
                            {/*px-6 text-[14px] font-medium text-[#ead9bc]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:border-[#b88a50]/45*/}
                            {/*hover:bg-[#22170f]"*/}
                            {/*                        >*/}
                            {/*                            Забронировать стол*/}
                            {/*                            <CalendarDays className="h-4 w-4 text-[#b88a50]"/>*/}
                            {/*                        </Link>*/}


                            {/*                        <button*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={scrollToMenu}*/}
                            {/*                            className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4*/}
                            {/*rounded-md*/}
                            {/*bg-[linear-gradient(135deg,#d4a055_0%,#b57b32_100%)]*/}
                            {/*px-6 text-[14px] font-semibold text-[#241506]*/}
                            {/*shadow-[0_10px_24px_rgba(0,0,0,0.16)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:brightness-105"*/}
                            {/*                        >*/}
                            {/*                            Смотреть меню*/}
                            {/*                            <ArrowRight*/}
                            {/*                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*                        </button>*/}

                            {/*                        <Link*/}
                            {/*                            href="/booking"*/}
                            {/*                            className="inline-flex h-12 min-w-57 items-center justify-center gap-4*/}
                            {/*rounded-md border border-[#9f7342]/30*/}
                            {/*bg-[linear-gradient(135deg,#3a2211_0%,#24140a_100%)]*/}
                            {/*px-6 text-[14px] font-semibold text-[#f4e2c6]*/}
                            {/*shadow-[0_10px_28px_rgba(0,0,0,0.24)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:border-[#c99654]/50"*/}
                            {/*                        >*/}
                            {/*                            Забронировать стол*/}
                            {/*                            <CalendarDays className="h-4 w-4 text-[#cf9851]"/>*/}
                            {/*                        </Link>*/}


                            {/*/!*Вариант 13: градиент оранжевый*!/*/}

                            {/*                        <button*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={scrollToMenu}*/}
                            {/*                            className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[linear-gradient(135deg,#ffd37a_0%,#f59e2f_52%,#c76a17_100%)] px-6 text-[14px] font-semibold text-[#221204] shadow-[0_18px_44px_rgba(245,158,47,0.34)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:brightness-110"*/}
                            {/*                        >*/}
                            {/*                            Смотреть меню*/}
                            {/*                            <ArrowRight*/}
                            {/*                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*                        </button>*/}

                            {/*                        <Link*/}
                            {/*                            href="/booking"*/}
                            {/*                            className="inline-flex h-12 min-w-57 items-center justify-center gap-4*/}
                            {/*rounded-md border border-[#8a6234]/35*/}
                            {/*bg-[linear-gradient(135deg,#2a1709_0%,#1d1209_100%)]*/}
                            {/*px-6 text-[14px] font-semibold text-[#f1dfc3]*/}
                            {/*shadow-[0_8px_20px_rgba(0,0,0,0.22)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:border-[#b68a4f]/45"*/}
                            {/*                        >*/}
                            {/*                            Забронировать стол*/}
                            {/*                            <CalendarDays className="h-4 w-4 text-[#c99955]"/>*/}
                            {/*                        </Link>*/}


                            {/*/!*Вариант 12: со свечением*!/*/}

                            {/*                        <button*/}
                            {/*                            type="button"*/}
                            {/*                            onClick={scrollToMenu}*/}
                            {/*                            className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#f1b84c] px-6 text-[14px] font-semibold text-[#1c1105] shadow-[0_0_18px_rgba(241,184,76,0.55),0_18px_42px_rgba(241,184,76,0.25)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(241,184,76,0.75),0_22px_48px_rgba(241,184,76,0.32)]"*/}
                            {/*                        >*/}
                            {/*                            Смотреть меню*/}
                            {/*                            <ArrowRight*/}
                            {/*                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*                        </button>*/}

                            {/*                        <Link*/}
                            {/*                            href="/booking"*/}
                            {/*                            className="inline-flex h-12 min-w-57 items-center justify-center gap-4*/}
                            {/*rounded-md border border-[#c59a5c]/25*/}
                            {/*bg-[#16110c]*/}
                            {/*px-6 text-[14px] font-medium tracking-[0.02em]*/}
                            {/*text-[#f1dfc2]*/}
                            {/*shadow-[0_6px_18px_rgba(0,0,0,0.28)]*/}
                            {/*transition duration-300*/}
                            {/*hover:-translate-y-0.5*/}
                            {/*hover:border-[#d6aa67]/45*/}
                            {/*hover:bg-[#1c140d]"*/}
                            {/*                        >*/}
                            {/*                            Забронировать стол*/}
                            {/*                            <CalendarDays className="h-4 w-4 text-[#c59a5c]"/>*/}
                            {/*                        </Link>*/}


                            {/*Вариант 11:как “плашки” на референсах */}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 md:h-16 min-w-52.5 items-center*/}
                            {/*    justify-center gap-4 rounded-md bg-[#FCB001]*/}
                            {/*    px-6 text-[16px] font-bold text-on-primary*/}
                            {/*    shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_28px_rgba(252,176,1,0.28)]*/}
                            {/*    cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffbf24]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 md:h-16 min-w-57 items-center*/}
                            {/*    justify-center gap-4 rounded-md bg-[#EA5516]*/}
                            {/*     px-6 text-[16px] font-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_10px_28px_rgba(234,85,22,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f36a23]"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-on-primary"/>*/}
                            {/*</Link>*/}

                            {/*/!*Вариант 10: темный премиум, с желтой окантовкой *!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md border border-[#FCB001]/55 bg-[#111111] px-6 text-[14px] font-semibold text-[#FCB001] shadow-[0_18px_42px_rgba(0,0,0,0.42)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#1a1202] hover:shadow-[0_0_22px_rgba(252,176,1,0.34)]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md bg-[#FCB001] px-6 text-[14px] font-semibold text-[#111111] shadow-[0_18px_42px_rgba(252,176,1,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffc22b]"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 9: со свечением, самый “огненный” *!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#FCB001] px-6 text-[14px] font-semibold text-[#111111] shadow-[0_0_18px_rgba(252,176,1,0.65),0_18px_44px_rgba(234,85,22,0.28)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(252,176,1,0.85),0_22px_52px_rgba(234,85,22,0.38)]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#FCB001]/45 bg-[#111111]/80 px-6 text-[14px] font-semibold text-[#FCB001] shadow-[0_0_16px_rgba(234,85,22,0.45),0_18px_42px_rgba(0,0,0,0.4)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#EA5516]/80 hover:text-[#ffd25c]"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 8: желтый + огненный оранжевый *!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[linear-gradient(135deg,#FCB001_0%,#F28A05_48%,#EA5516_100%)] px-6 text-[14px] font-semibold text-[#111111] shadow-[0_18px_44px_rgba(252,176,1,0.32)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:brightness-110"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#EA5516]/40 bg-[linear-gradient(135deg,rgba(17,17,17,0.88)_0%,rgba(57,22,5,0.9)_100%)] px-6 text-[14px] font-semibold text-[#ffe0a3] shadow-[0_16px_40px_rgba(234,85,22,0.22)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#FCB001]/70"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}

                            {/*/!*Вариант 7: чисто в цвет логотипа*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#FCB001] px-6 text-[14px] font-semibold text-[#111111] shadow-[0_18px_42px_rgba(252,176,1,0.28)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffc22b]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#FCB001]/35 bg-[#111111]/75 px-6 text-[14px] font-semibold text-[#ffd26a] shadow-[0_16px_38px_rgba(0,0,0,0.38)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#FCB001]/70 hover:bg-[#1b1303]/85"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 6: желтая плашка как на референсах*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#f4c15d] px-6 text-[14px] font-semibold text-[#241707] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_34px_rgba(244,193,93,0.28)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd071]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#f4c15d]/30 bg-[#4a2808]/75 px-6 text-[14px] font-semibold text-[#fff0d0] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ffd071]/60"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}

                            {/*/!*Вариант 5: темный премиум-коричневый*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#b9823f] px-6 text-[14px] font-semibold text-[#160d05] shadow-[0_18px_42px_rgba(185,130,63,0.3)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#d39a4f]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#b9823f]/35 bg-[#1f1208]/85 px-6 text-[14px] font-semibold text-[#f4ddbf] shadow-[0_16px_38px_rgba(0,0,0,0.42)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d6ad68]/60 hover:bg-[#2b190b]/90"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 4: красный уголь*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#d94b28] px-6 text-[14px] font-semibold text-white shadow-[0_18px_42px_rgba(217,75,40,0.32)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#ef6139]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#d94b28]/35 bg-[#2b0d08]/80 px-6 text-[14px] font-semibold text-[#ffe4dc] shadow-[0_16px_38px_rgba(73,17,9,0.4)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ef6139]/65 hover:bg-[#3a120a]/90"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 3: градиент оранжевый*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[linear-gradient(135deg,#ffd37a_0%,#f59e2f_52%,#c76a17_100%)] px-6 text-[14px] font-semibold text-[#221204] shadow-[0_18px_44px_rgba(245,158,47,0.34)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:brightness-110"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#f6b85f]/30 bg-[linear-gradient(135deg,rgba(80,36,7,0.92)_0%,rgba(38,18,7,0.88)_100%)] px-6 text-[14px] font-semibold text-[#fff1dd] shadow-[0_16px_40px_rgba(94,45,9,0.34)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ffc36b]/60"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 2: со свечением*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#f1b84c] px-6 text-[14px] font-semibold text-[#1c1105] shadow-[0_0_18px_rgba(241,184,76,0.55),0_18px_42px_rgba(241,184,76,0.25)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(241,184,76,0.75),0_22px_48px_rgba(241,184,76,0.32)]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#ffb13b]/35 bg-[#341804]/80 px-6 text-[14px] font-semibold text-[#ffe9c2] shadow-[0_0_16px_rgba(255,134,28,0.38),0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ffbd59]/70 hover:shadow-[0_0_24px_rgba(255,134,28,0.55)]"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*/!*Вариант 1: брендовый, как сейчас, но сочнее*!/*/}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center justify-center gap-4 rounded-md bg-[#d6ad68] px-6 text-[14px] font-semibold text-[#18130c] shadow-[0_18px_42px_rgba(214,173,104,0.28)] cursor-pointer transition duration-300 hover:-translate-y-0.5 hover:bg-[#e7bf78]"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center justify-center gap-4 rounded-md border border-[#d6ad68]/25 bg-[#2b1605]/75 px-6 text-[14px] font-semibold text-[#f7ead7] shadow-[0_16px_38px_rgba(80,39,8,0.35)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#d6ad68]/55 hover:bg-[#3a1d07]/85"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}


                            {/*Как было */}

                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={scrollToMenu}*/}
                            {/*    className="group inline-flex h-12 min-w-52.5 items-center*/}
                            {/*     justify-center gap-4 rounded-md bg-primary px-6 text-[14px]*/}
                            {/*     font-semibold text-on-primary shadow-[0_18px_42px_rgba(214,173,104,0.24)]*/}
                            {/*     cursor-pointer transition duration-300 hover:-translate-y-0.5"*/}
                            {/*>*/}
                            {/*    Смотреть меню*/}
                            {/*    <ArrowRight*/}
                            {/*        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>*/}
                            {/*</button>*/}

                            {/*<Link*/}
                            {/*    href="/booking"*/}
                            {/*    className="inline-flex h-12 min-w-57 items-center*/}
                            {/*     justify-center gap-4 rounded-md border border-white/10*/}
                            {/*      bg-white/4 px-6 text-[14px] font-semibold text-text backdrop-blur*/}
                            {/*      transition duration-300 hover:-translate-y-0.5 hover:border-primary/40"*/}
                            {/*>*/}
                            {/*    Забронировать стол*/}
                            {/*    <CalendarDays className="h-4 w-4 text-primary"/>*/}
                            {/*</Link>*/}

                        </div>
                    </div>

                    <div
                        className="mt-9 grid max-w-135 grid-cols-3 overflow-hidden rounded-[10px]
                        border border-white/9 bg-black/30 backdrop-blur-md"
                    >
                        {heroHighlights.map((item, index) => (
                            <div
                                key={item.label}
                                className={[
                                    "px-4 py-4 sm:px-5 sm:py-5",
                                    index !== 0 ? "border-l border-white/8" : "",
                                ].join(" ")}
                            >
                                <div
                                    className="text-[12px] font-semibold leading-none tracking-normal text-text md:text-[19px]">
                                    {item.value}
                                </div>
                                <div className="mt-2 text-[12px] font-light tracking-normal leading-none text-text/60">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

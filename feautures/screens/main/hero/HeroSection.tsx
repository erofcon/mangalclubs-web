"use client";

import Link from "next/link";
import {ArrowRight, CalendarDays, ShoppingBag, Sparkles, Truck, type LucideIcon} from "lucide-react";

type HeroService = {
    label: string;
    icon: LucideIcon;
};

const heroServices: HeroService[] = [
    {label: "Доставка еды", icon: Truck},
    {label: "Еда навынос", icon: ShoppingBag},
    {label: "VIP кабинки", icon: Sparkles},
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
                            bg-[#F1B94C] px-6 text-[14px] font-semibold text-[#111111]
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
                            Бронирование
                            <CalendarDays className="h-4 w-4 text-primary"/>
                        </Link>
                    </div>

                    <div className="max-w-120">
                        <div
                            className="mt-9 flex flex-col gap-4 overflow-hidden rounded-[10px] ps-1.5 md:max-w-160 md:flex-row md:justify-between"
                        >
                            {heroServices.map(({label, icon: Icon}) => (
                                <div key={label} className="flex items-center justify-start gap-2">
                                    <div className="rounded-lg border border-border bg-background p-1">
                                        <Icon className="h-auto w-6 text-primary" strokeWidth={1.8}/>
                                    </div>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

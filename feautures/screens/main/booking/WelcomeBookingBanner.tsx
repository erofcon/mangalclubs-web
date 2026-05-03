"use client"


import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const bookingTexts = [
    "Забронируй уютное место\nВыбери удобное время заранее!",
    "Лучшие места уходят быстро\nУспей забронировать!",
    "Планируй отдых заранее\nМы позаботимся об остальном",
    "Комфорт начинается с брони\nВыбери удобное время!",
    "Отдыхай без ожидания\nЗабронируй место заранее!"
];

export default function WelcomeBookingBanner() {
    const [textIndex, setTextIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setTextIndex((prev) => (prev + 1) % bookingTexts.length);
                setFade(true);
            }, 500);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="mb-6 md:mb-8 mx-auto w-full max-w-374 px-4 md:px-7">
            <div className="flex flex-col gap-4">
                <h2 className="text-xl md:text-2xl font-extrabold leading-none text-text">
                    Приходите к нам!
                </h2>

                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <div
                        className="flex items-center justify-between rounded-xl bg-card px-5 py-6 hover:scale-105 duration-300"
                        style={{
                            background: `linear-gradient(
                                90deg,
                                rgba(255, 106, 0, 0.18) 0%,
                                rgba(244, 144, 12, 0.14) 50%,
                                rgba(221, 46, 68, 0.18) 100%
                            )`
                        }}
                    >
                        <div>
                            <p className="text-sm leading-none text-text-secondary font-semibold">
                                Мы находимся
                            </p>
                            <p className="mt-2 text-sm md:text-lg font-bold leading-none text-text">
                                г. Грозный
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex hover:scale-105 duration-300 h-10 md:h-12 cursor-pointer items-center justify-center rounded-full bg-white px-6 text-sm md:text-base font-semibold text-black transition hover:bg-neutral-50"
                        >
                            Часы работы
                        </button>
                    </div>

                    <div
                        className="relative overflow-hidden rounded-xl p-4  hover:scale-105 duration-300"
                        style={{
                            background: `linear-gradient(
                                135deg,
                                rgba(255, 106, 0, 0.35) 0%,
                                rgba(221, 46, 68, 0.25) 100%
                            )`
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-linear-to-r from-primary/20 via-secondary/10 to-accent/20 blur-xl opacity-60 pointer-events-none"/>

                        <div className="relative flex flex-col md:flex-row h-full items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <p
                                    className={`text-sm md:text-base text-text font-bold whitespace-pre-line transition-all duration-300 ease-in-out ${
                                        fade
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-2"
                                    }`}
                                >
                                    {bookingTexts[textIndex]}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => router.push("/booking")}
                                className="inline-flex hover:scale-105 duration-300 w-full md:w-max px-4 cursor-pointer md:h-12 shrink-0 items-center justify-center rounded-full md:px-7 py-2 font-semibold text-black bg-white"
                            >
                                Забронировать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
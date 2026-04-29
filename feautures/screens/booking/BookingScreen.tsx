"use client";

import Image from "next/image";
import {useEffect, useState} from "react";

type RestaurantCard = {
    id: string;
    title: string;
    subtitle: string;
    image: string;
};

type RestaurantRow = {
    items: RestaurantCard[];
};

const restaurantCards: RestaurantCard[] = [
    {
        id: "auyl",
        title: "AUYL",
        subtitle:
            "\u041f\u0430\u043d\u043e\u0440\u0430\u043c\u043d\u044b\u0439 \u0437\u0430\u043b \u0441 \u043a\u0430\u043c\u0435\u0440\u043d\u043e\u0439 \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u043e\u0439 \u0438 \u0432\u0438\u0434\u043e\u043c \u043d\u0430 \u0432\u0435\u0447\u0435\u0440\u043d\u0438\u0439 \u0433\u043e\u0440\u043e\u0434",
        image: "/stories/rest.png",
    },
    {
        id: "spiros",
        title: "SPIROS",
        subtitle:
            "\u0422\u0435\u043f\u043b\u043e\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u043e\u0439 \u043a\u0443\u0445\u043d\u0435\u0439 \u0438 \u0440\u0430\u0441\u0441\u043b\u0430\u0431\u043b\u0435\u043d\u043d\u044b\u043c \u0440\u0438\u0442\u043c\u043e\u043c \u0443\u0436\u0438\u043d\u0430",
        image: "/stories/rest2.png",
    },
    {
        id: "terra",
        title: "TERRA",
        subtitle:
            "\u041b\u0430\u043a\u043e\u043d\u0438\u0447\u043d\u043e\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u0442\u0438\u0445\u0438\u0445 \u0443\u0436\u0438\u043d\u043e\u0432 \u0438 \u0434\u043e\u043b\u0433\u0438\u0445 \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440\u043e\u0432",
        image: "/stories/rest3.png",
    },
    {
        id: "ember",
        title: "EMBER",
        subtitle:
            "\u041c\u044f\u0433\u043a\u0438\u0439 \u0441\u0432\u0435\u0442, \u043d\u0430\u0442\u0443\u0440\u0430\u043b\u044c\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u0443\u0440\u044b \u0438 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u0430\u044f \u043f\u043e\u0441\u0430\u0434\u043a\u0430 \u0434\u043b\u044f \u0432\u0435\u0447\u0435\u0440\u0430",
        image: "/stories/rest4.png",
    },
    {
        id: "nova",
        title: "NOVA",
        subtitle:
            "\u041f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0439 \u0437\u0430\u043b \u0434\u043b\u044f \u043f\u0440\u0430\u0437\u0434\u043d\u0438\u043a\u043e\u0432 \u0438 \u0431\u043e\u043b\u044c\u0448\u0438\u0445 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0439",
        image: "/stories/barbecue.png",
    },
    {
        id: "sky",
        title: "SKY",
        subtitle:
            "\u0421\u0432\u0435\u0442\u043b\u043e\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0441 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u043c \u0440\u0438\u0442\u043c\u043e\u043c \u0438 \u0443\u044e\u0442\u043d\u043e\u0439 \u043f\u043e\u0434\u0430\u0447\u0435\u0439",
        image: "/stories/barbecue2.png",
    },
    {
        id: "cedar",
        title: "CEDAR",
        subtitle:
            "\u041e\u0431\u0449\u0438\u0439 \u0437\u0430\u043b \u0434\u043b\u044f \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u0438 \u043e\u0441\u043e\u0431\u044b\u0445 \u043f\u043e\u0432\u043e\u0434\u043e\u0432",
        image: "/stories/rest2.png",
    },
    {
        id: "loft",
        title: "LOFT",
        subtitle:
            "\u0421\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u0430\u044f \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0430 \u0434\u043b\u044f \u0434\u0440\u0443\u0436\u0435\u0441\u043a\u0438\u0445 \u0432\u0441\u0442\u0440\u0435\u0447 \u0438 \u0432\u0435\u0447\u0435\u0440\u0438\u043d\u043e\u043a",
        image: "/stories/rest3.png",
    },
    {
        id: "villa",
        title: "VILLA",
        subtitle:
            "\u0421\u043f\u043e\u043a\u043e\u0439\u043d\u0430\u044f \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0430 \u0441 \u043c\u044f\u0433\u043a\u043e\u0439 \u043f\u043e\u0441\u0430\u0434\u043a\u043e\u0439 \u0438 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u043c \u0444\u043e\u0440\u043c\u0430\u0442\u043e\u043c",
        image: "/stories/rest.png",
    },
    {
        id: "mirror",
        title: "MIRROR",
        subtitle:
            "\u0421\u0442\u0438\u043b\u044c\u043d\u044b\u0439 \u0437\u0430\u043b \u0434\u043b\u044f \u043a\u0440\u0430\u0441\u0438\u0432\u043e\u0439 \u0441\u0435\u0440\u0432\u0438\u0440\u043e\u0432\u043a\u0438 \u0438 \u0434\u043b\u0438\u043d\u043d\u044b\u0445 \u0443\u0436\u0438\u043d\u043e\u0432",
        image: "/stories/rest4.png",
    },
    {
        id: "river",
        title: "RIVER",
        subtitle:
            "\u041a\u0430\u043c\u0435\u0440\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 \u0434\u043b\u044f \u0442\u0438\u0445\u0438\u0445 \u0432\u0441\u0442\u0440\u0435\u0447 \u0438 \u043d\u0435\u0441\u043f\u0435\u0448\u043d\u044b\u0445 \u0432\u0435\u0447\u0435\u0440\u043e\u0432",
        image: "/stories/barbecue2.png",
    },
];

const layoutPattern = [2, 3, 1, 3, 2];

function splitRows(items: RestaurantCard[]): RestaurantRow[] {
    const rows: RestaurantRow[] = [];
    let index = 0;
    let patternIndex = 0;

    while (index < items.length) {
        const size = layoutPattern[patternIndex % layoutPattern.length];
        rows.push({
            items: items.slice(index, index + size),
        });
        index += size;
        patternIndex += 1;
    }

    return rows;
}

function getGridClass(count: number) {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
}

function getHeightClass(count: number) {
    if (count === 1) return "min-h-[340px] sm:min-h-[420px] lg:min-h-[520px]";
    if (count === 2) return "min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]";
    return "min-h-[280px] sm:min-h-[320px] lg:min-h-[340px]";
}

function getSizes(count: number) {
    if (count === 1) return "100vw";
    if (count === 2) return "(max-width: 768px) 100vw, 50vw";
    return "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw";
}

const rows = splitRows(restaurantCards);

export function BookingScreen() {
    const [visibleCards, setVisibleCards] = useState<Set<string>>(() => new Set());

    useEffect(() => {
        const cards = document.querySelectorAll<HTMLElement>("[data-reveal-card]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const cardId = entry.target.getAttribute("data-reveal-card");
                    if (!cardId) return;

                    setVisibleCards((current) => {
                        if (current.has(cardId)) return current;

                        const next = new Set(current);
                        next.add(cardId);
                        return next;
                    });

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.18,
                rootMargin: "0px 0px -10% 0px",
            },
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-dvh bg-black text-white">
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(176,144,104,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_22%)]"/>

                <div
                    className="relative mx-auto flex max-w-[1520px] flex-col px-6 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12 lg:pb-24 lg:pt-8">
                    <div className="max-w-[680px]">
                        <h1 className="text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[3.4rem] lg:text-[4rem]">
                            <span className="text-[#b6aa98]">
                                {"\u041d\u0430\u0448\u0438 "}
                            </span>
                            <span>
                                {"\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u044b"}
                            </span>
                        </h1>

                        <p className="mt-10 max-w-[560px] text-base leading-relaxed text-white/90 sm:mt-14 sm:text-[1.15rem]">
                            {
                                "\u0414\u0435\u043b\u0438\u043c\u0441\u044f \u0432\u043a\u0443\u0441\u043e\u043c \u0436\u0438\u0437\u043d\u0438 \u0447\u0435\u0440\u0435\u0437 \u0432\u043a\u0443\u0441 \u043a \u0435\u0434\u0435"
                            }
                        </p>
                    </div>

                    <div className="mt-16 space-y-6 lg:mt-20 lg:space-y-8">
                        {rows.map((row, rowIndex) => (
                            <div
                                key={`row-${rowIndex}`}
                                className={`grid gap-6 lg:gap-8 ${getGridClass(row.items.length)}`}
                            >
                                {row.items.map((restaurant, cardIndex) => {
                                    const isVisible = visibleCards.has(restaurant.id);
                                    const transitionDelay = `${cardIndex * 110 + rowIndex * 70}ms`;

                                    return (
                                        <article
                                            key={restaurant.id}
                                            data-reveal-card={restaurant.id}
                                            className={`group relative isolate overflow-hidden rounded-[30px] bg-[#111111] ${getHeightClass(row.items.length)} ${
                                                isVisible
                                                    ? "translate-y-0 scale-100 opacity-100 blur-0"
                                                    : "translate-y-12 scale-[0.97] opacity-0 blur-[10px]"
                                            } transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:blur-0`}
                                            style={{transitionDelay}}
                                        >
                                            <Image
                                                src={restaurant.image}
                                                alt={restaurant.title}
                                                fill
                                                priority={rowIndex === 0}
                                                sizes={getSizes(row.items.length)}
                                                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                                            />

                                            <div className="absolute inset-0 bg-black/40"/>
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/18 to-transparent"/>
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"/>

                                            <div
                                                className="relative flex h-full flex-col justify-between p-7 sm:p-8 lg:p-9">
                                                <h2 className="text-[2rem] font-extrabold uppercase tracking-[-0.04em] text-white sm:text-[2.35rem]">
                                                    {restaurant.title}
                                                </h2>

                                                <p className="max-w-[420px] text-sm leading-6 text-white/72 transition duration-500 group-hover:text-white/90">
                                                    {restaurant.subtitle}
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

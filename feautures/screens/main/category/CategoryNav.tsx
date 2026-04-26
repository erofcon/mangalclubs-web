'use client';

import {useEffect, useRef, useState} from "react";
import {categories} from "@/mocks/mocks-data";
import Image from "next/image";
import {CategoryIcons} from "@/types/products";

export function CategoriesNav() {
    const [activeId, setActiveId] = useState<string | number | null>(
        categories[0]?.id ?? null
    );

    const categoryRefs = useRef<Record<string, HTMLLIElement | null>>({});

    const scrollActiveCategoryIntoView = (categoryId: string | number) => {
        const element = categoryRefs.current[String(categoryId)];

        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    };

    useEffect(() => {
        let scrollTimeout: ReturnType<typeof setTimeout>;

        const updateActiveCategory = () => {
            let currentId: string | number | null = categories[0]?.id ?? null;

            categories.forEach((category) => {
                const section = document.getElementById(`menu-${category.id}`);

                if (!section) return;

                const sectionTop = section.getBoundingClientRect().top;

                if (sectionTop <= 120) {
                    currentId = category.id;
                }
            });

            setActiveId(currentId);

            if (currentId) {
                scrollActiveCategoryIntoView(currentId);
            }
        };

        const handleScroll = () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                updateActiveCategory();
            }, 150);
        };

        updateActiveCategory();

        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => {
            clearTimeout(scrollTimeout);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToCategory = (categoryId: string | number) => {
        const section = document.getElementById(`menu-${categoryId}`);

        if (!section) return;

        setActiveId(categoryId);
        scrollActiveCategoryIntoView(categoryId);

        const yOffset = -88;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };

    return (
        <nav className="sticky top-0 z-30  backdrop-blur-md py-4 md:max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between gap-4">

                <ul className="flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {categories.map(category => {
                        const isActive = activeId === category.id;

                        return (
                            <li
                                key={category.id}
                                ref={(element) => {
                                    categoryRefs.current[String(category.id)] = element;
                                }}
                                onClick={() => scrollToCategory(category.id)}
                                className={`flex items-center gap-4 cursor-pointer rounded-full px-3 py-1 font-semibold transition-all shrink-0
                            ${isActive
                                    ? "bg-warning text-primary-foreground shadow-md"
                                    : "bg-card text-text border border-border hover:bg-warning hover:text-text-on-primary"
                                }
                        `}
                            >
                                <div className="bg-surface p-1 rounded-full">
                                    <Image
                                        src={CategoryIcons[category.icon]}
                                        alt="icon"
                                        width={28}
                                        height={28}
                                    />
                                </div>
                                {category.title}
                            </li>
                        );
                    })}
                </ul>

                <button
                    className="hidden cursor-pointer md:flex shrink-0 items-center gap-2 rounded-full px-5 py-2 font-semibold bg-warning text-text-on-primary hover:opacity-90"
                >
                    Корзина
                    <span className={'bg-card text-text px-2 rounded-full'}>3</span>
                </button>

            </div>
        </nav>
    );
}
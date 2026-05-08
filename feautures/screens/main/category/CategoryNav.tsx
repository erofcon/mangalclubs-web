"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {ChevronRight} from "lucide-react";
import {categories} from "@/mocks/mocks-data";

const FLY_ANIMATION_DURATION_MS = 1650;

type FlyingItem = {
    id: string;
    image?: string;
    name: string;
    onComplete?: () => void;
    from: {
        x: number;
        y: number;
    };
    center: {
        x: number;
        y: number;
    };
    to: {
        x: number;
        y: number;
    };
};

export function CategoriesNav() {
    const [activeId, setActiveId] = useState<string | number | null>(
        categories[0]?.id ?? null
    );

    const categoryListRef = useRef<HTMLUListElement | null>(null);
    const categoryRefs = useRef<Record<string, HTMLLIElement | null>>({});

    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

    const scrollActiveCategoryIntoView = (categoryId: string | number) => {
        const list = categoryListRef.current;
        const element = categoryRefs.current[String(categoryId)];

        if (!list || !element) return;

        const listRect = list.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const left =
            list.scrollLeft +
            elementRect.left -
            listRect.left -
            (listRect.width - elementRect.width) / 2;

        list.scrollTo({
            left,
            behavior: "smooth",
        });
    };

    const getVisibleCartButtonRect = () => {
        const cartButtons = Array.from(
            document.querySelectorAll<HTMLElement>('[data-cart-target="true"]')
        );

        const visibleCartButton = cartButtons.find((button) => {
            const rect = button.getBoundingClientRect();

            return rect.width > 0 && rect.height > 0;
        });

        return visibleCartButton?.getBoundingClientRect() ?? null;
    };

    useEffect(() => {
        const handleFlyToCart = (event: Event) => {
            const customEvent = event as CustomEvent<{
                image?: string;
                name: string;
                from: {
                    x: number;
                    y: number;
                };
                onComplete?: () => void;
            }>;

            const cartRect = getVisibleCartButtonRect();

            if (!cartRect) {
                customEvent.detail.onComplete?.();
                return;
            }

            const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

            const flyingItem: FlyingItem = {
                id,
                image: customEvent.detail.image,
                name: customEvent.detail.name,
                onComplete: customEvent.detail.onComplete,
                from: customEvent.detail.from,
                center: {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                },
                to: {
                    x: cartRect.left + cartRect.width / 2,
                    y: cartRect.top + cartRect.height / 2,
                },
            };

            setFlyingItems((prev) => [...prev, flyingItem]);
        };

        window.addEventListener("fly-to-cart", handleFlyToCart);

        return () => {
            window.removeEventListener("fly-to-cart", handleFlyToCart);
        };
    }, []);

    useEffect(() => {
        let scrollTimeout: ReturnType<typeof setTimeout>;

        const updateActiveCategory = () => {
            let currentId: string | number | null = categories[0]?.id ?? null;

            categories.forEach((category) => {
                const section = document.getElementById(`menu-${category.id}`);

                if (!section) return;

                const sectionTop = section.getBoundingClientRect().top;

                if (sectionTop <= 150) {
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
            }, 120);
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

        const yOffset = -104;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };

    return (
        <>
            <nav className="sticky top-0 z-30 border-y border-[#1d1914] bg-[#070808]/92 shadow-[0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-[1210px] items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-0">
                    <ul
                        ref={categoryListRef}
                        className="flex flex-1 gap-3 overflow-x-auto whitespace-nowrap scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {categories.map((category) => {
                            const isActive = activeId === category.id;

                            return (
                                <li
                                    key={category.id}
                                    ref={(element) => {
                                        categoryRefs.current[String(category.id)] = element;
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => scrollToCategory(category.id)}
                                        className={`h-10 rounded-full px-7 text-[14px] transition duration-300 ${
                                            isActive
                                                ? "border border-[#b68442] bg-[#d6ad68]/10 text-[#d6ad68] shadow-[0_0_22px_rgba(214,173,104,0.12)]"
                                                : "border border-[#272421] bg-black/20 text-[#bfb6aa] hover:border-[#72542e] hover:bg-white/[0.03] hover:text-[#f5efe5]"
                                        }`}
                                    >
                                        {category.title}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <Link
                        href="#menu-99"
                        className="hidden shrink-0 items-center gap-3 text-[14px] text-[#c8c0b5] transition duration-300 hover:text-[#d6ad68] md:inline-flex"
                    >
                        Смотреть все меню
                        <ChevronRight className="h-5 w-5 text-[#d6ad68]"/>
                    </Link>
                </div>
            </nav>

            {flyingItems.map((item) => {
                return (
                    <div
                        key={item.id}
                        className="pointer-events-none fixed z-9999 h-28 w-28 rounded-[8px] bg-linear-to-t from-black/70 to-transparent p-3 shadow-2xl"
                        onAnimationEnd={() => {
                            setFlyingItems((prev) => prev.filter((flyingItem) => flyingItem.id !== item.id));
                            item.onComplete?.();
                        }}
                        style={{
                            left: item.from.x - 56,
                            top: item.from.y - 56,
                            animation: `fly-to-cart-${item.id} ${FLY_ANIMATION_DURATION_MS / 1000}s cubic-bezier(.2,.9,.2,1) forwards`,
                        }}
                    >
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={112}
                                height={112}
                                className="h-full w-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.45)]"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-[#d6ad68] text-sm font-bold text-[#17110b]">
                                {item.name}
                            </div>
                        )}

                        <style jsx>{`
                            @keyframes fly-to-cart-${item.id} {
                                0% {
                                    transform: translate(0, 0) scale(0.7) rotate(0deg);
                                    opacity: 0;
                                }

                                18% {
                                    transform: translate(
                                            ${item.center.x - item.from.x}px,
                                            ${item.center.y - item.from.y}px
                                    ) scale(1.18) rotate(-3deg);
                                    opacity: 1;
                                }

                                36% {
                                    transform: translate(
                                            ${item.center.x - item.from.x}px,
                                            ${item.center.y - item.from.y}px
                                    ) scale(1.18) rotate(0deg);
                                    opacity: 1;
                                }

                                88% {
                                    transform: translate(
                                            ${item.to.x - item.from.x}px,
                                            ${item.to.y - item.from.y}px
                                    ) scale(0.28) rotate(18deg);
                                    opacity: 1;
                                }

                                100% {
                                    transform: translate(
                                            ${item.to.x - item.from.x}px,
                                            ${item.to.y - item.from.y}px
                                    ) scale(0.12) rotate(24deg);
                                    opacity: 0;
                                }
                            }
                        `}</style>
                    </div>
                );
            })}
        </>
    );
}

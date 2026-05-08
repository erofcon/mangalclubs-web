"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {ShoppingCart} from "lucide-react";
import {categories} from "@/mocks/mocks-data";
import {useCartStore} from "@/store/cart-store";
import {useUIStore} from "@/store/ui-store";

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

const isCartTargetVisible = (element: HTMLElement | null) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.pointerEvents !== "none" &&
        Number(style.opacity) > 0
    );
};

const getCartTargetRect = (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);

    if (!element || !isCartTargetVisible(element)) return null;

    return element.getBoundingClientRect();
};

const getVisibleCartButtonRect = () => {
    return (
        getCartTargetRect('[data-cart-target="category"]') ??
        getCartTargetRect('[data-cart-target="header"]') ??
        getCartTargetRect('[data-cart-target="floating"]')
    );
};

export function CategoriesNav() {
    const [activeId, setActiveId] = useState<string | number | null>(
        categories[0]?.id ?? null
    );

    const [isHeaderCartVisible, setIsHeaderCartVisible] = useState(true);

    const openCart = useUIStore((state) => state.openCart);
    const totalItems = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
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

    useEffect(() => {
        const updateHeaderCartVisibility = () => {
            const headerCartButton = document.querySelector<HTMLElement>(
                '[data-cart-target="header"]'
            );

            setIsHeaderCartVisible(isCartTargetVisible(headerCartButton));
        };

        updateHeaderCartVisibility();

        window.addEventListener("scroll", updateHeaderCartVisibility, {passive: true});
        window.addEventListener("resize", updateHeaderCartVisibility);

        return () => {
            window.removeEventListener("scroll", updateHeaderCartVisibility);
            window.removeEventListener("resize", updateHeaderCartVisibility);
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
            <nav
                className="sticky top-0 z-30 shadow-[0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur-md mx-auto w-full max-w-[1210px]"
            >
                <div
                    className="mx-auto flex w-full max-w-[1210px] items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-0">
                    <ul
                        ref={categoryListRef}
                        className="flex flex-1 gap-3 overflow-x-auto whitespace-nowrap
                        scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4"
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
                                        className={`h-10 rounded-full px-7 text-[14px] transition duration-300 cursor-pointer ${
                                            isActive
                                                ? "border border-border text-primary bg-background shadow-[0_0_22px_rgba(214,173,104,0.12)]"
                                                : "border border-[#272421] bg-black/20 text-text hover:border-border hover:text-primary"
                                        }`}
                                    >
                                        {category.title}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <button
                        type="button"
                        data-cart-target="category"
                        tabIndex={isHeaderCartVisible ? -1 : 0}
                        onClick={openCart}
                        className={`relative cursor-pointer inline-flex h-10 w-10
                        items-center justify-center text-primary transition duration-300 hover:scale-105
                        ${
                            isHeaderCartVisible
                                ? "pointer-events-none opacity-0"
                                : "pointer-events-auto opacity-100"
                        }
                        `}
                        aria-label="Открыть корзину"
                    >
                        <ShoppingCart className="h-6 w-6" strokeWidth={1.8}/>
                        {totalItems > 0 && (
                            <span
                                className="absolute right-0 top-0 flex h-5 min-w-5
                                items-center justify-center rounded-full
                                bg-primary px-1 text-[11px] font-semibold text-on-primary">
                                {totalItems}
                            </span>
                        )}
                    </button>
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
                            <div
                                className="flex h-full w-full items-center justify-center rounded-[8px] bg-[#d6ad68] text-sm font-bold text-[#17110b]">
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

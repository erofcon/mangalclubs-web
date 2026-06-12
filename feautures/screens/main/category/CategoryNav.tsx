"use client";

import {type ReactNode, useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Menu, ShoppingCart, X} from "lucide-react";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";
import {useAppDataStore} from "@/store/app-data-store";
import {useCartStore} from "@/store/cart-store";
import {useUIStore} from "@/store/ui-store";

const FLY_ANIMATION_DURATION_MS = 1650;
const HALF_WIDTH_CATEGORY_MAX_LENGTH = 20;

export type CategoryNavItem = {
    id: string | number;
    title: string;
    icon?: ReactNode;
    meta?: string;
};

type CategoryNavProps = {
    items: CategoryNavItem[];
    sectionIdPrefix: string;
    ariaLabel?: string;
    menuTitle?: string;
    menuItems?: CategoryNavItem[];
    menuActiveId?: string | number | null;
    menuButtonIcon?: ReactNode;
    variant?: "menu" | "booking";
    showMenuButton?: boolean;
    menuButtonLabel?: string;
    closeMenuLabel?: string;
    onMenuItemSelect?: (item: CategoryNavItem) => void;
    scrollOffset?: number;
    activeThreshold?: number;
    rightSlot?: ReactNode;
};

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

const getCategoryGridSpanClass = (title: string) => {
    return title.length <= HALF_WIDTH_CATEGORY_MAX_LENGTH ? "" : "col-span-full";
};

export function CategoryNav({
                                items,
                                sectionIdPrefix,
                                ariaLabel = "Категории",
                                menuTitle = "Категории",
                                menuItems,
                                menuActiveId,
                                menuButtonIcon,
                                variant = "menu",
                                showMenuButton = true,
                                menuButtonLabel = "Открыть все категории",
                                closeMenuLabel = "Закрыть категории",
                                onMenuItemSelect,
                                scrollOffset = -104,
                                activeThreshold = 150,
                                rightSlot,
                            }: CategoryNavProps) {
    const [activeId, setActiveId] = useState<string | number | null>(
        items[0]?.id ?? null
    );
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [isMobileCategoryMenu, setIsMobileCategoryMenu] = useState(false);

    const categoryListRef = useRef<HTMLUListElement | null>(null);
    const categoryRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const categoryMenuButtonRef = useRef<HTMLButtonElement | null>(null);
    const categoryMenuPanelRef = useRef<HTMLDivElement | null>(null);

    const dropdownTitleId = `${sectionIdPrefix}-category-dropdown-title`;
    const mobileTitleId = `${sectionIdPrefix}-category-menu-title`;
    const currentActiveId = items.some((item) => item.id === activeId)
        ? activeId
        : items[0]?.id ?? null;
    const currentMenuItems = menuItems ?? items;
    const currentMenuActiveId = menuItems ? menuActiveId : currentActiveId;
    const isBookingVariant = variant === "booking";

    useBodyScrollLock(isCategoryMenuOpen && isMobileCategoryMenu);

    const getSectionId = useCallback((categoryId: string | number) => {
        return `${sectionIdPrefix}-${categoryId}`;
    }, [sectionIdPrefix]);

    const scrollActiveCategoryIntoView = useCallback((categoryId: string | number) => {
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
    }, []);

    useEffect(() => {
        if (items.length === 0) return;

        let scrollTimeout: ReturnType<typeof setTimeout>;

        const updateActiveCategory = () => {
            let currentId: string | number | null = items[0]?.id ?? null;

            items.forEach((category) => {
                const section = document.getElementById(getSectionId(category.id));

                if (!section) return;

                const sectionTop = section.getBoundingClientRect().top;

                if (sectionTop <= activeThreshold) {
                    currentId = category.id;
                }
            });

            setActiveId(currentId);

            if (currentId !== null) {
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
    }, [activeThreshold, getSectionId, items, scrollActiveCategoryIntoView]);

    useEffect(() => {
        const updateMenuMode = () => {
            setIsMobileCategoryMenu(window.innerWidth < 768);
        };

        updateMenuMode();

        window.addEventListener("resize", updateMenuMode);

        return () => {
            window.removeEventListener("resize", updateMenuMode);
        };
    }, []);

    useEffect(() => {
        if (!isCategoryMenuOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsCategoryMenuOpen(false);
            }
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [isCategoryMenuOpen]);

    useEffect(() => {
        if (!isCategoryMenuOpen || isMobileCategoryMenu) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            const target = event.target as Node;

            if (
                categoryMenuButtonRef.current?.contains(target) ||
                categoryMenuPanelRef.current?.contains(target)
            ) {
                return;
            }

            setIsCategoryMenuOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);

        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
        };
    }, [isCategoryMenuOpen, isMobileCategoryMenu]);

    const scrollToCategory = useCallback((categoryId: string | number) => {
        const section = document.getElementById(getSectionId(categoryId));

        if (!section) return;

        setActiveId(categoryId);
        scrollActiveCategoryIntoView(categoryId);

        const y = section.getBoundingClientRect().top + window.scrollY + scrollOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    }, [getSectionId, scrollActiveCategoryIntoView, scrollOffset]);

    const selectMenuItem = (item: CategoryNavItem) => {
        setIsCategoryMenuOpen(false);

        if (onMenuItemSelect) {
            onMenuItemSelect(item);
            return;
        }

        window.setTimeout(() => {
            scrollToCategory(item.id);
        }, 0);
    };

    if (items.length === 0) return null;

    return (
        <>
            <nav
                className={`sticky top-0 z-10 mx-auto w-full max-w-302.5 bg-background shadow-[0_18px_45px_rgba(0,0,0,0.34)] ${
                    isBookingVariant ? "bg-background/96 backdrop-blur-md" : "border-b border-border/50"
                }`}
                aria-label={ariaLabel}
            >
                <div
                    className={`mx-auto flex w-full max-w-302.5 items-center justify-between gap-3 px-5 sm:px-6 lg:px-0 ${
                        isBookingVariant ? "py-3" : "py-2"
                    }`}>
                    {showMenuButton && (
                        <button
                            ref={categoryMenuButtonRef}
                            type="button"
                            onClick={() => setIsCategoryMenuOpen((current) => !current)}
                            className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center 
                            border bg-black/35 transition duration-300 hover:border-primary hover:text-primary ${
                                isCategoryMenuOpen
                                    ? "border-primary text-primary shadow-[0_0_22px_rgba(214,173,104,0.16)]"
                                    : "border-border/60 text-text"
                            }
                            ${
                                isBookingVariant ? " rounded-lg" : " rounded-full"
                            }`
                            }
                            aria-label={menuButtonLabel}
                            aria-expanded={isCategoryMenuOpen}
                        >
                            {menuButtonIcon ?? <Menu className="h-6 w-6" strokeWidth={2.2}/>}
                        </button>
                    )}

                    <ul
                        ref={categoryListRef}
                        className={`flex flex-1 overflow-x-auto whitespace-nowrap scroll-smooth 
                        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                            isBookingVariant ? "gap-2.5" : "gap-3"
                        }`}
                    >
                        {items.map((category) => {
                            const isActive = currentActiveId === category.id;

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
                                        aria-current={isActive ? "true" : undefined}
                                        className={
                                            isBookingVariant
                                                ? `group flex h-11 min-w-[176px] cursor-pointer items-center gap-3
                                                px-3.5 text-left transition duration-300 sm:min-w-[205px] ${
                                                    isActive
                                                        ? "border border-border bg-background rounded-lg text-primary shadow-[0_0_22px_rgba(214,173,104,0.12)]"
                                                        : "border border-[#272421] bg-black/20 rounded-lg text-text hover:border-border hover:text-primary"
                                                }`
                                                : `h-10 cursor-pointer rounded-full px-7 text-[14px] transition duration-300 ${
                                                    isActive
                                                        ? "border border-border bg-background text-primary shadow-[0_0_22px_rgba(214,173,104,0.12)]"
                                                        : "border border-[#272421] bg-black/20 text-text hover:border-border hover:text-primary"
                                                }`
                                        }
                                    >
                                        {isBookingVariant ? (
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                {category.icon && (
                                                    <span
                                                        className={`flex h-9 w-9 shrink-0 items-center 
                                                        justify-center rounded-[6px] transition duration-300 ${
                                                            isActive
                                                                ? "text-primary"
                                                                : ""
                                                        }`}
                                                        aria-hidden="true"
                                                    >
                                                        {category.icon}
                                                    </span>
                                                )}
                                                <span className="min-w-0">
                                                    <span
                                                        className="block truncate text-[14px] font-semibold leading-5">
                                                        {category.title}
                                                    </span>
                                                </span>
                                            </div>
                                        ) : (
                                            category.title
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {rightSlot}
                </div>

                {isCategoryMenuOpen && (
                    <div
                        ref={categoryMenuPanelRef}
                        className={`absolute left-5 top-[calc(100%+10px)] hidden overflow-hidden rounded-[8px] border border-border/70 bg-background/98 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-md sm:left-6 md:block lg:left-0 ${
                            isBookingVariant
                                ? "w-[min(520px,calc(100vw-40px))]"
                                : "w-[min(420px,calc(100vw-40px))]"
                        }`}
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby={dropdownTitleId}
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-border/45 px-2 pb-3">
                            <h2
                                id={dropdownTitleId}
                                className="text-[18px] font-normal leading-tight text-text"
                            >
                                {menuTitle}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsCategoryMenuOpen(false)}
                                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center
                                rounded-md text-text/70 transition duration-300 hover:bg-white/6 hover:text-primary"
                                aria-label="Закрыть"
                            >
                                <X className="h-4 w-4" strokeWidth={2.2}/>
                            </button>
                        </div>

                        <div className={`mt-3 grid max-h-105 gap-1.5 overflow-y-auto pr-1 ${
                            isBookingVariant
                                ? "grid-cols-1"
                                : "grid-cols-[repeat(auto-fit,minmax(150px,1fr))]"
                        }`}>
                            {currentMenuItems.map((category) => {
                                const isActive = currentMenuActiveId === category.id;

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => selectMenuItem(category)}
                                        className={`group flex min-h-11 cursor-pointer items-center justify-between gap-4 
                                        rounded-md border px-3.5 py-2.5 text-left text-[14px] leading-5 transition duration-300 
                                        ${getCategoryGridSpanClass(category.title)} ${
                                            isActive
                                                ? "border-primary/60 bg-primary/12 text-primary"
                                                : "border-transparent bg-transparent text-text/78 hover:border-border/60 " +
                                                "hover:bg-white/4.5 hover:text-text"
                                        }`}
                                    >
                                        <span className="flex min-w-0 items-center gap-2.5">
                                            {isBookingVariant && category.icon && (
                                                <span
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition duration-300 ${
                                                        isActive ? "text-primary" : "text-text/58 group-hover:text-primary"
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    {category.icon}
                                                </span>
                                            )}
                                            <span className="min-w-0">
                                                <span className="block truncate font-semibold">{category.title}</span>
                                                {category.meta && (
                                                    <span
                                                        className={`mt-0.5 block truncate text-[12px] font-semibold leading-4 ${
                                                            isActive ? "text-primary/72" : "text-text/48"
                                                        }`}>
                                                        {category.meta}
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition duration-300 ${
                                                isActive
                                                    ? "bg-primary"
                                                    : "bg-border/70 opacity-0 group-hover:opacity-100"
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {isCategoryMenuOpen && (
                <div className="fixed inset-0 z-90 md:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        aria-label={closeMenuLabel}
                    />

                    <div
                        className="absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-hidden rounded-t-2xl border-t border-border/70 bg-background shadow-[0_-18px_60px_rgba(0,0,0,0.48)]"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={mobileTitleId}
                    >
                        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-text/18"/>

                        <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-5 sm:px-6">
                            <h2
                                id={mobileTitleId}
                                className="text-[26px] font-normal leading-tight text-text"
                            >
                                {menuTitle}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsCategoryMenuOpen(false)}
                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border/70 bg-black/20 text-text transition duration-300 hover:border-primary hover:text-primary"
                                aria-label="Закрыть"
                            >
                                <X className="h-5 w-5" strokeWidth={2.2}/>
                            </button>
                        </div>

                        <div className={`grid max-h-[calc(82dvh-82px)] gap-2 overflow-y-auto px-5 pb-6 sm:px-6 ${
                            isBookingVariant
                                ? "grid-cols-1"
                                : "grid-cols-[repeat(auto-fit,minmax(155px,1fr))]"
                        }`}>
                            {currentMenuItems.map((category) => {
                                const isActive = currentMenuActiveId === category.id;

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => selectMenuItem(category)}
                                        className={`group flex min-h-13 cursor-pointer items-center justify-between gap-4 
                                        rounded-lg border px-4 py-3 text-left text-[15px] leading-5 transition
                                         duration-300 ${getCategoryGridSpanClass(category.title)} ${
                                            isActive
                                                ? "border-primary/70 bg-primary/14 text-primary shadow-[0_12px_30px_rgba(214,173,104,0.12)]"
                                                : "border-border/50 bg-white/[0.035] text-text/82 hover:border-primary/60 hover:text-text"
                                        }`}
                                    >
                                        <span className="flex min-w-0 items-center gap-3">
                                            {isBookingVariant && category.icon && (
                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition duration-300 ${
                                                        isActive ? "text-primary" : "text-text/58 group-hover:text-primary"
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    {category.icon}
                                                </span>
                                            )}
                                            <span className="min-w-0">
                                                <span className="block truncate">{category.title}</span>
                                                {category.meta && (
                                                    <span
                                                        className={`mt-1 block truncate text-[12px] font-semibold leading-4 ${
                                                            isActive ? "text-primary/72" : "text-text/48"
                                                        }`}>
                                                        {category.meta}
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                        <span
                                            className={`h-2 w-2 shrink-0 rounded-full transition duration-300 ${
                                                isActive ? "bg-primary" : "bg-border/70 opacity-45 group-hover:opacity-100"
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function CategoriesNav() {
    const [isHeaderCartVisible, setIsHeaderCartVisible] = useState(true);
    const categories = useAppDataStore((state) => state.categories);
    const isMenuLoading = useAppDataStore((state) => state.isMenuLoading);
    const openCart = useUIStore((state) => state.openCart);
    const totalItems = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
    );

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

    return (
        <>
            <CategoryNav
                items={categories}
                sectionIdPrefix="menu"
                showMenuButton={!isMenuLoading}
                rightSlot={
                    <button
                        type="button"
                        data-cart-target="category"
                        tabIndex={isHeaderCartVisible ? -1 : 0}
                        onClick={openCart}
                        style={{
                            opacity: isHeaderCartVisible ? 0 : 1,
                            pointerEvents: isHeaderCartVisible ? "none" : "auto",
                        }}
                        className={`relative hidden h-10 w-10 cursor-pointer md:inline-flex
                        items-center justify-center text-primary transition duration-300 hover:scale-105`}
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
                }
            />

            <FlyToCartLayer/>
        </>
    );
}
function FlyToCartLayer() {
    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

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

    return (
        <>
            {flyingItems.map((item) => {
                return (
                    <div
                        key={item.id}
                        className="pointer-events-none fixed z-9999 h-28 w-28 rounded-lg bg-linear-to-t from-black/70 to-transparent p-3 shadow-2xl"
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
                                className="flex h-full w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-[#17110b]">
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

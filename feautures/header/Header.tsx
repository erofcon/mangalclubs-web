"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {type MouseEvent, useEffect, useState} from "react";
import {Menu, ShoppingCart, X} from "lucide-react";
import {Logo} from "@/feautures/header/Logo";
import {DeliverySelector} from "@/feautures/header/DeliverySelector";
import {LoginButton} from "@/feautures/header/LoginButton";
import {MobileMenu} from "@/feautures/header/MobileMenu";
import {MenuSearch} from "@/feautures/header/MenuSearch";
import {topLinks} from "@/utils/constants";
import {useUIStore} from "@/store/ui-store";
import {useCartStore} from "@/store/cart-store";

export default function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const openCart = useUIStore((state) => state.openCart);
    const totalItems = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
    );
    const isHomePage = pathname === "/";

    const scrollToMenu = (event: MouseEvent<HTMLAnchorElement>) => {
        if (window.location.pathname !== "/" || !event.currentTarget.hash) return;

        const menuSection = document.getElementById("menu");

        if (!menuSection) return;

        event.preventDefault();
        window.history.replaceState(null, "", "/#menu");
        menuSection.scrollIntoView({behavior: "smooth", block: "start"});
    };

    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;
        const body = document.body;

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";

        return () => {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.overflow = "";

            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    return (
        <header className="relative z-50 text-text">
            <div
                className="mx-auto flex h-26 w-full max-w-302.5 items-center justify-between px-5 sm:px-6 lg:px-0">
                <div className="hidden items-center gap-12 md:flex">
                    <Logo size="desktop"/>
                    <DeliverySelector/>
                </div>

                <nav className="hidden gap-13.5 text-[14px] font-normal tracking-wider md:flex">
                    {topLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={link.href === "/#menu" ? scrollToMenu : undefined}
                            className="relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-5 md:flex">
                    {isHomePage && (
                        <>
                            <button
                                type="button"
                                data-cart-target="header"
                                onClick={openCart}
                                className="relative cursor-pointer inline-flex h-10 w-10
                                items-center justify-center text-[#FCB001] transition duration-300 hover:scale-105"
                                aria-label="Открыть корзину"
                            >
                                <ShoppingCart className="h-6 w-6" strokeWidth={1.8}/>
                                {totalItems > 0 && (
                                    <span
                                        className="absolute right-0 top-0 flex h-5 min-w-5
                                        items-center justify-center rounded-full
                                        bg-[#FCB001] px-1 text-[11px] font-bold text-on-primary">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <MenuSearch variant="desktop"/>
                        </>
                    )}
                    <LoginButton/>
                </div>

                <div className="flex w-full items-center justify-between md:hidden">
                    <Logo size="mobile"/>
                    <div className="flex items-center gap-2">
                        {isHomePage && (
                            <>
                                <MenuSearch
                                    variant="mobile"
                                    onOpenChange={(isSearchOpen) => {
                                        if (isSearchOpen) setIsOpen(false);
                                    }}
                                />
                                <button
                                    type="button"
                                    data-cart-target="header"
                                    onClick={openCart}
                                    className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center text-[#FCB001] transition duration-300 hover:scale-105"
                                    aria-label="Открыть корзину"
                                >
                                    <ShoppingCart className="h-6 w-6" strokeWidth={1.8}/>
                                    {totalItems > 0 && (
                                        <span
                                            className="absolute right-0 top-0 flex h-5 min-w-5
                                            items-center justify-center rounded-full
                                            bg-[#FCB001] px-1 text-[11px] font-bold text-on-primary">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
                            onClick={() => setIsOpen((value) => !value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text"
                        >
                            {isOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-302.5 px-5 pb-4 sm:px-6 md:hidden">
                <DeliverySelector/>
            </div>

            <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </header>
    );
}

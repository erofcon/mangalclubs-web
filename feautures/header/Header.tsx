"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {Menu, ShoppingCart, X} from "lucide-react";
import {Logo} from "@/feautures/header/Logo";
import {DeliverySelector} from "@/feautures/header/DeliverySelector";
import {LoginButton} from "@/feautures/header/LoginButton";
import {MobileMenu} from "@/feautures/header/MobileMenu";
import {topLinks} from "@/utils/constants";
import {useCartStore} from "@/store/cart-store";
import {useUIStore} from "@/store/ui-store";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const openCart = useUIStore((state) => state.openCart);
    const totalItems = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
    );

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
        <header className="relative z-50 bg-[#070808] text-[#d8d0c5]">
            <div className="mx-auto flex h-[104px] w-full max-w-[1210px] items-center justify-between px-5 sm:px-6 lg:px-0">
                <div className="hidden items-center gap-12 md:flex">
                    <Logo size="desktop"/>
                    <DeliverySelector/>
                </div>

                <nav className="hidden items-center gap-[54px] text-[14px] font-medium md:flex">
                    {topLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="transition duration-300 hover:text-[#c99a55]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-6 md:flex">
                    <button
                        type="button"
                        data-cart-target="true"
                        onClick={openCart}
                        className="relative inline-flex h-10 w-10 items-center justify-center text-[#c99a55] transition duration-300 hover:text-[#e3bd78]"
                        aria-label="Открыть корзину"
                    >
                        <ShoppingCart className="h-6 w-6" strokeWidth={1.8}/>
                        {totalItems > 0 && (
                            <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6ad68] px-1 text-[11px] font-semibold text-[#17110b]">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    <div className="h-8 w-px bg-[#302b25]"/>
                    <LoginButton/>
                </div>

                <div className="flex w-full items-center justify-between md:hidden">
                    <Logo size="mobile"/>
                    <div className="flex items-center">
                        <button
                            type="button"
                            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
                            onClick={() => setIsOpen((value) => !value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#302b25] text-[#f5efe5]"
                        >
                            {isOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-[1210px] px-5 pb-4 sm:px-6 md:hidden">
                <DeliverySelector/>
            </div>

            <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </header>
    );
}

"use client";

import {useState, useEffect} from "react";
import {ChevronUp, Handbag} from "lucide-react";
import {useCartDrawerStore} from "@/store/cart-drawer-store";

export default function FloatingButton() {
    const [isVisible, setIsVisible] = useState(false);

    const totalItems = 0;
    const openCart = useCartDrawerStore((state) => state.openCart);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        toggleVisibility();

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <button
                onClick={scrollToTop}
                aria-label="Вернуться наверх"
                className={`fixed z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-text shadow-lg shadow-black/10 transition-all duration-300 hover:scale-115 hover:text-warning right-5 md:right-8
                ${isVisible
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }
                bottom-26 md:bottom-34`}
            >
                <ChevronUp size={24} strokeWidth={2.5}/>
            </button>

            <button
                data-cart-target="true"
                onClick={(e) => {
                    e.stopPropagation();
                    openCart();
                }}
                className={`fixed right-5 bottom-10 z-[90] flex items-center gap-2 rounded-full bg-warning pl-4 pr-5 py-3 text-sm font-bold text-text-on-primary transition-all duration-300 cursor-pointer hover:scale-110 md:bottom-14 md:hidden opacity-100 translate-y-0 pointer-events-auto ${!isVisible ? "md:pointer-events-none md:translate-y-4 md:opacity-0" : ""}`}
            >
                {!totalItems ? (
                    <Handbag size={18}/>
                ) : (
                    <span>{totalItems}</span>
                )}
                Корзина
            </button>
        </>
    );
}

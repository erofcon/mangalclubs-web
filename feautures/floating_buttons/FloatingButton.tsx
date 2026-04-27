"use client";

import {useState, useEffect} from "react";
import {ChevronUp, Handbag} from "lucide-react";


export default function FloatingButton() {
    const [isVisible, setIsVisible] = useState(false);

    const totalItems = 0

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
                className={`fixed z-10 flex items-center justify-center h-12 w-12 rounded-full bg-card text-text shadow-lg shadow-black/10 border border-border transition-all duration-300 hover:text-warning hover:scale-115 right-5 md:right-8 cursor-pointer
                ${isVisible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }
                bottom-26 md:bottom-34`}
            >
                <ChevronUp size={24} strokeWidth={2.5}/>
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className={`fixed md:hidden right-5 z-[90] flex items-center gap-2 bg-warning text-text-on-primary rounded-full pl-4 pr-5 py-3 text-sm font-bold transition-all duration-300 hover:scale-110 cursor-pointer opacity-100 translate-y-0 pointer-events-auto ${!isVisible ? "md:opacity-0 md:translate-y-4 md:pointer-events-none" : ""} bottom-10 md:bottom-14`}
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
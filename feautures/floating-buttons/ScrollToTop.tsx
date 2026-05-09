"use client"


import {ChevronUp} from "lucide-react";
import {useEffect, useState} from "react";


export function ScrollToTop() {

    const [isVisible, setIsVisible] = useState(false);

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
        <button
            onClick={scrollToTop}
            aria-label="Вернуться наверх"
            className={`fixed right-5 bottom-26 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-text transition-all duration-300 hover:border-primary hover:text-primary md:right-8 md:bottom-34
                ${
                isVisible
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
            <ChevronUp size={24} strokeWidth={2.5}/>
        </button>
    )
}
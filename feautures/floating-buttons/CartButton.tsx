"use client";

import {useState, useEffect} from "react";
import {Handbag} from "lucide-react";
import {useUIStore} from "@/store/ui-store";
import {useCartStore} from "@/store/cart-store";

export default function CartButton() {
    const [isVisible, setIsVisible] = useState(false);

    const totalItems = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
    );
    const openCart = useUIStore((state) => state.openCart);

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

    return (
        <>

            <button
                data-cart-target="floating"
                onClick={(e) => {
                    e.stopPropagation();
                    openCart();
                }}
                className={`fixed right-5 bottom-10 z-10 flex h-12 cursor-pointer items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary transition-all duration-300 hover:-translate-y-0.5 md:bottom-14 md:hidden ${
                    !isVisible ? "pointer-events-none translate-y-4 opacity-0" : ""
                }`}
            >
                {!totalItems ? <Handbag size={18}/> : <span>{totalItems}</span>}
                Корзина
            </button>
        </>
    );
}

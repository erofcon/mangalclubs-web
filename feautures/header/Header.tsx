"use client";

import {useEffect, useState} from "react";
import {Menu, X} from "lucide-react";
import {TopNav} from "@/feautures/header/TopNav";
import {Logo} from "@/feautures/header/Logo";
import {DeliverySelector} from "@/feautures/header/DeliverySelector";
import {LoginButton} from "@/feautures/header/LoginButton";
import {MobileMenu} from "@/feautures/header/MobileMenu";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

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
        <header className="mb-8 mx-auto w-full max-w-374 px-1 md:px-7">
            <TopNav/>

            <div className="mx-auto flex items-end justify-between max-md:hidden">
                <div className="flex gap-6 items-end">
                    <Logo size="desktop"/>
                    <DeliverySelector/>
                </div>
                <div className="flex gap-4">
                    <LoginButton/>
                </div>
            </div>

            <div className="relative z-60 flex h-15 items-end justify-between px-4 pt-2 mb-2 md:hidden">
                <Logo size="mobile"/>
                <button
                    type="button"
                    aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
                    onClick={() => setIsOpen((value) => !value)}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-text"/>
                    ) : (
                        <Menu className="h-6 w-6 text-text"/>
                    )}
                </button>
            </div>

            <div className="block md:hidden">
                <DeliverySelector/>
            </div>

            <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </header>
    );
}

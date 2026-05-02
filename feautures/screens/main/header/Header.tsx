"use client";

import {useState} from "react";
import {Menu} from "lucide-react";
import {TopNav} from "@/feautures/screens/main/header/TopNav";
import {Logo} from "@/feautures/screens/main/header/Logo";
import {DeliverySelector} from "@/feautures/screens/main/header/DeliverySelector";
import {LoginButton} from "@/feautures/screens/main/header/LoginButton";
import {MobileMenu} from "@/feautures/screens/main/header/MobileMenu";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="mb-8 mx-auto w-full max-w-374 px-7">
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

            <div className="flex h-15 items-end justify-between px-4 pt-2 mb-2 md:hidden">
                <Logo size="mobile"/>
                <button aria-label="menu" onClick={() => setIsOpen(true)}>
                    <Menu className="h-6 w-6 text-text"/>
                </button>
            </div>

            <div className="block md:hidden">
                <DeliverySelector/>
            </div>

            <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </header>
    );
}

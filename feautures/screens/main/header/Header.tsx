"use client";

import {useState} from "react";
import HeaderLinks from "./HeaderLinks";
import {MenuItems} from "./MenuItems";
import {DeliveryInfo} from "./DeliveryInfo";
import {MobileMenu} from "@/feautures/screens/main/header/MobileMenu";


export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            <div className="hidden md:block mt-2">
                <HeaderLinks/>
            </div>

            <div className="mt-4">
                <MenuItems isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>

            {/* MOBILE DeliveryInfo */}
            <div className="block md:hidden">
                <DeliveryInfo/>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <MobileMenu/>
            )}
        </header>
    );
}
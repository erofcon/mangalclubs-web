"use client";

import Link from "next/link";
import {LogIn} from "lucide-react";
import {topLinks} from "@/utils/constants";
import {useUIStore} from "@/store/ui-store";

type MobileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MobileMenu({isOpen, onClose}: MobileMenuProps) {
    const openAuthModal = useUIStore((state) => state.openAuthModal);

    const handleLoginClick = () => {
        onClose();
        openAuthModal();
    };

    return (
        <div
            className={`fixed left-0 right-0 top-20 bottom-0 z-50 overflow-y-auto bg-background transition-transform duration-300 md:hidden ${
                isOpen
                    ? "translate-x-0 pointer-events-auto"
                    : "-translate-x-full pointer-events-none"
            }`}
        >
            <nav className="divide-y divide-zinc-900 text-text">
                <button
                    type="button"
                    onClick={handleLoginClick}
                    className="flex min-h-11 w-full items-center justify-start gap-2 px-5 text-left"
                >
                    <LogIn className="w-4"/>
                    <span className="text-sm">Войти</span>
                </button>

                {topLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        onClick={onClose}
                        className="flex min-h-11 items-center justify-start gap-2 px-5"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

"use client";

import Link from "next/link";
import { LogIn, X } from "lucide-react";
import { Logo } from "@/feautures/screens/main/header/Logo";
import { topLinks } from "@/utils/constants";
import { useUIStore } from "@/store/ui-store";

type MobileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const openAuthModal = useUIStore((state) => state.openAuthModal);

    const handleLoginClick = () => {
        onClose();
        openAuthModal();
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black transition-transform duration-300 md:hidden ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="mb-4 flex h-15 items-center justify-between px-4 pt-2">
                <Logo size="mobile" />

                <button type="button" aria-label="Закрыть меню" onClick={onClose}>
                    <X className="h-6 w-6 text-text" />
                </button>
            </div>

            <nav className="divide-y divide-zinc-900 text-text">
                <button
                    type="button"
                    onClick={handleLoginClick}
                    className="flex min-h-11 w-full items-center justify-start gap-2 px-5 text-left"
                >
                    <LogIn className="w-4" />
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

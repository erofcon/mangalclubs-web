"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {topLinks} from "@/utils/constants";
import {useUIStore} from "@/store/ui-store";
import {useAuthStore} from "@/store/auth-store";

type MobileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MobileMenu({isOpen, onClose}: MobileMenuProps) {
    const openAuthModal = useUIStore((state) => state.openAuthModal);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    const handleProfileClick = () => {
        onClose();

        if (isAuthenticated) {
            router.push("/personal");
            return;
        }

        openAuthModal();
    };

    return (
        <div
            className={`fixed inset-x-0 bottom-0 top-23.75 z-40 overflow-y-auto border-t
            border-border/50 font-normal tracking-wider bg-background px-5 py-5 text-text transition-transform duration-300 md:hidden ${
                isOpen
                    ? "translate-x-0 pointer-events-auto"
                    : "-translate-x-full pointer-events-none"
            }`}
        >
            <nav className="flex flex-col gap-1">
                <button
                    type="button"
                    onClick={handleProfileClick}
                    className="flex min-h-12 w-full items-center gap-3 rounded-lg px-2 text-left text-[15px]"
                >
                    {isAuthenticated ? "Профиль" : "Войти"}
                </button>

                {topLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        onClick={onClose}
                        className="flex min-h-12 items-center rounded-lg px-2 text-[15px] transition"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {UserRound} from "lucide-react";
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
            className={`fixed inset-x-0 bottom-0 top-[112px] z-40 overflow-y-auto border-t border-[#211c17] bg-[#070808] px-5 py-5 text-[#f5efe5] transition-transform duration-300 md:hidden ${
                isOpen
                    ? "translate-x-0 pointer-events-auto"
                    : "-translate-x-full pointer-events-none"
            }`}
        >
            <nav className="flex flex-col gap-1">
                <button
                    type="button"
                    onClick={handleProfileClick}
                    className="flex min-h-12 w-full items-center gap-3 rounded-[8px] px-2 text-left text-[15px] transition hover:bg-white/[0.04]"
                >
                    <UserRound className="h-4 w-4 text-[#c99a55]"/>
                    {isAuthenticated ? "Профиль" : "Войти"}
                </button>

                {topLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        onClick={onClose}
                        className="flex min-h-12 items-center rounded-[8px] px-2 text-[15px] transition hover:bg-white/[0.04] hover:text-[#c99a55]"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

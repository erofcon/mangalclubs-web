"use client";

import { LogIn } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export function LoginButton() {
    const openAuthModal = useUIStore((state) => state.openAuthModal);

    return (
        <button
            type="button"
            onClick={openAuthModal}
            className="shrink-0 cursor-pointer items-center gap-4 rounded-full border border-border bg-card px-5 py-2 font-semibold text-text duration-300 hover:scale-105 hover:opacity-90 md:flex"
        >
            <LogIn className="w-5" />
            Войти
        </button>
    );
}

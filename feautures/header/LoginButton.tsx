"use client";

import {useRouter} from "next/navigation";
import {UserRound} from "lucide-react";
import {useAuthStore} from "@/store/auth-store";
import {useUIStore} from "@/store/ui-store";

export function LoginButton() {
    const openAuthModal = useUIStore((state) => state.openAuthModal);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const router = useRouter();

    return (
        <button
            type="button"
            onClick={isAuthenticated ? () => router.push("/personal") : openAuthModal}
            className="inline-flex h-10 shrink-0 cursor-pointer
            items-center gap-2.5 rounded-[5px]
            border border-border px-5 text-[13px] font-medium
            text-text transition duration-300 hover:border-primary hover:scale-102"
        >
            <UserRound className="h-4 w-4"/>
            {isAuthenticated ? "Профиль" : "Войти"}
        </button>
    );
}

"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {UserRound} from "lucide-react";
import {useAuthStore} from "@/store/auth-store";
import {useUIStore} from "@/store/ui-store";
import {useNotificationStore} from "@/store/notification-store";

const HEADER_NOTIFICATIONS_POLL_INTERVAL_MS = 30_000;

export function LoginButton() {
    const openAuthModal = useUIStore((state) => state.openAuthModal);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const accessToken = useAuthStore((state) => state.accessToken);
    const unreadNotificationsCount = useNotificationStore((state) => state.unreadNotifications.length);
    const loadUnreadNotifications = useNotificationStore((state) => state.loadUnreadNotifications);
    const clearUnreadNotifications = useNotificationStore((state) => state.clearUnreadNotifications);

    const router = useRouter();

    useEffect(() => {
        if (!accessToken || !isAuthenticated) {
            clearUnreadNotifications();
            return;
        }

        void loadUnreadNotifications(accessToken).catch(() => undefined);

        const intervalId = window.setInterval(() => {
            void loadUnreadNotifications(accessToken).catch(() => undefined);
        }, HEADER_NOTIFICATIONS_POLL_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [accessToken, isAuthenticated, clearUnreadNotifications, loadUnreadNotifications]);

    return (
        <button
            type="button"
            onClick={isAuthenticated ? () => router.push("/personal") : openAuthModal}
            className={[
                "relative inline-flex h-10 shrink-0 cursor-pointer",
                "items-center gap-2.5 rounded-[5px]",
                "border px-5 text-[13px] font-normal tracking-wider",
                "text-text transition duration-300 hover:scale-102",
                isAuthenticated && unreadNotificationsCount > 0
                    ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(236,172,24,0.18)] hover:border-primary"
                    : "border-border hover:border-primary",
            ].join(" ")}
        >
            <UserRound className="h-4 w-4"/>
            {isAuthenticated ? "Профиль" : "Войти"}
            {isAuthenticated && unreadNotificationsCount > 0 && (
                <span
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-on-primary"
                >
                    {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                </span>
            )}
        </button>
    );
}

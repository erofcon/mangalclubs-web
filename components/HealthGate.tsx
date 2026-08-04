"use client";

import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {AlertTriangle, RefreshCcw} from "lucide-react";
import {useAppDataStore} from "@/store/app-data-store";

type HealthStatus = "checking" | "ready" | "error";
type HealthResponse = { status?: string };
type HealthGateProps = { children: ReactNode };

const HEALTH_CHECK_CACHE_KEY = "mangalclubs-health-ready-at";
const HEALTH_CHECK_CACHE_TTL_MS = 5 * 60 * 1000;

const hasRecentSuccessfulHealthCheck = () => {
    if (typeof window === "undefined") return false;

    try {
        const readyAt = Number(window.sessionStorage.getItem(HEALTH_CHECK_CACHE_KEY));
        return Number.isFinite(readyAt) && Date.now() - readyAt < HEALTH_CHECK_CACHE_TTL_MS;
    } catch {
        return false;
    }
};

const rememberSuccessfulHealthCheck = () => {
    try {
        window.sessionStorage.setItem(HEALTH_CHECK_CACHE_KEY, String(Date.now()));
    } catch {
        // The health check still works when browser storage is unavailable.
    }
};

const requestHealth = async (signal: AbortSignal) => {
    const response = await fetch("/health", {cache: "no-store", signal});

    if (!response.ok) {
        throw new Error(`Сервер ответил со статусом ${response.status}`);
    }

    const data = await response.json() as HealthResponse;

    if (data.status !== "ok") {
        throw new Error("Сервис временно недоступен");
    }
};

/**
 * Health checks must not hide the page: otherwise crawlers only receive a
 * loading screen instead of the content they should index.
 */
export function HealthGate({children}: HealthGateProps) {
    const [status, setStatus] = useState<HealthStatus>("checking");
    const [errorMessage, setErrorMessage] = useState("");
    const initializeAppData = useAppDataStore((state) => state.initialize);
    const activeCheckRef = useRef<AbortController | null>(null);

    const checkHealth = useCallback(async () => {
        activeCheckRef.current?.abort();
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 12000);
        activeCheckRef.current = controller;
        setStatus("checking");
        setErrorMessage("");

        try {
            await requestHealth(controller.signal);
            if (activeCheckRef.current !== controller) return;

            rememberSuccessfulHealthCheck();
            setStatus("ready");
            await initializeAppData(controller.signal).catch(() => undefined);
        } catch (error) {
            if (activeCheckRef.current !== controller) return;

            setStatus("error");
            setErrorMessage(
                error instanceof Error && error.name === "AbortError"
                    ? "Сервер не ответил вовремя"
                    : error instanceof Error
                        ? error.message
                        : "Не удалось проверить доступность сервиса",
            );
        } finally {
            window.clearTimeout(timeoutId);
            if (activeCheckRef.current === controller) activeCheckRef.current = null;
        }
    }, [initializeAppData]);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            void checkHealth();
        }, 0);

        return () => {
            window.clearTimeout(timerId);
            activeCheckRef.current?.abort();
        };
    }, [checkHealth]);

    useEffect(() => {
        const restoreOrRecheck = () => {
            if (hasRecentSuccessfulHealthCheck()) {
                setStatus("ready");
                return;
            }
            void checkHealth();
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) restoreOrRecheck();
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") restoreOrRecheck();
        };

        window.addEventListener("pageshow", handlePageShow);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener("pageshow", handlePageShow);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [checkHealth]);

    return (
        <>
            {children}
            {status === "error" && (
                <div role="alert" className="fixed inset-x-5 bottom-5 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-[8px] border border-border bg-[#090a0a] p-4 text-text shadow-2xl sm:inset-x-auto sm:right-5">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-primary"/>
                    <p className="min-w-0 flex-1 text-sm leading-5 text-text/80">
                        {errorMessage || "Сервис временно недоступен"}
                    </p>
                    <button type="button" onClick={checkHealth} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[6px] bg-primary px-3 text-sm font-semibold text-on-primary transition hover:bg-hover">
                        <RefreshCcw className="h-4 w-4"/>
                        Повторить
                    </button>
                </div>
            )}
        </>
    );
}

"use client";

import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {AlertTriangle, LoaderCircle, RefreshCcw} from "lucide-react";
import {useAppDataStore} from "@/store/app-data-store";

type HealthStatus = "checking" | "ready" | "error";

type HealthResponse = {
    status?: string;
};

type HealthGateProps = {
    children: ReactNode;
};

const HEALTH_CHECK_CACHE_KEY = "mangalclubs-health-ready-at";
const HEALTH_CHECK_CACHE_TTL_MS = 5 * 60 * 1000;

const getHealthUrl = () => {
    return "/health";
};

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
        // The health gate still works without the short-lived browser cache.
    }
};

const requestHealth = async (signal: AbortSignal) => {
    const response = await fetch(getHealthUrl(), {
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new Error(`Сервер ответил статусом ${response.status}`);
    }

    const data = (await response.json()) as HealthResponse;

    if (data.status !== "ok") {
        throw new Error("Сервис временно недоступен");
    }
};

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

            if (activeCheckRef.current !== controller) {
                return;
            }

            rememberSuccessfulHealthCheck();
            setStatus("ready");

            await initializeAppData(controller.signal).catch(() => {
                // App data errors are stored in app-data-store and should not keep the health gate open.
            });
        } catch (error) {
            if (activeCheckRef.current !== controller) {
                return;
            }

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

            if (activeCheckRef.current === controller) {
                activeCheckRef.current = null;
            }
        }
    }, [initializeAppData]);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 12000);
        const hasRecentSuccessfulCheck = hasRecentSuccessfulHealthCheck();
        const shouldBlockRender = !hasRecentSuccessfulCheck;
        let isActive = true;

        const runInitialHealthCheck = async () => {
            if (hasRecentSuccessfulCheck) {
                setStatus("ready");
            } else {
                setStatus("checking");
            }

            try {
                await requestHealth(controller.signal);

                if (isActive) {
                    rememberSuccessfulHealthCheck();
                    setStatus("ready");
                }

                await initializeAppData(controller.signal).catch(() => {
                    // App data errors are stored in app-data-store and should not keep the health gate open.
                });
            } catch (error) {
                if (isActive && shouldBlockRender) {
                    setStatus("error");
                    setErrorMessage(
                        error instanceof Error && error.name === "AbortError"
                            ? "Сервер не ответил вовремя"
                            : error instanceof Error
                                ? error.message
                                : "Не удалось проверить доступность сервиса",
                    );
                }
            } finally {
                window.clearTimeout(timeoutId);
            }
        };

        void runInitialHealthCheck();

        return () => {
            isActive = false;
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [initializeAppData]);

    useEffect(() => {
        const restoreOrRecheck = () => {
            if (hasRecentSuccessfulHealthCheck()) {
                setStatus("ready");
                return;
            }

            void checkHealth();
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                restoreOrRecheck();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                restoreOrRecheck();
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
            document.removeEventListener("visibilitychange", handleVisibilityChange);

            const activeCheck = activeCheckRef.current;

            activeCheckRef.current = null;
            activeCheck?.abort();
        };
    }, [checkHealth]);

    if (status === "ready") {
        return children;
    }

    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-5 text-text">
            <div className="w-full max-w-md rounded-[8px] border border-border bg-[#090a0a] px-6 py-8 text-center">
                {status === "checking" ? (
                    <>
                        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-primary"/>
                        <h1 className="mt-5 text-[24px] font-normal leading-tight">
                            Проверяем доступность сервиса
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-text/68">
                            Подождите немного, сайт скоро откроется.
                        </p>
                    </>
                ) : (
                    <>
                        <AlertTriangle className="mx-auto h-10 w-10 text-primary"/>
                        <h1 className="mt-5 text-[24px] font-normal leading-tight">
                            Не удалось открыть сайт
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-text/68">
                            {errorMessage || "Сервис временно недоступен"}
                        </p>
                        <button
                            type="button"
                            onClick={checkHealth}
                            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-primary px-5 text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                        >
                            <RefreshCcw className="h-4 w-4"/>
                            Повторить
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}

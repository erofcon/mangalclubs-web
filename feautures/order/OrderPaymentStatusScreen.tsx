"use client";

import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AlertCircle, CheckCircle2, Clock3, LoaderCircle, RefreshCw, ShoppingBag} from "lucide-react";
import {useAuthStore} from "@/store/auth-store";
import {useCartStore} from "@/store/cart-store";
import {useUIStore} from "@/store/ui-store";
import {
    getOrderStatus,
    LAST_ORDER_ID_STORAGE_KEY,
    type OrderStatusOut,
} from "@/utils/orders";
import {
    getCreationStatusDescriptor,
    getOrderStatusDescriptor,
    getPaymentStatusDescriptor,
    isFailedPaymentStatus,
    type StatusTone,
} from "@/utils/order-status";

type PaymentReturnResult = "success" | "fail";

type OrderPaymentStatusScreenProps = {
    result: PaymentReturnResult;
};

const POLLING_INTERVAL_MS = 3000;

const getStoredOrderId = () => {
    if (typeof window === "undefined") return "";

    return window.localStorage.getItem(LAST_ORDER_ID_STORAGE_KEY) ?? "";
};

const isPaid = (status: OrderStatusOut | null) => status?.paymentStatus === "paid";

const isOrderSuccessful = (status: OrderStatusOut | null) => (
    Boolean(status) &&
    isPaid(status) &&
    (Boolean(status?.iikoOrderId) || status?.creationStatus === "Success")
);

const isPaymentFailed = (status: OrderStatusOut | null) => (
    isFailedPaymentStatus(status?.paymentStatus)
);

const formatAmount = (status: OrderStatusOut | null) => {
    const rubles = typeof status?.paymentAmountKopecks === "number"
        ? status.paymentAmountKopecks / 100
        : status?.totalSum ?? status?.sum;

    if (typeof rubles !== "number") return null;

    return `${rubles.toLocaleString("ru-RU")} ₽`;
};

const getStatusCopy = (status: OrderStatusOut | null, result: PaymentReturnResult, error: string) => {
    if (error) {
        return {
            tone: "error" as const,
            icon: AlertCircle,
            title: "Не удалось обновить статус",
            text: error,
        };
    }

    if (isOrderSuccessful(status)) {
        return {
            tone: "success" as const,
            icon: CheckCircle2,
            title: "Заказ оформлен",
            text: "Оплата получена, заказ передан в ресторан.",
        };
    }

    if (isPaymentFailed(status)) {
        return {
            tone: "error" as const,
            icon: AlertCircle,
            title: "Оплата не прошла",
            text: "Платеж отменен, не завершен или истекло время оплаты.",
        };
    }

    if (isPaid(status) && status?.creationStatus === "IikoCreateFailed") {
        return {
            tone: "progress" as const,
            icon: RefreshCw,
            title: "Оплата получена",
            text: "Заказ обрабатывается. Мы уже передаем его в ресторан.",
        };
    }

    if (isPaid(status)) {
        return {
            tone: "progress" as const,
            icon: RefreshCw,
            title: "Оплата получена",
            text: "Передаем заказ в ресторан.",
        };
    }

    return {
        tone: result === "fail" ? "error" as const : "progress" as const,
        icon: result === "fail" ? AlertCircle : Clock3,
        title: result === "fail" ? "Проверяем оплату" : "Ожидаем оплату",
        text: "Обновляем статус заказа и оплаты.",
    };
};

export function OrderPaymentStatusScreen({result}: OrderPaymentStatusScreenProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const openAuthModal = useUIStore((state) => state.openAuthModal);
    const openCart = useUIStore((state) => state.openCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const hasClearedCart = useRef(false);

    // Browser-persisted auth and order data are unavailable during SSR.
    // Read them after hydration so the initial server/client markup matches.
    const [isHydrated, setIsHydrated] = useState(false);
    const [storedOrderId, setStoredOrderId] = useState("");
    const [status, setStatus] = useState<OrderStatusOut | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const orderId = searchParams.get("orderId") || storedOrderId;
    const renderedIsAuthenticated = isHydrated && isAuthenticated;

    useEffect(() => {
        const hydrationTimer = window.setTimeout(() => {
            setStoredOrderId(getStoredOrderId());
            setIsHydrated(true);
        }, 0);

        return () => window.clearTimeout(hydrationTimer);
    }, []);

    const loadStatus = useCallback(async () => {
        if (!orderId || !accessToken) return null;

        setError("");
        setIsLoading(true);

        try {
            const nextStatus = await getOrderStatus(orderId, accessToken);

            setStatus(nextStatus);
            return nextStatus;
        } catch (nextError) {
            setError(nextError instanceof Error ? nextError.message : "Статус заказа пока недоступен.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, orderId]);

    useEffect(() => {
        if (!orderId || !accessToken) {
            return;
        }

        let interval: ReturnType<typeof setInterval> | null = null;

        const loadAndMaybeStop = async () => {
            const nextStatus = await loadStatus();

            if ((isOrderSuccessful(nextStatus) || isPaymentFailed(nextStatus)) && interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        void loadAndMaybeStop();
        interval = setInterval(loadAndMaybeStop, POLLING_INTERVAL_MS);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [accessToken, loadStatus, orderId]);

    useEffect(() => {
        if ((result === "success" || isPaid(status) || isOrderSuccessful(status)) && !hasClearedCart.current) {
            clearCart();
            hasClearedCart.current = true;
        }
    }, [clearCart, result, status]);

    const copy = useMemo(() => getStatusCopy(status, result, error), [error, result, status]);
    const amount = formatAmount(status);
    const paymentDescriptor = status?.paymentStatus
        ? getPaymentStatusDescriptor(status.paymentStatus)
        : {label: "Проверяем", tone: "progress" as const};
    const orderDescriptor = status?.orderStatus
        ? getOrderStatusDescriptor(status.orderStatus)
        : status?.creationStatus
            ? getCreationStatusDescriptor(status.creationStatus)
            : {label: "Ожидаем", tone: "progress" as const};
    const Icon = copy.icon;
    const isProgress = copy.tone === "progress" && !isPaymentFailed(status) && !isOrderSuccessful(status);
    const publicOrderNumber = status?.publicNumber || "";

    const handleReturnToCart = () => {
        router.push("/");
        window.setTimeout(openCart, 0);
    };

    return (
        <main className="min-h-screen bg-background text-text">
            <section className="mx-auto flex w-full max-w-[760px] flex-col px-5 py-14 sm:px-6 lg:px-0 lg:py-20">
                <div className="border-t border-border/70 pt-8">
                    <span
                        className={[
                            "flex h-16 w-16 items-center justify-center rounded-[8px] border",
                            copy.tone === "error"
                                ? "border-red-500/45 bg-red-500/10 text-red-200"
                                : "border-primary/55 bg-primary/10 text-primary",
                        ].join(" ")}
                    >
                        {isLoading || isProgress ? (
                            <LoaderCircle className="h-8 w-8 animate-spin" strokeWidth={1.6}/>
                        ) : (
                            <Icon className="h-8 w-8" strokeWidth={1.6}/>
                        )}
                    </span>

                    <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                        Оплата заказа
                    </p>
                    <h1 className="mt-3 text-[42px] font-normal leading-tight text-text sm:text-[58px]">
                        {copy.title}
                    </h1>
                    <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                        {copy.text}
                    </p>

                    <div className="mt-8 grid gap-3 rounded-[8px] border border-border/70 bg-black/15 px-5 py-5 text-sm leading-6 sm:grid-cols-2">
                        <StatusMeta label="Номер заказа" value={publicOrderNumber || "Уточняется"}/>
                        <StatusMeta
                            label="Статус оплаты"
                            value={paymentDescriptor.label}
                            tone={paymentDescriptor.tone}
                        />
                        <StatusMeta
                            label="Статус заказа"
                            value={orderDescriptor.label}
                            tone={orderDescriptor.tone}
                        />
                        <StatusMeta label="Сумма" value={amount ?? "Уточняется"}/>
                    </div>

                    {!orderId && (
                        <div className="mt-5 rounded-[6px] border border-red-500/45 bg-red-500/10 px-4 py-3 text-sm font-medium leading-6 text-red-100">
                            Не нашли данные заказа. Вернитесь в корзину и попробуйте оформить заказ еще раз.
                        </div>
                    )}

                    {orderId && isHydrated && !renderedIsAuthenticated && (
                        <div className="mt-5 rounded-[6px] border border-primary/45 bg-primary/10 px-4 py-3 text-sm font-medium leading-6 text-text">
                            Войдите в аккаунт, чтобы проверить статус заказа.
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {isPaymentFailed(status) ? (
                            <button
                                type="button"
                                onClick={handleReturnToCart}
                                className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                            >
                                <ShoppingBag className="h-4 w-4" strokeWidth={1.8}/>
                                Вернуться в корзину
                            </button>
                        ) : (
                            <Link
                                href="/personal"
                                className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                            >
                                <CheckCircle2 className="h-4 w-4" strokeWidth={1.8}/>
                                Открыть заказы
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={renderedIsAuthenticated ? () => void loadStatus() : openAuthModal}
                            disabled={renderedIsAuthenticated && isLoading}
                            className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] border border-border/70 px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-border/70 disabled:hover:text-text"
                        >
                            {isLoading ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8}/>
                            ) : (
                                <RefreshCw className="h-4 w-4" strokeWidth={1.8}/>
                            )}
                            {renderedIsAuthenticated ? "Обновить статус" : "Войти"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

type StatusMetaProps = {
    label: string;
    value: string;
    tone?: StatusTone;
};

const statusBadgeClasses: Record<StatusTone, string> = {
    success: "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
    progress: "border-primary/45 bg-primary/12 text-primary",
    warning: "border-amber-400/35 bg-amber-500/12 text-amber-100",
    danger: "border-red-500/45 bg-red-500/12 text-red-100",
    muted: "border-border/70 bg-white/[0.04] text-text/78",
};

function StatusMeta({label, value, tone}: StatusMetaProps) {
    return (
        <div className="min-w-0">
            <span className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                {label}
            </span>
            {tone ? (
                <span className={`mt-2 inline-flex max-w-full rounded-[6px] border px-3 py-1.5 font-semibold ${statusBadgeClasses[tone]}`}>
                    <span className="wrap-break-word">{value}</span>
                </span>
            ) : (
                <span className="mt-2 block wrap-break-word font-semibold text-text">
                    {value}
                </span>
            )}
        </div>
    );
}

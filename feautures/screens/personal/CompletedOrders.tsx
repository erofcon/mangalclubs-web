"use client";

import {type ReactNode} from "react";
import {ArrowRight, ClipboardCheck, X} from "lucide-react";
import {useUIStore} from "@/store/ui-store";

const orders = [
    {
        id: "W893-canceled",
        number: "W893",
        total: "1 079.99 ₽",
        date: "22.03.2026 21:14",
        status: "Отменен",
        tone: "muted",
        icon: <X className="h-5 w-5" strokeWidth={1.8}/>,
    },
    {
        id: "W893-done",
        number: "W893",
        total: "1 079.99 ₽",
        date: "22.03.2026 21:14",
        status: "Выполнено",
        tone: "primary",
        icon: <ClipboardCheck className="h-5 w-5" strokeWidth={1.8}/>,
    },
];

export function CompletedOrders() {
    const openShowOrderModal = useUIStore((state) => state.openShowOrderModal);

    return (
        <section className="overflow-hidden rounded-[8px] border border-border/70 text-text">
            <div className="border-b border-border/55 px-5 py-5 sm:px-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                    История
                </p>
                <h2
                    className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                >
                    Завершенные заказы
                </h2>
            </div>

            <div>
                {orders.map((order) => (
                    <OrderRow
                        key={order.id}
                        icon={order.icon}
                        number={order.number}
                        total={order.total}
                        date={order.date}
                        status={order.status}
                        tone={order.tone}
                        onClick={openShowOrderModal}
                    />
                ))}
            </div>
        </section>
    );
}

type OrderRowProps = {
    icon: ReactNode;
    number: string;
    total: string;
    date: string;
    status: string;
    tone: string;
    onClick: () => void;
};

function OrderRow({icon, number, total, date, status, tone, onClick}: OrderRowProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border/45 px-5 py-4 text-left transition duration-300 last:border-b-0 hover:bg-black/20 sm:px-6"
        >
            <span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border/70 text-primary transition duration-300 group-hover:border-primary">
                {icon}
            </span>

            <span className="min-w-0">
                <span className="block text-[12px] leading-none text-text/58">
                    В ресторане
                </span>
                <span className="mt-2 block wrap-break-word text-[15px] font-semibold leading-6 text-text">
                    Заказ {number} на {total}
                    <span className={tone === "primary" ? "ml-2 text-primary" : "ml-2 text-text/52"}>
                        {status}
                    </span>
                </span>
                <span className="mt-1 block text-[12px] text-text/55">
                    {date}
                </span>
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border/70 text-primary transition duration-300 group-hover:translate-x-0.5 group-hover:border-primary">
                <ArrowRight className="h-4 w-4" strokeWidth={1.8}/>
            </span>
        </button>
    );
}

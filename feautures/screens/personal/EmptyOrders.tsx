import Link from "next/link";
import {ArrowRight, Beef} from "lucide-react";

export function EmptyOrders() {
    return (
        <section className="overflow-hidden rounded-[8px] border border-border/70 text-text">
            <div className="px-5 py-5 sm:px-6 sm:py-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Сейчас
                </p>
                <h2
                    className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                >
                    Активные заказы
                </h2>
                <p className="mt-4 max-w-[520px] text-[14px] leading-6 text-text/68">
                    Когда появится новый заказ, его статус можно будет отслеживать здесь.
                </p>

                <Link
                    href="/#menu-99"
                    className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                >
                    <Beef className="h-5 w-5" strokeWidth={1.8}/>
                    Перейти в меню
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8}/>
                </Link>
            </div>
        </section>
    );
}

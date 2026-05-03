import {ArrowRight, X, ClipboardCheck} from 'lucide-react';

export function CompletedOrders() {
    return (
        <section
            className="
                flex flex-col gap-3
                bg-card rounded-2xl
                p-3 sm:p-4
                text-text
                w-full
            "
        >
            <h1 className="text-xl sm:text-2xl font-bold">
                Завершённые заказы
            </h1>

            <button
                type="button"
                className="
                    group
                    w-full
                    flex items-center gap-3
                    p-3 sm:p-4
                    bg-background rounded-2xl
                    text-left
                    cursor-pointer
                    transition-transform duration-200
                    hover:scale-[1.01]
                    active:scale-[0.99]
                "
            >
                <div
                    className="
                        shrink-0
                        p-2
                        bg-card rounded-full
                    "
                >
                    <X className="size-5 sm:size-8"/>
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-text/80">
                        В ресторане
                    </span>

                    <div
                        className="
                            flex flex-col
                            xs:flex-row xs:flex-wrap
                            gap-1 xs:gap-2
                        "
                    >
                        <span
                            className="
                                font-bold
                                text-sm sm:text-base
                                leading-snug
                                wrap-break-word
                            "
                        >
                            Заказ W893 на 1079.99
                             <span
                                 className="
                                text-accent font-bold ms-2
                            "
                             >
                            Отменен
                        </span>
                        </span>


                    </div>

                    <span className="text-xs font-semibold text-text/70">
                        22.03.2026 21:14
                    </span>
                </div>

                <div
                    className="
                        shrink-0
                        bg-card p-2 rounded-full
                        transition-transform duration-200
                        group-hover:translate-x-0.5
                    "
                >
                    <ArrowRight className="size-5 sm:size-6"/>
                </div>
            </button>

            <button
                type="button"
                className="
                    group
                    w-full
                    flex items-center gap-3
                    p-3 sm:p-4
                    bg-background rounded-2xl
                    text-left
                    cursor-pointer
                    transition-transform duration-200
                    hover:scale-[1.01]
                    active:scale-[0.99]
                "
            >
                <div
                    className="
                        shrink-0
                        p-2
                        bg-card rounded-full
                    "
                >
                    <ClipboardCheck className="size-5 sm:size-8"/>
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-text/80">
                        В ресторане
                    </span>

                    <div
                        className="
                            flex flex-col
                            xs:flex-row xs:flex-wrap
                            gap-1 xs:gap-2
                        "
                    >
                        <span
                            className="
                                font-bold
                                text-sm sm:text-base
                                leading-snug
                                wrap-break-word
                            "
                        >
                            Заказ W893 на 1079.99
                             <span
                                 className="
                                text-success font-bold ms-2
                            "
                             >
                            Выполнено
                        </span>
                        </span>


                    </div>

                    <span className="text-xs font-semibold text-text/70">
                        22.03.2026 21:14
                    </span>
                </div>

                <div
                    className="
                        shrink-0
                        bg-card p-2 rounded-full
                        transition-transform duration-200
                        group-hover:translate-x-0.5
                    "
                >
                    <ArrowRight className="size-5 sm:size-6"/>
                </div>
            </button>
        </section>
    );
}
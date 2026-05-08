import {Beef} from "lucide-react";


export function EmptyOrders() {
    return (
        <div className="
                            flex flex-col gap-2
                            rounded-[8px] border border-border p-4
                            text-text items-center md:items-start
                            "
        >
            <h1
                className="text-[28px] font-normal leading-tight"
                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
            >
                Активные заказы
            </h1>
            <span className="font-semibold text-text/60">
                                    Ты можешь сделать заказ и отслеживать его статус здесь
                                </span>
            <button
                type="button"
                className="bg-primary
                                    cursor-pointer px-5 h-12 rounded-[6px] mt-8 flex gap-3 items-center text-sm font-semibold text-on-primary
                                    transition duration-300 hover:-translate-y-0.5
                                    "
            >
                <Beef size={28}/>
                <span className="font-semibold">Перейти в меню</span>
            </button>
        </div>
    )
}

import {Beef} from "lucide-react";


export function EmptyOrders() {
    return (
        <div className="
                            flex flex-col gap-2
                            bg-card rounded-2xl p-4
                            text-text items-center md:items-start
                            "
        >
            <h1 className="text-2xl font-bold">Активные заказы</h1>
            <span className="text-text-secondary font-semibold">
                                    Ты можешь сделать заказ и отслеживать его статус здесь
                                </span>
            <button
                type="button"
                className="bg-background border
                                    border-border cursor-pointer p-4 rounded-full mt-8 flex gap-3 items-center
                                    hover:scale-105 duration-300
                                    "
            >
                <Beef size={28}/>
                <span className="font-semibold">Перейти в меню</span>
            </button>
        </div>
    )
}
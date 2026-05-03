"use client";

import {useState} from "react";

import {
    Cake,
    LogOut,
    Mail,
    Pencil,
    Phone,
    Plus,
    Trash2,
    User,
    Beef,
} from "lucide-react";
import {EmptyOrders} from "@/feautures/screens/personal/EmptyOrders";
import {CompletedOrders} from "@/feautures/screens/personal/CompletedOrders";
import {ShowOrderModal} from "@/feautures/screens/personal/modals/ShowOrderModal";

export function PersonalScreen() {

    const [activeTab, setActiveTab] = useState<"info" | "orders">("info");


    const activeTabClass = "bg-text text-text-on-primary";
    const inactiveTabClass = "bg-card text-text";


    return (
        <>
            <main className="min-h-screen w-full overflow-x-hidden px-4 pt-6 sm:px-7 sm:pt-10">
                <div className="mx-auto grid w-full max-w-270 gap-6 lg:grid-cols-[minmax(0,1fr)_190px] lg:gap-12">
                    <div className="min-w-0 space-y-5">

                        {activeTab === "info" ? (
                            <section
                                className="relative overflow-hidden rounded-xl bg-card px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8">
                                <button
                                    type="button"
                                    aria-label="Редактировать профиль"
                                    className="absolute right-4 top-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-text duration-200 hover:scale-110 sm:right-7 sm:top-7 cursor-pointer"
                                >
                                    <Pencil size={17} strokeWidth={3}/>
                                </button>

                                <div className="flex min-w-0 flex-col gap-5 sm:gap-6 md:flex-row md:items-center">
                                    <div
                                        className="relative h-28 w-28 shrink-0 rounded-full bg-background sm:h-37.5 sm:w-37.5">
                                        <div className="flex h-full w-full items-center justify-center text-text">
                                            <User
                                                size={58}
                                                strokeWidth={1.8}
                                                fill="currentColor"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            aria-label="Добавить фото"
                                            className="absolute bottom-1 right-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-text duration-200 hover:scale-110 cursor-pointer"
                                        >
                                            <Plus size={20} strokeWidth={3}/>
                                        </button>
                                    </div>

                                    <div className="min-w-0 pr-12 pt-1 md:pr-0">
                                        <h1 className="mb-5 max-w-full wrap-break-word text-[22px] font-extrabold leading-tight text-text sm:mb-6 sm:text-[24px]">
                                            Имя
                                        </h1>

                                        <div
                                            className="space-y-3 text-base font-semibold text-text sm:space-y-4 sm:text-[18px]">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Cake className="shrink-0" size={24}/>
                                                <span className="min-w-0 wrap-break-word">
                                            Дата рождения
                                        </span>
                                            </div>

                                            <div className="flex min-w-0 items-center gap-3">
                                                <Phone className="shrink-0" size={26}/>
                                                <span className="min-w-0 wrap-break-word">
                                            +7 (967) 416-71-14
                                        </span>
                                            </div>

                                            <div className="flex min-w-0 items-center gap-3">
                                                <Mail className="shrink-0" size={26}/>
                                                <span className="min-w-0 break-all">
                                            Email
                                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <>
                                <EmptyOrders/>
                                <CompletedOrders/>
                            </>
                        )}


                        <div className="flex flex-col gap-3 pt-8 sm:gap-4 sm:pt-16 md:flex-row md:flex-wrap">
                            <button
                                type="button"
                                className="flex min-h-14 w-full min-w-0 items-center justify-center gap-2 rounded-full bg-warning px-4 py-3 text-base font-extrabold text-text-on-primary duration-200 hover:scale-[1.02] sm:min-h-15 sm:gap-3 sm:px-7 sm:text-[20px] md:w-auto cursor-pointer"
                            >
                                <LogOut
                                    className="shrink-0"
                                    size={26}
                                    strokeWidth={3}
                                />
                                <span className="min-w-0 text-center leading-tight">
                                Выйти из аккаунта
                            </span>
                            </button>

                            <button
                                type="button"
                                className="flex min-h-14 w-full min-w-0 items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-base font-extrabold text-text-on-primary duration-200 hover:scale-[1.02] sm:min-h-15 sm:gap-3 sm:px-7 sm:text-[20px] md:w-auto cursor-pointer"
                            >
                                <Trash2
                                    className="shrink-0"
                                    size={24}
                                    strokeWidth={3}
                                />
                                <span className="min-w-0 text-center leading-tight">
                                Удалить аккаунт
                            </span>
                            </button>
                        </div>
                    </div>

                    <aside className="order-first w-full min-w-0 pt-1 text-text lg:order-0">
                        <nav
                            className="flex w-full flex-wrap gap-2 pb-2 text-sm font-extrabold sm:gap-3 sm:text-[18px] lg:block lg:space-y-8 lg:pb-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab("info")}
                                className={`
                             min-w-0 flex-1 basis-[calc(50%-0.25rem)] rounded-full
                             py-2 px-4 cursor-pointer lg:block hover:scale-105 duration-200
                             ${
                                    activeTab === "info" ? activeTabClass : inactiveTabClass
                                }`}
                            >
                                Информация
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("orders")}
                                className={`
                             min-w-0 flex-1 basis-[calc(50%-0.25rem)] rounded-full
                             py-2 px-4 cursor-pointer lg:block hover:scale-105 duration-200
                             ${
                                    activeTab === "orders" ? activeTabClass : inactiveTabClass
                                }`}
                            >
                                Заказы
                            </button>
                        </nav>
                    </aside>
                </div>
            </main>

            <ShowOrderModal/>
        </>
    );
}
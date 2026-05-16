"use client";

import {type ReactNode, useState} from "react";
import {useRouter} from "next/navigation";
import {
    Cake,
    LogOut,
    Mail,
    Pencil,
    Phone,
    Plus,
    Trash2,
    User,
} from "lucide-react";
import {EmptyOrders} from "@/feautures/screens/personal/EmptyOrders";
import {CompletedOrders} from "@/feautures/screens/personal/CompletedOrders";
import {ShowOrderModal} from "@/feautures/screens/personal/modals/ShowOrderModal";
import {useAuthStore} from "@/store/auth-store";

export function PersonalScreen() {
    const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace("/");
    };

    return (
        <>
            <main className="min-h-screen overflow-hidden bg-background text-text">
                <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="min-w-0">
                            <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                                Личный кабинет
                            </p>
                            <h1
                                className="max-w-[760px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]"
                            >
                                Профиль гостя Mangal Club.
                            </h1>
                            <p className="mt-6 max-w-[520px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                                Здесь хранятся контактные данные и история заказов. Все спокойно, коротко и без лишних действий.
                            </p>
                        </div>

                        <aside className="min-w-0 lg:pt-6">
                            <div className="border-t border-border/70 pt-5 lg:sticky lg:top-6">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                    Раздел
                                </p>

                                <nav className="mt-5 grid gap-2">
                                    <TabButton
                                        isActive={activeTab === "info"}
                                        onClick={() => setActiveTab("info")}
                                    >
                                        Информация
                                    </TabButton>
                                    <TabButton
                                        isActive={activeTab === "orders"}
                                        onClick={() => setActiveTab("orders")}
                                    >
                                        Заказы
                                    </TabButton>
                                </nav>
                            </div>
                        </aside>
                    </div>

                    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="min-w-0 space-y-5">
                            {activeTab === "info" ? (
                                <ProfileInfo phone={user?.phone ?? "+7 (967) 416-71-14"}/>
                            ) : (
                                <>
                                    <EmptyOrders/>
                                    <CompletedOrders/>
                                </>
                            )}
                        </div>

                        <aside className="min-w-0">
                            <div className="space-y-3 border-t border-border/70 pt-5 lg:sticky lg:top-42">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                    Аккаунт
                                </p>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex h-12 w-full items-center justify-center gap-3 rounded-[6px] border border-border/70 px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                >
                                    <LogOut className="h-4 w-4" strokeWidth={1.8}/>
                                    Выйти
                                </button>

                                <button
                                    type="button"
                                    className="flex h-12 w-full items-center justify-center gap-3 rounded-[6px] border border-border/70 px-5 text-[14px] font-semibold text-text/70 transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.8}/>
                                    Удалить аккаунт
                                </button>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <ShowOrderModal/>
        </>
    );
}

type TabButtonProps = {
    children: string;
    isActive: boolean;
    onClick: () => void;
};

function TabButton({children, isActive, onClick}: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex h-11 w-full cursor-pointer items-center justify-between rounded-[6px] border px-4 text-left text-[14px] font-semibold transition duration-300",
                isActive
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border/70 text-text hover:border-primary hover:text-primary",
            ].join(" ")}
        >
            {children}
            <span className={isActive ? "h-1.5 w-1.5 rounded-full bg-on-primary" : "h-1.5 w-1.5 rounded-full bg-primary/55"}/>
        </button>
    );
}

type ProfileInfoProps = {
    phone: string;
};

function ProfileInfo({phone}: ProfileInfoProps) {
    return (
        <section className="overflow-hidden rounded-[8px] border border-border/70">
            <div className="flex flex-col gap-7 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-28 shrink-0 rounded-[8px] border border-border/70 bg-black/25">
                        <div className="flex h-full w-full items-center justify-center text-primary">
                            <User className="h-14 w-14" strokeWidth={1.4}/>
                        </div>

                        <button
                            type="button"
                            aria-label="Добавить фото"
                            className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] border border-border/70 bg-background text-text transition duration-300 hover:border-primary hover:text-primary"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.8}/>
                        </button>
                    </div>

                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Данные гостя
                        </p>
                        <h2
                            className="mt-2 wrap-break-word text-[28px] font-normal leading-tight text-text sm:text-[34px]"
                        >
                            Имя гостя
                        </h2>
                        <p className="mt-3 max-w-[470px] text-[14px] leading-6 text-text/68">
                            Контакты используются для подтверждения заказов, доставки и бронирования.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="Редактировать профиль"
                    className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-[6px] border border-border/70 px-4 text-[14px] font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                    <Pencil className="h-4 w-4" strokeWidth={1.8}/>
                    Изменить
                </button>
            </div>

            <div className="grid border-t border-border/55 md:grid-cols-3">
                <ProfileValue
                    icon={<Cake className="h-5 w-5" strokeWidth={1.8}/>}
                    label="Дата рождения"
                    value="Не указана"
                />
                <ProfileValue
                    icon={<Phone className="h-5 w-5" strokeWidth={1.8}/>}
                    label="Телефон"
                    value={phone}
                />
                <ProfileValue
                    icon={<Mail className="h-5 w-5" strokeWidth={1.8}/>}
                    label="Email"
                    value="Не указан"
                />
            </div>
        </section>
    );
}

type ProfileValueProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function ProfileValue({icon, label, value}: ProfileValueProps) {
    return (
        <div className="border-b border-border/50 px-5 py-5 last:border-b-0 md:border-b-0 md:border-l md:first:border-l-0">
            <span className="mb-5 inline-flex text-primary">
                {icon}
            </span>
            <span className="block text-[12px] leading-none text-text/60">
                {label}
            </span>
            <span className="mt-3 block wrap-break-word text-[15px] font-semibold leading-6 text-text">
                {value}
            </span>
        </div>
    );
}

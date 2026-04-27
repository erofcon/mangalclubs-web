"use client";

import Image from "next/image";
import {X, ShoppingBag, Minus, Plus} from "lucide-react";
import {menus} from "@/mocks/mocks-data";
import {useCartDrawerStore} from "@/store/cart-drawer-store";


export function CartDrawer() {
    const items = menus[0].items;

    const isOpen = useCartDrawerStore((state) => state.isOpen);
    const closeCart = useCartDrawerStore((state) => state.closeCart);

    return (
        <>
            <div
                onClick={closeCart}
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            <div
                className={`surface-panel fixed top-0 right-0 z-[100] flex h-full w-full flex-col bg-background transition-transform duration-300 md:w-[450px] ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    onClick={closeCart}
                    className={`ghost-button hidden md:flex absolute top-1/2 
                    -left-16 -translate-y-1/2 h-12 w-12 cursor-pointer items-center justify-center rounded-full text-text bg-card
                    ${
                        isOpen ? "opacity-100 visible delay-100" : "opacity-0 invisible"
                    } 
                    `}
                    aria-label="Закрыть корзину"
                >
                    <X size={24} strokeWidth={2.5}/>
                </button>

                <div className="flex shrink-0 items-center justify-between px-5 py-5 md:px-8">
                    <h2 className="text-2xl font-semibold text-text md:text-3xl">
                        Корзина
                    </h2>

                    <button
                        onClick={closeCart}
                        className="ghost-button flex h-10 w-10 md:hidden items-center justify-center rounded-full text-text bg-card"
                        aria-label="Закрыть корзину"
                    >
                        <X size={20} strokeWidth={2.5}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 md:px-8">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-text">
                            <div
                                className="surface-soft mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                                <ShoppingBag size={48} className="text-primary" strokeWidth={1.5}/>
                            </div>

                            <p className="text-xl font-bold text-text">Корзина пуста</p>
                            <p className="mt-2 text-sm">
                                Добавьте что-нибудь из меню, чтобы сделать заказ
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col py-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-6 last:border-0">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div
                                                className="flex h-full w-full items-center justify-center text-xs text-text">
                                                Нет фото
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between text-text">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-base md:text-lg font-bold leading-tight line-clamp-2">
                                                {item.name}
                                            </h3>

                                            <button
                                                className="bg-card p-2 rounded-full cursor-pointer hover:scale-115 duration-200 hover:text-warning">
                                                <X size={18}/>
                                            </button>
                                        </div>

                                        <div className="flex items-start justify-between">
                                            <span>{item.price * 2}&nbsp;₽</span>

                                            <div
                                                className="surface-soft flex h-10 w-28 shrink-0 items-center justify-between rounded-full p-1">
                                                <button
                                                    className="ghost-button hover:scale-115 duration-200 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:text-warning disabled:opacity-50">
                                                    <Minus size={14} strokeWidth={2.5}/>
                                                </button>

                                                <span className="w-6 text-center text-sm font-bold">{2}</span>

                                                <button
                                                    className="ghost-button hover:scale-115 duration-200 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:text-warning">
                                                    <Plus size={14} strokeWidth={2.5}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="shrink-0 border-t border-border text-text px-5 pb-8 pt-5 md:px-8">
                        <div className="mb-5 font-semibold flex items-end justify-between md:text-lg">
                            <span>{2} товаров на сумму</span>
                            <span className="font-bold">{123}&nbsp;₽</span>
                        </div>

                        <button
                            className="w-full cursor-pointer rounded-full py-4 text-center text-text-on-primary text-lg font-bold bg-warning">
                            Оформить за {346}&nbsp;₽
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
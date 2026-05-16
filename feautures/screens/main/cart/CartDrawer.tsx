"use client";

import Image from "next/image";
import {X, ShoppingBag, Minus, Plus} from "lucide-react";
import {useUIStore} from "@/store/ui-store";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";
import {useCartStore} from "@/store/cart-store";

const getProductPlural = (count: number) => {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return "товаров";
    }

    if (lastDigit === 1) {
        return "товар";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return "товара";
    }

    return "товаров";
};

export function CartDrawer() {
    const isOpen = useUIStore((state) => state.isCartOpen);
    const closeCart = useUIStore((state) => state.closeCart);
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const incrementItem = useCartStore((state) => state.incrementItem);
    const decrementItem = useCartStore((state) => state.decrementItem);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useBodyScrollLock(isOpen);

    return (
        <>
            <div
                onClick={closeCart}
                className={`fixed inset-0 z-100 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <div
                className={`fixed top-0 right-0 z-100 flex h-full w-full flex-col md:border-l border-border bg-background transition-transform duration-300 md:w-112.5 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    onClick={closeCart}
                    className={`absolute top-1/2 -left-16 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] border border-border bg-background text-text transition duration-300 hover:border-primary hover:text-primary md:flex ${
                        isOpen ? "visible opacity-100 delay-100" : "invisible opacity-0"
                    }`}
                    aria-label="Закрыть корзину"
                >
                    <X size={24} strokeWidth={2.5}/>
                </button>

                <div className="flex shrink-0 items-center justify-between px-5 py-5 md:px-8">
                    <h2
                        className="text-[28px] font-normal leading-tight text-text md:text-[34px]"
                    >
                        Корзина
                    </h2>

                    <button
                        onClick={closeCart}
                        className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-background text-text transition duration-300 hover:border-primary hover:text-primary md:hidden"
                        aria-label="Закрыть корзину"
                    >
                        <X size={20} strokeWidth={2.5}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 md:px-8">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-text">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[8px] border border-border">
                                <ShoppingBag size={48} className="text-primary" strokeWidth={1.5}/>
                            </div>

                            <p className="text-xl font-bold text-text">Корзина пуста</p>
                            <p className="mt-2 max-w-72 text-sm leading-6 text-text/68">
                                Добавьте что-нибудь из меню, чтобы сделать заказ
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col py-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-border/50 py-6 last:border-0">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[8px] border border-border/60">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-text">
                                                Нет фото
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between text-text">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="line-clamp-2 text-base font-bold leading-tight md:text-lg">
                                                {item.name}
                                            </h3>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                aria-label={`Удалить ${item.name} из корзины`}
                                                className="cursor-pointer rounded-[6px] border border-border p-2 transition duration-300 hover:border-primary hover:text-primary"
                                            >
                                                <X size={18}/>
                                            </button>
                                        </div>

                                        <div className="flex items-start justify-between">
                                            <span>{(item.price * item.quantity).toLocaleString("ru-RU")}&nbsp;₽</span>

                                            <div className="flex h-10 w-28 shrink-0 items-center justify-between rounded-[6px] border border-border p-1">
                                                <button
                                                    onClick={() => decrementItem(item.id)}
                                                    aria-label={`Уменьшить количество ${item.name}`}
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] transition duration-300 hover:text-primary disabled:opacity-50"
                                                >
                                                    <Minus size={14} strokeWidth={2.5}/>
                                                </button>

                                                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>

                                                <button
                                                    onClick={() => incrementItem(item.id)}
                                                    aria-label={`Увеличить количество ${item.name}`}
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] transition duration-300 hover:text-primary"
                                                >
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
                    <div className="shrink-0 border-t border-border px-5 pt-5 pb-8 text-text md:px-8">
                        <div className="mb-5 flex items-end justify-between font-semibold md:text-lg">
                            <span>
                                {totalQuantity} {getProductPlural(totalQuantity)} на сумму
                            </span>
                            <span className="font-bold">{totalPrice.toLocaleString("ru-RU")}&nbsp;₽</span>
                        </div>

                        <button className="h-12 w-full cursor-pointer rounded-[6px] bg-primary px-5 text-center text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5">
                            Оформить за {totalPrice.toLocaleString("ru-RU")}&nbsp;₽
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

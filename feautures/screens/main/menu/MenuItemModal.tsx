"use client";

import {Plus, Minus} from "lucide-react";
import Image from "next/image";
import {useRef, useState} from "react";
import {type MenuItem as MenuItemType} from "@/types/products";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useCartStore} from "@/store/cart-store";

interface MenuItemModalProps {
    item: MenuItemType;
    onClose: () => void;
}

export function MenuItemModal({item, onClose}: MenuItemModalProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const decreaseQuantity = () => {
        setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
    };

    const increaseQuantity = () => {
        setQuantity((currentQuantity) => currentQuantity + 1);
    };

    const handleAddToCart = () => {
        const imageRect = imageWrapperRef.current?.getBoundingClientRect();

        if (!imageRect) {
            addItem(item, quantity);
            onClose();
            return;
        }

        const detail = {
            image: item.image,
            name: item.name,
            from: {
                x: imageRect.left + imageRect.width / 2,
                y: imageRect.top + imageRect.height / 2,
            },
            onComplete: () => addItem(item, quantity),
        };

        onClose();

        window.setTimeout(() => {
            window.requestAnimationFrame(() => {
                window.dispatchEvent(
                    new CustomEvent("fly-to-cart", {
                        detail,
                    }),
                );
            });
        }, 0);
    };

    return (
        <ModalSkeleton onClose={onClose} className="sm:h-125">
            <div
                className="flex h-full w-full flex-col overflow-hidden border-border bg-background sm:flex-row sm:rounded-[8px] sm:border">
                <div
                    ref={imageWrapperRef}
                    className="relative flex h-[42dvh] min-h-65 w-full shrink-0 items-center justify-center overflow-hidden bg-background sm:h-full sm:min-h-0 sm:w-1/2"
                >
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 450px"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="text-sm text-text/60">Нет фото</div>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col sm:w-1/2">
                    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Блюдо
                        </p>
                        <h2
                            className="pr-12 text-center text-[28px] font-normal leading-tight text-text sm:text-[34px] md:text-left"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {item.name}
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-text/68 sm:text-base">
                            {item.description}
                        </p>

                        <div className="mt-6">
                            <h3 className="font-semibold text-text">
                                Пищевая ценность
                            </h3>

                            <div
                                className="mt-3 grid grid-cols-2 overflow-hidden rounded-[8px] border border-border/70 text-center sm:grid-cols-4">
                                <div>
                                    <div className="border-b border-border/50 px-3 py-3 sm:border-b-0 sm:border-r">
                                        <div className="text-xs font-semibold text-text/60">
                                            кКал
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.calories ?? "—"}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="border-b border-border/50 px-3 py-3 sm:border-b-0 sm:border-r">
                                        <div className="text-xs font-semibold text-text/60">
                                            Жиры
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.fats ?? "—"} г
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="border-r border-border/50 px-3 py-3">
                                        <div className="text-xs font-semibold text-text/60">
                                            Белки
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.proteins ?? "—"} г
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="px-3 py-3">
                                        <div className="text-xs font-semibold text-text/60">
                                            Углеводы
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.carbs ?? "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-border bg-background p-5 sm:p-8">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-12 w-32 shrink-0 items-center justify-between rounded-[6px] border border-border p-1">
                                <button
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[4px] text-text transition hover:text-primary disabled:opacity-50"
                                    aria-label="Уменьшить количество"
                                >
                                    <Minus className="h-5 w-5"/>
                                </button>

                                <span className="w-8 text-center text-base md:text-lg font-bold text-text">
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[4px] text-text transition hover:text-primary"
                                    aria-label="Увеличить количество"
                                >
                                    <Plus className="h-5 w-5"/>
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[6px] bg-primary px-6 text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 md:text-base"
                            >
                                Добавить за {(item.price * quantity).toLocaleString("ru-RU")}&nbsp;₽
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalSkeleton>
    );
}

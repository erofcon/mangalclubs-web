'use client';

import Image from "next/image";
import { useRef } from "react";
import { MenuItem as MenuItemType } from "@/types/products";

interface MenuItemProps {
    item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);

    const handleAddToCart = () => {
        const imageRect = imageWrapperRef.current?.getBoundingClientRect();

        if (!imageRect) return;

        window.dispatchEvent(
            new CustomEvent("fly-to-cart", {
                detail: {
                    image: item.image,
                    name: item.name,
                    from: {
                        x: imageRect.left + imageRect.width / 2,
                        y: imageRect.top + imageRect.height / 2,
                    },
                },
            })
        );
    };

    return (
        <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border p-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] sm:p-4">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/70 to-transparent sm:h-32" />

            {item.isHit && (
                <div className="absolute left-3 top-3 z-20 rounded bg-card px-1.5 py-1 sm:left-4 sm:top-4">
                    <div className="flex items-end gap-1">
                        <Image
                            src="/menu/icons/heart-on-fire-svgrepo-com.svg"
                            alt="Хит продаж"
                            width={18}
                            height={18}
                            className="sm:h-5 sm:w-5"
                        />

                        <span className="text-xs font-bold uppercase text-text sm:text-sm">
                            Хит
                        </span>
                    </div>
                </div>
            )}

            <div
                ref={imageWrapperRef}
                className="relative z-10 flex items-center justify-center sm:h-32.5 lg:h-35"
            >
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={240}
                        height={160}
                        className="h-full w-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <p className="text-center text-sm font-semibold text-text sm:text-base">
                            Нет фото
                        </p>
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-3 flex flex-1 flex-col text-center">
                <h3 className="line-clamp-2 text-base font-semibold text-text sm:text-lg">
                    {item.name}
                </h3>

                <div className="mt-auto flex flex-col items-center gap-2 pt-4 sm:flex-row sm:justify-between sm:gap-3 sm:pt-6">
                    <span className="text-lg font-bold text-white sm:text-xl">
                        {item.price.toLocaleString("ru-RU")} ₽
                    </span>

                    <button
                        onClick={handleAddToCart}
                        className="w-full shrink-0 cursor-pointer rounded-lg bg-warning px-3 py-2 text-sm font-semibold text-text-on-primary transition hover:brightness-110 active:scale-95 sm:w-auto sm:py-1.5"
                    >
                        В корзину
                    </button>
                </div>
            </div>
        </article>
    );
}
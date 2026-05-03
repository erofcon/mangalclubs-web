'use client';

import Image from "next/image";
import React, {useRef} from "react";
import {MenuItem as MenuItemType} from "@/types/products";

interface MenuItemProps {
    item: MenuItemType;
}

export function MenuItem({item}: MenuItemProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);

    const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

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
        <div>
            <article
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border p-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]"
            >
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/70 to-transparent"/>

                {item.isHit && (
                    <div className="absolute left-3 top-3 z-20 rounded bg-card px-1.5 py-1">
                        <div className="flex items-end gap-1">
                            <Image
                                src="/menu/icons/heart-on-fire-svgrepo-com.svg"
                                alt="Хит продаж"
                                width={18}
                                height={18}
                            />
                            <span className="text-xs font-bold uppercase text-text">
                            Хит
                        </span>
                        </div>
                    </div>
                )}

                <div
                    ref={imageWrapperRef}
                    className="relative z-10 flex h-28 items-end justify-center sm:h-32 lg:h-34"
                >
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={240}
                            height={160}
                            className="max-h-full w-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <p className="text-center text-sm font-semibold text-text">
                                Нет фото
                            </p>
                        </div>
                    )}
                </div>

                <div className="relative z-10 mt-1 flex flex-1 flex-col text-center">
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-text sm:min-h-[44px] sm:text-base">
                        {item.name}
                    </h3>

                    <div
                        className="mt-auto flex flex-col items-center gap-2 pt-2 sm:flex-row sm:justify-between sm:gap-3 sm:pt-3">
                    <span className="text-base font-bold text-white sm:text-lg">
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
        </div>
    );
}
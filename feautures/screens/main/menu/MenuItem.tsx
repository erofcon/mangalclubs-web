"use client";

import Image from "next/image";
import React, {useRef} from "react";
import {ShoppingCart} from "lucide-react";
import {MenuItem as MenuItemType} from "@/types/products";
import {useCartStore} from "@/store/cart-store";

interface MenuItemProps {
    item: MenuItemType;
}

export function MenuItem({item}: MenuItemProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        const imageRect = imageWrapperRef.current?.getBoundingClientRect();

        if (!imageRect) {
            addItem(item);
            return;
        }

        window.dispatchEvent(
            new CustomEvent("fly-to-cart", {
                detail: {
                    image: item.image,
                    name: item.name,
                    from: {
                        x: imageRect.left + imageRect.width / 2,
                        y: imageRect.top + imageRect.height / 2,
                    },
                    onComplete: () => addItem(item),
                },
            })
        );
    };

    return (
        <article
            className="group relative flex h-full min-h-29 cursor-pointer overflow-hidden rounded-lg border border-border transition duration-300 hover:border-[#76532e] hover:bg-[#101112]">
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_44%),radial-gradient(circle_at_20%_45%,rgba(214,173,104,0.13),transparent_38%)]"/>

            <div
                ref={imageWrapperRef}
                className="relative flex w-32.5 shrink-0 items-center justify-center overflow-hidden pl-3 pr-1
                 sm:w-36.25 lg:w-37.5"
            >
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1280px) 150px, (min-width: 640px) 145px, 130px"
                        className="h-23 w-full object-cover drop-shadow-[0_18px_18px_rgba(0,0,0,0.54)]
                         transition duration-300 group-hover:scale-105 sm:h-25"
                    />
                ) : (
                    <div className="text-sm text-[#9d9387]">Нет фото</div>
                )}
            </div>

            <div className="relative flex min-w-0 flex-1 flex-col justify-center py-4 pl-2 pr-14.5">
                <h3
                    className="line-clamp-2 wrap-break-word text-[15px] font-normal leading-4.75 text-[#f3ede5]"
                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                >
                    {item.name}
                </h3>

                {item.description && (
                    <p className="mt-1 line-clamp-1 text-[13px] leading-5 text-[#b8afa5]">
                        {item.description}
                    </p>
                )}

                {item.weight && (
                    <p className="mt-2 text-[13px] leading-none text-[#b8afa5]">
                        {item.weight}
                    </p>
                )}

                <p className="mt-3 text-[16px] font-semibold leading-none text-[#f5efe5]">
                    {item.price.toLocaleString("ru-RU")} ₽
                </p>
            </div>

            <button
                onClick={handleAddToCart}
                className="absolute bottom-4 right-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[5px] border border-[#4a3925] bg-[#111213] text-[#d6ad68] transition duration-300 hover:border-[#d6ad68] hover:text-[#f5efe5] active:scale-95"
                aria-label={`Добавить ${item.name} в корзину`}
            >
                <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.8}/>
            </button>
        </article>
    );
}
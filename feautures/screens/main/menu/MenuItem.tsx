"use client";

import Image from "next/image";
import React, {useRef} from "react";
import {ShoppingCart} from "lucide-react";
import {MenuItem as MenuItemType} from "@/types/products";
import {useCartStore} from "@/store/cart-store";

interface MenuItemProps {
    item: MenuItemType;
    variant?: "featured" | "compact";
}

export function MenuItem({item, variant = "compact"}: MenuItemProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const addItem = useCartStore((state) => state.addItem);
    const isFeatured = variant === "featured";

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
            className={`group relative overflow-hidden rounded-[8px] border border-[#332a20] bg-[#0b0c0d]/70 transition duration-300 hover:border-[#76532e] hover:bg-[#101112] ${
                isFeatured ? "min-h-[176px]" : "min-h-[134px]"
            }`}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035),transparent_42%),radial-gradient(circle_at_18%_50%,rgba(214,173,104,0.08),transparent_38%)]"/>

            {isFeatured ? (
                <div className="relative z-10 grid min-h-[176px] grid-cols-[55%_45%]">
                    <div
                        ref={imageWrapperRef}
                        className="relative flex min-h-[174px] items-center justify-center overflow-hidden"
                    >
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={390}
                                height={230}
                                className="h-[158px] w-full object-contain drop-shadow-[0_22px_22px_rgba(0,0,0,0.58)] transition duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="text-sm text-[#9d9387]">Нет фото</div>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-center py-6 pl-1 pr-16">
                        <h3
                            className="text-[24px] font-normal leading-tight text-[#f3ede5]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {item.name}
                        </h3>
                        <p className="mt-2 max-w-[210px] text-[14px] leading-5 text-[#b8afa5]">
                            {item.description}
                        </p>
                        {item.weight && (
                            <p className="mt-5 text-[14px] text-[#b8afa5]">{item.weight}</p>
                        )}
                        <p className="mt-4 text-[18px] font-semibold text-[#f5efe5]">
                            {item.price.toLocaleString("ru-RU")} ₽
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative z-10 grid min-h-[134px] grid-cols-[58%_42%]">
                    <div
                        ref={imageWrapperRef}
                        className="relative flex items-center justify-center overflow-hidden px-2"
                    >
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={250}
                                height={150}
                                className="h-[106px] w-full object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.54)] transition duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="text-sm text-[#9d9387]">Нет фото</div>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-center py-4 pl-1 pr-12">
                        <h3
                            className="text-[16px] font-normal leading-5 text-[#f3ede5]"
                            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                        >
                            {item.name}
                        </h3>
                        {item.weight && (
                            <p className="mt-3 text-[13px] text-[#b8afa5]">{item.weight}</p>
                        )}
                        <p className="mt-2 text-[15px] font-semibold text-[#f5efe5]">
                            {item.price.toLocaleString("ru-RU")} ₽
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={handleAddToCart}
                className="absolute bottom-4 right-4 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[5px] border border-[#4a3925] bg-[#111213] text-[#d6ad68] transition duration-300 hover:border-[#d6ad68] hover:text-[#f5efe5] active:scale-95"
                aria-label={`Добавить ${item.name} в корзину`}
            >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.8}/>
            </button>
        </article>
    );
}

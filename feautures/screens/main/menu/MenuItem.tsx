"use client";

import Image from "next/image";
import React, {useRef, useState} from "react";
import {ShoppingCart} from "lucide-react";
import {MenuItem as MenuItemType} from "@/types/products";
import {useCartStore} from "@/store/cart-store";
import {requestCartAddPermission} from "@/store/cart-gate-store";

interface MenuItemProps {
    item: MenuItemType;
    onOpen?: (previewImage?: string) => void;
}

export function MenuItem({item, onOpen}: MenuItemProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const [shouldPreloadModalImage, setShouldPreloadModalImage] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const hasModifiers = Boolean(item.modifiers?.some((group) => group.items.length > 0));

    const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (hasModifiers) {
            onOpen?.(imageWrapperRef.current?.querySelector("img")?.currentSrc);
            return;
        }

        if (!requestCartAddPermission(item)) {
            return;
        }

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

    const preloadModalImage = () => {
        if (item.image) {
            setShouldPreloadModalImage(true);
        }
    };

    return (
        <article
            className="group relative flex h-full min-h-29 cursor-pointer overflow-hidden rounded-lg border border-border transition duration-300 hover:border-[#76532e] hover:bg-[#101112]"
            onPointerEnter={preloadModalImage}
            onFocusCapture={preloadModalImage}
            onTouchStart={preloadModalImage}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_44%),radial-gradient(circle_at_20%_45%,rgba(214,173,104,0.13),transparent_38%)]"/>

            <div
                ref={imageWrapperRef}
                className="relative flex w-32.5 shrink-0 items-center justify-center overflow-hidden pl-3 pr-1
                 sm:w-36.25 lg:w-37.5"
            >
                {item.image ? (
                    <>
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(min-width: 1280px) 150px, (min-width: 640px) 145px, 130px"
                            className="h-23 w-full object-cover drop-shadow-[0_18px_18px_rgba(0,0,0,0.54)]
                             transition duration-300 group-hover:scale-105 sm:h-25"
                        />
                        {shouldPreloadModalImage && (
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 100vw, 450px"
                                loading="eager"
                                className="pointer-events-none absolute inset-0 opacity-0"
                            />
                        )}
                    </>
                ) : (
                    <div className="text-sm text-[#9d9387]">Нет фото</div>
                )}
            </div>

            <div className="relative flex min-w-0 flex-1 flex-col justify-center py-4 pl-2 pr-14.5">
                <h3
                    className="line-clamp-2 wrap-break-word text-[15px] font-semibold leading-4.75 tracking-wide text-[#f3ede5]"
                >
                    {item.name}
                </h3>

                {item.description && (
                    <p className="mt-1 line-clamp-1 text-[12px] leading-5 text-text">
                        {item.description}
                    </p>
                )}

                {item.weight && (
                    <p className="mt-2 text-[12px] leading-none text-text">
                        {item.weight}
                    </p>
                )}

                <p className="mt-3 text-[16px] font-bold leading-4 tracking-wide text-text">
                    {item.price.toLocaleString("ru-RU")} ₽
                </p>
            </div>

            <button
                onClick={handleAddToCart}
                className="absolute bottom-4 right-4 inline-flex h-9 w-9 cursor-pointer
                items-center justify-center rounded-[5px] border border-[#4a3925] bg-[#111213] text-primary
                transition duration-300 hover:border-primary active:scale-95"
                aria-label={`Добавить ${item.name} в корзину`}
            >
                <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.8}/>
            </button>
        </article>
    );
}

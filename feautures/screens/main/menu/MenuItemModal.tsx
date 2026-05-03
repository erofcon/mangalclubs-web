"use client";

import {Plus, Minus} from "lucide-react";
import Image from "next/image";
import {useRef} from "react";
import {type MenuItem as MenuItemType} from "@/types/products";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";

interface MenuItemModalProps {
    item: MenuItemType;
    onClose: () => void;
}

export function MenuItemModal({item, onClose}: MenuItemModalProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);

    const handleAddToCart = () => {
        const imageRect = imageWrapperRef.current?.getBoundingClientRect();

        if (!imageRect) {
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
        };

        onClose();

        window.setTimeout(() => {
            window.requestAnimationFrame(() => {
                window.dispatchEvent(
                    new CustomEvent("fly-to-cart", {
                        detail,
                    })
                );
            });
        }, 0);
    };


    return (
        <ModalSkeleton onClose={onClose} className="sm:h-125">
            <div className="flex h-full w-full flex-col overflow-hidden bg-background sm:flex-row sm:rounded-4xl">
                {/* Image */}
                <div
                    ref={imageWrapperRef}
                    className="relative flex h-[42dvh] min-h-[260px] w-full shrink-0 items-center justify-center overflow-hidden bg-background sm:h-full sm:min-h-0 sm:w-1/2"
                >
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 450px"
                            className="bg-background object-contain p-8 sm:p-12"
                        />
                    ) : (
                        <div className="text-gray-400">Нет фото</div>
                    )}
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 flex-col sm:w-1/2">
                    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
                        <h2 className="pr-12 text-center text-2xl font-black leading-tight text-text sm:text-3xl md:text-left">
                            {item.name}
                        </h2>

                        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                            {item.description}
                        </p>

                        <div className="mt-6">
                            <h3 className="font-semibold text-text">
                                Пищевая ценность
                            </h3>

                            <div className="mt-3 grid grid-cols-4 gap-3 rounded-2xl bg-card p-4 text-center">
                                <div>
                                    <div className="text-xs font-semibold text-text-secondary">
                                        кКал
                                    </div>
                                    <div className="text-base font-semibold text-text">
                                        {item.calories ?? "—"}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-text-secondary">
                                        Жиры
                                    </div>
                                    <div className="text-base font-semibold text-text">
                                        {item.fats ?? "—"} г
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-text-secondary">
                                        Белки
                                    </div>
                                    <div className="text-base font-semibold text-text">
                                        {item.proteins ?? "—"} г
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-text-secondary">
                                        Углеводы
                                    </div>
                                    <div className="text-base font-semibold text-text">
                                        {item.carbs ?? "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="shrink-0 border-t border-black/5 bg-background p-5 sm:p-8">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-14 w-32 shrink-0 items-center justify-between rounded-full bg-card p-1">
                                <button
                                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-text transition hover:text-warning">
                                    <Minus className="h-5 w-5"/>
                                </button>

                                <span className="w-8 text-center text-base md:text-lg font-bold text-text">
                                    2
                                </span>

                                <button
                                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-text transition hover:text-warning">
                                    <Plus className="h-5 w-5"/>
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-full bg-warning px-6 text-sm md:text-base font-bold text-text-on-primary transition"
                            >
                                Добавить за {item.price}&nbsp;₽
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalSkeleton>
    );
}
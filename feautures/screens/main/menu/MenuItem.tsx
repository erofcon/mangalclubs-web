import Image from "next/image";

import {MenuItem as MenuItemType} from "@/types/products";
import {Plus} from "lucide-react";

interface MenuItemProps {
    item: MenuItemType;
}

export function MenuItem({item}: MenuItemProps) {
    return (
        <div className="md:p-10 px-4 cursor-pointer shadow-sm hover:shadow-md h-full flex flex-col">

            <div className="relative h-40 md:h-50 w-full flex items-end justify-center overflow-hidden">

                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain object-bottom md:p-2 transition-all duration-500 hover:translate-y-2"
                    />
                ) : (
                    <span className="text-xs text-gray-400">Нет фото</span>
                )}
            </div>

            <div className="flex flex-col flex-1 pt-2">
                <h3 className="line-clamp-2 md:text-xl font-bold leading-tight text-text">
                    {item.name}
                </h3>

                <p className="line-clamp-2 mt-2 text-sm md:text-base text-text-secondary">
                    {item.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="md:text-lg text-sm font-black text-text">
                        {item.price} ₽
                    </span>

                    <button
                        className="surface-soft cursor-pointer flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full text-text bg-primary hover:bg-secondary transition-colors">
                        <Plus className="h-5 w-5 md:h-6 md:w-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
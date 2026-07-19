"use client";

import {useState} from "react";
import {type MenuItem as MenuItemType} from "@/types/products";
import {MenuItem} from "@/feautures/screens/main/menu/MenuItem";
import {MenuItemModal} from "@/feautures/screens/main/menu/MenuItemModal";
import {useAppDataStore} from "@/store/app-data-store";

export function MenuSection() {
    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
    const menus = useAppDataStore((state) => state.menu);
    const isMenuLoading = useAppDataStore((state) => state.isMenuLoading);
    const errorMessage = useAppDataStore((state) => state.errorMessage);

    return (
        <>
            <div id="menu" className="mx-auto w-full mt-6 max-w-302.5 scroll-mt-28 space-y-7 px-5 pb-10 pt-2 sm:px-6 lg:px-0">
                {isMenuLoading ? (
                    <MenuSectionSkeleton/>
                ) : errorMessage ? (
                    <div className="rounded-[8px] border border-border/70 bg-[#090a0a] px-5 py-5 text-[14px] leading-6 text-text/72">
                        {errorMessage}
                    </div>
                ) : menus.length > 0 ? menus.map((menu) => (
                    <section
                        key={menu.id}
                        id={`menu-${menu.id}`}
                        className="relative scroll-mt-28"
                    >
                        <h2
                            className="mb-4 text-[20px] font-normal leading-tight text-text"
                        >
                            {menu.title}
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {menu.items.map((item) => (
                                <div
                                    key={item.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedItem(item)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            setSelectedItem(item);
                                        }
                                    }}
                                    className="h-full text-left outline-none"
                                >
                                    <MenuItem item={item} onOpen={() => setSelectedItem(item)}/>
                                </div>
                            ))}
                        </div>
                    </section>
                )) : (
                    <div className="rounded-[8px] border border-border/70 bg-[#090a0a] px-5 py-5 text-[14px] leading-6 text-text/72">
                        Меню пока недоступно
                    </div>
                )}
            </div>

            {selectedItem && (
                <MenuItemModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </>
    );
}

function MenuSectionSkeleton() {
    return (
        <div className="space-y-8" aria-label="Загрузка меню">
            {Array.from({length: 3}).map((_, sectionIndex) => (
                <section key={sectionIndex}>
                    <div className="mb-4 h-6 w-56 animate-pulse rounded-[6px] bg-white/8"/>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({length: 6}).map((__, itemIndex) => (
                            <div
                                key={itemIndex}
                                className="relative flex min-h-29 overflow-hidden rounded-lg border border-border/55 bg-[#090a0a]"
                            >
                                <div className="w-32.5 shrink-0 animate-pulse bg-white/7 sm:w-36.25 lg:w-37.5"/>
                                <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-4">
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/8"/>
                                    <div className="h-3 w-1/2 animate-pulse rounded bg-white/7"/>
                                    <div className="h-4 w-20 animate-pulse rounded bg-white/8"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

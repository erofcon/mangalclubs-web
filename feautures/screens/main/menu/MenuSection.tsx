"use client";

import { useState } from "react";
import { menus } from "@/mocks/mocks-data";
import { type MenuItem as MenuItemType } from "@/types/products";
import { MenuItem } from "@/feautures/screens/main/menu/MenuItem";
import { MenuItemModal } from "@/feautures/screens/main/menu/MenuItemModal";

export function MenuSection() {
    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

    return (
        <>
            <div className="mx-auto w-full max-w-[1210px] space-y-7 px-5 pb-10 pt-2 sm:px-6 lg:px-0">
                {menus.map((menu) => (
                    <section
                        key={menu.id}
                        id={`menu-${menu.id}`}
                        className="relative scroll-mt-28"
                    >
                        <h2
                            className="mb-4 text-[20px] font-normal leading-tight text-[#f5efe5]"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
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
                                    <MenuItem item={item} />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
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
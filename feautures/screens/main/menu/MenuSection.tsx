"use client";

import {useState} from "react";
import {menus} from "@/mocks/mocks-data";
import {type MenuItem as MenuItemType} from "@/types/products";
import {MenuItem} from "@/feautures/screens/main/menu/MenuItem";
import {MenuItemModal} from "@/feautures/screens/main/menu/MenuItemModal";

export function MenuSection() {
    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

    return (
        <>
            <div className="mx-auto w-full max-w-[1210px] space-y-7 px-5 pb-10 pt-2 sm:px-6 lg:px-0">
                {menus.map((menu, menuIndex) => {
                    const isFeatured = menuIndex === 0;

                    return (
                        <section
                            key={menu.id}
                            id={`menu-${menu.id}`}
                            className="relative scroll-mt-28"
                        >
                            {!isFeatured && (
                                <h2
                                    className="mb-4 text-[20px] font-normal leading-tight text-[#f5efe5]"
                                    style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                                >
                                    {menu.title}
                                </h2>
                            )}

                            <div className={isFeatured ? "grid gap-6 lg:grid-cols-2" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"}>
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
                                        className="text-left"
                                    >
                                        <MenuItem item={item} variant={isFeatured ? "featured" : "compact"}/>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
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

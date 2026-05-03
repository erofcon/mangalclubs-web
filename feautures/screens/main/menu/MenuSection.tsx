"use client";

import {menus} from "@/mocks/mocks-data";
import {type MenuItem as MenuItemType} from "@/types/products";
import {MenuItem} from "@/feautures/screens/main/menu/MenuItem";
import {MenuItemModal} from "@/feautures/screens/main/menu/MenuItemModal";
import {useState} from "react";


export function MenuSection() {

    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

    return (
        <>
            <div className="mt-4 space-y-12 mx-auto w-full max-w-374 px-4 md:px-7">
                {menus.map((menu) => (
                    <section
                        key={menu.id}
                        id={`menu-${menu.id}`}
                        className="relative"
                    >
                        <div className="md:mb-8 mb-4 md:py-4">
                            <h2 className="text-text text-base md:text-lg font-semibold tracking-wide">
                                {menu.title}
                            </h2>

                            <div className="mt-2 h-0.5 w-12 rounded-full bg-warning"/>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
                                    <MenuItem item={item}/>
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
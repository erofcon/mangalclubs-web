// Product categories
export interface Category {
    id: string;
    title: string;
    icon: string,
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    isHit: boolean;
}

export interface MenuCategory extends Category {
    items: MenuItem[];
}


export const CategoryIcons: Record<string, string> = {
    steak: "/menu/icons/steak.svg",
    grill: "/menu/icons/grill.svg",
};
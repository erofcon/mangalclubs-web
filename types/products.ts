// Product categories
export interface Category {
    id: string;
    title: string;
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
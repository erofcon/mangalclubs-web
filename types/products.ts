// Product categories
export interface Category {
    id: string;
    title: string;
}

export interface MenuModifierRestrictions {
    minQuantity: number;
    maxQuantity?: number | null;
    freeQuantity: number;
    byDefault: number;
    hideIfDefaultQuantity: boolean;
}

export interface MenuModifierItem {
    id: string;
    productId: string;
    productGroupId?: string | null;
    sku?: string | null;
    name: string;
    description?: string | null;
    price: number;
    defaultAmount?: number;
    restrictions: MenuModifierRestrictions;
    position?: number | null;
    image?: string | null;
    measureUnitType?: string | null;
}

export interface MenuModifierGroup {
    id: string;
    productGroupId: string;
    sku?: string | null;
    name: string;
    description?: string | null;
    required: boolean;
    minQuantity: number;
    maxQuantity?: number | null;
    freeQuantity: number;
    byDefault: number;
    hideIfDefaultQuantity: boolean;
    canBeDivided?: boolean;
    childModifiersHaveMinMaxRestrictions?: boolean;
    items: MenuModifierItem[];
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    weight?: string;
    calories?: string | number;
    fats?: string | number;
    proteins?: string | number;
    carbs?: string | number;
    sizeId?: string | null;
    size_id?: string | null;
    sizeName?: string | null;
    measureUnitType?: string | null;
    modifiers?: MenuModifierGroup[];
}

export interface MenuCategory extends Category {
    items: MenuItem[];
}

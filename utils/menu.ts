import type {MenuCategory} from "@/types/products";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
    ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
    : "";

export const normalizeMenuImage = (image?: string | null) => {
    if (!image) return undefined;

    if (API_ORIGIN && image.startsWith(API_ORIGIN)) {
        const url = new URL(image);

        return `${url.pathname}${url.search}`;
    }

    if (image.startsWith("/")) {
        return image;
    }

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    return `/${image}`;
};

export const normalizeMenuWeight = (weight?: string | null) => {
    if (!weight) return undefined;

    return weight
        .trim()
        .replace(/\s*(kilograms|kilogram|kgs|kg)\b/gi, " кг")
        .replace(/\s*(grams|gram|gr|g)\b/gi, " г")
        .replace(/\s*(milliliters|milliliter|ml)\b/gi, " мл")
        .replace(/\s*(liters|liter|l)\b/gi, " л")
        .replace(/\s+/g, " ");
};

export const normalizeMenu = (menu: MenuCategory[]) => {
    return menu.map((category) => ({
        ...category,
        items: category.items.map((item) => ({
            ...item,
            image: normalizeMenuImage(item.image),
            weight: normalizeMenuWeight(item.weight),
        })),
    }));
};

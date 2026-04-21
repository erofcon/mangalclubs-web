import {Category, MenuCategory} from "@/types/products";


export const categories: Category[] = [
    {
        id: "99",
        title: "Стейки из Мраморной Говядины",

    },
    {
        id: "98",
        title: "Мангал",
    },
];

export const menus: MenuCategory[] = [
    {
        id: categories[0].id,
        title: categories[0].title,
        items: [
            {
                id: "1",
                name: "Томагавк",
                description: "Премиальный мраморный стейк на кости, напоминающий топор индейцев",
                price: 2490,
                image: "/menu/no-background/Мраморный стейк томагавк.png"
            },
            {
                id: "2",
                name: "Рибай",
                description: "Премиальный мраморный стейк, маринованный способом сухого вызревания",
                price: 2490,
                image: "/menu/no-background/Мраморный стейк Рибай.png"
            },
        ],
    },
    {
        id: categories[1].id,
        title: categories[1].title,
        items: [
            {
                id: "3",
                name: "Антрекоты",
                description: "Нежные антрекоты прямо с огня",
                price: 2490,
                image: "/menu/no-background/Антрекоты.png"
            },
            {
                id: "4",
                name: "Мангал Бургер",
                description: "Сочная котлета на мангале, фирменный лаваш, начинка из грибного соуса",
                price: 2490,
                image: "/menu/no-background/Мангал бургер.png"
            },
            {
                id: "5",
                name: "Шашлык из говядины",
                description: "Шампур изумительной говядины",
                price: 2490,
                image: "/menu/no-background/Шашлык из говядины.png"
            },
            {
                id: "6",
                name: "Домашние колбаски чили из говядины",
                description: "Сочные фермерские говяжьи колбаски местного производства",
                price: 2490,
                image: "/menu/no-background/Домашние колбаски чили.png"
            },
            {
                id: "7",
                name: "Дорадо",
                description: "Нежная рыба с хрустящей корочкой, подается с запеченными овощами",
                price: 2490,
                image: "/menu/no-background/Дорадо на мангале.png"
            },
            {
                id: "8",
                name: "Крылышки",
                description: "Крылышки куриные обжаренные на мангале до золотистой корочки",
                price: 2490,
                image: "/menu/no-background/Куриные крылышки.png"
            },
        ],
    }
]
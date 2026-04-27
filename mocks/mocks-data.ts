import {Category, MenuCategory} from "@/types/products";
import {Story} from "@/types/story";


export const categories: Category[] = [
    {
        id: "99",
        title: "Стейки из Мраморной Говядины",
        icon: "steak",

    },
    {
        id: "98",
        title: "Мангал",
        icon: "grill",
    },
    {
        id: "97",
        title: "Тест",
        icon: "grill",
    },
];

export const menus: MenuCategory[] = [
    {
        id: categories[0].id,
        title: categories[0].title,
        icon: "steak",
        items: [
            {
                id: "1",
                name: "Томагавк",
                description: "Премиальный мраморный стейк на кости, напоминающий топор индейцев",
                price: 1490,
                image: "/menu/no-background/Мраморный стейк томагавк.png",
                isHit: true,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "2",
                name: "Рибай",
                description: "Премиальный мраморный стейк, маринованный способом сухого вызревания",
                price: 2490,
                image: "/menu/no-background/Мраморный стейк Рибай.png",
                isHit: false,
            },
        ],
    },
    {
        id: categories[1].id,
        title: categories[1].title,
        icon: "grill",
        items: [
            {
                id: "3",
                name: "Антрекоты",
                description: "Нежные антрекоты прямо с огня",
                price: 2490,
                image: "/menu/no-background/Антрекоты.png",
                isHit: false,
            },
            {
                id: "4",
                name: "Мангал Бургер",
                description: "Сочная котлета на мангале, фирменный лаваш, начинка из грибного соуса",
                price: 2490,
                image: "/menu/no-background/Мангал бургер.png",
                isHit: false,
            },
            {
                id: "5",
                name: "Шашлык из говядины",
                description: "Шампур изумительной говядины",
                price: 2490,
                image: "/menu/no-background/Шашлык из говядины.png",
                isHit: true,
            },
            {
                id: "6",
                name: "Домашние колбаски чили из говядины",
                description: "Сочные фермерские говяжьи колбаски местного производства",
                price: 2490,
                image: "/menu/no-background/Домашние колбаски чили.png",
                isHit: false,
            },
            {
                id: "7",
                name: "Дорадо",
                description: "Нежная рыба с хрустящей корочкой, подается с запеченными овощами",
                price: 2490,
                image: "/menu/no-background/Дорадо на мангале.png",
                isHit: true,
            },
            {
                id: "8",
                name: "Крылышки",
                description: "Крылышки куриные обжаренные на мангале до золотистой корочки",
                price: 2490,
                image: "/menu/no-background/Куриные крылышки.png",
                isHit: false,
            },
        ],
    },
    {
        id: categories[2].id,
        title: categories[2].title,
        icon: "grill",
        items: [
            {
                id: "9",
                name: "Антрекоты",
                description: "Нежные антрекоты прямо с огня",
                price: 2490,
                image: "/menu/no-background/Антрекоты.png",
                isHit: false,
            },
            {
                id: "10",
                name: "Мангал Бургер",
                description: "Сочная котлета на мангале, фирменный лаваш, начинка из грибного соуса",
                price: 2490,
                image: "/menu/no-background/Мангал бургер.png",
                isHit: false,
            },
            {
                id: "11",
                name: "Шашлык из говядины",
                description: "Шампур изумительной говядины",
                price: 2490,
                image: "/menu/no-background/Шашлык из говядины.png",
                isHit: true,
            },
            {
                id: "12",
                name: "Домашние колбаски чили из говядины",
                description: "Сочные фермерские говяжьи колбаски местного производства",
                price: 2490,
                image: "/menu/no-background/Домашние колбаски чили.png",
                isHit: false,
            },
            {
                id: "13",
                name: "Дорадо",
                description: "Нежная рыба с хрустящей корочкой, подается с запеченными овощами",
                price: 2490,
                image: "/menu/no-background/Дорадо на мангале.png",
                isHit: true,
            },
            {
                id: "14",
                name: "Крылышки",
                description: "Крылышки куриные обжаренные на мангале до золотистой корочки",
                price: 2490,
                image: "/menu/no-background/Куриные крылышки.png",
                isHit: false,
            },
        ],
    }
]


export const StoriesData: Story[] = [
    {
        id: "1",
        title: "",
        previewImage: "/stories/delivery.png",
        slides: [
            {
                id: "qww",
                src: "/stories/delivery.png",
                type: "image",
            },
            {
                id: "12sas",
                src: "/stories/delivery_2.png",
                type: "image",
            },
            {
                id: "4dsdd",
                src: "/stories/rest_clip.mp4",
                type: "video",
                poster: "/stories/delivery.png"
            },
        ],
    },
    {
        id: 2,
        title: "",
        previewImage: "/stories/barbecue.png",
        slides: [
            {
                id: "4ds2dd",
                src: "/stories/barbecue_clip.mp4",
                type: "video",
                poster: "/stories/delivery.png"
            },
            {
                id: "3dsfsd",
                src: "/stories/barbecue.png",
                type: "image"
            },
            {
                id: "2sas",
                src: "/stories/barbecue2.png",
                type: "image",
            },
        ],
    },
    {
        id: 3,
        title: "",
        previewImage: "/stories/rest.png",
        slides: [
            {
                id: "sxdfcwe",
                src: "/stories/rest.png",
                type: "image",
            },
            {
                id: "sxdfcwe",
                src: "/stories/rest2.png",
                type: "image",
            },
            {
                id: "dsfsd",
                src: "/stories/rest3.png",
                type: "image"
            },
            {
                id: "33adasd",
                src: "/stories/rest4.png",
                type: "image"
            },
        ],
    },
];

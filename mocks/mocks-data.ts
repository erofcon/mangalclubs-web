import {Category, MenuCategory} from "@/types/products";
import {Story} from "@/types/story";
import {Organization} from "@/types/organization";
import {Booking} from "@/types/booking";

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


export const PICKUP_POINT: Organization = {
    name: "Mangal Club",
    city: "г. Грозный",
    address: "ул. Светлая улица, 105А",
    schedule: "Ежедневно с 10:30 до 01:30",
    phone: "+7 (928) 340-50-50",
    intro: "Команда Mangal Clubs переосмысливает " +
        "приватность и комфорт, вдохновляясь духом города и его настроением. " +
        "Здесь современное гостеприимство встречается с камерной атмосферой, знакомой каждому алматинцу. " +
        "Каждая кабинка — это уютный островок, где время течёт медленнее, а встречи обретают особый смысл. " +
        "Пространство, идеальное для деловых завтраков, семейных обедов и неспешных ужинов в кругу близких. " +
        "Забронируйте свою кабинку и откройте для себя новый формат городского гостеприимства.",
    coordinates: {
        latitude: 43.359307,
        longitude: 45.697802,
        accuracy: null,
    },
};


export const BookingMocks: Booking[] = [
    {
        id: "3edsfsf",
        title: "Каминная",
        description: "Уютная кабина с атмосферой живого огня — идеальна для тёплых встреч и долгих разговоров",
        image: "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
    },
    {
        id: "5redsfsf",
        title: "Тёплый угол",
        description: "Пространство, где хочется задержаться — мягкий свет, комфорт и спокойная атмосфера",
        image: "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
    },
    {
        id: "5re2323dsfsf",
        title: "Лофт-зона",
        description: "Стильная кабина с кирпичом и мягкими диванами для компании и расслабленного отдыха",
        image: "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
    },
    {
        id: "4re2323dsfsf",
        title: "Зелёная гостиная",
        description: "Живые акценты и тёплое дерево создают ощущение домашнего уюта и уединения",
        image: "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
    },
    {
        id: "56tedre2323dsfsf",
        title: "Закрытый клуб",
        description: "Приватная зона для своей компании — отдых, общение и максимум комфорта без лишних глаз",
        image: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
    },
    {
        id: "udfftedre2323dsfsf",
        title: "Мягкая зона",
        description: "Просторная кабина с удобными диванами для больших компаний и долгих посиделок",
        image: "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
    },
    {
        id: "56tedre2323dsf34r5weffdwsf",
        title: "Кино-комната",
        description: "Идеальное место для отдыха с экраном, приставкой и любимыми фильмами",
        image: "/booking/611264128_18097554673907715_2049357468313814860_n..jpg",
    },
]
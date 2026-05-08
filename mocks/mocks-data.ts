import {Category, MenuCategory} from "@/types/products";
import {Story} from "@/types/story";
import {Organization} from "@/types/organization";
import {Booking} from "@/types/booking";

export const categories: Category[] = [
    {
        id: "99",
        title: "Стейки из мраморной говядины",
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
                description: "Премиальный стейк из мраморной говядины",
                weight: "600 г",
                price: 4490,
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
                description: "Сочный стейк зернового откорма",
                weight: "400 г",
                price: 2990,
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
                name: "Люля-кебаб из говядины",
                description: "Нежный люля-кебаб с луком и специями",
                weight: "230 г",
                price: 590,
                image: "/menu/no-background/Шашлык из говядины.png",
                isHit: false,
            },
            {
                id: "4",
                name: "Шашлык куриный",
                description: "Куриный шашлык с дымным ароматом",
                weight: "300 г",
                price: 550,
                image: "/menu/no-background/Куриные крылышки.png",
                isHit: false,
            },
            {
                id: "5",
                name: "Люля-кебаб из баранины",
                description: "Сочный люля-кебаб из баранины",
                weight: "230 г",
                price: 650,
                image: "/menu/no-background/Шашлык из говядины.png",
                isHit: true,
            },
            {
                id: "6",
                name: "Стейк из говядины",
                description: "Стейк с овощами на гриле",
                weight: "320 г",
                price: 890,
                image: "/menu/no-background/Антрекоты.png",
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
                id: "7",
                name: "Домашние колбаски чили",
                description: "Говяжьи колбаски с легкой остротой",
                weight: "260 г",
                price: 690,
                image: "/menu/no-background/Домашние колбаски чили.png",
                isHit: false,
            },
            {
                id: "8",
                name: "Дорадо на мангале",
                description: "Дорадо с хрустящей корочкой",
                weight: "1 шт",
                price: 990,
                image: "/menu/no-background/Дорадо на мангале.png",
                isHit: true,
            },
            {
                id: "9",
                name: "Мангал бургер",
                description: "Фирменный бургер с котлетой на огне",
                weight: "350 г",
                price: 790,
                image: "/menu/no-background/Мангал бургер.png",
                isHit: false,
            },
            {
                id: "10",
                name: "Куриные крылышки",
                description: "Крылышки на мангале",
                weight: "300 г",
                price: 620,
                image: "/menu/no-background/Куриные крылышки.png",
                isHit: false,
            },
        ],
    },
];

export const StoriesData: Story[] = [
    {
        id: "delivery",
        title: "Доставка",
        previewImage: "/stories/delivery.png",
        slides: [
            {id: "delivery-1", src: "/stories/delivery.png", type: "image"},
            {id: "delivery-2", src: "/stories/delivery_2.png", type: "image"},
            {id: "delivery-3", src: "/stories/rest_clip.mp4", type: "video", poster: "/stories/delivery.png"},
        ],
    },
    {
        id: "grill",
        title: "Наш гриль",
        previewImage: "/stories/barbecue.png",
        slides: [
            {id: "grill-1", src: "/stories/barbecue_clip.mp4", type: "video", poster: "/stories/barbecue.png"},
            {id: "grill-2", src: "/stories/barbecue.png", type: "image"},
            {id: "grill-3", src: "/stories/barbecue2.png", type: "image"},
        ],
    },
    {
        id: "menu",
        title: "Меню",
        previewImage: "/menu/no-background/Мраморный стейк томагавк.png",
        slides: [
            {id: "menu-1", src: "/menu/no-background/Мраморный стейк томагавк.png", type: "image"},
            {id: "menu-2", src: "/menu/no-background/Мраморный стейк Рибай.png", type: "image"},
        ],
    },
    {
        id: "guests",
        title: "Гости",
        previewImage: "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
        slides: [
            {id: "guests-1", src: "/booking/609720157_18097555507907715_5416527739075581508_n..jpg", type: "image"},
            {id: "guests-2", src: "/booking/610002010_18097554682907715_6683000151825881101_n..jpg", type: "image"},
        ],
    },
    {
        id: "interior",
        title: "Интерьер",
        previewImage: "/stories/rest.png",
        slides: [
            {id: "interior-1", src: "/stories/rest.png", type: "image"},
            {id: "interior-2", src: "/stories/rest2.png", type: "image"},
            {id: "interior-3", src: "/stories/rest3.png", type: "image"},
            {id: "interior-4", src: "/stories/rest4.png", type: "image"},
        ],
    },
    {
        id: "events",
        title: "Мероприятия",
        previewImage: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
        slides: [
            {id: "events-1", src: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg", type: "image"},
            {id: "events-2", src: "/booking/610683031_18097554145907715_1235544446749212874_n..jpg", type: "image"},
        ],
    },
    {
        id: "new",
        title: "Новинки",
        previewImage: "/menu/no-background/Мраморный стейк Рибай.png",
        slides: [
            {id: "new-1", src: "/menu/no-background/Мраморный стейк Рибай.png", type: "image"},
            {id: "new-2", src: "/hero/hero.png", type: "image"},
        ],
    },
];

export const PICKUP_POINT: Organization = {
    name: "Mangal Club",
    city: "г. Грозный",
    address: "ул. Светлая улица, 105А",
    schedule: "Ежедневно с 10:30 до 01:30",
    phone: "+7 (928) 340-50-50",
    intro: "Команда Mangal Clubs переосмысливает приватность и комфорт. Здесь современное гостеприимство встречается с камерной атмосферой, а каждая кабинка становится уютным местом для встреч с близкими.",
    coordinates: {
        latitude: 43.359307,
        longitude: 45.697802,
        accuracy: null,
    },
};

export const BookingMocks: Booking[] = [
    {
        id: "fireplace",
        title: "Каминная",
        description: "Уютная кабинка с атмосферой живого огня для теплых встреч и долгих разговоров",
        image: "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
    },
    {
        id: "warm-corner",
        title: "Теплый угол",
        description: "Мягкий свет, комфорт и спокойная атмосфера для неспешного отдыха",
        image: "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
    },
    {
        id: "loft",
        title: "Лофт-зона",
        description: "Стильная кабинка с кирпичом и мягкими диванами для компании",
        image: "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
    },
    {
        id: "green-room",
        title: "Зеленая гостиная",
        description: "Живые акценты и теплое дерево создают ощущение домашнего уюта",
        image: "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
    },
    {
        id: "private-club",
        title: "Закрытый клуб",
        description: "Приватная зона для своей компании без лишних глаз",
        image: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
    },
    {
        id: "soft-zone",
        title: "Мягкая зона",
        description: "Просторная кабинка с удобными диванами для больших компаний",
        image: "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
    },
    {
        id: "cinema-room",
        title: "Кино-комната",
        description: "Место для отдыха с экраном, приставкой и любимыми фильмами",
        image: "/booking/611264128_18097554673907715_2049357468313814860_n..jpg",
    },
];

export type DeliveryZone = {
    id: string;
    title: string;
    minOrder: number | null;
    price: number;
    freeDeliveryFrom: number | null;
    deliveryTime: string;
};

export const deliveryZones: DeliveryZone[] = [
    {id: "0-3", title: "Зона 0-3 км", minOrder: null, price: 200, freeDeliveryFrom: null, deliveryTime: "от 45 минут"},
    {id: "3-4", title: "Зона 3-4 км", minOrder: 800, price: 250, freeDeliveryFrom: null, deliveryTime: "от 50 минут"},
    {id: "4-5", title: "Зона 4-5 км", minOrder: 900, price: 300, freeDeliveryFrom: null, deliveryTime: "от 55 минут"},
    {id: "5-6", title: "Зона 5-6 км", minOrder: 1000, price: 350, freeDeliveryFrom: null, deliveryTime: "от 60 минут"},
    {id: "6-7", title: "Зона 6-7 км", minOrder: 1100, price: 400, freeDeliveryFrom: null, deliveryTime: "от 65 минут"},
    {id: "7-8", title: "Зона 7-8 км", minOrder: 1200, price: 450, freeDeliveryFrom: null, deliveryTime: "от 70 минут"},
    {id: "8-9", title: "Зона 8-9 км", minOrder: 1300, price: 500, freeDeliveryFrom: null, deliveryTime: "от 75 минут"},
    {id: "9-10", title: "Зона 9-10 км", minOrder: 1400, price: 550, freeDeliveryFrom: null, deliveryTime: "от 80 минут"},
    {id: "10-11", title: "Зона 10-11 км", minOrder: 1500, price: 600, freeDeliveryFrom: null, deliveryTime: "от 85 минут"},
    {id: "11-12", title: "Зона 11-12 км", minOrder: 1600, price: 650, freeDeliveryFrom: null, deliveryTime: "от 90 минут"},
    {id: "12-13", title: "Зона 12-13 км", minOrder: 1700, price: 700, freeDeliveryFrom: null, deliveryTime: "от 95 минут"},
    {id: "13-14", title: "Зона 13-14 км", minOrder: 1800, price: 750, freeDeliveryFrom: null, deliveryTime: "от 100 минут"},
    {id: "14-15", title: "Зона 14-15 км", minOrder: 1900, price: 800, freeDeliveryFrom: null, deliveryTime: "от 105 минут"},
];

export const deliveryPickupPoints = [
    {
        id: "svetlaya",
        city: PICKUP_POINT.city,
        address: PICKUP_POINT.address,
    },
];

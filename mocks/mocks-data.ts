import {Category, MenuCategory} from "@/types/products";
import {Story} from "@/types/story";
import {Organization} from "@/types/organization";
import {Booking, BookingCategory} from "@/types/booking";

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
        title: "Салаты",
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
                image: "/menu/steak/Мраморный стейк томагавк.jpg",
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
                image: "/menu/steak/Мраморный стейк Рибай.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
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
                image: "/menu/mangal/Люля кебаб говядина.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "4",
                name: "Шашлык куриный",
                description: "Куриный шашлык с дымным ароматом",
                weight: "300 г",
                price: 550,
                image: "/menu/mangal/Куриные крылышки.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "5",
                name: "Люля-кебаб из баранины",
                description: "Сочный люля-кебаб из баранины",
                weight: "230 г",
                price: 650,
                image: "/menu/mangal/Люля кебаб баранина.jpg",
                isHit: true,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "6",
                name: "Стейк из говядины",
                description: "Стейк с овощами на гриле",
                weight: "320 г",
                price: 890,
                image: "/menu/mangal/Антрекоты.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
        ],
    },
    {
        id: categories[2].id,
        title: categories[2].title,
        icon: "grill",
        items: [
            {
                id: "11",
                name: "Салат с бурратой",
                description: "Буратта, микс салата, томаты",
                weight: "230 г",
                price: 590,
                image: "/menu/salats/Салат с бураттой.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "14",
                name: "Греческий салат",
                description: "Помидоры, огурцы, болгарский перец, лук маслины и оливки, сыр фета",
                weight: "300 г",
                price: 550,
                image: "/menu/salats/Греческий салат.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "15",
                name: "Салат Капрезе",
                description: "Томаты, базилик, моцарелла",
                weight: "230 г",
                price: 650,
                image: "/menu/salats/Салат капрезе.jpg",
                isHit: true,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "16",
                name: "Салат из хрустящих баклажанов",
                description: "Салат из хрустящих баклажанов, со спелыми помидорами черри, миксом",
                weight: "320 г",
                price: 890,
                image: "/menu/salats/Салат из хрустящих баклажанов.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
            {
                id: "116",
                name: "Свежий салат",
                description: "Помидоры, огурцы, лук",
                weight: "320 г",
                price: 890,
                image: "/menu/salats/Свежий салат.jpg",
                isHit: false,
                calories: 1200,
                carbs: 24,
                fats: 64,
                proteins: 80,
            },
        ],
    },
];

export const StoriesData: Story[] = [
    {
        id: "delivery",
        title: "Доставка",
        previewImage: "/stories/delivery/story-save.com_Instagram_mangalclubs_3834710151765166617.jpg",
        slides: [
            {
                id: "delivery-1",
                src: "/stories/delivery/story-save.com_Instagram_mangalclubs_3524636564161616270.jpg",
                type: "image"
            },
            {
                id: "delivery-2",
                src: "/stories/delivery/story-save.com_Instagram_mangalclubs_3834710202994431662.jpg",
                type: "image"
            },
            {
                id: "delivery-3",
                src: "/stories/delivery/story-save.com_Instagram_mangalclubs_3834710151765166617.jpg",
                type: "image"
            },
            {
                id: "delivery-4",
                src: "/stories/delivery/story-save.com_Instagram_mangalclubs_3834710048291748543.jpg",
                type: "image"
            },
            {
                id: "delivery-5",
                src: "/stories/delivery/story-save.com_Instagram_mangalclubs_3834709189977711846.jpg",
                type: "image"
            },
        ],
    },
    {
        id: "sauna",
        title: "Сауна Mangal",
        previewImage: "/stories/sauna/story-save.com_Instagram_mangalclubs_3867130753218028097.jpg",
        slides: [
            {
                id: "sauna-1",
                src: "/stories/sauna/story-save.com_Instagram_mangalclubs_3867130753352259742.jpg",
                type: "image"
            },
            {
                id: "sauna-2",
                src: "/stories/sauna/story-save.com_Instagram_mangalclubs_3867130753218028097.jpg",
                type: "image"
            },
            {
                id: "sauna-3",
                src: "/stories/sauna/story-save.com_Instagram_mangalclubs_3867130750248452637.jpg",
                type: "image"
            },
            {
                id: "sauna-4",
                src: "/stories/sauna/story-save.com_Instagram_mangalclubs_3867130748897879169.jpg",
                type: "image"
            },
            {
                id: "sauna-5",
                src: "/stories/sauna/story-save.com_Instagram_mangalclubs_3867130748646239697.jpg",
                type: "image"
            },
        ],
    },
    {
        id: "vip-fazenda",
        title: "VIP FAZENDA",
        previewImage: "/stories/vip-fazenda/story-save.com_Instagram_mangalclubs_3801707989854605294.jpg",
        slides: [
            {
                id: "vip-fazenda-1",
                src: "/stories/vip-fazenda/story-save.com_Instagram_mangalclubs_3801707989854605294.jpg",
                type: "image"
            },
            {
                id: "vip-fazenda-2",
                src: "/stories/vip-fazenda/story-save.com_Instagram_mangalclubs_3801708386996456768.jpg",
                type: "image"
            },
            {
                id: "vip-fazenda-3",
                src: "/stories/vip-fazenda/story-save.com_Instagram_mangalclubs_3801708283296482743.jpg",
                type: "image"
            },
            {
                id: "vip-fazenda-4",
                src: "/stories/vip-fazenda/story-save.com_Instagram_mangalclubs_3801708282700931770.jpg",
                type: "image"
            },
            {
                id: "vip-fazenda-5",
                src: "/stories/vip-fazenda/story-save.com_Instagram_mangalclubs_3801708280670891279.jpg",
                type: "image"
            },
        ],
    },
];

export const Organizations: Organization[] = [
    {
        id: "fazenda",
        name: "Fazenda",
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
    },
    {
        id: "mangal-club",
        name: "Mangal Club",
        city: "г. Грозный",
        address: "ул. Окраинная, 4",
        schedule: "Ежедневно с 10:30 до 01:30",
        phone: "+7 (983) 999-50-50",
        intro: "Команда Mangal Clubs переосмысливает приватность и комфорт. Здесь современное гостеприимство встречается с камерной атмосферой, а каждая кабинка становится уютным местом для встреч с близкими.",
        coordinates: {
            latitude: 43.346346,
            longitude: 45.694209,
            accuracy: null,
        },
    }
];

export const BookingCategories: BookingCategory[] = [
    {
        id: "vip",
        title: "VIP-кабинки",
        description: "Приватные комнаты для ужинов, семейных встреч и вечеров без лишнего шума.",
        image: "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
    },
    {
        id: "sauna-pool",
        title: "Сауна и бассейн",
        description: "Теплая зона отдыха для спокойного восстановления и встреч своей компанией.",
        image: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
    },
    {
        id: "tables",
        title: "Столики",
        description: "Удобные места в зале для быстрых встреч, ужинов и больших компаний.",
        image: "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
    },
];

export const BookingMocks: Booking[] = [
    {
        id: "fireplace",
        organizationId: "fazenda",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Каминная",
        description: "Уютная кабинка с атмосферой живого огня для теплых встреч и долгих разговоров",
        longDescription: "Каминная подходит для вечеров, где хочется больше тишины, мягкого света и личного пространства. Здесь удобно собраться небольшой компанией, заказать мясо с мангала и провести время без спешки.",
        image: "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
        images: [
            "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
            "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
        ],
        capacity: "до 6 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Приватная посадка", "Мягкие диваны", "Атмосферный свет"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 6 человек"},
            {label: "Подходит", value: "ужин, встреча, день рождения"},
        ],
    },
    {
        id: "warm-corner",
        organizationId: "fazenda",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Теплый угол",
        description: "Мягкий свет, комфорт и спокойная атмосфера для неспешного отдыха",
        longDescription: "Теплый угол создан для камерного отдыха без суеты. В этой зоне приятно задержаться за ужином, отметить небольшое событие или просто провести вечер с близкими.",
        image: "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
        images: [
            "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
            "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
        ],
        capacity: "до 5 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Камерная атмосфера", "Удобная посадка", "Вызов официанта"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 5 человек"},
            {label: "Подходит", value: "спокойный ужин, встреча"},
        ],
    },
    {
        id: "loft",
        organizationId: "mangal-club",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Лофт-зона",
        description: "Стильная кабинка с кирпичом и мягкими диванами для компании",
        longDescription: "Лофт-зона держит баланс между приватностью и живой ресторанной атмосферой. Хороший выбор для компании, которой важно удобное место, выразительный интерьер и быстрый сервис.",
        image: "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
        images: [
            "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
            "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
        ],
        capacity: "до 8 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Больше пространства", "Диванная посадка", "Удобно для компании"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 8 человек"},
            {label: "Подходит", value: "компания, праздник, деловой ужин"},
        ],
    },
    {
        id: "green-room",
        organizationId: "fazenda",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Зеленая гостиная",
        description: "Живые акценты и теплое дерево создают ощущение домашнего уюта",
        longDescription: "Зеленая гостиная звучит мягче и спокойнее остальных зон. Здесь много теплых фактур, поэтому пространство хорошо подходит для семейного ужина или неторопливой встречи.",
        image: "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
        images: [
            "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
            "/booking/611264128_18097554673907715_2049357468313814860_n..jpg",
        ],
        capacity: "до 6 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Теплые материалы", "Спокойный свет", "Приватный стол"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 6 человек"},
            {label: "Подходит", value: "семейный ужин, свидание"},
        ],
    },
    {
        id: "private-club",
        organizationId: "mangal-club",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Закрытый клуб",
        description: "Приватная зона для своей компании без лишних глаз",
        longDescription: "Закрытый клуб выбирают, когда важны уединение и уверенность, что вечер останется внутри вашей компании. Зона подходит для больших заказов, праздников и деловых встреч.",
        image: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
        images: [
            "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
            "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
        ],
        capacity: "до 10 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Максимум приватности", "Для больших заказов", "Отдельная атмосфера"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 10 человек"},
            {label: "Подходит", value: "праздник, закрытая встреча"},
        ],
    },
    {
        id: "soft-zone",
        organizationId: "mangal-club",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Мягкая зона",
        description: "Просторная кабинка с удобными диванами для больших компаний",
        longDescription: "Мягкая зона рассчитана на долгие вечера и свободную посадку. Здесь удобно разделить закуски, горячее с мангала и спокойно общаться всей компанией.",
        image: "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
        images: [
            "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
            "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
        ],
        capacity: "до 9 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Просторные диваны", "Свободная посадка", "Для компаний"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 9 человек"},
            {label: "Подходит", value: "компания друзей, праздник"},
        ],
    },
    {
        id: "cinema-room",
        organizationId: "mangal-club",
        categoryId: "vip",
        categoryTitle: "VIP-кабинка",
        title: "Кино-комната",
        description: "Место для отдыха с экраном, приставкой и любимыми фильмами",
        longDescription: "Кино-комната подойдет тем, кто хочет совместить ресторанный ужин с домашним отдыхом. Можно собраться на фильм, игру или спокойный вечер без формального настроения.",
        image: "/booking/611264128_18097554673907715_2049357468313814860_n..jpg",
        images: [
            "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
            "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
        ],
        capacity: "до 7 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Экран", "Игровая приставка", "Неформальный отдых"],
        details: [
            {label: "Формат", value: "VIP-кабинка"},
            {label: "Гости", value: "до 7 человек"},
            {label: "Подходит", value: "фильм, игра, вечер с друзьями"},
        ],
    },
    {
        id: "sauna-room",
        organizationId: "mangal-club",
        categoryId: "sauna-pool",
        categoryTitle: "Сауна и бассейн",
        title: "Сауна Mangal",
        description: "Теплая сауна с зоной отдыха для спокойного восстановления",
        longDescription: "Сауна Mangal — отдельный формат отдыха после насыщенного дня. Можно заранее согласовать удобное время, прийти своей компанией и совместить парную с заказом блюд из ресторана.",
        image: "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
        images: [
            "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
            "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
        ],
        capacity: "до 8 гостей",
        time: "по записи",
        priceNote: "по звонку",
        features: ["Парная", "Зона отдыха", "Можно заказать блюда"],
        details: [
            {label: "Формат", value: "Сауна"},
            {label: "Гости", value: "до 8 человек"},
            {label: "Подходит", value: "отдых, восстановление, встреча"},
        ],
    },
    {
        id: "pool-lounge",
        organizationId: "mangal-club",
        categoryId: "sauna-pool",
        categoryTitle: "Сауна и бассейн",
        title: "Бассейн",
        description: "Прохладная зона с бассейном для отдыха своей компанией",
        longDescription: "Бассейн можно забронировать как отдельную зону отдыха. Это хороший вариант для компании, которой хочется больше движения, расслабленной атмосферы и сервиса рядом.",
        image: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
        images: [
            "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
            "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
        ],
        capacity: "до 10 гостей",
        time: "по записи",
        priceNote: "по звонку",
        features: ["Бассейн", "Приватное время", "Отдых компанией"],
        details: [
            {label: "Формат", value: "Бассейн"},
            {label: "Гости", value: "до 10 человек"},
            {label: "Подходит", value: "отдых, компания, выходной"},
        ],
    },
    {
        id: "sauna-pool-combo",
        organizationId: "mangal-club",
        categoryId: "sauna-pool",
        categoryTitle: "Сауна и бассейн",
        title: "Сауна с бассейном",
        description: "Комбинированный формат для полноценного отдыха без спешки",
        longDescription: "Сауна с бассейном — самый цельный вариант для отдыха: парная, вода, место для разговоров и ресторанный сервис. Время лучше уточнять заранее, чтобы команда подготовила зону к вашему приходу.",
        image: "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
        images: [
            "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
            "/booking/611264128_18097554673907715_2049357468313814860_n..jpg",
        ],
        capacity: "до 10 гостей",
        time: "по записи",
        priceNote: "по звонку",
        features: ["Сауна", "Бассейн", "Зона отдыха"],
        details: [
            {label: "Формат", value: "Сауна + бассейн"},
            {label: "Гости", value: "до 10 человек"},
            {label: "Подходит", value: "полный отдых, компания, праздник"},
        ],
    },
    {
        id: "window-table",
        organizationId: "fazenda",
        categoryId: "tables",
        categoryTitle: "Столики",
        title: "Столик у окна",
        description: "Уютное место в зале для ужина вдвоем или небольшой встречи",
        longDescription: "Столик у окна подойдет для тех, кто хочет остаться в атмосфере общего зала, но выбрать более спокойную посадку. Хороший вариант для ужина, короткой встречи или семейного обеда.",
        image: "/booking/609720157_18097555507907715_5416527739075581508_n..jpg",
        images: [
            "/booking/609686908_18097555516907715_1890579568138563188_n..jpg",
            "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
        ],
        capacity: "2–4 гостя",
        time: "10:30–01:30",
        priceNote: "без депозита",
        features: ["Зал ресторана", "Быстрая посадка", "Удобно для ужина"],
        details: [
            {label: "Формат", value: "Столик"},
            {label: "Гости", value: "2–4 человека"},
            {label: "Подходит", value: "ужин, свидание, встреча"},
        ],
    },
    {
        id: "main-hall-table",
        organizationId: "mangal-club",
        categoryId: "tables",
        categoryTitle: "Столики",
        title: "Столик в основном зале",
        description: "Классическая посадка рядом с живой атмосферой ресторана",
        longDescription: "Столик в основном зале — универсальный вариант, когда важны кухня, сервис и настроение ресторана. Можно быстро забронировать место и прийти к удобному времени.",
        image: "/booking/609982327_18097555342907715_1986147056012483252_n..jpg",
        images: [
            "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
            "/booking/610002010_18097554682907715_6683000151825881101_n..jpg",
        ],
        capacity: "2–6 гостей",
        time: "10:30–01:30",
        priceNote: "без депозита",
        features: ["Основной зал", "Рядом сервис", "Гибкая посадка"],
        details: [
            {label: "Формат", value: "Столик"},
            {label: "Гости", value: "2–6 человек"},
            {label: "Подходит", value: "обед, ужин, встреча"},
        ],
    },
    {
        id: "large-company-table",
        organizationId: "mangal-club",
        categoryId: "tables",
        categoryTitle: "Столики",
        title: "Стол для компании",
        description: "Больше места для общего заказа, праздника или семейного ужина",
        longDescription: "Стол для компании помогает собрать всех вместе без отдельной кабинки. Команда подскажет удобное время и посадку, чтобы на столе хватило места для блюд с мангала, салатов и напитков.",
        image: "/booking/610633596_18097555435907715_5781624860738448425_n..jpg",
        images: [
            "/booking/610683031_18097554145907715_1235544446749212874_n..jpg",
            "/booking/611264128_18097554673907715_2049357468313814860_n..jpg",
        ],
        capacity: "6–12 гостей",
        time: "10:30–01:30",
        priceNote: "по звонку",
        features: ["Для компаний", "Общий заказ", "Можно заранее согласовать посадку"],
        details: [
            {label: "Формат", value: "Большой стол"},
            {label: "Гости", value: "6–12 человек"},
            {label: "Подходит", value: "праздник, семья, друзья"},
        ],
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
    {
        id: "9-10",
        title: "Зона 9-10 км",
        minOrder: 1400,
        price: 550,
        freeDeliveryFrom: null,
        deliveryTime: "от 80 минут"
    },
    {
        id: "10-11",
        title: "Зона 10-11 км",
        minOrder: 1500,
        price: 600,
        freeDeliveryFrom: null,
        deliveryTime: "от 85 минут"
    },
    {
        id: "11-12",
        title: "Зона 11-12 км",
        minOrder: 1600,
        price: 650,
        freeDeliveryFrom: null,
        deliveryTime: "от 90 минут"
    },
    {
        id: "12-13",
        title: "Зона 12-13 км",
        minOrder: 1700,
        price: 700,
        freeDeliveryFrom: null,
        deliveryTime: "от 95 минут"
    },
    {
        id: "13-14",
        title: "Зона 13-14 км",
        minOrder: 1800,
        price: 750,
        freeDeliveryFrom: null,
        deliveryTime: "от 100 минут"
    },
    {
        id: "14-15",
        title: "Зона 14-15 км",
        minOrder: 1900,
        price: 800,
        freeDeliveryFrom: null,
        deliveryTime: "от 105 минут"
    },
];


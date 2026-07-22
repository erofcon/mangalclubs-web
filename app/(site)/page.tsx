import type {Metadata} from "next";

import {MainScreen} from "@/feautures/screens/main/MainScreen";

export const metadata: Metadata = {
    title: "Сеть ресторанов с доставкой в Грозном",
    description: "Меню Mangal Clubs, доставка, самовывоз и бронирование приватных зон в Грозном.",
    alternates: {
        canonical: "/",
    },
};

export default MainScreen;

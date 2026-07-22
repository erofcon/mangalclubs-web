import type {Metadata} from "next";

import {DeliveryScreen} from "@/feautures/screens/delivery/DeliveryScreen";

export const metadata: Metadata = {
    title: "Доставка и самовывоз",
    description: "Оформите доставку или самовывоз блюд Mangal Clubs в Грозном.",
    alternates: {
        canonical: "/delivery",
    },
};

export default DeliveryScreen;

import type {Metadata} from "next";

import {AboutScreen} from "@/feautures/screens/about/AboutScreen";

export const metadata: Metadata = {
    title: "О ресторанах",
    description: "Информация о ресторанах Mangal Clubs, атмосфере, адресах и формате отдыха.",
    alternates: {
        canonical: "/about",
    },
};

export default AboutScreen;

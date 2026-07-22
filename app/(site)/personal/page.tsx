import type {Metadata} from "next";

import {PersonalScreen} from "@/feautures/screens/personal/PersonalScreen";

export const metadata: Metadata = {
    title: "Личный кабинет",
    description: "Личный кабинет гостя Mangal Clubs.",
    robots: {
        index: false,
        follow: false,
    },
};

export default PersonalScreen;

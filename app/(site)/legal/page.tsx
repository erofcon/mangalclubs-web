import type {Metadata} from "next";

import {LegalScreen} from "@/feautures/screens/legal/LegalScreen";

export const metadata: Metadata = {
    title: "Правовая информация",
    description: "Согласие на обработку персональных данных, политика обработки персональных данных, cookie и условия сервиса Mangal Clubs.",
    alternates: {
        canonical: "/legal",
    },
};

export default LegalScreen;

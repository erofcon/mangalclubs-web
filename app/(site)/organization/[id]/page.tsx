import type {Metadata} from "next";

import {OrganizationScreen} from "@/feautures/screens/organization/OrganizationScreen";

type OrganizationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({params}: OrganizationPageProps): Promise<Metadata> {
    const {id} = await params;

    return {
        title: "Ресторан",
        description: "Адрес, контакты, условия доставки и самовывоза ресторана Mangal Clubs.",
        alternates: {
            canonical: `/organization/${encodeURIComponent(id)}`,
        },
    };
}

export default OrganizationScreen;

import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {OrganizationScreen} from "@/feautures/screens/organization/OrganizationScreen";
import {getOrganizationsForSeo} from "@/utils/seo-organizations";

type OrganizationPageProps = {
    params: Promise<{ id: string }>;
};

const findOrganization = async (id: string) => {
    const organizations = await getOrganizationsForSeo();

    if (!organizations) {
        return {organization: null, dataAvailable: false};
    }

    return {
        organization: organizations.find((item) => item.id === id || item.slug === id) ?? null,
        dataAvailable: true,
    };
};

export async function generateMetadata({params}: OrganizationPageProps): Promise<Metadata> {
    const {id} = await params;
    const {organization} = await findOrganization(id);

    if (organization) {
        return {
            title: `${organization.name} — ресторан в ${organization.city}`,
            description: organization.intro || `Адрес, контакты и график работы ресторана ${organization.name}.`,
            alternates: {
                canonical: `/organization/${encodeURIComponent(organization.slug ?? organization.id)}`,
            },
        };
    }

    return {
        title: "Ресторан",
        description: "Адрес, контакты, условия доставки и самовывоза ресторана Mangal Clubs.",
        alternates: {canonical: `/organization/${encodeURIComponent(id)}`},
    };
}

export default async function OrganizationPage({params}: OrganizationPageProps) {
    const {id} = await params;
    const {organization, dataAvailable} = await findOrganization(id);

    // If the public source confirms the restaurant does not exist, return a
    // real HTTP 404 instead of a visually similar page with a 200 response.
    if (dataAvailable && !organization) {
        notFound();
    }

    return <OrganizationScreen initialOrganization={organization ?? undefined}/>;
}

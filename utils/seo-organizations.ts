import type {Organization, WorkingHour} from "@/types/organization";

type ApiOrganization = Omit<Organization, "schedule" | "working_hours"> & {
    working_hours?: WorkingHour[] | null;
};

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "https://mangalclubs.ru").replace(/\/+$/, "");

const toSeoOrganization = (organization: ApiOrganization): Organization => ({
    ...organization,
    intro: organization.intro ?? "",
    schedule: "График работы уточняйте по телефону",
    scheduleLines: ["График работы уточняйте по телефону"],
    working_hours: organization.working_hours ?? [],
});

/** Public API data used to make restaurant URLs and the sitemap crawlable. */
export async function getOrganizationsForSeo(): Promise<Organization[] | null> {
    try {
        const response = await fetch(`${API_ORIGIN}/api/v1/organizations`, {
            next: {revalidate: 3600},
        });

        if (!response.ok) return null;

        const organizations = await response.json() as ApiOrganization[];
        return Array.isArray(organizations) ? organizations.map(toSeoOrganization) : null;
    } catch {
        return null;
    }
}

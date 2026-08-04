import type {MetadataRoute} from "next";
import {getOrganizationsForSeo} from "@/utils/seo-organizations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mangalclubs.ru";

const routes = [
    {path: "/", priority: 1},
    {path: "/booking", priority: 0.85},
    {path: "/delivery", priority: 0.8},
    {path: "/about", priority: 0.7},
    {path: "/legal", priority: 0.3},
] as const;

// Lets the generated sitemap keep working during a short API outage.
const fallbackRestaurantPaths = ["/organization/fazenda", "/organization/mangalclubs"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date();
    const organizations = await getOrganizationsForSeo();
    const restaurantPaths = organizations
        ? organizations
            .map((organization) => organization.slug ? `/organization/${encodeURIComponent(organization.slug)}` : null)
            .filter((path): path is string => Boolean(path))
        : fallbackRestaurantPaths;

    return [
        ...routes.map((route) => ({
            url: `${siteUrl}${route.path}`,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: route.priority,
        })),
        ...restaurantPaths.map((path) => ({
            url: `${siteUrl}${path}`,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })),
    ];
}

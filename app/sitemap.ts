import type {MetadataRoute} from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mangalclubs.ru";

const routes = [
    {path: "/", priority: 1},
    {path: "/booking", priority: 0.85},
    {path: "/delivery", priority: 0.8},
    {path: "/about", priority: 0.7},
    {path: "/legal", priority: 0.3},
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return routes.map((route) => ({
        url: `${siteUrl}${route.path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: route.priority,
    }));
}

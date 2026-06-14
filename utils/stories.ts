import type {Story} from "@/types/story";
import {apiFetch} from "@/utils/api";

type ApiStorySlide = {
    id: string;
    src: string;
    type: "image" | "video";
    title?: string | null;
    caption?: string | null;
    duration_seconds?: number | null;
    sort_order?: number | null;
};

type ApiStory = {
    id: string;
    slug: string;
    title: string;
    previewImage: string;
    description?: string | null;
    slides?: ApiStorySlide[] | null;
    sort_order?: number | null;
};

const normalizeMediaUrl = (url?: string | null) => {
    const value = url?.trim();

    if (!value) return undefined;

    if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
        return value;
    }

    return `/${value.replace(/^\/+/, "")}`;
};

const normalizeStorySlide = (slide: ApiStorySlide): Story["slides"][number] | null => {
    const src = normalizeMediaUrl(slide.src);

    if (!src) return null;

    return {
        id: slide.id,
        src,
        type: slide.type,
        title: slide.title ?? undefined,
        caption: slide.caption ?? undefined,
        durationMs: slide.duration_seconds ? slide.duration_seconds * 1000 : undefined,
        sortOrder: slide.sort_order ?? 0,
    };
};

export const normalizeStory = (story: ApiStory): Story | null => {
    const previewImage = normalizeMediaUrl(story.previewImage);

    if (!previewImage) return null;

    const slides = (story.slides ?? [])
        .map(normalizeStorySlide)
        .filter((slide): slide is Story["slides"][number] => Boolean(slide))
        .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));

    if (slides.length === 0) return null;

    return {
        id: story.id,
        slug: story.slug,
        title: story.title,
        previewImage,
        description: story.description ?? undefined,
        slides,
        sortOrder: story.sort_order ?? 0,
    };
};

export const loadStories = async (signal?: AbortSignal) => {
    const stories = await apiFetch<ApiStory[]>("/api/v1/stories", {signal});

    return stories
        .map(normalizeStory)
        .filter((story): story is Story => Boolean(story))
        .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));
};

export const loadStory = async (slug: string, signal?: AbortSignal) => {
    const story = await apiFetch<ApiStory>(`/api/v1/stories/${encodeURIComponent(slug)}`, {signal});

    return normalizeStory(story);
};

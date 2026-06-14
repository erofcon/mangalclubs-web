export type Story = {
    id: number | string;
    slug?: string;
    title?: string;
    previewImage: string;
    description?: string;
    sortOrder?: number;
    slides: {
        id: number | string;
        src: string;
        type: "image" | "video";
        title?: string;
        caption?: string;
        poster?: string;
        durationMs?: number;
        sortOrder?: number;
    }[];
};

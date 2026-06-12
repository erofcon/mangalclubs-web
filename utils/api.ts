export const buildApiUrl = (path: string, params?: Record<string, string | null | undefined>) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(normalizedPath, window.location.origin);

    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
};

export const apiFetch = async <T>(
    path: string,
    options: RequestInit & {
        params?: Record<string, string | null | undefined>;
    } = {},
) => {
    const {params, ...requestOptions} = options;
    const headers = new Headers(requestOptions.headers);

    if (requestOptions.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(buildApiUrl(path, params), {
        cache: "no-store",
        ...requestOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        const detail = Array.isArray(error?.detail)
            ? error.detail
                .map((item: {loc?: Array<string | number>; msg?: string}) => {
                    const field = item.loc?.filter((part) => part !== "body").join(".");

                    return field ? `${field}: ${item.msg}` : item.msg;
                })
                .filter(Boolean)
                .join(", ")
            : error?.detail;

        throw new Error(
            detail ||
            error?.message ||
            `Сервер ответил статусом ${response.status}`,
        );
    }

    return (await response.json()) as T;
};

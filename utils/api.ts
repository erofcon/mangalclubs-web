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

export class ApiError extends Error {
    status: number;
    payload: unknown;

    constructor(message: string, status: number, payload: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.payload = payload;
    }
}

export const isUnauthorizedError = (error: unknown) => (
    error instanceof ApiError && error.status === 401
);

const parseJsonSafely = (text: string) => {
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

export const apiFetch = async <T>(
    path: string,
    options: RequestInit & {
        params?: Record<string, string | null | undefined>;
    } = {},
) => {
    const {params, ...requestOptions} = options;
    const headers = new Headers(requestOptions.headers);
    const isFormDataBody = typeof FormData !== "undefined" && requestOptions.body instanceof FormData;

    if (requestOptions.body && !isFormDataBody && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(buildApiUrl(path, params), {
        cache: "no-store",
        ...requestOptions,
        headers,
    });

    if (!response.ok) {
        const error = parseJsonSafely(await response.text().catch(() => ""));
        const detail = Array.isArray(error?.detail)
            ? error.detail
                .map((item: {loc?: Array<string | number>; msg?: string}) => {
                    const field = item.loc?.filter((part) => part !== "body").join(".");

                    return field ? `${field}: ${item.msg}` : item.msg;
                })
                .filter(Boolean)
                .join(", ")
            : error?.detail;

        throw new ApiError(
            detail ||
            error?.message ||
            `Server responded with status ${response.status}`,
            response.status,
            error,
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();

    if (!text) {
        return undefined as T;
    }

    return JSON.parse(text) as T;
};

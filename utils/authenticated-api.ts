import {useAuthStore} from "@/store/auth-store";
import {isUnauthorizedError} from "@/utils/api";

export const runWithAuthRefresh = async <T>(
    request: (accessToken: string) => Promise<T>,
    accessToken = useAuthStore.getState().accessToken,
) => {
    if (!accessToken) {
        throw new Error("Authorization required");
    }

    try {
        return await request(accessToken);
    } catch (error) {
        if (!isUnauthorizedError(error)) {
            throw error;
        }

        const refreshed = await useAuthStore.getState().refreshTokens();
        const nextAccessToken = useAuthStore.getState().accessToken;

        if (!refreshed || !nextAccessToken) {
            throw error;
        }

        return request(nextAccessToken);
    }
};

export const runWithOptionalAuthRefresh = async <T>(
    request: (accessToken: string | null) => Promise<T>,
    accessToken = useAuthStore.getState().accessToken,
) => {
    if (!accessToken) {
        return request(null);
    }

    try {
        return await request(accessToken);
    } catch (error) {
        if (!isUnauthorizedError(error)) {
            throw error;
        }

        const refreshed = await useAuthStore.getState().refreshTokens();
        const nextAccessToken = useAuthStore.getState().accessToken;

        if (!refreshed || !nextAccessToken) {
            throw error;
        }

        return request(nextAccessToken);
    }
};

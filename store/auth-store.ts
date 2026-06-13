import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {apiFetch} from "@/utils/api";

export type AuthUser = {
    id?: string;
    subject_type?: string;
    phone?: string;
    name?: string | null;
    email?: string | null;
    birthday?: string | null;
    avatarUrl?: string | null;
    role?: string;
};

type AuthStore = {
    accessToken: string | null;
    refreshToken: string | null;
    tokenType: string;
    expiresIn: number | null;
    user: AuthUser | null;
    pendingPhone: string | null;
    pendingPhoneForApi: string | null;
    isAuthenticated: boolean;
    isRequestingCode: boolean;
    isConfirmingCode: boolean;
    errorMessage: string | null;

    requestCode: (phone: string) => Promise<boolean>;
    confirmCode: (code: string) => Promise<boolean>;
    refreshTokens: () => Promise<boolean>;
    setUser: (user: AuthUser | null) => void;
    clearPendingPhone: () => void;
    clearError: () => void;
    logout: () => void;
};

type TokenPair = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
};

const DEVICE_ID_STORAGE_KEY = "mangalclubs-device-id";

const normalizePhoneForApi = (phone: string) => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 11) {
        return `+${digits}`;
    }

    return phone.trim();
};

const createFallbackId = () => {
    return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

const getDeviceId = () => {
    if (typeof window === "undefined") {
        return createFallbackId();
    }

    const existingDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);

    if (existingDeviceId) {
        return existingDeviceId;
    }

    const nextDeviceId = window.crypto?.randomUUID?.() ?? createFallbackId();

    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, nextDeviceId);

    return nextDeviceId;
};

const getDeviceName = () => {
    if (typeof navigator === "undefined") {
        return "Web browser";
    }

    const platform = navigator.platform || "Unknown platform";
    const userAgent = navigator.userAgent || "Unknown browser";

    return `Web browser on ${platform} (${userAgent.slice(0, 120)})`;
};

const getDevicePayload = () => ({
    device_id: getDeviceId(),
    device_name: getDeviceName(),
});

const applyTokenPair = (tokens: TokenPair) => ({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type,
    expiresIn: tokens.expires_in,
    user: tokens.user,
    pendingPhone: null,
    pendingPhoneForApi: null,
    isAuthenticated: true,
    errorMessage: null,
});

let refreshTokensPromise: Promise<boolean> | null = null;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            tokenType: "bearer",
            expiresIn: null,
            user: null,
            pendingPhone: null,
            pendingPhoneForApi: null,
            isAuthenticated: false,
            isRequestingCode: false,
            isConfirmingCode: false,
            errorMessage: null,

            requestCode: async (phone) => {
                const phoneForApi = normalizePhoneForApi(phone);

                set({
                    isRequestingCode: true,
                    errorMessage: null,
                });

                try {
                    await apiFetch("/api/v1/auth/customer/otp/request", {
                        method: "POST",
                        body: JSON.stringify({
                            ...getDevicePayload(),
                            phone: phoneForApi,
                        }),
                    });

                    set({
                        pendingPhone: phone,
                        pendingPhoneForApi: phoneForApi,
                        isRequestingCode: false,
                    });

                    return true;
                } catch (error) {
                    set({
                        isRequestingCode: false,
                        errorMessage: error instanceof Error
                            ? error.message
                            : "Не удалось отправить код",
                    });

                    return false;
                }
            },

            confirmCode: async (code) => {
                const phone = get().pendingPhoneForApi;

                if (!phone) {
                    return false;
                }

                set({
                    isConfirmingCode: true,
                    errorMessage: null,
                });

                try {
                    const tokens = await apiFetch<TokenPair>("/api/v1/auth/customer/otp/verify", {
                        method: "POST",
                        body: JSON.stringify({
                            ...getDevicePayload(),
                            phone,
                            code,
                        }),
                    });

                    set({
                        ...applyTokenPair(tokens),
                        isConfirmingCode: false,
                    });

                    return true;
                } catch (error) {
                    set({
                        isConfirmingCode: false,
                        errorMessage: error instanceof Error
                            ? error.message
                            : "Не удалось подтвердить код",
                    });

                    return false;
                }
            },

            refreshTokens: async () => {
                if (refreshTokensPromise) {
                    return refreshTokensPromise;
                }

                const {refreshToken} = get();

                if (!refreshToken) {
                    return false;
                }

                refreshTokensPromise = (async () => {
                    try {
                        const tokens = await apiFetch<TokenPair>("/api/v1/auth/refresh", {
                            method: "POST",
                            body: JSON.stringify({
                                ...getDevicePayload(),
                                refresh_token: refreshToken,
                            }),
                        });

                        set(applyTokenPair(tokens));

                        return true;
                    } catch {
                        get().logout();

                        return false;
                    }
                })();

                try {
                    return await refreshTokensPromise;
                } finally {
                    refreshTokensPromise = null;
                }
            },

            setUser: (user) => set({user}),

            clearPendingPhone: () =>
                set({
                    pendingPhone: null,
                    pendingPhoneForApi: null,
                    errorMessage: null,
                }),

            clearError: () => set({errorMessage: null}),

            logout: () =>
                set({
                    accessToken: null,
                    refreshToken: null,
                    tokenType: "bearer",
                    expiresIn: null,
                    user: null,
                    pendingPhone: null,
                    pendingPhoneForApi: null,
                    isAuthenticated: false,
                    isRequestingCode: false,
                    isConfirmingCode: false,
                    errorMessage: null,
                }),
        }),
        {
            name: "mangalclubs-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                tokenType: state.tokenType,
                expiresIn: state.expiresIn,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);

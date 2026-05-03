import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type AuthUser = {
    phone: string;
};

type AuthStore = {
    token: string | null;
    user: AuthUser | null;
    pendingPhone: string | null;
    isAuthenticated: boolean;

    requestCode: (phone: string) => void;
    confirmCode: (code: string) => void;
    logout: () => void;
};

const createMockToken = (phone: string) => {
    return `mock-token-${phone.replace(/\D/g, "")}-${Date.now()}`;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            pendingPhone: null,
            isAuthenticated: false,

            requestCode: (phone) =>
                set({
                    pendingPhone: phone,
                }),

            confirmCode: () => {
                const phone = get().pendingPhone;

                if (!phone) return;

                set({
                    token: createMockToken(phone),
                    user: {phone},
                    pendingPhone: null,
                    isAuthenticated: true,
                });
            },

            logout: () =>
                set({
                    token: null,
                    user: null,
                    pendingPhone: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "mangalclubs-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);

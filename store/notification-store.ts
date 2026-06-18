import {create} from "zustand";
import {useAuthStore} from "@/store/auth-store";
import {
    getCustomerUnreadNotifications,
    markCustomerOrderNotificationsRead,
    type CustomerOrderNotification,
} from "@/utils/notifications";

type NotificationStore = {
    unreadNotifications: CustomerOrderNotification[];
    setUnreadNotifications: (notifications: CustomerOrderNotification[]) => void;
    clearUnreadNotifications: () => void;
    loadUnreadNotifications: (accessToken?: string | null) => Promise<CustomerOrderNotification[]>;
    markOrderRead: (orderId: string, accessToken?: string | null) => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
    unreadNotifications: [],

    setUnreadNotifications: (notifications) => set({unreadNotifications: notifications}),

    clearUnreadNotifications: () => set({unreadNotifications: []}),

    loadUnreadNotifications: async (accessToken = useAuthStore.getState().accessToken) => {
        if (!accessToken) {
            set({unreadNotifications: []});
            return [];
        }

        const unread = await getCustomerUnreadNotifications(accessToken);

        set({unreadNotifications: unread.notifications});

        return unread.notifications;
    },

    markOrderRead: async (orderId, accessToken = useAuthStore.getState().accessToken) => {
        if (!accessToken) return;

        set({
            unreadNotifications: get().unreadNotifications.filter((notification) => notification.orderId !== orderId),
        });

        try {
            await markCustomerOrderNotificationsRead(accessToken, orderId);
        } catch (error) {
            void get().loadUnreadNotifications(accessToken).catch(() => undefined);
            throw error;
        }
    },
}));

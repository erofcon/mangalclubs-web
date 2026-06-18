import {apiFetch} from "@/utils/api";
import {runWithAuthRefresh} from "@/utils/authenticated-api";

export type OrderNotificationEvent =
    | "order_created"
    | "pickup_ready"
    | "delivery_on_way"
    | "delivery_delivered";

export type CustomerOrderNotification = {
    id: string;
    orderId: string;
    eventType: OrderNotificationEvent | string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
};

export type CustomerUnreadNotifications = {
    count: number;
    orderIds: string[];
    notifications: CustomerOrderNotification[];
};

const getAuthHeaders = (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
});

export const getCustomerUnreadNotifications = (accessToken: string) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerUnreadNotifications>("/api/v1/notifications/me/unread", {
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

export const markCustomerOrderNotificationsRead = (
    accessToken: string,
    orderId: string,
) => (
    runWithAuthRefresh(
        (token) => apiFetch<void>(`/api/v1/notifications/me/orders/${encodeURIComponent(orderId)}/read`, {
            method: "POST",
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

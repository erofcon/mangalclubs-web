import {apiFetch} from "@/utils/api";
import {runWithAuthRefresh} from "@/utils/authenticated-api";
import type {OrderCreationStatus, PaymentStatus} from "@/utils/orders";

export type CustomerProfile = {
    id: string;
    phone: string;
    name?: string | null;
    email?: string | null;
    birthday?: string | null;
    avatarUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CustomerProfilePatch = {
    name?: string;
    email?: string;
    birthday?: string;
};

export type CustomerOrderItem = {
    id?: string;
    productId?: string;
    name?: string;
    productName?: string;
    title?: string;
    amount?: number;
    quantity?: number;
    price?: number;
    sum?: number;
    total?: number;
    modifiers?: CustomerOrderItem[];
};

export type CustomerOrder = {
    id: string;
    organizationId: string;
    organizationSlug?: string;
    orderType?: "delivery" | "pickup";
    phone?: string;
    comment?: string | null;
    completeBefore?: string | null;
    guestsCount?: number;
    deliveryPoint?: unknown;
    items?: CustomerOrderItem[];
    iikoOrderId?: string | null;
    iikoExternalNumber?: string | null;
    creationStatus?: OrderCreationStatus | string | null;
    orderStatus?: string | null;
    paymentStatus?: PaymentStatus | string | null;
    paymentAmountKopecks?: number | null;
    notificationEvent?: "pickup_ready" | "delivery_on_way" | "delivery_delivered" | null;
    totalSum?: number | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CustomerOrderStatus = Partial<CustomerOrder> & {
    id?: string;
    orderStatus?: string | null;
    creationStatus?: OrderCreationStatus | string | null;
    notificationEvent?: CustomerOrder["notificationEvent"];
    paymentStatus?: PaymentStatus | string | null;
    paymentAmountKopecks?: number | null;
    totalSum?: number | null;
};

const getAuthHeaders = (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
});

export const getCustomerProfile = (accessToken: string) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerProfile>("/api/v1/customers/me", {
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

export const updateCustomerProfile = (
    accessToken: string,
    payload: CustomerProfilePatch,
) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerProfile>("/api/v1/customers/me", {
            method: "PATCH",
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
        }),
        accessToken,
    )
);

export const uploadCustomerAvatar = (accessToken: string, file: File) => {
    const formData = new FormData();
    formData.set("avatar", file);

    return runWithAuthRefresh(
        (token) => apiFetch<CustomerProfile>("/api/v1/customers/me/avatar", {
            method: "POST",
            headers: getAuthHeaders(token),
            body: formData,
        }),
        accessToken,
    );
};

export const deleteCustomerAvatar = (accessToken: string) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerProfile | void>("/api/v1/customers/me/avatar", {
            method: "DELETE",
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

export const getCurrentCustomerOrders = (accessToken: string) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerOrder[]>("/api/v1/orders/me/current", {
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

export const getHistoryCustomerOrders = (accessToken: string) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerOrder[]>("/api/v1/orders/me/history", {
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

export const getCustomerOrderStatus = (accessToken: string, orderId: string) => (
    runWithAuthRefresh(
        (token) => apiFetch<CustomerOrderStatus>(`/api/v1/orders/me/${encodeURIComponent(orderId)}/status`, {
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

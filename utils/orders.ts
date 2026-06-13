import {apiFetch} from "@/utils/api";
import {runWithOptionalAuthRefresh} from "@/utils/authenticated-api";

export type OrderRequestType = "delivery" | "pickup";

export type OrderCreateItem = {
    productId: string;
    amount: number;
    price: number;
    productSizeId?: string;
    comment?: string;
    modifiers?: Array<{
        productId: string;
        amount: number;
        productGroupId: string;
        price: number;
    }>;
};

export type OrderCreatePayload = {
    orderType: OrderRequestType;
    organizationId: string;
    organizationSlug?: string;
    successUrl?: string;
    failUrl?: string;
    phone?: string;
    comment?: string;
    completeBefore: string;
    deliveryPoint?: {
        address: {
            city: string;
            street: string;
            house: string;
            index?: string;
            building?: string;
            flat?: string;
            entrance?: string;
            floor?: string;
            doorphone?: string;
            regionId?: string;
        };
        coordinates: {
            latitude: number;
            longitude: number;
        };
        comment?: string;
        externalCartographyId?: string;
    };
    guestsCount: number;
    items: OrderCreateItem[];
};

export type OrderCreateOut = {
    id: string;
    customerId?: string | null;
    correlationId?: string;
    organizationId: string;
    organizationSlug: string;
    iikoOrganizationId: string;
    terminalGroupId: string;
    orderType: OrderRequestType;
    iikoOrderTypeId: string;
    iikoOrderServiceType: string;
    paymentStatus: PaymentStatus;
    totalSum: number;
    payment: {
        id: string;
        status: PaymentStatus;
        amount: number;
        amountKopecks: number;
        bankOrderId: string;
        bankPaymentId: string;
        paymentUrl: string;
    };
    orderInfo?: {
        id?: string;
        posId?: string;
        externalNumber?: string;
        creationStatus?: string;
        errorInfo?: Record<string, unknown>;
    };
};

export type PaymentStatus =
    | "payment_pending"
    | "payment_form_created"
    | "paid"
    | "payment_failed"
    | "payment_cancelled"
    | "payment_expired";

export type OrderCreationStatus =
    | "PaymentPending"
    | "PaymentConfirmed"
    | "IikoCreateInProgress"
    | "IikoCreateFailed"
    | "Success"
    | "Error";

export type OrderStatusOut = {
    id: string;
    correlationId?: string;
    organizationId?: string;
    organizationSlug?: string;
    iikoOrganizationId?: string;
    orderType?: OrderRequestType;
    iikoOrderId?: string | null;
    creationStatus?: OrderCreationStatus | string | null;
    orderStatus?: string | null;
    paymentStatus?: PaymentStatus | string | null;
    paymentAmountKopecks?: number | null;
    number?: number;
    sum?: number;
    totalSum?: number | null;
    completeBefore?: string;
    comment?: string | null;
    notificationEvent?: string;
    shouldNotifyCustomer?: boolean;
    errorInfo?: Record<string, unknown>;
};

export const LAST_ORDER_ID_STORAGE_KEY = "mangalclubs-last-order-id";

const getAuthHeaders = (accessToken?: string | null) => (
    accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
        }
        : undefined
);

export const createOrder = (payload: OrderCreatePayload, accessToken?: string | null) => (
    runWithOptionalAuthRefresh(
        (token) => apiFetch<OrderCreateOut>("/api/v1/orders", {
            method: "POST",
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
        }),
        accessToken,
    )
);

export const getOrderStatus = (
    orderId: string,
    accessToken?: string | null,
) => (
    runWithOptionalAuthRefresh(
        (token) => apiFetch<OrderStatusOut>(`/api/v1/orders/me/${encodeURIComponent(orderId)}/status`, {
            headers: getAuthHeaders(token),
        }),
        accessToken,
    )
);

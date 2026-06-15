import type {CustomerOrder} from "@/utils/customer-profile";

export type StatusTone = "success" | "progress" | "warning" | "danger" | "muted";

export type StatusDescriptor = {
    label: string;
    tone: StatusTone;
};

const fallbackStatus: StatusDescriptor = {
    label: "Статус уточняется",
    tone: "muted",
};

const paymentStatusMap: Record<string, StatusDescriptor> = {
    payment_pending: {label: "Ожидает оплаты", tone: "progress"},
    payment_form_created: {label: "Ссылка на оплату создана", tone: "progress"},
    paid: {label: "Оплачено", tone: "success"},
    payment_failed: {label: "Оплата не прошла", tone: "danger"},
    payment_cancelled: {label: "Оплата отменена", tone: "danger"},
    payment_expired: {label: "Время оплаты истекло", tone: "warning"},
};

const creationStatusMap: Record<string, StatusDescriptor> = {
    PaymentPending: {label: "Ожидает оплаты", tone: "progress"},
    PaymentConfirmed: {label: "Оплата подтверждена", tone: "progress"},
    IikoCreateInProgress: {label: "Передаем в ресторан", tone: "progress"},
    IikoCreateFailed: {label: "Ошибка передачи в ресторан", tone: "warning"},
    Success: {label: "Принят рестораном", tone: "success"},
    Error: {label: "Ошибка заказа", tone: "danger"},
};

const notificationStatusMap: Record<string, StatusDescriptor> = {
    pickup_ready: {label: "Готов к выдаче", tone: "success"},
    delivery_on_way: {label: "Курьер в пути", tone: "progress"},
    delivery_delivered: {label: "Доставлен", tone: "success"},
};

const orderStatusMap: Record<string, StatusDescriptor> = {
    New: {label: "Новый", tone: "progress"},
    Unconfirmed: {label: "Не подтвержден", tone: "warning"},
    WaitCooking: {label: "Ожидает приготовления", tone: "progress"},
    ReadyForCooking: {label: "Передан на кухню", tone: "progress"},
    CookingStarted: {label: "Готовится", tone: "progress"},
    CookingCompleted: {label: "Приготовлен", tone: "success"},
    Waiting: {label: "Ожидает выдачи", tone: "progress"},
    OnWay: {label: "Курьер в пути", tone: "progress"},
    Delivered: {label: "Доставлен", tone: "success"},
    Closed: {label: "Завершен", tone: "success"},
    Cancelled: {label: "Отменен", tone: "danger"},
    Canceled: {label: "Отменен", tone: "danger"},
};

const lowerCaseStatusMap: Record<string, StatusDescriptor> = {
    new: orderStatusMap.New,
    unconfirmed: orderStatusMap.Unconfirmed,
    waitcooking: orderStatusMap.WaitCooking,
    readyforcooking: orderStatusMap.ReadyForCooking,
    cookingstarted: orderStatusMap.CookingStarted,
    cookingcompleted: orderStatusMap.CookingCompleted,
    waiting: orderStatusMap.Waiting,
    onway: orderStatusMap.OnWay,
    delivered: orderStatusMap.Delivered,
    closed: orderStatusMap.Closed,
    cancelled: orderStatusMap.Cancelled,
    canceled: orderStatusMap.Canceled,
    cancel: orderStatusMap.Cancelled,
    completed: orderStatusMap.Closed,
    done: orderStatusMap.Closed,
    success: creationStatusMap.Success,
    error: creationStatusMap.Error,
    failed: {label: "Не выполнен", tone: "danger"},
};

const terminalFailedPaymentStatuses = new Set([
    "payment_failed",
    "payment_cancelled",
    "payment_expired",
]);

const payablePaymentStatuses = new Set([
    "payment_pending",
    "payment_form_created",
]);

const terminalOrderStatuses = new Set([
    "delivered",
    "closed",
    "cancelled",
    "canceled",
]);

const normalizeStatusKey = (value: string) => (
    value.replace(/[\s_-]+/g, "").toLowerCase()
);

const hasCyrillic = (value: string) => /[а-яё]/i.test(value);

const getMappedStatus = (
    value: string | null | undefined,
    map: Record<string, StatusDescriptor>,
    fallbackTone: StatusTone = "muted",
) => {
    if (!value) return fallbackStatus;

    const mapped = map[value] ?? lowerCaseStatusMap[normalizeStatusKey(value)];

    if (mapped) return mapped;

    return {
        label: hasCyrillic(value) ? value : "Статус уточняется",
        tone: fallbackTone,
    };
};

export const getPaymentStatusDescriptor = (status?: string | null): StatusDescriptor => (
    getMappedStatus(status, paymentStatusMap, "progress")
);

export const getCreationStatusDescriptor = (status?: string | null): StatusDescriptor => (
    getMappedStatus(status, creationStatusMap, "progress")
);

export const getOrderStatusDescriptor = (status?: string | null): StatusDescriptor => (
    getMappedStatus(status, orderStatusMap, "progress")
);

export const getNotificationStatusDescriptor = (status?: string | null): StatusDescriptor => (
    getMappedStatus(status, notificationStatusMap, "progress")
);

export const isFailedPaymentStatus = (status?: string | null) => (
    Boolean(status && terminalFailedPaymentStatuses.has(status))
);

export const canContinueOrderPayment = (
    order: Pick<CustomerOrder, "paymentStatus" | "payment">,
) => (
    Boolean(
        order.paymentStatus &&
        payablePaymentStatuses.has(order.paymentStatus) &&
        order.payment?.paymentUrl,
    )
);

export const shouldShowOrderInHistory = (
    order: Pick<CustomerOrder, "paymentStatus" | "orderStatus" | "creationStatus">,
) => (
    isFailedPaymentStatus(order.paymentStatus) ||
    order.creationStatus === "Error" ||
    Boolean(order.orderStatus && terminalOrderStatuses.has(normalizeStatusKey(order.orderStatus)))
);

export const getCustomerOrderStatusDescriptor = (
    order: Pick<CustomerOrder, "notificationEvent" | "orderStatus" | "creationStatus" | "paymentStatus">,
): StatusDescriptor => {
    if (isFailedPaymentStatus(order.paymentStatus)) {
        return getPaymentStatusDescriptor(order.paymentStatus);
    }

    if (order.notificationEvent) {
        return getNotificationStatusDescriptor(order.notificationEvent);
    }

    if (order.orderStatus) {
        return getOrderStatusDescriptor(order.orderStatus);
    }

    if (order.creationStatus) {
        return getCreationStatusDescriptor(order.creationStatus);
    }

    if (order.paymentStatus) {
        return getPaymentStatusDescriptor(order.paymentStatus);
    }

    return fallbackStatus;
};

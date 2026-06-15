"use client";

import Image from "next/image";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {AlertCircle, CheckCircle2, LoaderCircle, Minus, Plus, ShoppingBag, X} from "lucide-react";
import {useUIStore} from "@/store/ui-store";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";
import {useCartStore} from "@/store/cart-store";
import {useOrderStore} from "@/store/order-store";
import type {DeliveryOrderDetails} from "@/store/order-store";
import {useAppDataStore} from "@/store/app-data-store";
import {useAuthStore} from "@/store/auth-store";
import {getCurrentOrderAvailability} from "@/utils/availability";
import {createOrder, LAST_ORDER_ID_STORAGE_KEY} from "@/utils/orders";
import type {OrderCreatePayload} from "@/utils/orders";
import {checkDeliveryZone} from "@/utils/delivery-zones";
import type {DeliveryCheckResult} from "@/utils/delivery-zones";
import type {Organization, WorkingHour} from "@/types/organization";
import {
    PAYMENT_REDIRECT_STATE_STORAGE_KEY,
    PAYMENT_REDIRECT_URL_STORAGE_KEY,
} from "@/utils/payment-return";

type DateMode = "asap" | "today" | "tomorrow" | "dayAfterTomorrow";
type ScheduledDateMode = Exclude<DateMode, "asap">;

type TimeSlot = {
    value: string;
    label: string;
};

type DateOption = {
    mode: DateMode;
    label: string;
    slots: TimeSlot[];
    disabled: boolean;
};

type CheckoutSuccess = {
    orderId: string;
    publicNumber?: string;
    status?: string;
};

const formatDeliveryPrice = (price: number) => (
    `${price.toLocaleString("ru-RU")} ₽`
);

const getDeliveryCheckErrorMessage = (result: DeliveryCheckResult) => {
    if (result.reason === "outside_delivery_area") {
        return "Адрес вне зоны доставки. Сейчас доставляем только по Грозному.";
    }

    if (result.reason === "delivery_tariff_not_configured") {
        return "Для этого адреса пока не настроен тариф доставки.";
    }

    return "Доставка по этому адресу недоступна.";
};

const getDeliveryCheckKey = (delivery: DeliveryOrderDetails | null) => (
    delivery
        ? `${delivery.coordinates.latitude}:${delivery.coordinates.longitude}`
        : ""
);

const getDeliveryTotal = (itemsTotal: number, deliveryPrice: number | null | undefined) => (
    itemsTotal + (deliveryPrice ?? 0)
);

const getProductPlural = (count: number) => {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return "товаров";
    }

    if (lastDigit === 1) {
        return "товар";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return "товара";
    }

    return "товаров";
};

const padTimePart = (value: number) => String(value).padStart(2, "0");

const SLOT_STEP_MINUTES = 30;
const MIN_ORDER_DELAY_MINUTES = 30;

const dateModeOffsets: Record<ScheduledDateMode, number> = {
    today: 0,
    tomorrow: 1,
    dayAfterTomorrow: 2,
};

const addDays = (date: Date, days: number) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);

    return nextDate;
};

const roundUpToHalfHour = (date: Date) => {
    const nextDate = new Date(date);
    const minutes = nextDate.getMinutes();
    const extraMinutes = minutes === 0 || minutes === 30
        ? 0
        : minutes < 30
            ? 30 - minutes
            : 60 - minutes;

    nextDate.setMinutes(minutes + extraMinutes, 0, 0);

    return nextDate;
};

const getDateForMode = (mode: ScheduledDateMode) => {
    const now = new Date();

    return addDays(now, dateModeOffsets[mode]);
};

const getWeekdayIndex = (date: Date) => (date.getDay() + 6) % 7;

const getWorkingHourForDate = (workingHours: WorkingHour[] | undefined, date: Date) => (
    workingHours?.find((item) => item.weekday === getWeekdayIndex(date))
);

const getStartOfDay = (date: Date) => {
    const nextDate = new Date(date);

    nextDate.setHours(0, 0, 0, 0);

    return nextDate;
};

const getEndOfDay = (date: Date) => {
    const nextDate = new Date(date);

    nextDate.setHours(23, 59, 59, 999);

    return nextDate;
};

const maxDate = (first: Date, second: Date) => (
    first > second ? first : second
);

const minDate = (first: Date, second: Date) => (
    first < second ? first : second
);

const parseTimeParts = (value: string) => {
    const [hours = "0", minutes = "0"] = value.replace("Z", "").split(":");

    return {
        hours: Number(hours),
        minutes: Number(minutes),
    };
};

const setTimeOnDate = (date: Date, value: string) => {
    const nextDate = new Date(date);
    const {hours, minutes} = parseTimeParts(value);

    nextDate.setHours(hours, minutes, 0, 0);

    return nextDate;
};

const formatSlotLabel = (date: Date) => (
    `${padTimePart(date.getHours())}:${padTimePart(date.getMinutes())}`
);

const createTimeSlots = (
    mode: ScheduledDateMode,
    organization: Pick<Organization, "working_hours"> | null,
): TimeSlot[] => {
    const workingHours = organization?.working_hours;

    if (!workingHours?.length) {
        return [];
    }

    const day = getDateForMode(mode);
    const dayStart = getStartOfDay(day);
    const dayEnd = getEndOfDay(day);
    const intervalBaseDates = [addDays(day, -1), day];
    const slots: TimeSlot[] = [];
    const seenSlotValues = new Set<string>();

    intervalBaseDates.forEach((baseDate) => {
        const workingHour = getWorkingHourForDate(workingHours, baseDate);

        if (!workingHour || workingHour.is_closed) {
            return;
        }

        let start = setTimeOnDate(baseDate, workingHour.opens_at);
        let end = setTimeOnDate(baseDate, workingHour.closes_at);

        if (workingHour.closes_next_day) {
            end = addDays(end, 1);
        }

        start = maxDate(start, dayStart);
        end = minDate(end, dayEnd);

        if (mode === "today") {
            const earliest = new Date();
            earliest.setMinutes(earliest.getMinutes() + MIN_ORDER_DELAY_MINUTES);
            const roundedEarliest = roundUpToHalfHour(earliest);

            start = maxDate(start, roundedEarliest);
        }

        start = roundUpToHalfHour(start);

        if (start > end) {
            return;
        }

        const cursor = new Date(start);

        while (cursor <= end) {
            const value = cursor.toISOString();

            if (!seenSlotValues.has(value)) {
                seenSlotValues.add(value);
                slots.push({
                    value,
                    label: formatSlotLabel(cursor),
                });
            }

            cursor.setMinutes(cursor.getMinutes() + SLOT_STEP_MINUTES);
        }
    });

    return slots.sort((first, second) => (
        new Date(first.value).getTime() - new Date(second.value).getTime()
    ));
};

const createDateOptions = (
    organization: Pick<Organization, "working_hours"> | null,
): DateOption[] => {
    const todaySlots = createTimeSlots("today", organization);
    const tomorrowSlots = createTimeSlots("tomorrow", organization);
    const dayAfterTomorrowSlots = createTimeSlots("dayAfterTomorrow", organization);

    return [
        {
            mode: "asap",
            label: "Ближайшее",
            slots: todaySlots,
            disabled: todaySlots.length === 0,
        },
        {
            mode: "today",
            label: "Сегодня",
            slots: todaySlots,
            disabled: todaySlots.length === 0,
        },
        {
            mode: "tomorrow",
            label: "Завтра",
            slots: tomorrowSlots,
            disabled: tomorrowSlots.length === 0,
        },
        {
            mode: "dayAfterTomorrow",
            label: "Послезавтра",
            slots: dayAfterTomorrowSlots,
            disabled: dayAfterTomorrowSlots.length === 0,
        },
    ];
};

const createCompleteBefore = (
    dateMode: DateMode,
    timeSlot: string,
    organization: Pick<Organization, "working_hours"> | null,
) => {
    if (dateMode === "asap") {
        return createTimeSlots("today", organization)[0]?.value ?? null;
    }

    return timeSlot || null;
};

const splitAddressFallback = (address: string) => {
    const parts = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    return {
        city: parts[0] ?? "",
        street: parts[1] ?? parts[0] ?? address.trim(),
        house: parts[2] ?? "",
    };
};

const getDeliveryAddressParts = (delivery: DeliveryOrderDetails) => {
    const fallback = splitAddressFallback(delivery.address);

    return {
        city: delivery.city || fallback.city,
        street: delivery.street || fallback.street,
        house: delivery.house || fallback.house,
    };
};

export function CartDrawer() {
    const isOpen = useUIStore((state) => state.isCartOpen);
    const closeCart = useUIStore((state) => state.closeCart);
    const openAuthModal = useUIStore((state) => state.openAuthModal);
    const openOrderTypeModal = useUIStore((state) => state.openOrderTypeModal);
    const openDeliveryTypeModal = useUIStore((state) => state.openDeliveryTypeModal);
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const incrementItem = useCartStore((state) => state.incrementItem);
    const decrementItem = useCartStore((state) => state.decrementItem);
    const orderType = useOrderStore((state) => state.orderType);
    const delivery = useOrderStore((state) => state.delivery);
    const restaurant = useOrderStore((state) => state.restaurant);
    const organizations = useAppDataStore((state) => state.organizations);
    const defaultDeliveryOrganization = useAppDataStore((state) => state.defaultDeliveryOrganization);
    const availabilityByOrganizationId = useAppDataStore((state) => state.availabilityByOrganizationId);
    const accessToken = useAuthStore((state) => state.accessToken);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [comment, setComment] = useState("");
    const [dateMode, setDateMode] = useState<DateMode>("asap");
    const [timeSlot, setTimeSlot] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [checkoutSuccess, setCheckoutSuccess] = useState<CheckoutSuccess | null>(null);
    const [deliveryCheckState, setDeliveryCheckState] = useState<{
        key: string;
        result: DeliveryCheckResult;
    } | null>(null);

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderAvailability = getCurrentOrderAvailability({
        orderType,
        restaurant,
        organizations,
        defaultDeliveryOrganization,
        availabilityByOrganizationId,
    });
    const dateOptions = useMemo(
        () => createDateOptions(orderAvailability.organization),
        [orderAvailability.organization],
    );
    const selectedDateOption = dateOptions.find((option) => option.mode === dateMode);
    const firstAvailableDateOption = dateOptions.find((option) => !option.disabled);
    const activeDateMode = selectedDateOption?.disabled
        ? firstAvailableDateOption?.mode ?? dateMode
        : dateMode;
    const currentDateOption = dateOptions.find((option) => option.mode === activeDateMode) ?? dateOptions[0];
    const currentTimeSlots = currentDateOption.slots;
    const selectedTimeSlot = currentTimeSlots.some((slot) => slot.value === timeSlot)
        ? timeSlot
        : currentTimeSlots[0]?.value ?? "";
    const isSelectedDateDisabled = currentDateOption.disabled;
    const isScheduledModeWithoutSlots = activeDateMode !== "asap" && !selectedTimeSlot;
    const isCheckoutDisabled = orderAvailability.isUnavailable || isSubmitting || isSelectedDateDisabled || isScheduledModeWithoutSlots;

    useBodyScrollLock(isOpen);

    const deliveryCheckKey = getDeliveryCheckKey(delivery);
    const deliveryCheck = deliveryCheckState?.key === deliveryCheckKey
        ? deliveryCheckState.result
        : null;
    const deliveryPrice = orderType === "delivery" && deliveryCheck?.available
        ? deliveryCheck.price
        : null;
    const checkoutTotal = orderType === "delivery"
        ? getDeliveryTotal(totalPrice, deliveryPrice)
        : totalPrice;

    useEffect(() => {
        if (!isOpen || orderType !== "delivery" || !delivery) return;

        const controller = new AbortController();

        checkDeliveryZone(
            {
                coordinates: delivery.coordinates,
                organizationSlug: defaultDeliveryOrganization?.slug,
            },
            controller.signal,
        )
            .then((result) => {
                setDeliveryCheckState({
                    key: getDeliveryCheckKey(delivery),
                    result,
                });
            })
            .catch(() => {
                if (controller.signal.aborted) return;

                setDeliveryCheckState(null);
            });

        return () => controller.abort();
    }, [
        defaultDeliveryOrganization?.slug,
        delivery,
        isOpen,
        orderType,
    ]);

    const buildOrderPayload = (): OrderCreatePayload | null => {
        const organization = orderAvailability.organization;

        if (!organization) {
            setCheckoutError("Выберите доставку или самовывоз перед оформлением заказа.");
            openOrderTypeModal();
            return null;
        }

        if (orderType === "delivery" && !delivery) {
            setCheckoutError("Укажите адрес доставки перед оформлением заказа.");
            openDeliveryTypeModal();
            return null;
        }

        const completeBefore = createCompleteBefore(activeDateMode, selectedTimeSlot, organization);

        if (!completeBefore) {
            setCheckoutError("На выбранную дату нет доступного времени для заказа.");
            return null;
        }

        const orderComment = comment.trim();
        const payload: OrderCreatePayload = {
            orderType: orderType === "restaurant" ? "pickup" : "delivery",
            comment: orderComment || undefined,
            completeBefore,
            guestsCount: 1,
            items: items.map((item) => ({
                productId: item.id,
                amount: item.quantity,
                price: item.price,
                modifiers: [],
            })),
        };

        if (orderType === "restaurant") {
            payload.organizationId = organization.id;
            payload.organizationSlug = organization.slug;
        }

        if (orderType === "delivery" && delivery) {
            const address = getDeliveryAddressParts(delivery);

            payload.deliveryPoint = {
                address: {
                    city: address.city,
                    street: address.street,
                    house: address.house,
                    flat: delivery.apartment || undefined,
                    entrance: delivery.entrance || undefined,
                    floor: delivery.floor || undefined,
                },
                coordinates: {
                    latitude: delivery.coordinates.latitude,
                    longitude: delivery.coordinates.longitude,
                },
                comment: delivery.comment || undefined,
            };
        }

        return payload;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCheckoutError("");
        setCheckoutSuccess(null);

        if (!isAuthenticated) {
            openAuthModal();
            return;
        }

        if (isCheckoutDisabled) {
            return;
        }

        const payload = buildOrderPayload();

        if (!payload) return;

        payload.successUrl = `${window.location.origin}/order-payment/success`;
        payload.failUrl = `${window.location.origin}/order-payment/fail`;

        setIsSubmitting(true);

        try {
            if (payload.orderType === "delivery" && payload.deliveryPoint) {
                const result = await checkDeliveryZone({
                    coordinates: payload.deliveryPoint.coordinates,
                    organizationSlug: defaultDeliveryOrganization?.slug,
                });

                setDeliveryCheckState({
                    key: getDeliveryCheckKey(delivery),
                    result,
                });

                if (!result.available) {
                    setCheckoutError(getDeliveryCheckErrorMessage(result));
                    openDeliveryTypeModal();
                    return;
                }
            }

            const createdOrder = await createOrder(payload, accessToken);
            const paymentUrl = createdOrder.payment?.paymentUrl;

            if (!paymentUrl) {
                throw new Error("Не удалось получить ссылку на оплату. Попробуйте еще раз.");
            }

            window.localStorage.setItem(LAST_ORDER_ID_STORAGE_KEY, createdOrder.id);
            window.sessionStorage.setItem(PAYMENT_REDIRECT_URL_STORAGE_KEY, paymentUrl);
            window.localStorage.setItem(PAYMENT_REDIRECT_URL_STORAGE_KEY, paymentUrl);
            window.sessionStorage.removeItem(PAYMENT_REDIRECT_STATE_STORAGE_KEY);
            window.localStorage.removeItem(PAYMENT_REDIRECT_STATE_STORAGE_KEY);
            window.location.href = "/order-payment/redirect";
        } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : "Не удалось создать заказ. Попробуйте еще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const checkoutButtonText = (() => {
        if (isSubmitting) return "Открываем оплату...";
        if (!isAuthenticated) return "Войти и оформить";
        if (!orderType) return "Выбрать способ получения";
        if (orderType === "delivery" && !delivery) return "Указать адрес доставки";
        if (orderType === "delivery" && deliveryPrice === null) return "Проверить доставку и оформить";

        return `Оформить за ${checkoutTotal.toLocaleString("ru-RU")}\u00a0₽`;
    })();

    return (
        <>
            <div
                onClick={closeCart}
                className={`fixed inset-0 z-100 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <div
                className={`fixed top-0 right-0 z-100 flex h-full w-full flex-col border-border bg-background transition-transform duration-300 md:w-112.5 md:border-l ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    type="button"
                    onClick={closeCart}
                    className={`absolute top-1/2 -left-16 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] border border-border bg-background text-text transition duration-300 hover:border-primary hover:text-primary md:flex ${
                        isOpen ? "visible opacity-100 delay-100" : "invisible opacity-0"
                    }`}
                    aria-label="Закрыть корзину"
                >
                    <X size={24} strokeWidth={2.5}/>
                </button>

                <div className="flex shrink-0 items-center justify-between px-5 py-5 md:px-8">
                    <h2 className="text-[28px] font-normal leading-tight text-text md:text-[34px]">
                        Корзина
                    </h2>

                    <button
                        type="button"
                        onClick={closeCart}
                        className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-background text-text transition duration-300 hover:border-primary hover:text-primary md:hidden"
                        aria-label="Закрыть корзину"
                    >
                        <X size={20} strokeWidth={2.5}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 md:px-8">
                    {checkoutSuccess ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-text">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[8px] border border-primary/55 bg-primary/10">
                                <CheckCircle2 size={48} className="text-primary" strokeWidth={1.5}/>
                            </div>
                            <p className="text-xl font-bold text-text">Заказ отправлен</p>
                            <p className="mt-2 max-w-80 text-sm leading-6 text-text/68">
                                {checkoutSuccess.publicNumber
                                    ? `Номер заказа: ${checkoutSuccess.publicNumber}.`
                                    : "Номер заказа скоро появится."}
                                {checkoutSuccess.status ? ` Статус: ${checkoutSuccess.status}.` : ""}
                            </p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-text">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[8px] border border-border">
                                <ShoppingBag size={48} className="text-primary" strokeWidth={1.5}/>
                            </div>

                            <p className="text-xl font-bold text-text">Корзина пуста</p>
                            <p className="mt-2 max-w-72 text-sm leading-6 text-text/68">
                                Добавьте что-нибудь из меню, чтобы сделать заказ
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col py-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-border/50 py-6 last:border-0">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[8px] border border-border/60">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-text">
                                                Нет фото
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between text-text">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="line-clamp-2 text-base font-bold leading-tight md:text-lg">
                                                {item.name}
                                            </h3>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                aria-label={`Удалить ${item.name} из корзины`}
                                                className="cursor-pointer rounded-[6px] border border-border p-2 transition duration-300 hover:border-primary hover:text-primary"
                                            >
                                                <X size={18}/>
                                            </button>
                                        </div>

                                        <div className="flex items-start justify-between">
                                            <span>{(item.price * item.quantity).toLocaleString("ru-RU")}&nbsp;₽</span>

                                            <div className="flex h-10 w-28 shrink-0 items-center justify-between rounded-[6px] border border-border p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => decrementItem(item.id)}
                                                    aria-label={`Уменьшить количество ${item.name}`}
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] transition duration-300 hover:text-primary disabled:opacity-50"
                                                >
                                                    <Minus size={14} strokeWidth={2.5}/>
                                                </button>

                                                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>

                                                <button
                                                    type="button"
                                                    onClick={() => incrementItem(item.id)}
                                                    aria-label={`Увеличить количество ${item.name}`}
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] transition duration-300 hover:text-primary"
                                                >
                                                    <Plus size={14} strokeWidth={2.5}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <form
                        onSubmit={handleSubmit}
                        className="shrink-0 border-t border-border px-5 pt-5 pb-6 text-text md:px-8"
                    >
                        <div className="mb-4 flex items-end justify-between font-semibold md:text-lg">
                            <span>
                                {totalQuantity} {getProductPlural(totalQuantity)} на сумму
                            </span>
                            <span className="font-bold">{totalPrice.toLocaleString("ru-RU")}&nbsp;₽</span>
                        </div>

                        {orderType === "delivery" && delivery && (
                            <div className="mb-4 rounded-[6px] border border-border/60 bg-black/20 px-4 py-3 text-sm leading-6 text-text/78">
                                {deliveryCheck?.available && deliveryCheck.price !== null
                                    ? `Доставка ориентировочно ${formatDeliveryPrice(deliveryCheck.price)}. Точную сумму уточним перед оплатой.`
                                    : "Стоимость доставки уточним перед оплатой."}
                            </div>
                        )}

                        {orderType === "delivery" && deliveryPrice !== null && (
                            <div className="mb-4 flex items-end justify-between border-t border-border/50 pt-4 font-semibold md:text-lg">
                                <span>Итого с доставкой</span>
                                <span className="font-bold">{checkoutTotal.toLocaleString("ru-RU")}&nbsp;₽</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <textarea
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                placeholder="Комментарий к заказу"
                                className="min-h-20 w-full resize-none rounded-[6px] border border-border bg-background px-4 py-3 text-sm leading-5 text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                            />

                            <div>
                                <p className="mb-2 text-sm font-semibold text-text/82">Когда приготовить заказ</p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {dateOptions.map((option) => (
                                        <button
                                            key={option.mode}
                                            type="button"
                                            onClick={() => setDateMode(option.mode)}
                                            disabled={option.disabled}
                                            className={`h-10 rounded-[6px] border px-2 text-xs font-semibold transition ${
                                                activeDateMode === option.mode
                                                    ? "border-primary bg-primary text-on-primary"
                                                    : "border-border text-text hover:border-primary hover:text-primary"
                                            } disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-border disabled:hover:text-text`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {activeDateMode !== "asap" && (
                                <select
                                    value={selectedTimeSlot}
                                    onChange={(event) => setTimeSlot(event.target.value)}
                                    className="h-11 w-full rounded-[6px] border border-border bg-background px-4 text-sm font-semibold text-text outline-none transition focus:border-primary"
                                >
                                    {currentTimeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {(orderAvailability.isUnavailable || checkoutError) && (
                            <div className="mt-4 flex gap-3 rounded-[6px] border border-primary/45 bg-primary/10 px-4 py-3 text-sm font-medium leading-6 text-text">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary"/>
                                <span>{checkoutError || orderAvailability.message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isCheckoutDisabled}
                            className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-primary px-5 text-center text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin"/>}
                            {checkoutButtonText}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}

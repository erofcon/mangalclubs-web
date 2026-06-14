"use client";

import Image from "next/image";
import Link from "next/link";
import {type ChangeEvent, type FormEvent, type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {
    Cake,
    CalendarDays,
    ChevronRight,
    Clock3,
    ImageIcon,
    LoaderCircle,
    LogIn,
    LogOut,
    Mail,
    PackageCheck,
    Phone,
    RefreshCw,
    Trash2,
    Upload,
    User,
    WalletCards,
} from "lucide-react";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useAppDataStore} from "@/store/app-data-store";
import {useAuthStore} from "@/store/auth-store";
import {useUIStore} from "@/store/ui-store";
import type {MenuCategory, MenuItem} from "@/types/products";
import {
    deleteCustomerAvatar,
    getCurrentCustomerOrders,
    getCustomerOrderStatus,
    getCustomerProfile,
    getHistoryCustomerOrders,
    updateCustomerProfile,
    uploadCustomerAvatar,
    type CustomerOrder,
    type CustomerOrderItem,
    type CustomerProfile,
} from "@/utils/customer-profile";
import {
    getCustomerOrderStatusDescriptor,
    getPaymentStatusDescriptor,
    shouldShowOrderInHistory,
    type StatusTone,
} from "@/utils/order-status";

type ActiveTab = "info" | "orders";

type ProfileFormState = {
    name: string;
    email: string;
    birthday: string;
};

const initialForm: ProfileFormState = {
    name: "",
    email: "",
    birthday: "",
};

const supportedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];

const getAvatarSrc = (avatarUrl?: string | null) => {
    if (!avatarUrl) return null;

    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://") || avatarUrl.startsWith("/")) {
        return avatarUrl;
    }

    return `/${avatarUrl}`;
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "Дата не указана";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const formatBirthday = (value?: string | null) => {
    if (!value) return "Не указана";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const getBirthdayInputValue = (value?: string | null) => (
    value ? value.slice(0, 10) : ""
);

const formatMoney = (value?: number | null) => {
    if (typeof value !== "number") return "Сумма уточняется";

    return `${value.toLocaleString("ru-RU")} ₽`;
};

const getOrderTypeLabel = (orderType?: CustomerOrder["orderType"]) => {
    if (orderType === "delivery") return "Доставка";
    if (orderType === "pickup") return "Самовывоз";

    return "Заказ";
};

const getOrderNumber = (order: CustomerOrder) => (
    order.iikoExternalNumber || order.id
);

type OrderItemLike = CustomerOrderItem & {
    image?: string;
    imageUrl?: string;
    productImage?: string;
    product?: {
        name?: string;
        title?: string;
        image?: string;
        imageUrl?: string;
    };
};

const getRawOrderItemName = (item: OrderItemLike) => (
    item.name ||
    item.productName ||
    item.title ||
    item.product?.name ||
    item.product?.title
);

const getOrderItemName = (item: OrderItemLike, menuItem?: MenuItem) => (
    getRawOrderItemName(item) ||
    menuItem?.name ||
    "Позиция заказа"
);

const getOrderItemQuantity = (item: CustomerOrderItem) => (
    item.amount ?? item.quantity ?? 1
);

const getOrderItemTotal = (item: CustomerOrderItem) => {
    if (typeof item.sum === "number") return item.sum;
    if (typeof item.total === "number") return item.total;
    if (typeof item.price === "number") return item.price * getOrderItemQuantity(item);

    return null;
};

const normalizeLookupKey = (value?: string | null) => value?.trim().toLowerCase();

const buildMenuItemLookup = (menu: MenuCategory[]) => {
    const lookup = new Map<string, MenuItem>();

    menu.forEach((category) => {
        category.items.forEach((item) => {
            lookup.set(item.id, item);

            const nameKey = normalizeLookupKey(item.name);

            if (nameKey) {
                lookup.set(nameKey, item);
            }
        });
    });

    return lookup;
};

const getMenuItemForOrderItem = (
    item: OrderItemLike,
    lookup: Map<string, MenuItem>,
) => {
    if (item.productId) {
        const byId = lookup.get(item.productId);

        if (byId) return byId;
    }

    const rawName = getRawOrderItemName(item);
    const nameKey = normalizeLookupKey(rawName);

    return nameKey ? lookup.get(nameKey) : undefined;
};

const getOrderItemImage = (item: OrderItemLike, menuItem?: MenuItem) => (
    item.image ||
    item.imageUrl ||
    item.productImage ||
    item.product?.image ||
    item.product?.imageUrl ||
    menuItem?.image ||
    null
);

const getOrderItemsLabel = (order: CustomerOrder) => {
    const count = order.items?.reduce((sum, item) => sum + getOrderItemQuantity(item), 0) ?? 0;

    if (count === 0) return "Состав заказа";

    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;
    const label = lastTwoDigits >= 11 && lastTwoDigits <= 14
        ? "позиций"
        : lastDigit === 1
            ? "позиция"
            : lastDigit >= 2 && lastDigit <= 4
                ? "позиции"
                : "позиций";

    return `${count.toLocaleString("ru-RU")} ${label}`;
};

const getOrderSummary = (order: CustomerOrder) => (
    `Заказ ${getOrderNumber(order)} от ${formatDateTime(order.createdAt)} на ${formatMoney(order.totalSum)}`
);

export function PersonalScreen() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("info");
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [form, setForm] = useState<ProfileFormState>(initialForm);
    const [currentOrders, setCurrentOrders] = useState<CustomerOrder[]>([]);
    const [historyOrders, setHistoryOrders] = useState<CustomerOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
    const [refreshingOrderIds, setRefreshingOrderIds] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const accessToken = useAuthStore((state) => state.accessToken);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);
    const openAuthModal = useUIStore((state) => state.openAuthModal);
    const router = useRouter();

    const syncProfile = useCallback((nextProfile: CustomerProfile) => {
        setProfile(nextProfile);
        setForm({
            name: nextProfile.name ?? "",
            email: nextProfile.email ?? "",
            birthday: getBirthdayInputValue(nextProfile.birthday),
        });
        setUser({
            ...useAuthStore.getState().user,
            ...nextProfile,
        });
    }, [setUser]);

    const loadPersonalData = useCallback(async () => {
        if (!accessToken || !isAuthenticated) {
            setIsLoading(false);
            setProfile(null);
            setCurrentOrders([]);
            setHistoryOrders([]);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setMessage("");

        try {
            const [nextProfile, nextCurrentOrders, nextHistoryOrders] = await Promise.all([
                getCustomerProfile(accessToken),
                getCurrentCustomerOrders(accessToken),
                getHistoryCustomerOrders(accessToken),
            ]);

            syncProfile(nextProfile);
            setCurrentOrders(nextCurrentOrders);
            setHistoryOrders(nextHistoryOrders);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Не удалось загрузить личный кабинет.");
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, isAuthenticated, syncProfile]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        void loadPersonalData();
    }, [loadPersonalData]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const avatarSrc = useMemo(() => getAvatarSrc(profile?.avatarUrl), [profile?.avatarUrl]);
    const displayedCurrentOrders = useMemo(
        () => currentOrders.filter((order) => !shouldShowOrderInHistory(order)),
        [currentOrders],
    );
    const displayedHistoryOrders = useMemo(() => {
        const historyIds = new Set(historyOrders.map((order) => order.id));
        const movedToHistory = currentOrders.filter((order) => (
            shouldShowOrderInHistory(order) && !historyIds.has(order.id)
        ));

        return [...movedToHistory, ...historyOrders];
    }, [currentOrders, historyOrders]);

    const handleLogout = () => {
        logout();
        router.replace("/");
    };

    const handleFormChange =
        (field: keyof ProfileFormState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setMessage("");
                setErrorMessage("");
                setForm((prev) => ({
                    ...prev,
                    [field]: event.target.value,
                }));
            };

    const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!accessToken || isSaving) return;

        setIsSaving(true);
        setMessage("");
        setErrorMessage("");

        try {
            const nextProfile = await updateCustomerProfile(accessToken, {
                name: form.name.trim(),
                email: form.email.trim(),
                birthday: form.birthday || undefined,
            });

            syncProfile(nextProfile);
            setMessage("Профиль обновлен.");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Не удалось сохранить профиль.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !accessToken || isUploadingAvatar) return;

        setMessage("");
        setErrorMessage("");

        if (!supportedAvatarTypes.includes(file.type)) {
            setErrorMessage("Поддерживаются только JPEG, PNG и WebP.");
            return;
        }

        setIsUploadingAvatar(true);

        try {
            const nextProfile = await uploadCustomerAvatar(accessToken, file);
            syncProfile(nextProfile);
            setMessage("Аватар обновлен.");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Не удалось загрузить аватар.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!accessToken || isDeletingAvatar || !profile?.avatarUrl) return;

        setIsDeletingAvatar(true);
        setMessage("");
        setErrorMessage("");

        try {
            const nextProfile = await deleteCustomerAvatar(accessToken);

            if (nextProfile) {
                syncProfile(nextProfile);
            } else {
                syncProfile({
                    ...profile,
                    avatarUrl: null,
                });
            }

            setMessage("Аватар удален.");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Не удалось удалить аватар.");
        } finally {
            setIsDeletingAvatar(false);
        }
    };

    const handleRefreshOrderStatus = async (orderId: string) => {
        if (!accessToken || refreshingOrderIds.includes(orderId)) return;

        setRefreshingOrderIds((prev) => [...prev, orderId]);
        setMessage("");
        setErrorMessage("");

        try {
            const status = await getCustomerOrderStatus(accessToken, orderId);

            setCurrentOrders((prev) => (
                prev.map((order) => (
                    order.id === orderId
                        ? {
                            ...order,
                            ...status,
                            id: order.id,
                        }
                        : order
                ))
            ));
            setMessage("Статус заказа обновлен.");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Не удалось обновить статус заказа.");
        } finally {
            setRefreshingOrderIds((prev) => prev.filter((id) => id !== orderId));
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-text">
                <section className="mx-auto w-full max-w-[1210px] px-5 py-16 sm:px-6 lg:px-0">
                    <div className="rounded-[8px] border border-border/70 px-5 py-8 text-center sm:px-6">
                        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary"/>
                        <p className="mt-4 text-sm font-semibold text-text/72">Загружаем личный кабинет</p>
                    </div>
                </section>
            </main>
        );
    }

    if (!isAuthenticated || !accessToken) {
        return (
            <main className="min-h-screen bg-background text-text">
                <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                    <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                        Личный кабинет
                    </p>
                    <div className="overflow-hidden rounded-[8px] border border-border/70 px-5 py-8 sm:px-6 md:px-8">
                        <div className="flex max-w-2xl flex-col items-start gap-5">
                            <span className="flex h-14 w-14 items-center justify-center rounded-[6px] border border-border/70 text-primary">
                                <LogIn className="h-7 w-7" strokeWidth={1.6}/>
                            </span>
                            <div>
                                <h1 className="text-[34px] font-normal leading-tight text-text sm:text-[48px]">
                                    Войдите в аккаунт
                                </h1>
                                <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-text/72">
                                    После входа здесь появятся данные профиля, аватар и история ваших заказов.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAuthModal}
                                className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
                            >
                                <LogIn className="h-4 w-4" strokeWidth={1.8}/>
                                Войти в профиль
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden bg-background text-text">
            <section className="mx-auto w-full max-w-[1210px] px-5 pb-16 pt-8 sm:px-6 lg:px-0 lg:pb-20">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">
                            Личный кабинет
                        </p>
                        <h1 className="max-w-[760px] text-[45px] font-normal leading-[0.98] text-text sm:text-[64px] lg:text-[76px]">
                            Профиль гостя Mangal Club.
                        </h1>
                        <p className="mt-6 max-w-[540px] text-[15px] leading-7 text-text/72 sm:text-[16px]">
                            Управляйте контактными данными, аватаром и заказами в одном месте.
                        </p>
                    </div>

                    <aside className="min-w-0 lg:pt-6">
                        <div className="border-t border-border/70 pt-5 lg:sticky lg:top-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Раздел
                            </p>

                            <nav className="mt-5 grid gap-2">
                                <TabButton
                                    isActive={activeTab === "info"}
                                    onClick={() => setActiveTab("info")}
                                >
                                    Информация
                                </TabButton>
                                <TabButton
                                    isActive={activeTab === "orders"}
                                    onClick={() => setActiveTab("orders")}
                                >
                                    Заказы
                                </TabButton>
                            </nav>
                        </div>
                    </aside>
                </div>

                {(errorMessage || message) && (
                    <div
                        className={[
                            "mt-8 rounded-[6px] border px-5 py-4 text-sm font-medium leading-6",
                            errorMessage
                                ? "border-red-500/45 bg-red-500/10 text-red-200"
                                : "border-primary/45 bg-primary/10 text-text",
                        ].join(" ")}
                    >
                        {errorMessage || message}
                    </div>
                )}

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0 space-y-5">
                        {activeTab === "info" ? (
                            <ProfileInfo
                                profile={profile}
                                avatarSrc={avatarSrc}
                                form={form}
                                isSaving={isSaving}
                                isUploadingAvatar={isUploadingAvatar}
                                isDeletingAvatar={isDeletingAvatar}
                                onChange={handleFormChange}
                                onSave={handleSaveProfile}
                                onAvatarChange={handleAvatarChange}
                                onDeleteAvatar={handleDeleteAvatar}
                            />
                        ) : (
                            <OrdersSection
                                currentOrders={displayedCurrentOrders}
                                historyOrders={displayedHistoryOrders}
                                refreshingOrderIds={refreshingOrderIds}
                                onRefreshOrderStatus={handleRefreshOrderStatus}
                            />
                        )}
                    </div>

                    <aside className="min-w-0">
                        <div className="space-y-3 border-t border-border/70 pt-5 lg:sticky lg:top-42">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Аккаунт
                            </p>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex h-12 w-full items-center justify-center gap-3 rounded-[6px] border border-border/70 px-5 text-[14px] font-semibold text-text transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                            >
                                <LogOut className="h-4 w-4" strokeWidth={1.8}/>
                                Выйти
                            </button>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

type TabButtonProps = {
    children: string;
    isActive: boolean;
    onClick: () => void;
};

function TabButton({children, isActive, onClick}: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex h-11 w-full cursor-pointer items-center justify-between rounded-[6px] border px-4 text-left text-[14px] font-semibold transition duration-300",
                isActive
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border/70 text-text hover:border-primary hover:text-primary",
            ].join(" ")}
        >
            {children}
            <span className={isActive ? "h-1.5 w-1.5 rounded-full bg-on-primary" : "h-1.5 w-1.5 rounded-full bg-primary/55"}/>
        </button>
    );
}

type ProfileInfoProps = {
    profile: CustomerProfile | null;
    avatarSrc: string | null;
    form: ProfileFormState;
    isSaving: boolean;
    isUploadingAvatar: boolean;
    isDeletingAvatar: boolean;
    onChange: (field: keyof ProfileFormState) => (event: ChangeEvent<HTMLInputElement>) => void;
    onSave: (event: FormEvent<HTMLFormElement>) => void;
    onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDeleteAvatar: () => void;
};

function ProfileInfo({
                         profile,
                         avatarSrc,
                         form,
                         isSaving,
                         isUploadingAvatar,
                         isDeletingAvatar,
                         onChange,
                         onSave,
                         onAvatarChange,
                         onDeleteAvatar,
                     }: ProfileInfoProps) {
    const displayName = profile?.name?.trim() || "Гость Mangal Club";

    return (
        <section className="overflow-hidden rounded-[8px] border border-border/70">
            <div className="flex flex-col gap-7 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[8px] border border-border/70 bg-black/25">
                        {avatarSrc ? (
                            <Image
                                src={avatarSrc}
                                alt={displayName}
                                fill
                                sizes="112px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-primary">
                                <User className="h-14 w-14" strokeWidth={1.4}/>
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Данные гостя
                        </p>
                        <h2 className="mt-2 wrap-break-word text-[28px] font-normal leading-tight text-text sm:text-[34px]">
                            {displayName}
                        </h2>
                        <p className="mt-3 max-w-[470px] text-[14px] leading-6 text-text/68">
                            Телефон используется для входа и заказов, поэтому его нельзя изменить в профиле.
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-3 rounded-[6px] border border-border/70 px-4 text-[14px] font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary">
                        {isUploadingAvatar ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8}/>
                        ) : (
                            <Upload className="h-4 w-4" strokeWidth={1.8}/>
                        )}
                        Загрузить
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={onAvatarChange}
                            disabled={isUploadingAvatar}
                            className="sr-only"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={onDeleteAvatar}
                        disabled={!profile?.avatarUrl || isDeletingAvatar}
                        className="inline-flex h-11 cursor-pointer items-center justify-center gap-3 rounded-[6px] border border-border/70 px-4 text-[14px] font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:border-border/70 disabled:hover:text-text"
                    >
                        {isDeletingAvatar ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8}/>
                        ) : (
                            <Trash2 className="h-4 w-4" strokeWidth={1.8}/>
                        )}
                        Удалить
                    </button>
                </div>
            </div>

            <div className="grid border-t border-border/55 md:grid-cols-3">
                <ProfileValue
                    icon={<Cake className="h-5 w-5" strokeWidth={1.8}/>}
                    label="Дата рождения"
                    value={formatBirthday(profile?.birthday)}
                />
                <ProfileValue
                    icon={<Phone className="h-5 w-5" strokeWidth={1.8}/>}
                    label="Телефон"
                    value={profile?.phone ?? "Не указан"}
                />
                <ProfileValue
                    icon={<Mail className="h-5 w-5" strokeWidth={1.8}/>}
                    label="Email"
                    value={profile?.email || "Не указан"}
                />
            </div>

            <form onSubmit={onSave} className="border-t border-border/55 px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <FormField label="Имя">
                        <input
                            type="text"
                            value={form.name}
                            onChange={onChange("name")}
                            placeholder="Иван"
                            className="h-12 w-full rounded-[6px] border border-border/70 bg-background px-4 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                        />
                    </FormField>

                    <FormField label="Email">
                        <input
                            type="email"
                            value={form.email}
                            onChange={onChange("email")}
                            placeholder="ivan@example.com"
                            className="h-12 w-full rounded-[6px] border border-border/70 bg-background px-4 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                        />
                    </FormField>

                    <FormField label="Дата рождения">
                        <input
                            type="date"
                            value={form.birthday}
                            onChange={onChange("birthday")}
                            className="h-12 w-full rounded-[6px] border border-border/70 bg-background px-4 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                        />
                    </FormField>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-5 inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8}/>}
                    Сохранить профиль
                </button>
            </form>
        </section>
    );
}

type FormFieldProps = {
    label: string;
    children: ReactNode;
};

function FormField({label, children}: FormFieldProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                {label}
            </span>
            {children}
        </label>
    );
}

type ProfileValueProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function ProfileValue({icon, label, value}: ProfileValueProps) {
    return (
        <div className="border-b border-border/50 px-5 py-5 last:border-b-0 md:border-b-0 md:border-l md:first:border-l-0">
            <span className="mb-5 inline-flex text-primary">
                {icon}
            </span>
            <span className="block text-[12px] leading-none text-text/60">
                {label}
            </span>
            <span className="mt-3 block wrap-break-word text-[15px] font-semibold leading-6 text-text">
                {value}
            </span>
        </div>
    );
}

type OrdersSectionProps = {
    currentOrders: CustomerOrder[];
    historyOrders: CustomerOrder[];
    refreshingOrderIds: string[];
    onRefreshOrderStatus: (orderId: string) => void;
};

function OrdersSection({
                           currentOrders,
                           historyOrders,
                           refreshingOrderIds,
                           onRefreshOrderStatus,
                       }: OrdersSectionProps) {
    const menu = useAppDataStore((state) => state.menu);
    const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
    const menuItemLookup = useMemo(() => buildMenuItemLookup(menu), [menu]);

    return (
        <>
            <OrderBlock
                title="Текущие заказы"
                eyebrow="Сейчас"
                emptyText="Когда появится новый заказ, его статус можно будет отслеживать здесь."
            >
                {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            menuItemLookup={menuItemLookup}
                            isRefreshing={refreshingOrderIds.includes(order.id)}
                            onOpen={() => setSelectedOrder(order)}
                            onRefreshStatus={() => onRefreshOrderStatus(order.id)}
                        />
                    ))
                ) : (
                    <EmptyOrdersState/>
                )}
            </OrderBlock>

            <OrderBlock
                title="История заказов"
                eyebrow="История"
                emptyText="Завершенные заказы будут храниться здесь."
            >
                {historyOrders.length > 0 ? (
                    historyOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            menuItemLookup={menuItemLookup}
                            onOpen={() => setSelectedOrder(order)}
                        />
                    ))
                ) : null}
            </OrderBlock>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    menuItemLookup={menuItemLookup}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </>
    );
}

type OrderBlockProps = {
    title: string;
    eyebrow: string;
    emptyText: string;
    children: ReactNode;
};

function OrderBlock({title, eyebrow, emptyText, children}: OrderBlockProps) {
    const hasContent = Boolean(children);

    return (
        <section className="overflow-hidden rounded-[8px] border border-border/70 text-text">
            <div className="border-b border-border/55 px-5 py-5 sm:px-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {eyebrow}
                </p>
                <h2 className="mt-2 text-[28px] font-normal leading-tight text-text sm:text-[34px]">
                    {title}
                </h2>
                {!hasContent && (
                    <p className="mt-4 max-w-[520px] text-[14px] leading-6 text-text/68">
                        {emptyText}
                    </p>
                )}
            </div>

            <div className="divide-y divide-border/45">
                {hasContent ? children : null}
            </div>
        </section>
    );
}

function EmptyOrdersState() {
    return (
        <div className="px-5 py-5 sm:px-6 sm:py-6">
            <p className="max-w-[520px] text-[14px] leading-6 text-text/68">
                Когда появится новый заказ, его статус можно будет отслеживать здесь.
            </p>
            <Link
                href="/#menu-99"
                className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5"
            >
                <PackageCheck className="h-5 w-5" strokeWidth={1.8}/>
                Перейти в меню
            </Link>
        </div>
    );
}

type OrderCardProps = {
    order: CustomerOrder;
    menuItemLookup: Map<string, MenuItem>;
    isRefreshing?: boolean;
    onOpen: () => void;
    onRefreshStatus?: () => void;
};

function OrderCard({order, menuItemLookup, isRefreshing = false, onOpen, onRefreshStatus}: OrderCardProps) {
    const items = order.items ?? [];
    const previewItems = items.slice(0, 3).map((item) => {
        const menuItem = getMenuItemForOrderItem(item, menuItemLookup);

        return getOrderItemName(item, menuItem);
    });
    const status = getCustomerOrderStatusDescriptor(order);
    const paymentStatus = order.paymentStatus ? getPaymentStatusDescriptor(order.paymentStatus) : null;

    return (
        <article className="px-5 py-5 transition duration-300 hover:bg-white/[0.025] sm:px-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <button
                    type="button"
                    onClick={onOpen}
                    className="group min-w-0 flex-1 cursor-pointer text-left"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-8 items-center rounded-[6px] border border-border/70 px-3 text-[12px] font-semibold text-primary">
                            {getOrderTypeLabel(order.orderType)}
                        </span>
                        <StatusBadge label={`Заказ: ${status.label}`} tone={status.tone}/>
                        {paymentStatus && (
                            <StatusBadge label={`Оплата: ${paymentStatus.label}`} tone={paymentStatus.tone}/>
                        )}
                    </div>

                    <div className="mt-4 flex min-w-0 items-start gap-3">
                        <div className="min-w-0">
                            <h3 className="wrap-break-word text-[19px] font-semibold leading-7 text-text transition duration-300 group-hover:text-primary">
                                {getOrderSummary(order)}
                            </h3>
                            <p className="mt-2 wrap-break-word text-[13px] leading-5 text-text/62">
                                {previewItems.length > 0
                                    ? previewItems.join(", ")
                                    : "Состав заказа будет доступен в деталях"}
                            </p>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-primary transition duration-300 group-hover:translate-x-1"/>
                    </div>

                    <div className="mt-3 grid gap-3 text-[13px] leading-5 text-text/68 sm:grid-cols-2">
                        <OrderMeta
                            icon={<PackageCheck className="h-4 w-4" strokeWidth={1.8}/>}
                            label={getOrderItemsLabel(order)}
                        />
                        <OrderMeta
                            icon={<WalletCards className="h-4 w-4" strokeWidth={1.8}/>}
                            label={formatMoney(order.totalSum)}
                        />
                    </div>
                </button>

                {onRefreshStatus && (
                    <button
                        type="button"
                        onClick={onRefreshStatus}
                        disabled={isRefreshing}
                        className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-[6px] border border-border/70 px-4 text-[14px] font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {isRefreshing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8}/>
                        ) : (
                            <RefreshCw className="h-4 w-4" strokeWidth={1.8}/>
                        )}
                        Обновить статус
                    </button>
                )}
            </div>
        </article>
    );
}

type OrderDetailsModalProps = {
    order: CustomerOrder;
    menuItemLookup: Map<string, MenuItem>;
    onClose: () => void;
};

function OrderDetailsModal({order, menuItemLookup, onClose}: OrderDetailsModalProps) {
    const items = order.items ?? [];
    const status = getCustomerOrderStatusDescriptor(order);
    const paymentStatus = order.paymentStatus ? getPaymentStatusDescriptor(order.paymentStatus) : null;

    return (
        <ModalSkeleton
            onClose={onClose}
            className="w-full sm:max-w-3xl"
        >
            <div className="flex max-h-dvh min-h-dvh w-full flex-col overflow-y-auto bg-background p-5 text-text sm:max-h-[86dvh] sm:min-h-0 sm:rounded-[8px] sm:border sm:border-border/70 sm:p-6">
                <div className="pr-12 sm:pr-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Заказ {getOrderNumber(order)}
                    </p>
                    <h2 className="mt-2 wrap-break-word text-[28px] font-normal leading-tight text-text sm:text-[34px]">
                        {formatMoney(order.totalSum)}
                    </h2>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex h-8 items-center rounded-[6px] border border-border/70 px-3 text-[12px] font-semibold text-primary">
                        {getOrderTypeLabel(order.orderType)}
                    </span>
                    <StatusBadge label={`Заказ: ${status.label}`} tone={status.tone}/>
                    {paymentStatus && (
                        <StatusBadge label={`Оплата: ${paymentStatus.label}`} tone={paymentStatus.tone}/>
                    )}
                </div>

                <div className="mt-6 grid overflow-hidden rounded-[8px] border border-border/70 sm:grid-cols-3">
                    <OrderDetail
                        icon={<CalendarDays className="h-4 w-4" strokeWidth={1.8}/>}
                        label="Дата заказа"
                        value={formatDateTime(order.createdAt)}
                    />
                    <OrderDetail
                        icon={<Clock3 className="h-4 w-4" strokeWidth={1.8}/>}
                        label="Ко времени"
                        value={formatDateTime(order.completeBefore)}
                    />
                    <OrderDetail
                        icon={<WalletCards className="h-4 w-4" strokeWidth={1.8}/>}
                        label="Сумма"
                        value={formatMoney(order.totalSum)}
                    />
                </div>

                <div className="mt-6 overflow-hidden rounded-[8px] border border-border/70">
                    <div className="border-b border-border/55 px-4 py-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Состав
                        </p>
                    </div>

                    {items.length > 0 ? (
                        <div className="divide-y divide-border/45">
                            {items.map((item, index) => {
                                const menuItem = getMenuItemForOrderItem(item, menuItemLookup);
                                const itemName = getOrderItemName(item, menuItem);
                                const image = getOrderItemImage(item, menuItem);
                                const quantity = getOrderItemQuantity(item);
                                const itemTotal = getOrderItemTotal(item);

                                return (
                                    <div
                                        key={`${item.productId ?? item.id ?? itemName}-${index}`}
                                        className="flex gap-4 px-4 py-4"
                                    >
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[6px] border border-border/55 bg-black/25">
                                            {image ? (
                                                <Image
                                                    src={image}
                                                    alt={itemName}
                                                    fill
                                                    sizes="80px"
                                                    className="object-contain p-1"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-primary/70">
                                                    <ImageIcon className="h-8 w-8" strokeWidth={1.5}/>
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="wrap-break-word text-[15px] font-semibold leading-6 text-text">
                                                        {itemName}
                                                    </p>
                                                    <p className="mt-1 text-[12px] text-text/55">
                                                        {quantity} шт.
                                                        {typeof item.price === "number" ? ` x ${formatMoney(item.price)}` : ""}
                                                    </p>
                                                </div>

                                                {typeof itemTotal === "number" && (
                                                    <span className="shrink-0 text-[14px] font-semibold text-text">
                                                        {formatMoney(itemTotal)}
                                                    </span>
                                                )}
                                            </div>

                                            {item.modifiers && item.modifiers.length > 0 && (
                                                <div className="mt-3 space-y-1 text-[12px] leading-5 text-text/58">
                                                    {item.modifiers.map((modifier, modifierIndex) => {
                                                        const modifierMenuItem = getMenuItemForOrderItem(modifier, menuItemLookup);

                                                        return (
                                                            <p key={`${modifier.productId ?? modifier.id ?? modifierIndex}`}>
                                                                + {getOrderItemName(modifier, modifierMenuItem)} · {getOrderItemQuantity(modifier)} шт.
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-4 py-5 text-[14px] leading-6 text-text/68">
                            Состав заказа не пришел в ответе сервера.
                        </div>
                    )}
                </div>

                {order.comment && (
                    <div className="mt-6 rounded-[8px] border border-border/70 px-4 py-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Комментарий
                        </p>
                        <p className="mt-3 wrap-break-word text-[14px] leading-6 text-text/74">
                            {order.comment}
                        </p>
                    </div>
                )}
            </div>
        </ModalSkeleton>
    );
}

type OrderDetailProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function OrderDetail({icon, label, value}: OrderDetailProps) {
    return (
        <div className="border-b border-border/45 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <span className="mb-4 inline-flex text-primary">
                {icon}
            </span>
            <p className="text-[12px] leading-none text-text/58">
                {label}
            </p>
            <p className="mt-3 wrap-break-word text-[14px] font-semibold leading-6 text-text">
                {value}
            </p>
        </div>
    );
}

const statusBadgeClasses: Record<StatusTone, string> = {
    success: "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
    progress: "border-primary/45 bg-primary/12 text-primary",
    warning: "border-amber-400/35 bg-amber-500/12 text-amber-100",
    danger: "border-red-500/45 bg-red-500/12 text-red-100",
    muted: "border-border/70 bg-white/[0.04] text-text/78",
};

type StatusBadgeProps = {
    label: string;
    tone: StatusTone;
};

function StatusBadge({label, tone}: StatusBadgeProps) {
    return (
        <span className={`inline-flex min-h-8 max-w-full items-center rounded-[6px] border px-3 py-1 text-[12px] font-semibold leading-4 ${statusBadgeClasses[tone]}`}>
            <span className="wrap-break-word">{label}</span>
        </span>
    );
}

type OrderMetaProps = {
    icon: ReactNode;
    label: string;
};

function OrderMeta({icon, label}: OrderMetaProps) {
    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-primary">{icon}</span>
            <span className="wrap-break-word">{label}</span>
        </span>
    );
}

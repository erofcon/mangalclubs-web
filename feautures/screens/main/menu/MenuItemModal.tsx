"use client";

import {Minus, Plus} from "lucide-react";
import Image from "next/image";
import {useMemo, useRef, useState} from "react";
import {type MenuModifierGroup, type MenuItem as MenuItemType} from "@/types/products";
import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useCartStore} from "@/store/cart-store";
import {requestCartAddPermission} from "@/store/cart-gate-store";

interface MenuItemModalProps {
    item: MenuItemType;
    onClose: () => void;
}

type SelectedModifiers = Record<string, Record<string, number>>;

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")}\u00a0₽`;

const getGroupKey = (group: MenuModifierGroup) => group.productGroupId || group.id;

const isRequiredGroup = (group: MenuModifierGroup) => group.required || group.minQuantity > 0;

const getModifierDefaultAmount = (modifier: MenuModifierGroup["items"][number]) => (
    modifier.defaultAmount ?? modifier.restrictions?.byDefault ?? 0
);

const getSortedModifierItems = (group: MenuModifierGroup) => (
    [...group.items].sort((firstItem, secondItem) => (firstItem.position ?? 0) - (secondItem.position ?? 0))
);

const getGroupMinSelections = (group: MenuModifierGroup) => (
    Math.max(0, Math.ceil(group.minQuantity || (group.required ? 1 : 0)))
);

const getGroupMaxSelections = (group: MenuModifierGroup) => (
    group.maxQuantity && group.maxQuantity > 0 ? Math.floor(group.maxQuantity) : undefined
);

const isGroupTotalAmountBased = (group: MenuModifierGroup) => !group.childModifiersHaveMinMaxRestrictions;

const isSingleChoiceGroup = (group: MenuModifierGroup) => (
    isRequiredGroup(group) && getGroupMaxSelections(group) === 1
);

const isLockedSingleModifierGroup = (group: MenuModifierGroup) => (
    isRequiredGroup(group) && group.items.length === 1
);

const getModifierMinAmount = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
) => {
    const modifierMin = Math.ceil(modifier.restrictions?.minQuantity ?? 0);
    const groupMin = isLockedSingleModifierGroup(group) ? getGroupMinSelections(group) : 0;

    return Math.max(1, modifierMin, groupMin);
};

const getModifierMaxAmount = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
) => {
    const modifierMax = modifier.restrictions?.maxQuantity && modifier.restrictions.maxQuantity > 0
        ? Math.floor(modifier.restrictions.maxQuantity)
        : undefined;
    const groupMax = getGroupMaxSelections(group);

    if (isLockedSingleModifierGroup(group) && groupMax) {
        return modifierMax ? Math.min(modifierMax, groupMax) : groupMax;
    }

    return modifierMax;
};

const clampModifierAmount = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
    amount: number,
) => {
    const minAmount = getModifierMinAmount(group, modifier);
    const maxAmount = getModifierMaxAmount(group, modifier);
    const nextAmount = Math.max(minAmount, Math.floor(amount));

    return maxAmount ? Math.min(nextAmount, maxAmount) : nextAmount;
};

const getInitialModifierAmount = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
) => {
    const defaultAmount = getModifierDefaultAmount(modifier);
    const amount = defaultAmount > 0 ? defaultAmount : getModifierMinAmount(group, modifier);

    return clampModifierAmount(group, modifier, amount);
};

const getGroupSelectedTotal = (group: MenuModifierGroup, selectedAmounts: Record<string, number> = {}) => {
    const amounts = Object.values(selectedAmounts).filter((amount) => amount > 0);

    return isGroupTotalAmountBased(group)
        ? amounts.reduce((sum, amount) => sum + amount, 0)
        : amounts.length;
};

const getModifierQuantityCapacity = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
    selectedAmounts: Record<string, number> = {},
) => {
    const modifierMax = getModifierMaxAmount(group, modifier);
    const groupMax = isGroupTotalAmountBased(group) ? getGroupMaxSelections(group) : undefined;

    if (!groupMax) {
        return modifierMax;
    }

    const otherAmount = Object.entries(selectedAmounts).reduce(
        (sum, [productId, amount]) => (productId === modifier.productId ? sum : sum + amount),
        0,
    );
    const groupCapacity = Math.max(0, groupMax - otherAmount);

    return modifierMax ? Math.min(modifierMax, groupCapacity) : groupCapacity;
};

const getInitialModifierAmountWithinCapacity = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
    selectedAmounts: Record<string, number> = {},
) => {
    const amount = getInitialModifierAmount(group, modifier);
    const capacity = getModifierQuantityCapacity(group, modifier, selectedAmounts);

    return clampModifierAmount(
        group,
        modifier,
        capacity === undefined ? amount : Math.min(amount, capacity),
    );
};

const canSelectModifier = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
    selectedAmounts: Record<string, number> = {},
) => {
    const groupMax = getGroupMaxSelections(group);

    if (group.childModifiersHaveMinMaxRestrictions && groupMax && getGroupSelectedTotal(group, selectedAmounts) >= groupMax) {
        return false;
    }

    const capacity = getModifierQuantityCapacity(group, modifier, selectedAmounts);

    return capacity === undefined || capacity >= getModifierMinAmount(group, modifier);
};

const modifierSupportsQuantity = (
    group: MenuModifierGroup,
    modifier: MenuModifierGroup["items"][number],
) => {
    const minAmount = getModifierMinAmount(group, modifier);
    const maxAmount = getModifierMaxAmount(group, modifier);
    const groupMax = getGroupMaxSelections(group);
    const defaultAmount = getModifierDefaultAmount(modifier);

    return minAmount > 1
        || defaultAmount > 1
        || Boolean(maxAmount && maxAmount > 1)
        || Boolean(isGroupTotalAmountBased(group) && groupMax && groupMax > 1);
};

const buildInitialSelectedModifiers = (groups: MenuModifierGroup[] = []): SelectedModifiers => (
    groups.reduce<SelectedModifiers>((selectedModifiers, group) => {
        const items = getSortedModifierItems(group);

        if (items.length === 0) {
            return selectedModifiers;
        }

        const groupKey = getGroupKey(group);
        const selectedAmounts: Record<string, number> = {};
        const minSelections = getGroupMinSelections(group);

        for (const modifier of items) {
            if (getModifierDefaultAmount(modifier) > 0 && canSelectModifier(group, modifier, selectedAmounts)) {
                selectedAmounts[modifier.productId] = getInitialModifierAmountWithinCapacity(
                    group,
                    modifier,
                    selectedAmounts,
                );
            }
        }

        if (isLockedSingleModifierGroup(group)) {
            const modifier = items[0];
            selectedAmounts[modifier.productId] = selectedAmounts[modifier.productId]
                ?? getInitialModifierAmount(group, modifier);
            selectedModifiers[groupKey] = selectedAmounts;
            return selectedModifiers;
        }

        if (isRequiredGroup(group) && getGroupSelectedTotal(group, selectedAmounts) < minSelections) {
            for (const modifier of items) {
                if (getGroupSelectedTotal(group, selectedAmounts) >= minSelections) {
                    break;
                }

                if (selectedAmounts[modifier.productId] || !canSelectModifier(group, modifier, selectedAmounts)) {
                    continue;
                }

                selectedAmounts[modifier.productId] = getInitialModifierAmountWithinCapacity(
                    group,
                    modifier,
                    selectedAmounts,
                );
            }
        }

        selectedModifiers[groupKey] = selectedAmounts;

        return selectedModifiers;
    }, {})
);

export function MenuItemModal({item, onClose}: MenuItemModalProps) {
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>(() => (
        buildInitialSelectedModifiers(item.modifiers)
    ));
    const addItem = useCartStore((state) => state.addItem);

    const modifierGroups = useMemo(
        () => item.modifiers?.filter((group) => group.items.length > 0) ?? [],
        [item.modifiers],
    );
    const requiredGroups = useMemo(
        () => modifierGroups.filter(isRequiredGroup),
        [modifierGroups],
    );
    const optionalGroups = useMemo(
        () => modifierGroups.filter((group) => !isRequiredGroup(group)),
        [modifierGroups],
    );
    const selectedCartModifiers = useMemo(
        () => modifierGroups.flatMap((group) => {
            const groupKey = getGroupKey(group);
            const selectedAmounts = selectedModifiers[groupKey] ?? {};

            return Object.entries(selectedAmounts).flatMap(([productId, amount]) => {
                const modifier = group.items.find((groupItem) => groupItem.productId === productId);

                if (!modifier || amount <= 0) {
                    return [];
                }

                const nextAmount = clampModifierAmount(group, modifier, amount);

                return [{
                    productId: modifier.productId,
                    productGroupId: modifier.productGroupId ?? group.productGroupId,
                    name: modifier.name,
                    amount: nextAmount,
                    price: Number.isFinite(modifier.price) ? modifier.price : 0,
                }];
            });
        }),
        [modifierGroups, selectedModifiers],
    );
    const modifiersPrice = selectedCartModifiers.reduce(
        (sum, modifier) => sum + modifier.price * modifier.amount,
        0,
    );
    const unitPrice = item.price + modifiersPrice;
    const canAddToCart = modifierGroups.every((group) => {
        const groupKey = getGroupKey(group);
        const selectedAmounts = selectedModifiers[groupKey] ?? {};
        const selectedTotal = getGroupSelectedTotal(group, selectedAmounts);
        const minSelections = getGroupMinSelections(group);
        const maxSelections = getGroupMaxSelections(group);
        const selectedItemsAreValid = Object.entries(selectedAmounts).every(([productId, amount]) => {
            const modifier = group.items.find((groupItem) => groupItem.productId === productId);

            if (!modifier || amount <= 0) {
                return false;
            }

            return amount === clampModifierAmount(group, modifier, amount);
        });

        return selectedItemsAreValid
            && selectedTotal >= minSelections
            && (!maxSelections || selectedTotal <= maxSelections);
    });

    const decreaseQuantity = () => {
        setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
    };

    const increaseQuantity = () => {
        setQuantity((currentQuantity) => currentQuantity + 1);
    };

    const selectSingleModifier = (group: MenuModifierGroup, productId: string) => {
        const groupKey = getGroupKey(group);
        const modifier = group.items.find((groupItem) => groupItem.productId === productId);

        if (!modifier) {
            return;
        }

        setSelectedModifiers((currentSelectedModifiers) => ({
            ...currentSelectedModifiers,
            [groupKey]: {
                [productId]: currentSelectedModifiers[groupKey]?.[productId]
                    ?? getInitialModifierAmount(group, modifier),
            },
        }));
    };

    const toggleModifier = (group: MenuModifierGroup, productId: string) => {
        const groupKey = getGroupKey(group);
        const modifier = group.items.find((groupItem) => groupItem.productId === productId);

        if (!modifier) {
            return;
        }

        setSelectedModifiers((currentSelectedModifiers) => {
            const selectedAmounts = currentSelectedModifiers[groupKey] ?? {};
            const isSelected = Boolean(selectedAmounts[productId]);

            if (isSelected) {
                const nextSelectedAmounts = {...selectedAmounts};
                delete nextSelectedAmounts[productId];

                return {
                    ...currentSelectedModifiers,
                    [groupKey]: nextSelectedAmounts,
                };
            }

            if (!canSelectModifier(group, modifier, selectedAmounts)) {
                return currentSelectedModifiers;
            }

            return {
                ...currentSelectedModifiers,
                [groupKey]: {
                    ...selectedAmounts,
                    [productId]: getInitialModifierAmountWithinCapacity(group, modifier, selectedAmounts),
                },
            };
        });
    };

    const changeModifierAmount = (
        group: MenuModifierGroup,
        modifier: MenuModifierGroup["items"][number],
        nextAmount: number,
    ) => {
        const groupKey = getGroupKey(group);

        setSelectedModifiers((currentSelectedModifiers) => {
            const selectedAmounts = currentSelectedModifiers[groupKey] ?? {};

            if (!selectedAmounts[modifier.productId]) {
                return currentSelectedModifiers;
            }

            const capacity = getModifierQuantityCapacity(group, modifier, selectedAmounts);
            const clampedAmount = clampModifierAmount(
                group,
                modifier,
                capacity === undefined ? nextAmount : Math.min(nextAmount, capacity),
            );

            return {
                ...currentSelectedModifiers,
                [groupKey]: {
                    ...selectedAmounts,
                    [modifier.productId]: clampedAmount,
                },
            };
        });
    };

    const handleAddToCart = () => {
        if (!canAddToCart) {
            return;
        }

        if (!requestCartAddPermission(item, quantity, selectedCartModifiers)) {
            onClose();
            return;
        }

        const imageRect = imageWrapperRef.current?.getBoundingClientRect();

        if (!imageRect) {
            addItem(item, quantity, selectedCartModifiers);
            onClose();
            return;
        }

        const detail = {
            image: item.image,
            name: item.name,
            from: {
                x: imageRect.left + imageRect.width / 2,
                y: imageRect.top + imageRect.height / 2,
            },
            onComplete: () => addItem(item, quantity, selectedCartModifiers),
        };

        onClose();

        window.setTimeout(() => {
            window.requestAnimationFrame(() => {
                window.dispatchEvent(
                    new CustomEvent("fly-to-cart", {
                        detail,
                    }),
                );
            });
        }, 0);
    };

    const renderModifierSection = (
        title: string,
        groups: MenuModifierGroup[],
    ) => {
        if (groups.length === 0) {
            return null;
        }

        return (
            <section className="mt-6 space-y-4">
                <h3 className="text-[17px] font-semibold leading-tight text-text">
                    {title}
                </h3>

                {groups.map((group) => {
                    const groupKey = getGroupKey(group);
                    const selectedAmounts = selectedModifiers[groupKey] ?? {};
                    const isLockedSingleGroup = isLockedSingleModifierGroup(group);
                    const inputType = isSingleChoiceGroup(group) ? "radio" : "checkbox";
                    const shouldShowGroupName = group.name && group.name !== title;

                    return (
                        <div key={groupKey} className="space-y-2.5">
                            {shouldShowGroupName && (
                                <p className="text-[13px] font-semibold leading-5 text-text/72">
                                    {group.name}
                                </p>
                            )}

                            <div className="space-y-2">
                                {getSortedModifierItems(group).map((modifier) => {
                                    const modifierAmount = selectedAmounts[modifier.productId] ?? 0;
                                    const isSelected = modifierAmount > 0;
                                    const canUseQuantity = modifierSupportsQuantity(group, modifier);
                                    const modifierMinAmount = getModifierMinAmount(group, modifier);
                                    const modifierCapacity = getModifierQuantityCapacity(group, modifier, selectedAmounts);
                                    const isDisabled = !isLockedSingleGroup
                                        && inputType === "checkbox"
                                        && !isSelected
                                        && !canSelectModifier(group, modifier, selectedAmounts);
                                    const isDecreaseDisabled = modifierAmount <= modifierMinAmount;
                                    const isIncreaseDisabled = modifierCapacity !== undefined
                                        && modifierAmount >= modifierCapacity;
                                    const modifierPrice = Number.isFinite(modifier.price) ? modifier.price : 0;
                                    const displayedModifierPrice = modifierPrice * (isSelected ? modifierAmount : 1);

                                    return (
                                        <label
                                            key={modifier.id}
                                            className={`flex min-h-12 items-center gap-3 rounded-[6px] border border-border/70 bg-[#0d0e0e] px-3.5 py-3 text-text transition duration-200 hover:border-primary/70 ${isDisabled ? "cursor-not-allowed opacity-50" : isLockedSingleGroup ? "cursor-default" : "cursor-pointer"}`}
                                        >
                                            {!isLockedSingleGroup && (
                                                <input
                                                    type={inputType}
                                                    name={`modifier-${groupKey}`}
                                                    checked={isSelected}
                                                    disabled={isDisabled}
                                                    onChange={() => {
                                                        if (inputType === "radio") {
                                                            selectSingleModifier(group, modifier.productId);
                                                            return;
                                                        }

                                                        toggleModifier(group, modifier.productId);
                                                    }}
                                                    className="h-4 w-4 shrink-0 accent-primary"
                                                />
                                            )}
                                            <span className="min-w-0 flex-1 text-[14px] leading-5">
                                                {modifier.name}
                                            </span>
                                            <div className="flex shrink-0 items-center gap-3">
                                                {isSelected && canUseQuantity && (
                                                    <div className="flex h-9 w-24 items-center justify-between rounded-md border border-border/70 p-1">
                                                        <button
                                                            type="button"
                                                            disabled={isDecreaseDisabled}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                changeModifierAmount(group, modifier, modifierAmount - 1);
                                                            }}
                                                            className="flex h-7 w-7 items-center justify-center rounded-sm text-text transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                                            aria-label="Decrease modifier amount"
                                                        >
                                                            <Minus className="h-4 w-4"/>
                                                        </button>

                                                        <span className="w-6 text-center text-sm font-bold">
                                                            {modifierAmount}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            disabled={isIncreaseDisabled}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                changeModifierAmount(group, modifier, modifierAmount + 1);
                                                            }}
                                                            className="flex h-7 w-7 items-center justify-center rounded-sm text-text transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                                            aria-label="Increase modifier amount"
                                                        >
                                                            <Plus className="h-4 w-4"/>
                                                        </button>
                                                    </div>
                                                )}

                                                <span className="text-[13px] font-semibold text-primary">
                                                    {modifierPrice > 0 ? `+ ${formatPrice(displayedModifierPrice)}` : formatPrice(0)}
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </section>
        );
    };

    return (
        <ModalSkeleton onClose={onClose} className="sm:h-125">
            <div
                className="flex h-full w-full flex-col overflow-hidden border-border bg-background sm:flex-row sm:rounded-[8px] sm:border">
                <div
                    ref={imageWrapperRef}
                    className="relative flex h-[42dvh] min-h-65 w-full shrink-0 items-center justify-center overflow-hidden bg-background sm:h-full sm:min-h-0 sm:w-1/2"
                >
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 450px"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="text-sm text-text/60">Нет фото</div>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col sm:w-1/2">
                    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
                        <p className="mb-3 text-[12px] font-semibold uppercase text-primary">
                            Блюдо
                        </p>
                        <h2
                            className="pr-12 text-center text-[28px] font-normal leading-tight text-text sm:text-[34px] md:text-left"
                        >
                            {item.name}
                        </h2>

                        {item.description && (
                            <p className="mt-4 text-sm leading-6 text-text/68 sm:text-base">
                                {item.description}
                            </p>
                        )}

                        {item.weight && (
                            <div className="mt-5 inline-flex min-h-9 items-center rounded-[6px] border border-border/70 px-3.5 text-[13px] font-semibold leading-none text-text/78">
                                {item.weight}
                            </div>
                        )}

                        {renderModifierSection("Варианты приготовления", requiredGroups)}
                        {renderModifierSection("Дополнительные опции", optionalGroups)}

                        <div className="mt-6">
                            <h3 className="font-semibold text-text">
                                Пищевая ценность
                            </h3>

                            <div
                                className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg
                                border border-border/70 text-center sm:grid-cols-4">
                                <div>
                                    <div className="border-b border-border/50 px-3 py-3 sm:border-b-0 sm:border-r">
                                        <div className="text-xs font-semibold text-text/60">
                                            кКал
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.calories ?? "—"}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="border-b border-border/50 px-3 py-3 sm:border-b-0 sm:border-r">
                                        <div className="text-xs font-semibold text-text/60">
                                            Жиры
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.fats ?? "—"} г
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="border-r border-border/50 px-3 py-3">
                                        <div className="text-xs font-semibold text-text/60">
                                            Белки
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.proteins ?? "—"} г
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="px-3 py-3">
                                        <div className="text-xs font-semibold text-text/60">
                                            Углеводы
                                        </div>
                                        <div className="text-base font-semibold text-text">
                                            {item.carbs ?? "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-border bg-background p-5 sm:p-8">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-12 w-32 shrink-0 items-center justify-between
                                rounded-md border border-border p-1">
                                <button
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center
                                    rounded-sm text-text transition hover:text-primary disabled:opacity-50"
                                    aria-label="Уменьшить количество"
                                >
                                    <Minus className="h-5 w-5"/>
                                </button>

                                <span className="w-8 text-center text-base font-bold text-text md:text-lg">
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm text-text transition hover:text-primary"
                                    aria-label="Увеличить количество"
                                >
                                    <Plus className="h-5 w-5"/>
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!canAddToCart}
                                className="flex h-12 flex-1 cursor-pointer items-center justify-center
                                rounded-md bg-primary px-6 text-sm font-bold
                                text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
                            >
                                Добавить за {formatPrice(unitPrice * quantity)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalSkeleton>
    );
}

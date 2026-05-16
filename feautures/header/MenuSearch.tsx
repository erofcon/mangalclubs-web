"use client";

import Image from "next/image";
import {Search, X} from "lucide-react";
import {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {menus} from "@/mocks/mocks-data";
import type {MenuItem as MenuItemType} from "@/types/products";
import {MenuItemModal} from "@/feautures/screens/main/menu/MenuItemModal";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";

type MenuSearchProps = {
    variant: "desktop" | "mobile";
    onOpenChange?: (isOpen: boolean) => void;
};

type SearchEntry = {
    item: MenuItemType;
    categoryId: string;
    categoryTitle: string;
    searchableText: string;
    searchableName: string;
    searchableDescription: string;
    searchableCategory: string;
};

type SearchResult = SearchEntry & {
    score: number;
};

const keyboardLayoutMap: Record<string, string> = {
    q: "й",
    w: "ц",
    e: "у",
    r: "к",
    t: "е",
    y: "н",
    u: "г",
    i: "ш",
    o: "щ",
    p: "з",
    "[": "х",
    "]": "ъ",
    a: "ф",
    s: "ы",
    d: "в",
    f: "а",
    g: "п",
    h: "р",
    j: "о",
    k: "л",
    l: "д",
    ";": "ж",
    "'": "э",
    z: "я",
    x: "ч",
    c: "с",
    v: "м",
    b: "и",
    n: "т",
    m: "ь",
    ",": "б",
    ".": "ю",
    "`": "ё",
};

const transliterationMap: Record<string, string> = {
    a: "а",
    b: "б",
    v: "в",
    g: "г",
    d: "д",
    e: "е",
    z: "з",
    i: "и",
    j: "й",
    k: "к",
    l: "л",
    m: "м",
    n: "н",
    o: "о",
    p: "п",
    r: "р",
    s: "с",
    t: "т",
    u: "у",
    f: "ф",
    h: "х",
    c: "ц",
    y: "ы",
};

const synonymGroups = [
    ["стейк", "мясо", "говядина", "рибай", "томагавк", "антрекот"],
    ["шашлык", "мангал", "гриль", "мясо", "крылышки", "курица", "куриный"],
    ["люля", "кебаб", "фарш", "баранина", "говядина"],
    ["салат", "овощи", "зелень", "помидоры", "томаты", "огурцы", "буррата", "капрезе"],
];

const allMenuEntries: SearchEntry[] = menus.flatMap((category) =>
    category.items.map((item) => ({
        item,
        categoryId: category.id,
        categoryTitle: category.title,
        searchableName: normalizeText(item.name),
        searchableDescription: normalizeText(item.description),
        searchableCategory: normalizeText(category.title),
        searchableText: normalizeText(`${item.name} ${item.description} ${category.title}`),
    })),
);

export function MenuSearch({variant, onOpenChange}: MenuSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isMobile = variant === "mobile";
    const trimmedQuery = query.trim();
    const results = useMemo(() => searchMenu(trimmedQuery), [trimmedQuery]);

    const openSearch = () => setIsOpen(true);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery("");
    }, []);

    const selectItem = (item: MenuItemType) => {
        setSelectedItem(item);
        closeSearch();
    };

    useBodyScrollLock(isMobile && isOpen);

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        if (!isOpen) return;

        window.setTimeout(() => inputRef.current?.focus(), 70);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || isMobile) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                closeSearch();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [closeSearch, isMobile, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeSearch();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeSearch, isOpen]);

    if (isMobile) {
        return (
            <>
                <button
                    type="button"
                    onClick={openSearch}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text transition duration-300 hover:border-primary hover:text-primary"
                    aria-label="Открыть поиск по меню"
                >
                    <Search className="h-5 w-5"/>
                </button>

                {isOpen && (
                    <div className="fixed inset-0 z-70 bg-background/88 px-4 pt-4 backdrop-blur-md md:hidden">
                        <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[8px] border border-border/80 bg-background shadow-[0_24px_55px_rgba(0,0,0,0.42)]">
                            <SearchInput
                                ref={inputRef}
                                query={query}
                                placeholder="Найти блюдо"
                                onChange={setQuery}
                                onClose={closeSearch}
                            />

                            <SearchResults
                                query={trimmedQuery}
                                results={results}
                                onSelect={selectItem}
                                isWaiting={!trimmedQuery}
                                className="max-h-[calc(100dvh-84px)] border-t border-border/55"
                            />
                        </div>
                    </div>
                )}

                {selectedItem && (
                    <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)}/>
                )}
            </>
        );
    }

    return (
        <div ref={containerRef} className="relative hidden h-10 w-10 md:block">
            {isOpen ? (
                <div
                    className="absolute right-0 top-0 z-30 w-[400px] overflow-hidden rounded-[6px] border border-primary bg-background shadow-[0_24px_55px_rgba(0,0,0,0.44)]"
                >
                    <SearchInput
                        ref={inputRef}
                        query={query}
                        placeholder="Найти блюдо"
                        onChange={setQuery}
                        onClose={closeSearch}
                    />

                    <SearchResults
                        query={trimmedQuery}
                        results={results}
                        onSelect={selectItem}
                        isWaiting={!trimmedQuery}
                        className="border-t border-border/55"
                    />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openSearch}
                    className="flex h-full w-full cursor-pointer items-center justify-center rounded-[6px] border border-border text-text transition duration-300 hover:border-primary hover:text-primary"
                    aria-label="Открыть поиск по меню"
                >
                    <Search className="h-4 w-4"/>
                </button>
            )}

            {selectedItem && (
                <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)}/>
            )}
        </div>
    );
}

type SearchInputProps = {
    query: string;
    placeholder: string;
    onChange: (value: string) => void;
    onClose: () => void;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
    {query, placeholder, onChange, onClose},
    ref,
) {
    return (
        <div className="flex h-12 w-full items-center gap-2 px-4">
            <Search className="h-4 w-4 shrink-0 text-text-secondary"/>
            <input
                ref={ref}
                value={query}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-text outline-none placeholder:text-text-secondary"
                aria-label={placeholder}
            />
            <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[5px] text-text-secondary transition duration-300 hover:bg-primary hover:text-on-primary"
                aria-label="Закрыть поиск"
            >
                <X className="h-4 w-4"/>
            </button>
        </div>
    );
});

function SearchResults({
                           query,
                           results,
                           onSelect,
                           isWaiting,
                           className,
                       }: {
    query: string;
    results: SearchResult[];
    onSelect: (item: MenuItemType) => void;
    isWaiting: boolean;
    className?: string;
}) {
    const groupedResults = groupResults(results);

    return (
        <div className={`overflow-hidden bg-background ${className ?? ""}`}>
            <div className="max-h-[470px] overflow-y-auto">
                {isWaiting ? (
                    <div className="px-4 py-4">
                        <div className="rounded-[6px] bg-primary/7 px-3.5 py-3 text-[14px] font-semibold leading-6 text-text-secondary">
                            Начните вводить название блюда
                        </div>
                    </div>
                ) : groupedResults.length > 0 ? (
                    groupedResults.map((group) => (
                        <section key={group.categoryId}>
                            <h3
                                className="sticky top-0 z-10 border-b border-border/50 bg-background px-4 py-3 text-[18px] font-semibold leading-tight text-text"
                            >
                                {group.categoryTitle}
                            </h3>

                            <div>
                                {group.items.map((result) => (
                                    <button
                                        key={result.item.id}
                                        type="button"
                                        onClick={() => onSelect(result.item)}
                                        className="grid w-full grid-cols-[74px_minmax(0,1fr)] items-center gap-4 border-b border-border/40 px-4 py-3 text-left transition duration-300 last:border-b-0 hover:bg-primary/8"
                                    >
                                        <span className="relative h-18 w-18 overflow-hidden rounded-[6px] bg-black/20">
                                            {result.item.image ? (
                                                <Image
                                                    src={result.item.image}
                                                    alt={result.item.name}
                                                    fill
                                                    sizes="72px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="flex h-full items-center justify-center text-[11px] text-text-secondary">
                                                    Нет фото
                                                </span>
                                            )}
                                        </span>

                                        <span className="min-w-0">
                                            <span className="line-clamp-2 text-[15px] font-semibold leading-5 text-text">
                                                <HighlightedText text={result.item.name} query={query}/>
                                            </span>
                                            {result.item.description && (
                                                <span className="mt-1 line-clamp-1 text-[12px] leading-5 text-text-secondary">
                                                    <HighlightedText text={result.item.description} query={query}/>
                                                </span>
                                            )}
                                            <span className="mt-2 block text-[14px] font-bold text-primary">
                                                {result.item.price.toLocaleString("ru-RU")} ₽
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="px-4 py-5 text-[14px] leading-6 text-text-secondary">
                        Ничего не найдено
                    </div>
                )}
            </div>
        </div>
    );
}

function HighlightedText({text, query}: { text: string; query: string }) {
    const normalizedQuery = normalizeText(query).split(" ")[0];

    if (!normalizedQuery) return text;

    const normalizedText = normalizeText(text);
    const startIndex = normalizedText.indexOf(normalizedQuery);

    if (startIndex < 0) return text;

    const endIndex = startIndex + normalizedQuery.length;

    return (
        <>
            {text.slice(0, startIndex)}
            <mark className="bg-transparent text-primary">{text.slice(startIndex, endIndex)}</mark>
            {text.slice(endIndex)}
        </>
    );
}

function searchMenu(query: string): SearchResult[] {
    const variants = getQueryVariants(query);

    if (variants.length === 0) {
        return [];
    }

    return allMenuEntries
        .map((entry) => ({
            ...entry,
            score: Math.max(...variants.map((variant) => scoreEntry(entry, variant))),
        }))
        .filter((entry) => entry.score > 22)
        .sort((first, second) => second.score - first.score)
        .slice(0, 12);
}

function getQueryVariants(query: string) {
    const normalized = normalizeText(query);

    if (!normalized) return [];

    const keyboardFixed = normalizeText(
        query
            .toLowerCase()
            .split("")
            .map((letter) => keyboardLayoutMap[letter] ?? letter)
            .join(""),
    );
    const transliterated = normalizeText(transliterateToCyrillic(query));

    return Array.from(new Set([normalized, keyboardFixed, transliterated].filter(Boolean)));
}

function scoreEntry(entry: SearchEntry, normalizedQuery: string) {
    const queryTokens = normalizedQuery.split(" ").filter(Boolean);
    const targetTokens = entry.searchableText.split(" ").filter(Boolean);
    let score = 0;

    if (entry.searchableName === normalizedQuery) score += 180;
    if (entry.searchableName.startsWith(normalizedQuery)) score += 140;
    if (entry.searchableName.includes(normalizedQuery)) score += 115;
    if (entry.searchableDescription.includes(normalizedQuery)) score += 58;
    if (entry.searchableCategory.includes(normalizedQuery)) score += 42;

    queryTokens.forEach((queryToken) => {
        const bestTokenScore = targetTokens.reduce((best, targetToken) => {
            if (targetToken === queryToken) return Math.max(best, 80);
            if (targetToken.startsWith(queryToken)) return Math.max(best, 66);
            if (targetToken.includes(queryToken)) return Math.max(best, 48);

            const similarity = getSimilarity(queryToken, targetToken);

            if (similarity > 0.78) return Math.max(best, Math.round(similarity * 54));
            if (queryToken.length > 3 && similarity > 0.66) return Math.max(best, Math.round(similarity * 38));

            return best;
        }, 0);

        score += bestTokenScore;
        score += getSynonymScore(queryToken, entry.searchableText);
    });

    return score;
}

function getSynonymScore(token: string, searchableText: string) {
    const group = synonymGroups.find((synonyms) => synonyms.some((synonym) => getSimilarity(token, synonym) > 0.72));

    if (!group) return 0;

    return group.some((synonym) => searchableText.includes(synonym)) ? 34 : 0;
}

function groupResults(results: SearchResult[]) {
    return results.reduce<Array<{ categoryId: string; categoryTitle: string; items: SearchResult[] }>>((groups, result) => {
        const currentGroup = groups.find((group) => group.categoryId === result.categoryId);

        if (currentGroup) {
            currentGroup.items.push(result);
            return groups;
        }

        groups.push({
            categoryId: result.categoryId,
            categoryTitle: result.categoryTitle,
            items: [result],
        });

        return groups;
    }, []);
}

function normalizeText(value: string) {
    return value
        .toLowerCase()
        .replaceAll("ё", "е")
        .replace(/[^a-zа-я0-9]+/gi, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function transliterateToCyrillic(value: string) {
    return value
        .toLowerCase()
        .replaceAll("shch", "щ")
        .replaceAll("yo", "е")
        .replaceAll("yu", "ю")
        .replaceAll("ya", "я")
        .replaceAll("zh", "ж")
        .replaceAll("ch", "ч")
        .replaceAll("sh", "ш")
        .replaceAll("kh", "х")
        .replaceAll("ts", "ц")
        .split("")
        .map((letter) => transliterationMap[letter] ?? letter)
        .join("");
}

function getSimilarity(first: string, second: string) {
    const maxLength = Math.max(first.length, second.length);

    if (maxLength === 0) return 1;

    return 1 - getLevenshteinDistance(first, second) / maxLength;
}

function getLevenshteinDistance(first: string, second: string) {
    const previous = Array.from({length: second.length + 1}, (_, index) => index);
    const current = Array(second.length + 1).fill(0);

    for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
        current[0] = firstIndex;

        for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
            const substitutionCost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1;

            current[secondIndex] = Math.min(
                current[secondIndex - 1] + 1,
                previous[secondIndex] + 1,
                previous[secondIndex - 1] + substitutionCost,
            );
        }

        for (let index = 0; index <= second.length; index += 1) {
            previous[index] = current[index];
        }
    }

    return previous[second.length];
}

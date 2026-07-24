"use client";

import Image from "next/image";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ChevronLeft, ChevronRight, LoaderCircle, X} from "lucide-react";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";

type UseImageLightboxOptions = {
    images: string[];
    alt?: string;
};

type TouchPoint = {
    x: number;
    y: number;
};

export function useImageLightbox({images, alt = "Фото"}: UseImageLightboxOptions) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
    const activeIndexRef = useRef<number | null>(null);
    const isOpen = activeIndex !== null && images.length > 0;
    const normalizedIndex = activeIndex === null ? 0 : clampIndex(activeIndex, images.length);
    const activeImage = images[normalizedIndex];
    const normalizedDisplayedIndex = displayedIndex === null ? normalizedIndex : clampIndex(displayedIndex, images.length);
    const displayedImage = images[normalizedDisplayedIndex];
    const canNavigate = images.length > 1;

    useBodyScrollLock(isOpen);

    const open = useCallback((index = 0) => {
        if (images.length === 0) return;

        const nextIndex = clampIndex(index, images.length);

        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setDisplayedIndex(nextIndex);
        setIsImageLoading(true);
    }, [images.length]);

    const close = useCallback(() => {
        activeIndexRef.current = null;
        setActiveIndex(null);
        setDisplayedIndex(null);
        setIsImageLoading(false);
    }, []);

    const showPrev = useCallback(() => {
        if (images.length < 2) return;

        const nextIndex = wrapIndex((activeIndex ?? 0) - 1, images.length);

        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIsImageLoading(nextIndex !== normalizedDisplayedIndex);
    }, [activeIndex, images.length, normalizedDisplayedIndex]);

    const showNext = useCallback(() => {
        if (images.length < 2) return;

        const nextIndex = wrapIndex((activeIndex ?? 0) + 1, images.length);

        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIsImageLoading(nextIndex !== normalizedDisplayedIndex);
    }, [activeIndex, images.length, normalizedDisplayedIndex]);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const showLoadedImage = useCallback((index: number) => {
        if (activeIndexRef.current !== index) return;

        setDisplayedIndex(index);
        setIsImageLoading(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
                return;
            }

            if (event.key === "ArrowLeft") {
                showPrev();
                return;
            }

            if (event.key === "ArrowRight") {
                showNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [close, isOpen, showNext, showPrev]);

    const lightbox = useMemo(() => {
        if (!isOpen || !activeImage || !displayedImage) return null;

        return (
            <div
                className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black/94 px-3 py-4 text-white sm:px-6"
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                onClick={close}
            >
                <button
                    type="button"
                    onClick={close}
                    className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-[6px] border border-white/20 bg-black/45 text-white transition duration-300 hover:border-primary hover:text-primary sm:right-5 sm:top-5"
                    aria-label="Закрыть просмотр"
                >
                    <X className="h-5 w-5" strokeWidth={1.8}/>
                </button>

                {canNavigate && (
                    <>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                showPrev();
                            }}
                            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[6px] border border-white/20 bg-black/45 text-white transition duration-300 hover:border-primary hover:text-primary sm:left-5 sm:h-12 sm:w-12"
                            aria-label="Предыдущее фото"
                        >
                            <ChevronLeft className="h-6 w-6" strokeWidth={1.8}/>
                        </button>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                showNext();
                            }}
                            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[6px] border border-white/20 bg-black/45 text-white transition duration-300 hover:border-primary hover:text-primary sm:right-5 sm:h-12 sm:w-12"
                            aria-label="Следующее фото"
                        >
                            <ChevronRight className="h-6 w-6" strokeWidth={1.8}/>
                        </button>
                    </>
                )}

                <div
                    className="relative h-[calc(100dvh-112px)] w-full max-w-[1180px] sm:h-[calc(100dvh-96px)]"
                    onClick={(event) => event.stopPropagation()}
                    onTouchStart={(event) => {
                        const touch = event.touches[0];

                        setTouchStart({x: touch.clientX, y: touch.clientY});
                    }}
                    onTouchEnd={(event) => {
                        if (!touchStart || !canNavigate) return;

                        const touch = event.changedTouches[0];
                        const deltaX = touch.clientX - touchStart.x;
                        const deltaY = touch.clientY - touchStart.y;

                        setTouchStart(null);

                        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;

                        if (deltaX > 0) {
                            showPrev();
                        } else {
                            showNext();
                        }
                    }}
                >
                    <Image
                        src={displayedImage}
                        alt={`${alt} ${normalizedDisplayedIndex + 1}`}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        priority
                        onLoad={() => showLoadedImage(normalizedDisplayedIndex)}
                    />
                    {activeImage !== displayedImage && (
                        <Image
                            key={activeImage}
                            src={activeImage}
                            alt=""
                            fill
                            sizes="100vw"
                            className="pointer-events-none absolute inset-0 opacity-0"
                            onLoad={() => showLoadedImage(normalizedIndex)}
                        />
                    )}
                    {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30" aria-live="polite">
                            <LoaderCircle className="h-9 w-9 animate-spin text-white" strokeWidth={1.8}/>
                            <span className="sr-only">Загружаем фото</span>
                        </div>
                    )}
                    {!isImageLoading && canNavigate && Array.from(new Set([
                        wrapIndex(normalizedIndex - 1, images.length),
                        wrapIndex(normalizedIndex + 1, images.length),
                    ])).map((index) => (
                        index !== normalizedIndex && (
                            <Image
                                key={`preload-${images[index]}`}
                                src={images[index]}
                                alt=""
                                fill
                                sizes="100vw"
                                loading="eager"
                                className="pointer-events-none absolute inset-0 opacity-0"
                            />
                        )
                    ))}
                </div>

                {canNavigate && (
                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-[6px] border border-white/15 bg-black/45 px-3 py-2 text-[13px] font-semibold text-white/85">
                        {normalizedIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        );
    }, [activeImage, alt, canNavigate, close, displayedImage, images, isImageLoading, isOpen, normalizedDisplayedIndex, normalizedIndex, showLoadedImage, showNext, showPrev, touchStart]);

    return {
        isOpen,
        open,
        close,
        showNext,
        showPrev,
        activeIndex: normalizedIndex,
        lightbox,
    };
}

function clampIndex(index: number, length: number) {
    if (length <= 0) return 0;

    return Math.min(Math.max(index, 0), length - 1);
}

function wrapIndex(index: number, length: number) {
    if (length <= 0) return 0;

    return (index + length) % length;
}

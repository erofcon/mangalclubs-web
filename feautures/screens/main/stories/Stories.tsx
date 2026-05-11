"use client";

import Image from "next/image";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {StoriesData} from "@/mocks/mocks-data";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";

const DEFAULT_IMAGE_DURATION = 5000;
const LOAD_TIMEOUT = 15000;

function getMediaType(slide: {
    src: string;
    type?: "image" | "video";
}): "image" | "video" {
    if (slide.type) return slide.type;

    const cleanSrc = slide.src.split("?")[0].toLowerCase();

    if (
        cleanSrc.endsWith(".mp4") ||
        cleanSrc.endsWith(".webm") ||
        cleanSrc.endsWith(".mov")
    ) {
        return "video";
    }

    return "image";
}

export default function Stories() {
    const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [hasMediaError, setHasMediaError] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const imageTimerStartedAtRef = useRef<number | null>(null);

    const activeStory =
        activeStoryIndex !== null ? StoriesData[activeStoryIndex] : null;

    const activeSlide = activeStory?.slides[activeSlideIndex] ?? null;
    const isViewerOpen = Boolean(activeStory && activeSlide);

    useBodyScrollLock(isViewerOpen);

    const activeMediaType = useMemo(() => {
        if (!activeSlide) return null;
        return getMediaType(activeSlide);
    }, [activeSlide]);

    const resetMediaState = useCallback(() => {
        imageTimerStartedAtRef.current = null;
        setProgress(0);
        setIsMediaLoading(true);
        setHasMediaError(false);
    }, []);

    const close = useCallback(() => {
        videoRef.current?.pause();
        setActiveStoryIndex(null);
        setActiveSlideIndex(0);
        setProgress(0);
        setIsMediaLoading(false);
        setHasMediaError(false);
        imageTimerStartedAtRef.current = null;
    }, []);

    const next = useCallback(() => {
        if (!activeStory || activeStoryIndex === null) return;

        videoRef.current?.pause();

        if (activeSlideIndex < activeStory.slides.length - 1) {
            resetMediaState();
            setActiveSlideIndex((value) => value + 1);
            return;
        }

        if (activeStoryIndex < StoriesData.length - 1) {
            resetMediaState();
            setActiveStoryIndex((value) => (value === null ? 0 : value + 1));
            setActiveSlideIndex(0);
            return;
        }

        close();
    }, [
        activeStory,
        activeStoryIndex,
        activeSlideIndex,
        close,
        resetMediaState,
    ]);

    const prev = useCallback(() => {
        if (!activeStory || activeStoryIndex === null) return;

        videoRef.current?.pause();

        if (activeSlideIndex > 0) {
            resetMediaState();
            setActiveSlideIndex((value) => value - 1);
            return;
        }

        if (activeStoryIndex > 0) {
            const previousStory = StoriesData[activeStoryIndex - 1];

            resetMediaState();
            setActiveStoryIndex(activeStoryIndex - 1);
            setActiveSlideIndex(previousStory.slides.length - 1);
        }
    }, [
        activeStory,
        activeStoryIndex,
        activeSlideIndex,
        resetMediaState,
    ]);

    const openStory = useCallback(
        (index: number) => {
            resetMediaState();
            setActiveStoryIndex(index);
            setActiveSlideIndex(0);
        },
        [resetMediaState]
    );

    useEffect(() => {
        if (!activeSlide || !isMediaLoading) return;

        const timeoutId = window.setTimeout(() => {
            setIsMediaLoading(false);
            setHasMediaError(true);
        }, LOAD_TIMEOUT);

        return () => window.clearTimeout(timeoutId);
    }, [activeSlide, isMediaLoading]);

    useEffect(() => {
        if (
            !activeStory ||
            !activeSlide ||
            activeMediaType !== "image" ||
            isMediaLoading ||
            hasMediaError
        ) {
            imageTimerStartedAtRef.current = null;
            return;
        }

        if (imageTimerStartedAtRef.current === null) {
            imageTimerStartedAtRef.current = Date.now();
        }

        const duration = activeSlide.durationMs ?? DEFAULT_IMAGE_DURATION;

        const intervalId = window.setInterval(() => {
            if (imageTimerStartedAtRef.current === null) return;

            const nextProgress = Math.min(
                ((Date.now() - imageTimerStartedAtRef.current) / duration) * 100,
                100
            );

            setProgress(nextProgress);

            if (nextProgress >= 100) {
                window.clearInterval(intervalId);
                next();
            }
        }, 50);

        return () => window.clearInterval(intervalId);
    }, [
        activeStory,
        activeSlide,
        activeMediaType,
        isMediaLoading,
        hasMediaError,
        next,
    ]);

    useEffect(() => {
        if (!activeSlide || activeMediaType !== "video") return;

        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0;
        video.pause();
        video.load();
    }, [activeSlide, activeMediaType]);

    return (
        <>
            <section
                className="relative mx-auto -mt-10 w-full max-w-302.5 px-5 pb-8 pt-6 text-text sm:px-6 lg:px-0">
                <div
                    className="pointer-events-none absolute inset-x-5 top-0 h-px bg-linear-to-r
                    from-transparent via-[#5f472b] to-transparent sm:inset-x-6 lg:inset-x-0"/>
                <h2
                    className="mb-5 text-[20px] font-normal leading-none text-text"
                >
                    Mangal Clubs в деталях
                </h2>

                <div
                    className="flex items-start justify-start gap-10 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {StoriesData.map((story, index) => (
                        <button
                            key={story.id}
                            type="button"
                            onClick={() => openStory(index)}
                            className="group ms-6 md:ms-0 flex min-w-23.5 flex-col items-center gap-3 text-center cursor-pointer"
                        >
                            <span
                                className={`
                                    relative h-40 w-35 overflow-hidden rounded-lg border border-primary
                                    bg-[#111314] p-0.75 shadow-[0_18px_40px_rgba(0,0,0,0.42)]
                                    transition duration-300
                                    group-hover:scale-105
                                    group-hover:shadow-[0_22px_48px_rgba(214,173,104,0.16)]
                                    ${
                                    index === 0
                                        ? "origin-left"
                                        : index === StoriesData.length - 1
                                            ? "origin-right"
                                            : "origin-center"
                                }
                                    `}
                            >
                                <span
                                    className="relative block h-full w-full overflow-hidden rounded-lg bg-black">
                                    <Image
                                        src={story.previewImage}
                                        alt={story.title ?? "История"}
                                        fill
                                        sizes="92px"
                                        className="object-cover"
                                        priority={index < 4}
                                    />
                                </span>
                            </span>

                            <span className="text-[14px] leading-none font-semibold text-text">{story.title}</span>
                        </button>
                    ))}
                </div>
            </section>

            {activeStory && activeSlide && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black">
                    <button
                        type="button"
                        onClick={prev}
                        className="hidden cursor-pointer border-0 bg-transparent px-6 text-text transition hover:text-white md:block"
                        aria-label="Предыдущая история"
                    >
                        <ChevronLeft className="h-10 w-10"/>
                    </button>

                    <div
                        className="relative h-svh w-screen overflow-hidden bg-black md:aspect-9/16 md:h-[min(100svh,820px)] md:w-auto md:rounded-[14px]">
                        <div className="absolute left-2.5 right-2.5 top-2 z-40 flex gap-1">
                            {activeStory.slides.map((_, index) => (
                                <div
                                    key={index}
                                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"
                                >
                                    <div
                                        className="h-full bg-white transition-[width] duration-75"
                                        style={{
                                            width:
                                                index < activeSlideIndex
                                                    ? "100%"
                                                    : index === activeSlideIndex
                                                        ? `${progress}%`
                                                        : "0%",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={close}
                            className="absolute right-3 top-6 z-50 flex h-10 w-10 cursor-pointer
                             items-center justify-center rounded-full border-0 bg-black/45 text-text"
                            aria-label="Закрыть историю"
                        >
                            <X className="h-5 w-5"/>
                        </button>

                        {activeMediaType === "video" ? (
                            <video
                                ref={videoRef}
                                key={activeSlide.src}
                                src={activeSlide.src}
                                poster={activeSlide.poster}
                                className="absolute inset-0 h-full w-full object-cover"
                                autoPlay
                                muted
                                playsInline
                                preload="auto"
                                controls={false}
                                onLoadedData={() => {
                                    setIsMediaLoading(false);
                                    setHasMediaError(false);
                                }}
                                onCanPlay={async (event) => {
                                    setIsMediaLoading(false);
                                    setHasMediaError(false);

                                    try {
                                        await event.currentTarget.play();
                                    } catch {
                                        setHasMediaError(true);
                                    }
                                }}
                                onWaiting={() => setIsMediaLoading(true)}
                                onPlaying={() => {
                                    setIsMediaLoading(false);
                                    setHasMediaError(false);
                                }}
                                onError={() => {
                                    setIsMediaLoading(false);
                                    setHasMediaError(true);
                                }}
                                onTimeUpdate={(event) => {
                                    const video = event.currentTarget;

                                    if (!video.duration || isMediaLoading || hasMediaError) {
                                        return;
                                    }

                                    setProgress((video.currentTime / video.duration) * 100);
                                }}
                                onEnded={next}
                            />
                        ) : (
                            <Image
                                key={activeSlide.src}
                                src={activeSlide.src}
                                alt={activeStory.title ?? "История"}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                priority
                                unoptimized={activeSlide.src.endsWith(".gif")}
                                onLoad={() => {
                                    setIsMediaLoading(false);
                                    setHasMediaError(false);
                                }}
                                onError={() => {
                                    setIsMediaLoading(false);
                                    setHasMediaError(true);
                                }}
                            />
                        )}

                        {(isMediaLoading || hasMediaError) && (
                            <div
                                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black text-sm text-white/80">
                                {hasMediaError ? "Не удалось загрузить медиа" : "Загрузка..."}
                            </div>
                        )}

                        <div
                            className="absolute inset-x-0 top-1/2 z-50 flex -translate-y-1/2 items-center justify-between px-4 md:hidden">
                            <button
                                type="button"
                                onClick={prev}
                                aria-label="Предыдущий слайд"
                                className="rounded-full bg-black/55 p-2 text-text"
                            >
                                <ChevronLeft className="h-5 w-5"/>
                            </button>

                            <button
                                type="button"
                                onClick={next}
                                aria-label="Следующий слайд"
                                className="rounded-full bg-black/55 p-2 text-text"
                            >
                                <ChevronRight className="h-5 w-5"/>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={prev}
                            className="absolute bottom-0 left-0 top-0 z-10 w-1/2 cursor-pointer border-0 bg-transparent"
                            aria-label="Предыдущий слайд"
                        />

                        <button
                            type="button"
                            onClick={next}
                            className="absolute bottom-0 right-0 top-0 z-10 w-1/2 cursor-pointer border-0 bg-transparent"
                            aria-label="Следующий слайд"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={next}
                        className="hidden cursor-pointer border-0 bg-transparent px-6 text-text transition hover:text-white md:block"
                        aria-label="Следующая история"
                    >
                        <ChevronRight className="h-10 w-10"/>
                    </button>
                </div>
            )}
        </>
    );
}

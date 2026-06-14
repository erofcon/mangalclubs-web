"use client";

import Image from "next/image";
import {
    type PointerEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";
import type {Story} from "@/types/story";
import {loadStories} from "@/utils/stories";

const DEFAULT_IMAGE_DURATION = 5000;
const LOAD_TIMEOUT = 15000;
const STORY_SWIPE_DISTANCE = 56;
const STORY_SWIPE_AXIS_RATIO = 1.15;
const SUPPRESS_CLICK_AFTER_SWIPE_MS = 320;
const STORY_DRAG_START_DISTANCE = 6;
const STORY_CUBE_SETTLE_MS = 260;
const STORY_CUBE_COMMIT_PROGRESS = 0.28;
const LOADING_OVERLAY_DELAY_MS = 180;

const loadedMediaSources = new Set<string>();

type StoryDirection = "previous" | "next";

type StoryCubeTransition = {
    fromStoryIndex: number;
    fromSlideIndex: number;
    toStoryIndex: number;
    direction: StoryDirection;
    progress: number;
    isSettling: boolean;
    shouldCommit: boolean;
};

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

function preloadImageSource(src?: string) {
    if (!src || typeof window === "undefined") return;
    if (loadedMediaSources.has(src)) return;

    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
        loadedMediaSources.add(src);
    };
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
        loadedMediaSources.add(src);
    }
}

function isImageSlideReady(slide?: {
    src: string;
    type?: "image" | "video";
} | null) {
    return Boolean(
        slide &&
        getMediaType(slide) === "image" &&
        loadedMediaSources.has(slide.src)
    );
}

function preloadStorySlide(stories: Story[], storyIndex: number | null, slideIndex: number) {
    if (storyIndex === null) return;

    const slide = stories[storyIndex]?.slides[slideIndex];
    if (!slide) return;

    if (getMediaType(slide) === "video") {
        preloadImageSource(slide.poster);
        return;
    }

    preloadImageSource(slide.src);
}

function preloadStoryFirstSlide(stories: Story[], storyIndex: number | null) {
    if (storyIndex === null) return;

    const story = stories[storyIndex];
    const slide = story?.slides[0];
    if (!story || !slide) return;

    preloadImageSource(story.previewImage);

    if (getMediaType(slide) === "video") {
        preloadImageSource(slide.poster);
        return;
    }

    preloadImageSource(slide.src);
}

function StoryJumpPreview({
                              story,
                              direction,
                              onClick,
}: {
    story: Story;
    direction: StoryDirection;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative hidden aspect-9/16 h-[min(44svh,320px)] shrink-0
            cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#111314]
            text-left text-white opacity-70 shadow-[0_18px_46px_rgba(0,0,0,0.42)]
            transition duration-300 hover:scale-[1.03] hover:opacity-100
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-primary lg:block"
            aria-label={`${direction === "previous" ? "Previous" : "Next"} story${story.title ? `: ${story.title}` : ""}`}
        >
            <Image
                src={story.previewImage}
                alt={story.title ?? "Story"}
                fill
                sizes="180px"
                className="object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-linear-to-b from-black/15 via-black/10 to-black/75"/>
            {story.title && (
                <span className="absolute bottom-4 left-4 right-4 text-[16px] font-semibold leading-tight drop-shadow">
                    {story.title}
                </span>
            )}
        </button>
    );
}

function StoryJumpPreviewPlaceholder() {
    return (
        <div
            className="hidden aspect-9/16 h-[min(44svh,320px)] shrink-0 lg:block"
            aria-hidden="true"
        />
    );
}

function StoryCubeFace({
                           stories,
                           storyIndex,
                           slideIndex,
                           progressValue = 0,
                       }: {
    stories: Story[];
    storyIndex: number;
    slideIndex: number;
    progressValue?: number;
}) {
    const story = stories[storyIndex];
    if (!story) return null;

    const safeSlideIndex = Math.min(slideIndex, story.slides.length - 1);
    const slide = story.slides[safeSlideIndex] ?? story.slides[0];
    if (!slide) return null;

    const mediaType = getMediaType(slide);
    const fallbackImage = mediaType === "video" ? slide.poster ?? story.previewImage : slide.src;

    return (
        <div
            className="relative h-full w-full overflow-hidden bg-black bg-cover bg-center"
            style={{backgroundImage: `url("${fallbackImage}")`}}
        >
            <div className="absolute left-2.5 right-2.5 top-2 z-20 flex gap-1">
                {story.slides.map((_, index) => (
                    <div
                        key={index}
                        className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"
                    >
                        <div
                            className="h-full bg-white"
                            style={{
                                width:
                                    index < safeSlideIndex
                                        ? "100%"
                                        : index === safeSlideIndex
                                            ? `${progressValue}%`
                                            : "0%",
                            }}
                        />
                    </div>
                ))}
            </div>

            {mediaType === "video" ? (
                <video
                    src={slide.src}
                    poster={slide.poster}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                />
            ) : (
                <Image
                    src={slide.src}
                    alt={story.title ?? "История"}
                    fill
                    sizes="(min-width: 768px) calc(min(100svh, 820px) * 0.5625), 100vw"
                    className="object-cover"
                    priority
                    unoptimized={slide.src.endsWith(".gif")}
                />
            )}
        </div>
    );
}

function StoryCubeTransitionOverlay({
                                        stories,
                                        transition,
                                        progressValue,
                                    }: {
    stories: Story[];
    transition: StoryCubeTransition;
    progressValue: number;
}) {
    const rotationProgress = transition.shouldCommit
        ? 1
        : transition.isSettling
            ? 0
            : transition.progress;
    const rotation = transition.direction === "next"
        ? -90 * rotationProgress
        : 90 * rotationProgress;
    const cubeTransform = `translateZ(-50vw) rotateY(${rotation}deg)`;
    const targetFaceTransform =
        transition.direction === "next"
            ? "rotateY(90deg) translateZ(50vw)"
            : "rotateY(-90deg) translateZ(50vw)";

    return (
        <div
            className="absolute inset-0 z-[60] overflow-hidden bg-black md:hidden"
            style={{perspective: "1100px"}}
        >
            <div
                className="absolute inset-0 transition-transform"
                style={{
                    transform: cubeTransform,
                    transformStyle: "preserve-3d",
                    transitionDuration: transition.isSettling ? `${STORY_CUBE_SETTLE_MS}ms` : "0ms",
                    transitionTimingFunction: "cubic-bezier(0.2, 0.72, 0.18, 1)",
                }}
            >
                <div
                    className="absolute inset-0 overflow-hidden bg-black"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(0deg) translateZ(50vw)",
                    }}
                >
                    <StoryCubeFace
                        stories={stories}
                        storyIndex={transition.fromStoryIndex}
                        slideIndex={transition.fromSlideIndex}
                        progressValue={progressValue}
                    />
                </div>

                <div
                    className="absolute inset-0 overflow-hidden bg-black"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: targetFaceTransform,
                    }}
                >
                    <StoryCubeFace
                        stories={stories}
                        storyIndex={transition.toStoryIndex}
                        slideIndex={0}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Stories() {
    const [stories, setStories] = useState<Story[]>([]);
    const [isStoriesLoading, setIsStoriesLoading] = useState(true);
    const [hasStoriesError, setHasStoriesError] = useState(false);
    const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMediaLoading, setIsMediaLoading] = useState(false);
    const [isLoadingOverlayVisible, setIsLoadingOverlayVisible] = useState(false);
    const [hasMediaError, setHasMediaError] = useState(false);
    const [storyCubeTransition, setStoryCubeTransition] =
        useState<StoryCubeTransition | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const imageTimerStartedAtRef = useRef<number | null>(null);
    const storySwipeStartRef = useRef<{
        pointerId: number;
        x: number;
        y: number;
        hasDragged: boolean;
    } | null>(null);
    const suppressClickAfterSwipeRef = useRef(false);
    const suppressClickTimerRef = useRef<number | null>(null);
    const storyCubeTimerRef = useRef<number | null>(null);

    const activeStory =
        activeStoryIndex !== null ? stories[activeStoryIndex] : null;

    const activeSlide = activeStory?.slides[activeSlideIndex] ?? null;
    const isViewerOpen = Boolean(activeStory && activeSlide);
    const previousStoryIndex =
        activeStoryIndex !== null && activeStoryIndex > 0
            ? activeStoryIndex - 1
            : null;
    const nextStoryIndex =
        activeStoryIndex !== null && activeStoryIndex < stories.length - 1
            ? activeStoryIndex + 1
            : null;
    const previousStory =
        previousStoryIndex !== null ? stories[previousStoryIndex] : null;
    const nextStory =
        nextStoryIndex !== null ? stories[nextStoryIndex] : null;

    useBodyScrollLock(isViewerOpen);

    const activeMediaType = useMemo(() => {
        if (!activeSlide) return null;
        return getMediaType(activeSlide);
    }, [activeSlide]);

    useEffect(() => {
        const controller = new AbortController();

        loadStories(controller.signal)
            .then((nextStories) => {
                setStories(nextStories);
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }

                console.error("Failed to load stories", error);
                setHasStoriesError(true);
                setStories([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsStoriesLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    const resetMediaState = useCallback((targetSlide?: typeof activeSlide) => {
        imageTimerStartedAtRef.current = null;
        setProgress(0);
        setIsMediaLoading(!isImageSlideReady(targetSlide));
        setIsLoadingOverlayVisible(false);
        setHasMediaError(false);
    }, []);

    const clearStoryCubeTransitionTimers = useCallback(() => {
        if (storyCubeTimerRef.current !== null) {
            window.clearTimeout(storyCubeTimerRef.current);
            storyCubeTimerRef.current = null;
        }
    }, []);

    const close = useCallback(() => {
        clearStoryCubeTransitionTimers();
        videoRef.current?.pause();
        setStoryCubeTransition(null);
        setActiveStoryIndex(null);
        setActiveSlideIndex(0);
        setProgress(0);
        setIsMediaLoading(false);
        setIsLoadingOverlayVisible(false);
        setHasMediaError(false);
        imageTimerStartedAtRef.current = null;
    }, [clearStoryCubeTransitionTimers]);

    const jumpToStory = useCallback(
        (storyIndex: number) => {
            if (
                storyIndex < 0 ||
                storyIndex >= stories.length ||
                storyIndex === activeStoryIndex
            ) {
                return;
            }

            clearStoryCubeTransitionTimers();
            videoRef.current?.pause();
            setStoryCubeTransition(null);
            resetMediaState(stories[storyIndex]?.slides[0]);
            setActiveStoryIndex(storyIndex);
            setActiveSlideIndex(0);
        },
        [activeStoryIndex, clearStoryCubeTransitionTimers, resetMediaState, stories]
    );

    const updateMobileStoryDrag = useCallback(
        (targetStoryIndex: number, direction: StoryDirection, dragProgress: number) => {
            if (
                activeStoryIndex === null ||
                targetStoryIndex < 0 ||
                targetStoryIndex >= stories.length ||
                targetStoryIndex === activeStoryIndex
            ) {
                return;
            }

            clearStoryCubeTransitionTimers();
            videoRef.current?.pause();
            setStoryCubeTransition({
                fromStoryIndex: activeStoryIndex,
                fromSlideIndex: activeSlideIndex,
                toStoryIndex: targetStoryIndex,
                direction,
                progress: dragProgress,
                isSettling: false,
                shouldCommit: false,
            });
        },
        [
            activeSlideIndex,
            activeStoryIndex,
            clearStoryCubeTransitionTimers,
            stories.length,
        ]
    );

    const suppressClickAfterSwipe = useCallback(() => {
        if (suppressClickTimerRef.current !== null) {
            window.clearTimeout(suppressClickTimerRef.current);
        }

        suppressClickAfterSwipeRef.current = true;
        suppressClickTimerRef.current = window.setTimeout(() => {
            suppressClickAfterSwipeRef.current = false;
            suppressClickTimerRef.current = null;
        }, SUPPRESS_CLICK_AFTER_SWIPE_MS);
    }, []);

    const finishMobileStoryDrag = useCallback(
        (shouldCommit: boolean) => {
            if (!storyCubeTransition) return;

            suppressClickAfterSwipe();
            clearStoryCubeTransitionTimers();

            setStoryCubeTransition((current) =>
                current
                    ? {
                        ...current,
                        progress: shouldCommit ? 1 : 0,
                        isSettling: true,
                        shouldCommit,
                    }
                    : current
            );

            storyCubeTimerRef.current = window.setTimeout(() => {
                if (shouldCommit) {
                    resetMediaState(stories[storyCubeTransition.toStoryIndex]?.slides[0]);
                    setActiveStoryIndex(storyCubeTransition.toStoryIndex);
                    setActiveSlideIndex(0);
                }

                setStoryCubeTransition(null);
                storyCubeTimerRef.current = null;
            }, STORY_CUBE_SETTLE_MS);
        },
        [
            clearStoryCubeTransitionTimers,
            resetMediaState,
            stories,
            storyCubeTransition,
            suppressClickAfterSwipe,
        ]
    );

    const consumeSuppressedClick = useCallback(() => {
        if (!suppressClickAfterSwipeRef.current) return false;

        suppressClickAfterSwipeRef.current = false;

        if (suppressClickTimerRef.current !== null) {
            window.clearTimeout(suppressClickTimerRef.current);
            suppressClickTimerRef.current = null;
        }

        return true;
    }, []);

    const next = useCallback(() => {
        if (!activeStory || activeStoryIndex === null) return;

        videoRef.current?.pause();

        if (activeSlideIndex < activeStory.slides.length - 1) {
            resetMediaState(activeStory.slides[activeSlideIndex + 1]);
            setActiveSlideIndex((value) => value + 1);
            return;
        }

        if (activeStoryIndex < stories.length - 1) {
            resetMediaState(stories[activeStoryIndex + 1]?.slides[0]);
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
        stories,
    ]);

    const prev = useCallback(() => {
        if (!activeStory || activeStoryIndex === null) return;

        videoRef.current?.pause();

        if (activeSlideIndex > 0) {
            resetMediaState(activeStory.slides[activeSlideIndex - 1]);
            setActiveSlideIndex((value) => value - 1);
            return;
        }

        if (activeStoryIndex > 0) {
            const previousStory = stories[activeStoryIndex - 1];

            resetMediaState(previousStory.slides[previousStory.slides.length - 1]);
            setActiveStoryIndex(activeStoryIndex - 1);
            setActiveSlideIndex(previousStory.slides.length - 1);
        }
    }, [
        activeStory,
        activeStoryIndex,
        activeSlideIndex,
        resetMediaState,
        stories,
    ]);

    const handlePreviousClick = useCallback(() => {
        if (storyCubeTransition) return;
        if (consumeSuppressedClick()) return;

        prev();
    }, [consumeSuppressedClick, prev, storyCubeTransition]);

    const handleNextClick = useCallback(() => {
        if (storyCubeTransition) return;
        if (consumeSuppressedClick()) return;

        next();
    }, [consumeSuppressedClick, next, storyCubeTransition]);

    const handleViewerPointerDown = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            if (
                event.pointerType !== "touch" ||
                activeStoryIndex === null ||
                storyCubeTransition
            ) {
                return;
            }

            storySwipeStartRef.current = {
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                hasDragged: false,
            };

            try {
                event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
                // Some mobile browsers can reject pointer capture during native gestures.
            }
        },
        [activeStoryIndex, storyCubeTransition]
    );

    const handleViewerPointerMove = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            const swipeStart = storySwipeStartRef.current;

            if (
                event.pointerType !== "touch" ||
                !swipeStart ||
                swipeStart.pointerId !== event.pointerId ||
                activeStoryIndex === null
            ) {
                return;
            }

            const deltaX = event.clientX - swipeStart.x;
            const deltaY = event.clientY - swipeStart.y;
            const absoluteDeltaX = Math.abs(deltaX);
            const absoluteDeltaY = Math.abs(deltaY);

            if (
                absoluteDeltaX < STORY_DRAG_START_DISTANCE ||
                absoluteDeltaX < absoluteDeltaY * STORY_SWIPE_AXIS_RATIO
            ) {
                if (storyCubeTransition && !storyCubeTransition.isSettling) {
                    setStoryCubeTransition(null);
                }

                return;
            }

            const direction: StoryDirection = deltaX < 0 ? "next" : "previous";
            const targetStoryIndex =
                direction === "next" ? nextStoryIndex : previousStoryIndex;

            swipeStart.hasDragged = true;

            if (targetStoryIndex === null) return;

            event.preventDefault();

            const viewerWidth = Math.max(event.currentTarget.clientWidth, 1);
            const dragProgress = Math.min(absoluteDeltaX / viewerWidth, 1);

            updateMobileStoryDrag(targetStoryIndex, direction, dragProgress);
        },
        [
            activeStoryIndex,
            nextStoryIndex,
            previousStoryIndex,
            storyCubeTransition,
            updateMobileStoryDrag,
        ]
    );

    const handleViewerPointerUp = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            const swipeStart = storySwipeStartRef.current;

            if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;

            storySwipeStartRef.current = null;

            const deltaX = event.clientX - swipeStart.x;
            const deltaY = event.clientY - swipeStart.y;
            const absoluteDeltaX = Math.abs(deltaX);
            const absoluteDeltaY = Math.abs(deltaY);
            const isStorySwipe =
                absoluteDeltaX >= STORY_SWIPE_DISTANCE &&
                absoluteDeltaX >= absoluteDeltaY * STORY_SWIPE_AXIS_RATIO;

            if (swipeStart.hasDragged || storyCubeTransition) {
                if (!storyCubeTransition) {
                    suppressClickAfterSwipe();
                    return;
                }

                const shouldCommit =
                    isStorySwipe ||
                    Boolean(
                        storyCubeTransition &&
                        storyCubeTransition.progress >= STORY_CUBE_COMMIT_PROGRESS
                    );

                finishMobileStoryDrag(shouldCommit);
            }
        },
        [
            finishMobileStoryDrag,
            suppressClickAfterSwipe,
            storyCubeTransition,
        ]
    );

    const handleViewerPointerCancel = useCallback(() => {
        storySwipeStartRef.current = null;

        if (storyCubeTransition) {
            finishMobileStoryDrag(false);
        }
    }, [finishMobileStoryDrag, storyCubeTransition]);

    const openStory = useCallback(
        (index: number) => {
            clearStoryCubeTransitionTimers();
            setStoryCubeTransition(null);
            resetMediaState(stories[index]?.slides[0]);
            setActiveStoryIndex(index);
            setActiveSlideIndex(0);
        },
        [clearStoryCubeTransitionTimers, resetMediaState, stories]
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
        if (!isMediaLoading || hasMediaError) return;

        const timeoutId = window.setTimeout(() => {
            setIsLoadingOverlayVisible(true);
        }, LOADING_OVERLAY_DELAY_MS);

        return () => window.clearTimeout(timeoutId);
    }, [hasMediaError, isMediaLoading]);

    useEffect(() => {
        if (
            !activeStory ||
            !activeSlide ||
            activeMediaType !== "image" ||
            isMediaLoading ||
            hasMediaError ||
            storyCubeTransition
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
        storyCubeTransition,
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

    useEffect(() => {
        if (!isViewerOpen) return;

        preloadStorySlide(stories, activeStoryIndex, activeSlideIndex - 1);
        preloadStorySlide(stories, activeStoryIndex, activeSlideIndex + 1);
        preloadStoryFirstSlide(stories, previousStoryIndex);
        preloadStoryFirstSlide(stories, nextStoryIndex);
    }, [
        activeSlideIndex,
        activeStoryIndex,
        isViewerOpen,
        nextStoryIndex,
        previousStoryIndex,
        stories,
    ]);

    useEffect(() => {
        return () => {
            clearStoryCubeTransitionTimers();

            if (suppressClickTimerRef.current !== null) {
                window.clearTimeout(suppressClickTimerRef.current);
            }
        };
    }, [clearStoryCubeTransitionTimers]);

    if (!isStoriesLoading && (hasStoriesError || stories.length === 0)) {
        return null;
    }

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
                    {isStoriesLoading && stories.length === 0 ? (
                        Array.from({length: 3}).map((_, index) => (
                            <div
                                key={index}
                                className="ms-6 flex min-w-23.5 flex-col items-center gap-3 md:ms-0"
                            >
                                <div className="h-40 w-35 animate-pulse rounded-lg bg-white/10"/>
                                <div className="h-3 w-20 animate-pulse rounded-full bg-white/10"/>
                            </div>
                        ))
                    ) : stories.map((story, index) => (
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
                                        : index === stories.length - 1
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
                    <div className="flex h-full w-full items-center justify-center gap-3 overflow-hidden px-0 md:px-4">
                        {previousStory && previousStoryIndex !== null ? (
                            <StoryJumpPreview
                                story={previousStory}
                                direction="previous"
                                onClick={() => jumpToStory(previousStoryIndex)}
                            />
                        ) : (
                            <StoryJumpPreviewPlaceholder/>
                        )}

                        <button
                            type="button"
                            onClick={handlePreviousClick}
                            className="hidden h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-text transition hover:bg-white/18 hover:text-white md:flex"
                            aria-label="Предыдущая история"
                        >
                            <ChevronLeft className="h-10 w-10"/>
                        </button>

                        <div
                            onPointerDown={handleViewerPointerDown}
                            onPointerMove={handleViewerPointerMove}
                            onPointerUp={handleViewerPointerUp}
                            onPointerCancel={handleViewerPointerCancel}
                            className="relative h-svh w-screen touch-pan-y overflow-hidden bg-black md:aspect-9/16 md:h-[min(100svh,820px)] md:w-auto md:rounded-[14px]">
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
                                        setIsLoadingOverlayVisible(false);
                                        setHasMediaError(false);
                                    }}
                                    onCanPlay={async (event) => {
                                        setIsMediaLoading(false);
                                        setIsLoadingOverlayVisible(false);
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
                                        setIsLoadingOverlayVisible(false);
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
                                    sizes="(min-width: 768px) calc(min(100svh, 820px) * 0.5625), 100vw"
                                    className="object-cover"
                                    priority
                                    unoptimized={activeSlide.src.endsWith(".gif")}
                                    onLoad={() => {
                                        loadedMediaSources.add(activeSlide.src);
                                        setIsMediaLoading(false);
                                        setIsLoadingOverlayVisible(false);
                                        setHasMediaError(false);
                                    }}
                                    onError={() => {
                                        setIsMediaLoading(false);
                                        setHasMediaError(true);
                                    }}
                                />
                            )}

                            {(isLoadingOverlayVisible || hasMediaError) && (
                                <div
                                    className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black text-sm text-white/80">
                                    {hasMediaError ? "Не удалось загрузить медиа" : "Загрузка..."}
                                </div>
                            )}

                            <div
                                className="absolute inset-x-0 top-1/2 z-50 flex -translate-y-1/2 items-center justify-between px-4 md:hidden">
                                <button
                                    type="button"
                                    onClick={handlePreviousClick}
                                    aria-label="Предыдущий слайд"
                                    className="rounded-full bg-black/55 p-2 text-text"
                                >
                                    <ChevronLeft className="h-5 w-5"/>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNextClick}
                                    aria-label="Следующий слайд"
                                    className="rounded-full bg-black/55 p-2 text-text"
                                >
                                    <ChevronRight className="h-5 w-5"/>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handlePreviousClick}
                                className="absolute bottom-0 left-0 top-0 z-10 w-1/2 cursor-pointer border-0 bg-transparent"
                                aria-label="Предыдущий слайд"
                            />

                            <button
                                type="button"
                                onClick={handleNextClick}
                                className="absolute bottom-0 right-0 top-0 z-10 w-1/2 cursor-pointer border-0 bg-transparent"
                                aria-label="Следующий слайд"
                            />

                            {storyCubeTransition && (
                                <StoryCubeTransitionOverlay
                                    stories={stories}
                                    transition={storyCubeTransition}
                                    progressValue={progress}
                                />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleNextClick}
                            className="hidden h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-text transition hover:bg-white/18 hover:text-white md:flex"
                            aria-label="Следующая история"
                        >
                            <ChevronRight className="h-10 w-10"/>
                        </button>

                        {nextStory && nextStoryIndex !== null ? (
                            <StoryJumpPreview
                                story={nextStory}
                                direction="next"
                                onClick={() => jumpToStory(nextStoryIndex)}
                            />
                        ) : (
                            <StoryJumpPreviewPlaceholder/>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

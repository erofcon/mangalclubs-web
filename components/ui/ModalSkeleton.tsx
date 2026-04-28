"use client";

import {X} from "lucide-react";
import {ReactNode, useEffect} from "react";

interface ModalSkeletonProps {
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export function ModalSkeleton({
                                  onClose,
                                  children,
                                  className = "",
                              }: ModalSkeletonProps) {
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        const currentLocks = Number(body.dataset.modalLockCount ?? "0");

        if (currentLocks === 0) {
            const scrollbarWidth = window.innerWidth - html.clientWidth;

            body.dataset.prevBodyOverflow = body.style.overflow;
            body.dataset.prevBodyPaddingRight = body.style.paddingRight;
            html.dataset.prevHtmlOverflow = html.style.overflow;

            body.style.overflow = "hidden";
            html.style.overflow = "hidden";

            if (scrollbarWidth > 0) {
                body.style.paddingRight = `${scrollbarWidth}px`;
            }
        }

        body.dataset.modalLockCount = String(currentLocks + 1);

        return () => {
            const nextLocks = Number(body.dataset.modalLockCount ?? "1") - 1;

            if (nextLocks <= 0) {
                body.style.overflow = body.dataset.prevBodyOverflow ?? "";
                body.style.paddingRight = body.dataset.prevBodyPaddingRight ?? "";
                html.style.overflow = html.dataset.prevHtmlOverflow ?? "";

                delete body.dataset.modalLockCount;
                delete body.dataset.prevBodyOverflow;
                delete body.dataset.prevBodyPaddingRight;
                delete html.dataset.prevHtmlOverflow;
            } else {
                body.dataset.modalLockCount = String(nextLocks);
            }
        };
    }, []);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative h-dvh w-full sm:max-h-[90dvh] sm:max-w-225 ${className}`}
            >
                <button
                    onClick={onClose}
                    className="
                        absolute z-999 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-text shadow-sm
                        right-4 top-4
                        md:-right-12 md:-top-12
                    "
                    aria-label="Р—Р°РєСЂС‹С‚СЊ"
                >
                    <X className="h-6 w-6"/>
                </button>

                {children}
            </div>
        </div>
    );
}

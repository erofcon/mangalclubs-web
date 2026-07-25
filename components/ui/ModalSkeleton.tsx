"use client";

import {X} from "lucide-react";
import {ReactNode} from "react";
import {useBodyScrollLock} from "@/hooks/useBodyScrollLock";

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
    useBodyScrollLock(true);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[2000] flex h-dvh min-h-0 items-stretch justify-center overflow-hidden bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative flex min-h-0 w-full sm:max-h-[calc(100dvh-32px)] sm:max-w-225 ${className}`}
            >
                <button
                    onClick={onClose}
                    className="
                        absolute z-999 flex h-10 w-10 cursor-pointer items-center justify-center rounded-[6px] border border-border/70 bg-background text-text transition duration-300 hover:border-primary hover:text-primary
                        right-3 top-3 sm:right-4 sm:top-4
                    "
                    aria-label="Закрыть"
                >
                    <X className="h-6 w-6"/>
                </button>

                {children}
            </div>
        </div>
    );
}

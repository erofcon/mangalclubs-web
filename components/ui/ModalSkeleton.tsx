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

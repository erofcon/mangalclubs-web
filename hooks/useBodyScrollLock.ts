"use client";

import {useEffect} from "react";

export function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

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
    }, [locked]);
}

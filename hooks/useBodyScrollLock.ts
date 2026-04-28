"use client";

import {useEffect} from "react";

export function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        const body = document.body;
        const html = document.documentElement;
        const currentLocks = Number(body.dataset.modalLockCount ?? "0");

        if (currentLocks === 0) {
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - html.clientWidth;

            body.dataset.prevScrollY = String(scrollY);
            body.dataset.prevBodyOverflow = body.style.overflow;
            body.dataset.prevBodyPaddingRight = body.style.paddingRight;
            body.dataset.prevBodyPosition = body.style.position;
            body.dataset.prevBodyTop = body.style.top;
            body.dataset.prevBodyLeft = body.style.left;
            body.dataset.prevBodyRight = body.style.right;
            body.dataset.prevBodyWidth = body.style.width;
            html.dataset.prevHtmlOverflow = html.style.overflow;

            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
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
                const scrollY = Number(body.dataset.prevScrollY ?? "0");

                body.style.overflow = body.dataset.prevBodyOverflow ?? "";
                body.style.paddingRight = body.dataset.prevBodyPaddingRight ?? "";
                body.style.position = body.dataset.prevBodyPosition ?? "";
                body.style.top = body.dataset.prevBodyTop ?? "";
                body.style.left = body.dataset.prevBodyLeft ?? "";
                body.style.right = body.dataset.prevBodyRight ?? "";
                body.style.width = body.dataset.prevBodyWidth ?? "";
                html.style.overflow = html.dataset.prevHtmlOverflow ?? "";

                delete body.dataset.modalLockCount;
                delete body.dataset.prevScrollY;
                delete body.dataset.prevBodyOverflow;
                delete body.dataset.prevBodyPaddingRight;
                delete body.dataset.prevBodyPosition;
                delete body.dataset.prevBodyTop;
                delete body.dataset.prevBodyLeft;
                delete body.dataset.prevBodyRight;
                delete body.dataset.prevBodyWidth;
                delete html.dataset.prevHtmlOverflow;

                window.scrollTo(0, scrollY);
            } else {
                body.dataset.modalLockCount = String(nextLocks);
            }
        };
    }, [locked]);
}

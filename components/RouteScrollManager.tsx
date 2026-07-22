"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";

function scrollToTop() {
    window.scrollTo(0, 0);
}

export function RouteScrollManager() {
    const pathname = usePathname();

    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (pathname !== "/" || window.location.hash) return;

        requestAnimationFrame(scrollToTop);
    }, [pathname]);

    return null;
}

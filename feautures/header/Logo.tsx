import Link from "next/link";
import Image from "next/image";
import React from "react";

type LogoProps = {
    size: "desktop" | "mobile";
};

export function Logo({size}: LogoProps) {
    const isDesktop = size === "desktop";

    return (
        <Link
            href="/"
            aria-label="Grill & Mangal"
        >
            <span
                className={`flex shrink-0 h-auto ${
                    isDesktop ? "w-32" : "w-22"
                }`}
            >
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={473}
                    height={284}
                    priority
                />
            </span>
        </Link>
    );
}

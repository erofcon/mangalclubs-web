import Link from "next/link";
import {Flame} from "lucide-react";

type LogoProps = {
    size: "desktop" | "mobile";
};

export function Logo({size}: LogoProps) {
    const isDesktop = size === "desktop";

    return (
        <Link
            href="/"
            className="flex items-center gap-3 text-[#f5efe5] transition duration-300 hover:text-[#d4a760]"
            aria-label="Grill & Mangal"
        >
            <span
                className={`flex shrink-0 items-center justify-center text-[#c99a55] ${
                    isDesktop ? "h-10 w-10" : "h-9 w-9"
                }`}
            >
                <Flame className="h-full w-full" strokeWidth={1.8}/>
            </span>
            <span
                className={`block leading-[0.92] ${isDesktop ? "text-[20px]" : "text-[18px]"}`}
                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
            >
                Grill &<br/>Mangal
            </span>
        </Link>
    );
}

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    size: "desktop" | "mobile";
};

export function Logo({ size }: LogoProps) {
    const imageSize = size === "desktop" ? 150 : 80;

    return (
        <Link href="/" className="flex items-center gap-2 hover:scale-105 duration-300">
            <Image
                src="/logo.png"
                alt="logo"
                width={imageSize}
                height={imageSize}
                priority
            />
        </Link>
    );
}
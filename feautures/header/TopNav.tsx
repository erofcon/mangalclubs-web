import Link from "next/link";
import { topLinks } from "@/utils/constants";

export function TopNav() {
    return (
        <div className="hidden border-b border-border md:block">
            <div className="mx-auto flex h-10 items-center justify-end">
                <nav className="flex items-center gap-8 text-sm font-semibold text-text">
                    {topLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="inline-flex items-center gap-2 transition duration-300 hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

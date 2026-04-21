"use client";

const LINKS = ["О нас", "Контакты", "Доставка"];

export default function HeaderLinks() {
    return (
        <div
            className={'text-text flex gap-4 text-sm font-semibold'}
        >
            {LINKS.map((label) => (
                <a
                    key={label}
                    className="cursor-pointer hover:text-text-muted transition-colors mt-1"
                >
                    {label}
                </a>
            ))}
        </div>
    );
}
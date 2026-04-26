"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Menu,
    X,
    Pencil,
    LogIn
} from "lucide-react";

const topLinks = [
    {label: "Доставка", href: "#"},
    {label: "Бронирование", href: "#"},
    {label: "Контакты", href: "#"},
    {label: "О нас", href: "#"},
];


export default function DarkDodoHeader() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full mb-8 md:max-w-6xl mx-auto px-4">
            <div className="hidden border-b border-border md:block">
                <div className="mx-auto flex h-10 items-center justify-end">

                    <nav className="flex items-center gap-8 text-sm font-semibold text-text">
                        {topLinks.map((link) => (
                            <Link key={link.label} href={link.href}
                                  className="inline-flex items-center gap-2 hover:text-warning hover:scale-105 duration-300">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="mx-auto flex items-end justify-between max-md:hidden">
                <div className={'flex gap-6 items-end'}>
                    <Link href="/" className={'hover:scale-105 duration-300'}>
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={150}
                            height={150}
                            priority
                        />
                    </Link>

                    <button
                        className="group text-text hover:text-warning hover:scale-105 duration-300 font-bold leading-tight text-start cursor-pointer ">
                        <span className={' flex gap-4 items-end'}>
                            Доставка / В ресторане
                            <Pencil className={'w-4 group-hover:w-5 duration-300'}/>
                        </span>
                        <span className="mt-1 block font-semibold text-text-secondary">Для заказа выбери способ получения</span>
                    </button>
                </div>


                <button
                    className="cursor-pointer md:flex shrink-0 items-center gap-4 rounded-full px-5 py-2 font-semibold hover:scale-105 duration-300 bg-background text-text border border-border hover:opacity-90"
                >
                    <LogIn className={'w-5'}/>
                    Войти
                </button>
            </div>

            <div className="flex h-15 items-center justify-between px-4 pt-2 md:hidden">
                <Link href="#" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={60}
                        height={60}
                        priority
                    />
                </Link>

                <button aria-label="Открыть меню" onClick={() => setIsOpen(true)}>
                    <Menu className="h-6 w-6 text-text"/>
                </button>
            </div>

            <div
                className={`fixed inset-0 z-50 bg-black transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

                <div className="flex h-15 items-center justify-between px-4 pt-2">
                    <Link href="#" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={60}
                            height={60}
                            priority
                        />
                    </Link>
                    <button aria-label="Закрыть меню" onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6 text-text"/>
                    </button>
                </div>


                <nav className="divide-y divide-zinc-900 text-text">
                    <Link

                        href={'#'}
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-11 items-center justify-start gap-2 px-5 "
                    >
                        <LogIn className={'w-4'}/>
                        <span className={'text-sm'}>Войти</span>
                    </Link>

                    {topLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={'flex min-h-11 items-center justify-start gap-2 px-5'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
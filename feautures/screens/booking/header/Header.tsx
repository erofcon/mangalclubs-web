"use client"


import Link from "next/link";
import Image from "next/image";
import React from "react";

export function Header() {

    return (
        <header
            className="fixed inset-x-0 top-0 z-20 bg-background/90 py-3.25 transition-all duration-300 text-text"
        >
            <div className="mx-auto w-full px-4 xl:px-7">
                <div className="flex items-center justify-between p-2">
                    <Link href="/" aria-label="mangal-clubs" className="hidden md:block">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={473}
                            height={284}
                            className="block h-auto w-22 max-w-full md:w-25.5"
                            priority
                        />
                    </Link>

                    <h1 className="text-[18px] font-medium leading-9.25 tracking-[0.005em] xl:text-[30px] xl:leading-12.25">Бронирование</h1>

                    <div className="relative">
                        <Link
                            href="/"
                            rel="noreferrer"
                            className="my-2 whitespace-nowrap rounded-full bg-text px-2 py-2 text-center text-sm font-semibold leading-4.5 text-text-on-primary transition hover:-translate-y-px md:px-4 md:py-2.75 md:text-base"
                        >
                            Показать меню
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
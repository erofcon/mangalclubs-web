import Link from "next/link";
import Image from "next/image";
import {Bell, Handbag, User} from "lucide-react";

export function MenuItems() {
    return (
        <div className={'flex items-center justify-between mt-4'}>
            <div className='flex items-center gap-6'>
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={100}
                        height={100}
                        priority
                        className="w-20 md:w-25"
                    />
                </Link>

                <div
                    className='block cursor-pointer px-4 py-2.5'
                >
                    <div className='flex flex-col'>
                            <span
                                className='font-bold leading-none mb-1 text-text'
                            >
                                Доставка / В ресторане
                            </span>
                        <span
                            className="text-sm font-medium text-text-secondary"
                        >
                                Для заказа выбери способ получения
                            </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    className={'text-text cursor-pointer flex gap-2 border p-2.5 border-divider rounded-full items-center text-sm font-semibold'}
                >
                    <Handbag size={26}/>
                    <span>Корзина</span>
                </button>

                <button
                    className={'text-text cursor-pointer flex gap-2 border p-2.5 border-divider rounded-full items-center text-sm font-semibold'}
                >
                    <User size={26}/>
                    <span>Войти</span>
                </button>

                <button
                    className={'text-text cursor-pointer flex flex-col items-center text-sm font-semibold'}
                >
                    <Bell size={26}/>
                </button>
            </div>

        </div>
    )
}
import Link from "next/link";
import Image from "next/image";
import { Bell, Handbag, User, Menu, X } from "lucide-react";
import { DeliveryInfo } from "./DeliveryInfo";

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export function MenuItems({ isOpen, setIsOpen }: Props) {
    return (
        <div className="flex items-center justify-between text-text">
            <div className="flex items-center gap-6">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={100}
                        height={100}
                        priority
                        className="w-20"
                    />
                </Link>

                <div className="hidden md:block">
                    <DeliveryInfo />
                </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <button className="flex gap-2 border p-2.5 rounded-full">
                    <Handbag size={26} />
                    <span>Корзина</span>
                </button>

                <button className="flex gap-2 border p-2.5 rounded-full">
                    <User size={26} />
                    <span>Войти</span>
                </button>

                <Bell size={26} />
            </div>

            <button
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
        </div>
    );
}
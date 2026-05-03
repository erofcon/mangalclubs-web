"use client";

import {useRouter, useParams} from "next/navigation";
import Image from "next/image";
import {BookingMocks} from "@/mocks/mocks-data";
import {PICKUP_POINT} from "@/mocks/mocks-data";

import {ArrowLeftIcon} from "lucide-react";

export function BookingSelectedScreen() {
    const router = useRouter();
    const params = useParams();

    const bookingId = params?.id as string;

    const booking = BookingMocks.find(item => item.id === bookingId);

    if (!booking) {
        return <div className="p-10">Бронирование не найдено</div>;
    }

    return (
        <div className="min-h-screen bg-background text-text">
            <main className="overflow-hidden pt-26">
                <div className="page--restaurant">
                    <section className="py-8">
                        <div className="mx-auto w-full max-w-374 px-4 md:px-7">
                            <div className="mb-12.5 flex items-center justify-between gap-6 lg:mb-16">
                                <div className="text-[30px] font-medium lg:text-[40px]">
                                    {booking.title}
                                </div>

                                <button
                                    onClick={() => router.back()}
                                    className="inline-flex items-center group cursor-pointer"
                                >
                                    <span
                                        className="mr-2 flex h-10 w-10
                                        items-center justify-center rounded-full bg-card
                                        transition-transform duration-300
                                        group-hover:-translate-x-2
                                        "
                                    >
                                        <ArrowLeftIcon/>
                                    </span>
                                    <span className="group-hover:scale-115 duration-300">Назад</span>
                                </button>
                            </div>

                            <div>
                                <div
                                    className="relative mb-7.5 min-h-90 overflow-hidden rounded-[20px] lg:mb-15 lg:min-h-140">
                                    {booking.image ? (
                                        <Image
                                            src={booking.image}
                                            alt={booking.title || "Изображение бронирования"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (<></>)
                                    }
                                </div>

                                <div className="mb-10 text-[20px] lg:text-[30px]">
                                    {booking.description}
                                </div>

                                <div className="text-text-secondary">
                                    <p>{PICKUP_POINT.intro}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-8">
                        <div className="mx-auto w-full max-w-374 px-4 md:px-7">
                            <div className="mb-12.5 lg:mb-16">
                                <div
                                    className="text-[30px] font-medium leading-9.25 tracking-[0.005em] lg:text-[40px] lg:leading-12.25">
                                    {PICKUP_POINT.name}
                                </div>
                            </div>

                            <ul className="-mx-4 mb-12.5 flex list-none items-center overflow-x-auto pl-0">
                                <li className="px-4">
                                    <button
                                        type="button"
                                        className="block whitespace-nowrap rounded-lg border border-border bg-card px-6 py-5.25 text-[20px] leading-5.5"
                                    >
                                        {PICKUP_POINT.city}
                                    </button>
                                </li>
                            </ul>

                            <ul className="-mx-4 mb-12.5 flex flex-col md:flex-row gap-4 list-none overflow-x-auto pl-0">
                                <li className="px-4">
                                    <a
                                        href={`tel:${PICKUP_POINT.phone}`}
                                        className="whitespace-nowrap
                                    rounded-full bg-warning
                                    text-text-on-primary px-6 py-5.25 text-[14px] md:text-[20px] leading-7.5
                                    tracking-widest
                                    cursor-pointer font-bold
                                    hover:scale-105 duration-300
                                    flex gap-4 items-center
                                    z-10
                                    "
                                    >
                                        <Image src="/booking/CallForwardedFilled.svg"
                                               alt="WhatsApp"
                                               priority
                                               width={24}
                                               height={24}
                                               className="w-6 md:w-8"
                                        />
                                        Забронировать
                                    </a>
                                </li>

                                <li className="px-4">
                                    <a
                                        href={`https://wa.me/${String(PICKUP_POINT.phone).replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="whitespace-nowrap rounded-full
                                    bg-green-500 text-text-on-primary px-6 py-5.25
                                     text-[14px] md:text-[20px] leading-7.5 tracking-widest cursor-pointer
                                    font-bold hover:scale-105 duration-300
                                    flex gap-4 items-center"
                                    >
                                        <Image
                                            src="/icons/WhatsappIcon.svg"
                                            alt="WhatsApp"
                                            priority
                                            width={256}
                                            height={258}
                                            className="w-6 md:w-8"
                                        />
                                        Написать в WhatsApp
                                    </a>
                                </li>
                            </ul>


                            <div className="grid gap-x-14 gap-y-16 lg:grid-cols-2">

                                <div
                                    className="relative flex flex-col justify-between overflow-hidden rounded-[25px] bg-card p-6 lg:p-10">
                                    <div className="mb-10">
                                        <div
                                            className="text-[26px] font-medium leading-8 lg:text-[30px] lg:leading-9.25">
                                            {PICKUP_POINT.address}
                                        </div>
                                    </div>

                                    <div
                                        className="-mx-3 flex flex-wrap gap-y-6 text-[16px] font-medium leading-5 text-text lg:-mx-7">
                                        <div className="px-3 lg:px-7">
                                            <div className="mb-2">Контакты</div>
                                            <a
                                                href={`tel:${PICKUP_POINT.phone}`}
                                                className="text-text transition hover:text-text-secondary"
                                            >
                                                {PICKUP_POINT.phone}
                                            </a>
                                        </div>

                                        <div className="max-w-130 px-3 lg:px-7">
                                            <div className="mb-2">Работаем</div>
                                            <div>{PICKUP_POINT.schedule}</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="">
                                    <iframe
                                        title={`Карта: ${PICKUP_POINT.address}`}
                                        src={`https://yandex.com/map-widget/v1/?ll=${PICKUP_POINT.coordinates.longitude}%2C${PICKUP_POINT.coordinates.latitude}&z=15&pt=${PICKUP_POINT.coordinates.longitude}%2C${PICKUP_POINT.coordinates.latitude}%2Cpm2rdm`}
                                        className="h-full w-full border-0 rounded-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
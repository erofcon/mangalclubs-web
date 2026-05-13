"use client";

import {Clock, MapPin} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {RestaurantInfoModal} from "@/feautures/order/RestaurantInfoModal";
import {Organizations} from "@/mocks/mocks-data";
import {formatOrganizationAddress} from "@/utils/organizations";

export default function WelcomeBookingBanner() {
    const [isRestaurantInfoOpen, setRestaurantInfoOpen] = useState(false);
    const [activeOrganization, setActiveOrganization] = useState(Organizations[0]);
    const router = useRouter();

    return (
        <>
            <section className="mx-auto mb-8 w-full max-w-[1210px] px-5 sm:px-6 lg:px-0">
                <div className="grid overflow-hidden rounded-[8px] border border-border/70 lg:grid-cols-[1fr_1.2fr]">
                    <div className="min-h-32 border-b border-border/55 px-5 py-5 lg:border-b-0 lg:border-r">
                        <span className="flex min-w-0 gap-4">
                            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8}/>
                            <span className="min-w-0">
                                <span className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    Мы находимся
                                </span>
                                <span className="mt-2 block text-[18px] font-semibold leading-6 text-text">
                                    {Organizations.length} ресторана в Грозном
                                </span>
                                <span className="mt-3 grid gap-2">
                                    {Organizations.map((organization) => (
                                        <button
                                            key={organization.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveOrganization(organization);
                                                setRestaurantInfoOpen(true);
                                            }}
                                            className="group flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-[6px] border border-border/50 px-3 py-2 text-left transition duration-300 hover:border-primary/70"
                                        >
                                            <span className="min-w-0">
                                                <span className="block text-[13px] font-semibold text-text">
                                                    {organization.name}
                                                </span>
                                                <span className="mt-1 block truncate text-[12px] text-text/62">
                                                    {formatOrganizationAddress(organization)}
                                                </span>
                                            </span>
                                            <Clock className="h-4 w-4 shrink-0 text-text/60 transition duration-300 group-hover:text-primary" strokeWidth={1.8}/>
                                        </button>
                                    ))}
                                </span>
                            </span>
                        </span>
                    </div>

                    <div className="flex min-h-32 flex-col justify-between gap-5 px-5 py-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">
                                Бронирование
                            </p>
                            <h2
                                className="mt-2 text-[26px] font-normal leading-tight text-text"
                                style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                            >
                                Забронируйте удобное место заранее.
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push("/booking")}
                            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[6px] bg-primary px-5 text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 sm:w-auto"
                        >
                            Забронировать
                        </button>
                    </div>
                </div>
            </section>

            <RestaurantInfoModal
                isOpen={isRestaurantInfoOpen}
                onClose={() => setRestaurantInfoOpen(false)}
                organization={activeOrganization}
            />
        </>
    );
}

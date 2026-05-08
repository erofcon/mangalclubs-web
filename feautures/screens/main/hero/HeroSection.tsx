import Image from "next/image";
import Link from "next/link";
import {ArrowRight, CalendarDays} from "lucide-react";

const heroHighlights = [
    {value: "10:30–01:30", label: "каждый день"},
    {value: "от 45 мин", label: "доставка"},
    {value: "VIP", label: "кабинки"},
];

export function HeroSection() {
    return (
        <section className="relative isolate mx-auto w-full max-w-[1210px] overflow-hidden text-text">
            <Image
                src="/hero/hero-v2.png"
                alt="Стейки на гриле"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1210px"
                className="absolute inset-0 -z-30 object-cover object-[64%_center] sm:object-[68%_center]"
            />

            <div
                className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.97)_24%,rgba(5,5,5,0.78)_48%,rgba(5,5,5,0.28)_74%,rgba(5,5,5,0.62)_100%)]"/>

            <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_36%,rgba(214,173,104,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_45%,#050505_100%)]"/>

            <div className="mx-auto flex min-h-[620px] w-full items-center px-5 py-14 sm:px-6 md:min-h-[580px] lg:px-0">
                <div className="max-w-[590px]">

                    <h1
                        className="max-w-[560px] text-[46px] font-normal leading-[0.96] tracking-[-0.035em] text-text drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:text-[64px] lg:text-[78px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Искусство живого огня.
                    </h1>

                    <p
                        className="mt-5 text-[24px] leading-tight text-primary sm:text-[32px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Мясо, за которым возвращаются.
                    </p>

                    <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-text/85 sm:text-[16px]">
                        Авторские стейки, мангал и приватные залы для тех вечеров,
                        где важны вкус, огонь и спокойная атмосфера.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Link
                            href="#menu-99"
                            className="group inline-flex h-12 min-w-[210px] items-center
                             justify-center gap-4 rounded-[6px] bg-primary px-6 text-[14px]
                             font-semibold text-on-primary shadow-[0_18px_42px_rgba(214,173,104,0.24)]
                             transition duration-300 hover:-translate-y-0.5"
                        >
                            Смотреть меню
                            <ArrowRight
                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>
                        </Link>

                        <Link
                            href="/booking"
                            className="inline-flex h-12 min-w-[228px] items-center
                             justify-center gap-4 rounded-[6px] border border-white/10
                              bg-white/[0.04] px-6 text-[14px] font-semibold text-text backdrop-blur
                              transition duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                        >
                            Забронировать стол
                            <CalendarDays className="h-4 w-4 text-primary"/>
                        </Link>
                    </div>

                    <div
                        className="mt-9 grid max-w-[540px] grid-cols-3 overflow-hidden rounded-[10px]
                        border border-white/[0.09] bg-black/30 backdrop-blur-md"
                    >
                        {heroHighlights.map((item, index) => (
                            <div
                                key={item.label}
                                className={[
                                    "px-4 py-4 sm:px-5 sm:py-5",
                                    index !== 0 ? "border-l border-white/[0.08]" : "",
                                ].join(" ")}
                            >
                                <div className="text-[12px] font-semibold leading-none text-text sm:text-[19px]">
                                    {item.value}
                                </div>
                                <div className="mt-2 text-[12px] leading-none text-text/60 sm:text-[12px]">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
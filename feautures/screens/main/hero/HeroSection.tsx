import Image from "next/image";
import Link from "next/link";
import {ArrowRight, CalendarDays, Flame} from "lucide-react";

const heroHighlights = [
    {value: "10:30-01:30", label: "каждый день"},
    {value: "45 мин", label: "доставка от"},
    {value: "VIP", label: "кабинки"},
];

export function HeroSection() {
    return (
        <section className="relative isolate overflow-hidden bg-[#050505] text-[#f5efe5] mx-auto w-full max-w-[1210px]">
            <Image
                src="/hero/hero-v2.png"
                alt="Стейки на гриле"
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 -z-20 object-cover  object-[68%_center]"
            />

            <div
                className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.96)_23%,rgba(5,5,5,0.72)_47%,rgba(5,5,5,0.18)_72%,rgba(5,5,5,0.5)_100%)]"/>
            <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_37%,rgba(214,173,104,0.18),transparent_31%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%,#050505_100%)]"/>

            <div
                className="mx-auto flex min-h-[560px] w-full max-w-[1210px] items-center px-5 py-10 sm:px-6 md:min-h-[520px] lg:px-0">
                <div className="max-w-[560px]">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6f522e] bg-black/35 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#d6ad68] shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur">
                        <Flame className="h-4 w-4"/>
                        Премиальный гриль
                    </div>

                    <h1
                        className="max-w-[540px] text-[48px] font-normal leading-[0.98] text-[#fff7ec] drop-shadow-[0_10px_24px_rgba(0,0,0,0.46)] sm:text-[64px] lg:text-[74px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Искусство живого огня.
                    </h1>

                    <p
                        className="mt-4 text-[25px] leading-tight text-[#d6ad68] sm:text-[31px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Мясо, за которым возвращаются.
                    </p>

                    <p className="mt-6 max-w-[470px] text-[15px] leading-7 text-[#d8d0c5]">
                        Авторские стейки, мангал и приватные залы для тех вечеров,
                        где важны вкус, огонь и спокойная атмосфера.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="#menu-99"
                            className="inline-flex h-12 min-w-[206px] items-center justify-center gap-8 whitespace-nowrap rounded-[6px] bg-[#d6ad68] px-6 text-[14px] font-semibold text-[#18130c] shadow-[0_18px_42px_rgba(214,173,104,0.22)] transition duration-300 hover:bg-[#e3bd78]"
                        >
                            Смотреть меню
                            <ArrowRight className="h-5 w-5"/>
                        </Link>

                        <Link
                            href="/booking"
                            className="inline-flex h-12 min-w-[228px] items-center justify-center gap-7 whitespace-nowrap rounded-[6px] border border-[#5d4529] bg-black/42 px-6 text-[14px] font-semibold text-[#f0e8dd] backdrop-blur transition duration-300 hover:border-[#d6ad68] hover:bg-black/58"
                        >
                            Забронировать стол
                            <CalendarDays className="h-4 w-4 text-[#d6ad68]"/>
                        </Link>
                    </div>

                    <div
                        className="mt-8 grid max-w-[520px] grid-cols-3 overflow-hidden rounded-[8px] border border-white/[0.08] bg-black/38 backdrop-blur">
                        {heroHighlights.map((item) => (
                            <div
                                key={item.label}
                                className="border-r border-white/[0.08] px-4 py-4 last:border-r-0"
                            >
                                <div className="text-[18px] font-semibold leading-none text-[#fff7ec]">
                                    {item.value}
                                </div>
                                <div className="mt-1 text-[12px] leading-none text-[#b8afa5]">
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

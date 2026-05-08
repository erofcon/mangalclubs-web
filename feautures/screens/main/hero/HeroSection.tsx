import Image from "next/image";
import Link from "next/link";
import {ArrowRight, CalendarDays} from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#070808] text-[#f5efe5]">
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_73%_31%,rgba(200,151,79,0.14),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_44%)]"/>

            <div
                className="relative mx-auto grid min-h-[280px] w-full max-w-[1210px] items-center gap-8 px-5 pb-5 pt-5 sm:px-6 md:grid-cols-[0.78fr_1.22fr] md:pb-0 md:pt-4 lg:px-0">
                <div className="relative z-10 max-w-[520px]">
                    <h1
                        className="text-[46px] font-normal leading-[1.03] text-[#f5f0e8] sm:text-[58px] md:text-[54px] lg:text-[60px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Искусство огня.
                    </h1>

                    <p
                        className="mt-3 text-[25px] leading-tight text-[#c99a55] sm:text-[30px]"
                        style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
                    >
                        Вкус, который запоминается.
                    </p>

                    <p className="mt-5 max-w-[465px] text-[14px] leading-6 text-[#b7b0a6]">
                        Отборное мясо, открытый огонь и безупречный вкус.
                        <br/>
                        Доставка и бронирование в лучшем гриль-ресторане Грозного.
                    </p>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="#menu-99"
                            className="inline-flex h-12 min-w-[206px] items-center justify-center gap-8 whitespace-nowrap rounded-[6px] bg-[#d6ad68] px-6 text-[14px] font-medium text-[#18130c] transition duration-300 hover:bg-[#e3bd78]"
                        >
                            Смотреть меню
                            <ArrowRight className="h-5 w-5"/>
                        </Link>

                        <Link
                            href="/booking"
                            className="inline-flex h-12 min-w-[228px] items-center justify-center gap-7 whitespace-nowrap rounded-[6px] border border-[#3a3024] bg-[#0b0c0d]/70 px-6 text-[14px] font-medium text-[#d8d0c5] transition duration-300 hover:border-[#c99a55] hover:text-[#f5efe5]"
                        >
                            Забронировать стол
                            <CalendarDays className="h-4 w-4 text-[#c99a55]"/>
                        </Link>
                    </div>
                </div>

                <div className="relative min-h-[230px] md:min-h-[300px]">
                    <div
                        className="absolute bottom-4 left-[6%] right-[2%] h-[42%] rounded-[50%] border border-white/[0.04] bg-[#111314] shadow-[0_36px_70px_rgba(0,0,0,0.78),inset_0_0_60px_rgba(255,255,255,0.025)] md:bottom-6"/>
                    <div
                        className="absolute bottom-[17%] left-[10%] right-[8%] h-[24%] rounded-[50%] bg-black/65 blur-2xl"/>
                    <Image
                        src="/hero/hero.png"
                        alt="Стейк на гриле"
                        width={880}
                        height={640}
                        priority
                        className="relative z-10 ml-auto h-auto w-full max-w-[720px] translate-y-4 object-contain drop-shadow-[0_34px_42px_rgba(0,0,0,0.72)] md:absolute md:bottom-0 md:right-[-22px] md:h-[330px] md:w-auto md:max-w-none md:translate-x-0 md:translate-y-0"
                    />
                </div>
            </div>
        </section>
    );
}

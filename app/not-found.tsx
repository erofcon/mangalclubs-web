import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export const metadata = {
    title: "Страница не найдена",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <main className="flex min-h-[65vh] items-center bg-background px-5 py-16 text-text sm:px-6">
            <section className="mx-auto w-full max-w-2xl rounded-[8px] border border-border/70 bg-[#090a0a] p-7 sm:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">Ошибка 404</p>
                <h1 className="mt-4 text-[34px] font-semibold leading-tight sm:text-[48px]">Страница не найдена</h1>
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-text/70">
                    Возможно, ссылка устарела или адрес был введён с ошибкой. Вернитесь на главную страницу и выберите нужный раздел.
                </p>
                <Link href="/" className="mt-8 inline-flex h-12 items-center gap-3 rounded-[6px] bg-primary px-5 text-[14px] font-semibold text-on-primary transition hover:bg-hover">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.8}/>
                    На главную
                </Link>
            </section>
        </main>
    );
}

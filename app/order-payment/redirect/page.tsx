import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Переход к оплате",
    robots: {
        index: false,
        follow: false,
    },
};

export default function OrderPaymentRedirectPage() {
    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-5 text-text">
            <div className="w-full max-w-md rounded-[8px] border border-border bg-[#090a0a] px-6 py-8 text-center">
                <h1 className="text-[24px] font-normal leading-tight">
                    Открываем оплату
                </h1>
                <p className="mt-3 text-sm leading-6 text-text/68">
                    Подождите немного, сейчас откроется страница банка.
                </p>
            </div>
        </main>
    );
}

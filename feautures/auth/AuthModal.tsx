"use client";

import {ModalSkeleton} from "@/components/ui/ModalSkeleton";

export function AuthModal() {
    return (
        <ModalSkeleton
            onClose={() => {
            }}
            className="sm:max-w-md"
        >
            <div
                className="flex h-full w-full flex-col bg-background px-6 py-8 pb-6 sm:rounded-[32px] sm:px-10 sm:py-10">

                <div className="flex flex-1 flex-col justify-center">
                    <h1 className="text-center text-2xl font-semibold text-text">
                        Войдите в профиль
                    </h1>

                    <p className="mt-3 text-center text-sm text-text-secondary px-12">
                        Необходимо авторизоваться чтобы сделать заказ
                    </p>

                    <input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="mt-12 w-full rounded-2xl text-text border border-border bg-card px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-warning"
                    />

                    <div className="mt-5 flex items-start gap-3 text-xs text-text">
                        <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border border-border cursor-pointer"
                        />
                        <span className="cursor-pointer">
                            Соглашаюсь с{" "}
                            <span className="underline">обработкой персональных данных</span>,{" "}
                            <span className="underline">политикой обработки персональных данных</span>,{" "}
                            <span className="underline">политикой обработки файлов cookie</span>,{" "}
                            и <span className="underline">условиями сервиса</span>
                        </span>
                    </div>
                </div>

                <button
                    className="mt-auto w-full rounded-full cursor-pointer bg-warning py-4 text-sm font-bold text-text-on-primary transition hover:opacity-90"
                >
                    Отправить код в Telegram <br/> или СМС
                </button>
            </div>
        </ModalSkeleton>
    );
}
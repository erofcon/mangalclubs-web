"use client";

import {FormEvent, KeyboardEvent, useState} from "react";

import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useAuthStore} from "@/store/auth-store";
import {useUIStore} from "@/store/ui-store";


const getRussianPhoneDigits = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (!digits) return "";

    if (digits === "8" || digits === "7") {
        return "";
    }

    if (digits.startsWith("8")) {
        digits = `7${digits.slice(1)}`;
    }

    if (digits.startsWith("7")) {
        digits = digits.slice(1);
    }

    return digits.slice(0, 10);
};


const formatRussianPhoneByDigits = (digits: string, shouldShowPrefix = false) => {
    if (!digits && !shouldShowPrefix) return "";

    const area = digits.slice(0, 3);
    const first = digits.slice(3, 6);
    const second = digits.slice(6, 8);
    const third = digits.slice(8, 10);

    let result = "+7";

    if (area) result += ` (${area}`;
    if (area.length === 3) result += ")";
    if (first) result += ` ${first}`;
    if (second) result += `-${second}`;
    if (third) result += `-${third}`;

    return result;
};


const formatRussianPhone = (value: string) => {
    const rawDigits = value.replace(/\D/g, "");
    const shouldShowPrefix = rawDigits === "8" || rawDigits === "7";

    return formatRussianPhoneByDigits(
        getRussianPhoneDigits(value),
        shouldShowPrefix,
    );
};


export function AuthModal() {
    const isOpen = useUIStore((state) => state.isAuthModalOpen);
    const closeAuthModal = useUIStore((state) => state.closeAuthModal);
    const openAuthCodeConfirm = useUIStore((state) => state.openAuthCodeConfirm);
    const requestCode = useAuthStore((state) => state.requestCode);

    const [phone, setPhone] = useState("");
    const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);

    const phoneDigits = phone.replace(/\D/g, "");
    const canSubmit = phoneDigits.length === 11 && isAgreementAccepted;

    const handleClose = () => {
        setPhone("");
        setIsAgreementAccepted(false);
        closeAuthModal();
    };

    const handlePhoneChange = (value: string) => {
        setPhone(formatRussianPhone(value));
    };

    const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Backspace") return;

        event.preventDefault();

        const digits = getRussianPhoneDigits(phone);
        const nextDigits = digits.slice(0, -1);

        setPhone(formatRussianPhoneByDigits(nextDigits));
    };


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit) return;

        requestCode(phone);
        setPhone("");
        setIsAgreementAccepted(false);
        openAuthCodeConfirm();
    };

    if (!isOpen) return null;

    return (
        <ModalSkeleton
            onClose={handleClose}
            className="sm:max-w-md sm:h-125"
        >
            <form
                onSubmit={handleSubmit}
                className="flex h-full w-full flex-col border-border bg-background px-6 py-8 pb-6 sm:rounded-[8px] sm:border sm:px-10 sm:py-10"
            >
                <div className="flex flex-1 flex-col justify-center">
                    <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Профиль
                    </p>
                    <h1
                        className="text-center text-[28px] font-normal leading-tight text-text"
                    >
                        Войдите в профиль
                    </h1>

                    <p className="mt-3 px-4 text-center text-sm leading-6 text-text/68">
                        Необходимо авторизоваться, чтобы сделать заказ
                    </p>

                    <input
                        value={phone}
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        onKeyDown={handlePhoneKeyDown}
                        type="tel"
                        inputMode="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="mt-10 h-12 w-full rounded-[6px] border border-border bg-background px-4 text-sm text-text outline-none transition placeholder:text-text/45 focus:border-primary"
                    />

                    <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-text/72">
                        <input
                            checked={isAgreementAccepted}
                            onChange={(event) => setIsAgreementAccepted(event.target.checked)}
                            type="checkbox"
                            className="mt-1 h-4 w-4 cursor-pointer rounded-[3px] border border-border accent-primary"
                        />
                        <span className="cursor-pointer">
                            Соглашаюсь с{" "}
                            <span className="underline">обработкой персональных данных</span>,{" "}
                            <span className="underline">политикой обработки персональных данных</span>,{" "}
                            <span className="underline">политикой обработки файлов cookie</span>,{" "}
                            и <span className="underline">условиями сервиса</span>
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-auto h-12 w-full cursor-pointer rounded-[6px] bg-primary px-5 text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
                >
                    Отправить код в Telegram <br/> или СМС
                </button>
            </form>
        </ModalSkeleton>
    );
}

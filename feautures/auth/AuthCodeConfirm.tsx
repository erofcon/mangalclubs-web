"use client";

import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import {useAuthStore} from "@/store/auth-store";
import {useUIStore} from "@/store/ui-store";
import {cancelPendingCartFlow, continuePendingCartFlow} from "@/store/cart-gate-store";
import React, {ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState} from "react";

export function AuthCodeConfirm() {
    const isOpen = useUIStore((state) => state.isAuthCodeConfirmOpen);
    const closeAuthCodeConfirm = useUIStore((state) => state.closeAuthCodeConfirm);
    const pendingPhone = useAuthStore((state) => state.pendingPhone);
    const requestCode = useAuthStore((state) => state.requestCode);
    const confirmCode = useAuthStore((state) => state.confirmCode);
    const clearPendingPhone = useAuthStore((state) => state.clearPendingPhone);
    const isRequestingCode = useAuthStore((state) => state.isRequestingCode);
    const isConfirmingCode = useAuthStore((state) => state.isConfirmingCode);
    const errorMessage = useAuthStore((state) => state.errorMessage);
    const clearError = useAuthStore((state) => state.clearError);
    const otpRetryAfterSeconds = useAuthStore((state) => state.otpRetryAfterSeconds);
    const otpRetryStartedAt = useAuthStore((state) => state.otpRetryStartedAt);

    const [code, setCode] = useState(["", "", "", ""]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    const [codeInputKey, setCodeInputKey] = useState(0);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const enteredCode = code.join("");
    const timeLeft = useMemo(() => {
        if (!otpRetryStartedAt) {
            return Math.max(0, otpRetryAfterSeconds);
        }

        const elapsedSeconds = Math.max(0, Math.floor((currentTime - otpRetryStartedAt) / 1000));

        return Math.max(0, otpRetryAfterSeconds - elapsedSeconds);
    }, [currentTime, otpRetryAfterSeconds, otpRetryStartedAt]);
    const canConfirm = enteredCode.length === code.length && !isConfirmingCode && !isRequestingCode;
    const canShowResend = timeLeft <= 0 && Boolean(pendingPhone);
    const canResend = canShowResend && !isRequestingCode;

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        requestAnimationFrame(() => {
            inputRefs.current[0]?.focus();
        });
    }, [isOpen]);

    const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, "").slice(-1);
        const nextCode = [...code];

        clearError();
        nextCode[index] = value;
        setCode(nextCode);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
            setActiveIndex(index + 1);
        }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            setActiveIndex(index - 1);
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();

        const pastedCode = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, code.length)
            .split("");

        if (!pastedCode.length) return;

        const nextCode = [...code];

        pastedCode.forEach((digit, index) => {
            nextCode[index] = digit;
        });

        setCode(nextCode);

        const nextIndex = Math.min(pastedCode.length, code.length) - 1;
        inputRefs.current[nextIndex]?.focus();
        setActiveIndex(nextIndex);
    };

    const resetCodeInput = (shouldClearError = true) => {
        setCode(["", "", "", ""]);
        setActiveIndex(0);
        setCodeInputKey((value) => value + 1);

        if (shouldClearError) {
            clearError();
        }

        requestAnimationFrame(() => {
            inputRefs.current[0]?.focus();
        });
    };

    const handleResend = async () => {
        if (!pendingPhone || !canResend) return;

        resetCodeInput();

        const isRequested = await requestCode(pendingPhone);

        if (!isRequested) return;

        requestAnimationFrame(() => {
            inputRefs.current[0]?.focus();
        });
    };

    const handleConfirm = async () => {
        if (!canConfirm) return;

        const isConfirmed = await confirmCode(enteredCode);

        if (!isConfirmed) {
            resetCodeInput(false);
            return;
        }

        closeAuthCodeConfirm();
        resetCodeInput();
        continuePendingCartFlow();
    };

    const handleClose = () => {
        clearPendingPhone();
        cancelPendingCartFlow();
        closeAuthCodeConfirm();
        resetCodeInput();
    };

    if (!isOpen) return null;

    return (
        <ModalSkeleton
            onClose={handleClose}
            className="sm:max-w-md sm:h-135"
        >
            <div
                className="flex h-full w-full flex-col border-border bg-background px-6 py-8 pb-7 transition-transform duration-300 ease-in-out sm:rounded-[8px] sm:border sm:px-10 sm:py-10">
                <div className="flex flex-1 flex-col items-center">
                    <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                        Подтверждение
                    </p>
                    <h1
                        className="text-center text-[28px] font-normal leading-tight text-text"
                    >
                        Введите код
                    </h1>

                    <p className="mt-4 max-w-80 text-center text-sm leading-6 text-text/68">
                        Код уже в пути! Проверьте Telegram или СМС на {pendingPhone}
                    </p>

                    <div key={codeInputKey} className="mt-9 flex w-full justify-center gap-2.5 sm:gap-3">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                value={digit}
                                onChange={(event) => handleChange(index, event)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                onPaste={handlePaste}
                                onFocus={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                aria-label={`Цифра кода ${index + 1}`}
                                placeholder="_"
                                className={`
                                    h-14 w-14 cursor-pointer rounded-[6px] bg-background
                                    text-center text-2xl font-bold text-text outline-none transition
                                    placeholder:text-text/45 caret-transparent
                                    ${activeIndex === index ? "border border-primary ring-2 ring-primary/20" : "border border-border"}
                                `}
                            />
                        ))}
                    </div>

                    {errorMessage && (
                        <p className="mt-4 text-center text-sm font-medium text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    {canShowResend ? (
                        <div className="mt-8 flex flex-col items-center gap-3 text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isRequestingCode}
                                className="cursor-pointer text-sm font-semibold text-primary underline disabled:pointer-events-none disabled:opacity-50"
                            >
                                {isRequestingCode ? "Отправляем код..." : "Отправить код повторно"}
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8 text-center text-sm font-semibold text-text/60">
                            Для повторной отправки ожидайте {timeLeft} секунд
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className="mt-4 h-12 w-full cursor-pointer rounded-[6px] bg-primary px-6 text-sm font-semibold text-on-primary transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isConfirmingCode ? "Проверяем код..." : isRequestingCode ? "Отправляем код..." : "Подтвердить"}
                </button>
            </div>
        </ModalSkeleton>
    );
}

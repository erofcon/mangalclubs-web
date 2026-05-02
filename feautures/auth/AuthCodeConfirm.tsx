"use client";

import {ModalSkeleton} from "@/components/ui/ModalSkeleton";
import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";

export function AuthCodeConfirm() {
    const [code, setCode] = useState(["", "", "", ""]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTimeout, setIsTimeout] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // Время для отсчета
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (isTimeout) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimeout(true); // Время вышло
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimeout]);

    const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, "").slice(-1);
        const nextCode = [...code];

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


    const resetTimer = () => {
        setCode(["", "", "", ""]);
        setActiveIndex(0);
        setTimeLeft(30);
        setIsTimeout(false);
    };

    return (
        <ModalSkeleton
            onClose={() => {
            }}
            className="sm:max-w-md sm:h-135"
        >
            <div
                className="flex h-full w-full flex-col bg-card px-6 py-8 pb-7 sm:rounded-4xl sm:px-10 sm:py-10 transition-transform duration-300 ease-in-out"
            >
                <div className="flex flex-1 flex-col items-center">
                    <h1 className="text-center text-[32px] font-extrabold leading-none text-text">
                        Введи код
                    </h1>

                    <p className="mt-6 max-w-75 text-center text-lg font-semibold leading-7 text-text-secondary">
                        Код уже в пути! Проверьте Telegram или СМС на +7 (967) 416-71-14
                    </p>

                    <div className="mt-9 flex w-full justify-center gap-2.5 sm:gap-3">
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
                                    h-15 w-15 cursor-pointer rounded-2xl bg-background
                                    text-center text-2xl font-bold text-text outline-none transition
                                    placeholder:text-text-secondary caret-transparent
                                    ${activeIndex === index ? "border border-warning ring-2 ring-warning/30" : "border border-border"}
                                `}
                            />
                        ))}
                    </div>

                    {isTimeout ? (
                        <div className="mt-8 text-center">
                            <p className="text-xl font-semibold text-red-500">
                                Время для ввода кода истекло. Попробуйте снова.
                            </p>
                            <span className="text-xl font-semibold text-text-secondary cursor-pointer underline">
                                Нажмите для повторной отправки
                            </span>
                        </div>
                    ) : (
                        <div className="mt-8 text-center text-xl font-semibold text-text-secondary">
                            Для повторной отправки ожидайте {timeLeft} секунд
                        </div>
                    )}
                </div>

                <button
                    onClick={resetTimer}
                    className="mt-4 h-18.5 w-full cursor-pointer rounded-full bg-warning px-6 text-xl font-extrabold text-text-on-primary transition hover:scale-105"
                >
                    Подтвердить
                </button>

            </div>
        </ModalSkeleton>
    );
}
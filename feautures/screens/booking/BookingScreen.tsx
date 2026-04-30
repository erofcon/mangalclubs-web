"use client";

import Image from "next/image";

import {BookingMocks} from "@/mocks/mocks-data";


export function BookingScreen() {
    return (
        <main className="bg-black text-white min-h-screen px-4 py-10 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-semibold mb-3">
                        Наши рестораны
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Делимся вкусом жизни через вкус к еде
                    </p>
                </div>

                {/* Grid */}
                <div className="space-y-6">
                    {(() => {
                        const rows: typeof BookingMocks[] = [];
                        let i = 0;
                        let useTwo = true;

                        while (i < BookingMocks.length) {
                            const count = useTwo ? 2 : 3;
                            rows.push(BookingMocks.slice(i, i + count));
                            i += count;
                            useTwo = !useTwo;
                        }

                        return rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={`grid gap-6 ${
                                    row.length === 2
                                        ? "grid-cols-1 md:grid-cols-2"
                                        : "grid-cols-1 md:grid-cols-3"

                                }`}
                            >
                                {row.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative group overflow-hidden rounded-2xl cursor-pointer"
                                    >
                                        <div className="relative w-full h-[240px] md:h-[280px]">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <div
                                            className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-300"/>

                                        <div className="absolute top-4 left-4 z-10">
                                            <h3 className="text-lg md:text-xl font-semibold">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div
                                            className="absolute inset-0 flex items-end p-4 z-10 opacity-0 group-hover:opacity-100 transition duration-300">
                                            <p className="text-sm text-gray-200">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ));
                    })()}
                </div>
            </div>
        </main>
    );
}

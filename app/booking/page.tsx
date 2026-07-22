import type {Metadata} from "next";

import {BookingScreen} from "@/feautures/screens/booking/BookingScreen";

export const metadata: Metadata = {
    title: "Бронирование",
    description: "Выберите ресторан и зону Mangal Clubs для бронирования стола или приватного кабинета.",
    alternates: {
        canonical: "/booking",
    },
};

export default BookingScreen;

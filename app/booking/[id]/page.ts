import type {Metadata} from "next";

import {BookingSelectedScreen} from "@/feautures/screens/booking/BookingSelectedScreen";

type BookingPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({params}: BookingPageProps): Promise<Metadata> {
    const {id} = await params;

    return {
        title: "Зона бронирования",
        description: "Описание зоны бронирования Mangal Clubs, фото, ресторан и контакты для уточнения свободного времени.",
        alternates: {
            canonical: `/booking/${encodeURIComponent(id)}`,
        },
    };
}

export default BookingSelectedScreen;

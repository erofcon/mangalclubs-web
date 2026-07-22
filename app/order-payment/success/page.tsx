import type {Metadata} from "next";
import {OrderPaymentStatusScreen} from "@/feautures/order/OrderPaymentStatusScreen";

export const metadata: Metadata = {
    title: "Статус оплаты",
    robots: {
        index: false,
        follow: false,
    },
};

export default function OrderPaymentSuccessPage() {
    return <OrderPaymentStatusScreen result="success"/>;
}

import type {Metadata} from "next";
import {Suspense} from "react";
import {OrderPaymentStatusScreen} from "@/feautures/order/OrderPaymentStatusScreen";

export const metadata: Metadata = {
    title: "Статус оплаты",
    robots: {
        index: false,
        follow: false,
    },
};

export default function OrderPaymentFailPage() {
    return (
        <Suspense fallback={null}>
            <OrderPaymentStatusScreen result="fail"/>
        </Suspense>
    );
}
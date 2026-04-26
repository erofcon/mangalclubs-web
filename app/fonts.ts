
import localFont from "next/font/local";

export const myFont = localFont({
    src: [
        {
            path: "../font/CeraPro-Regular.woff",
            weight: "400",
            style: "normal",
        },
        {
            path: "../font/CeraPro-Medium.woff",
            weight: "500",
            style: "normal",
        },
        {
            path: "../font/CeraPro-Bold.woff",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-my-font",
    display: "swap",
});
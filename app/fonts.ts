import localFont from "next/font/local";

export const point = localFont({
    src: [
        {
            path: "../public/fonts/point/Point/Point-Light.ttf", // font-light Тонкий текст
            weight: "300",
            style: "normal",
        },
        {
            path: "../public/fonts/point/Point/Point-Regular.ttf", // font-normal
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/point/Point/Point-SemiBold.ttf", // font-semibold
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/point/Point/Point-Bold.ttf", // font-bold
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/point/Point/Point-ExtraBold.ttf", // font-extrabold
            weight: "800",
            style: "normal",
        },
        {
            path: "../public/fonts/point/Point/Point-Black.ttf", // font-black
            weight: "900",
            style: "normal",
        },
    ],
    variable: "--font-point",
    display: "swap",
});

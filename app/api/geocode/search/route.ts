import { NextResponse } from "next/server";
import { normalizeGeoapifyAddress } from "../_utils";

type GeoapifySearchResponse = {
    results?: Parameters<typeof normalizeGeoapifyAddress>[0][];
};

export async function GET(request: Request) {
    const apiKey = process.env.GEOAPIFY_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { message: "Не задан GEOAPIFY_KEY" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text")?.trim();

    if (!text || text.length < 3) {
        return NextResponse.json(
            { message: "Введите адрес" },
            { status: 400 }
        );
    }

    const geoapifyUrl = new URL("https://api.geoapify.com/v1/geocode/search");
    geoapifyUrl.searchParams.set("text", text);
    geoapifyUrl.searchParams.set("format", "json");
    geoapifyUrl.searchParams.set("lang", "ru");
    geoapifyUrl.searchParams.set("limit", "1");
    geoapifyUrl.searchParams.set("filter", "countrycode:ru");
    geoapifyUrl.searchParams.set("apiKey", apiKey);

    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lon");

    if (latitude && longitude) {
        geoapifyUrl.searchParams.set("bias", `proximity:${longitude},${latitude}`);
    }

    const response = await fetch(geoapifyUrl, { cache: "no-store" });

    if (!response.ok) {
        return NextResponse.json(
            { message: "Не удалось найти адрес" },
            { status: response.status }
        );
    }

    const data = (await response.json()) as GeoapifySearchResponse;
    const result = data.results?.[0];

    if (!result) {
        return NextResponse.json(
            { message: "Адрес не найден" },
            { status: 404 }
        );
    }

    const normalized = normalizeGeoapifyAddress(result);

    if (!normalized) {
        return NextResponse.json(
            { message: "Укажите город, улицу и дом" },
            { status: 422 }
        );
    }

    return NextResponse.json(normalized);
}

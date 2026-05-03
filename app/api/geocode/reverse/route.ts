import { NextResponse } from "next/server";
import { normalizeGeoapifyAddress } from "../_utils";

type GeoapifyReverseResponse = {
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
    const latitude = Number(searchParams.get("lat"));
    const longitude = Number(searchParams.get("lon"));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return NextResponse.json(
            { message: "Некорректные координаты" },
            { status: 400 }
        );
    }

    const geoapifyUrl = new URL("https://api.geoapify.com/v1/geocode/reverse");
    geoapifyUrl.searchParams.set("lat", String(latitude));
    geoapifyUrl.searchParams.set("lon", String(longitude));
    geoapifyUrl.searchParams.set("format", "json");
    geoapifyUrl.searchParams.set("lang", "ru");
    geoapifyUrl.searchParams.set("limit", "1");
    geoapifyUrl.searchParams.set("apiKey", apiKey);

    const response = await fetch(geoapifyUrl, { cache: "no-store" });

    if (!response.ok) {
        return NextResponse.json(
            { message: "Не удалось получить адрес" },
            { status: response.status }
        );
    }

    const data = (await response.json()) as GeoapifyReverseResponse;
    const result = data.results?.[0];

    if (!result) {
        return NextResponse.json(
            { message: "Адрес не найден" },
            { status: 404 }
        );
    }

    const normalized = normalizeGeoapifyAddress(result, latitude, longitude);

    if (!normalized) {
        return NextResponse.json(
            { message: "Не удалось распознать город, улицу и дом" },
            { status: 422 }
        );
    }

    return NextResponse.json(normalized);
}

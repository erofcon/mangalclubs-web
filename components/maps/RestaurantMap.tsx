"use client";

import {useEffect, useMemo} from "react";
import {MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";
import type {DeliveryArea} from "@/utils/delivery-zones";

type Coordinates = {
    latitude: number;
    longitude: number;
};

type RestaurantMapProps = {
    name: string;
    address: string;
    coordinates: Coordinates;
    deliveryArea?: DeliveryArea | null;
    onSelectCoordinates?: (coordinates: Coordinates) => void;
};

const restaurantIcon = new L.Icon({
    iconUrl: "/map/restaurant-marker.svg",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
});

const YANDEX_MAPS_TERMS_URL = "https://yandex.ru/legal/maps_api/ru/";

function MapCenterSync({coordinates}: { coordinates: Coordinates }) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [coordinates.latitude, coordinates.longitude],
            map.getZoom(),
            {animate: true}
        );
    }, [coordinates.latitude, coordinates.longitude, map]);

    return null;
}

const ringToLeafletPositions = (ring: number[][]): [number, number][] => (
    ring
        .map(([longitude, latitude]) => [latitude, longitude] as [number, number])
        .filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude))
);

const deliveryAreaToPositions = (deliveryArea?: DeliveryArea | null) => {
    if (!deliveryArea?.coordinates?.length) {
        return [];
    }

    if (deliveryArea.type === "Polygon") {
        return (deliveryArea.coordinates as number[][][]).map(ringToLeafletPositions);
    }

    return (deliveryArea.coordinates as number[][][][]).map((polygon) => (
        polygon.map(ringToLeafletPositions)
    ));
};

const collectLatLngPairs = (
    value: unknown,
    result: [number, number][] = [],
) => {
    if (!Array.isArray(value)) {
        return result;
    }

    value.forEach((item) => {
        if (
            Array.isArray(item) &&
            item.length === 2 &&
            typeof item[0] === "number" &&
            typeof item[1] === "number" &&
            Number.isFinite(item[0]) &&
            Number.isFinite(item[1])
        ) {
            result.push(item as [number, number]);
            return;
        }

        collectLatLngPairs(item, result);
    });

    return result;
};

function DeliveryAreaBounds({positions}: { positions: ReturnType<typeof deliveryAreaToPositions> }) {
    const map = useMap();

    useEffect(() => {
        if (!positions.length) return;

        const bounds = L.latLngBounds(collectLatLngPairs(positions));

        if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.12), {animate: false});
        }
    }, [map, positions]);

    return null;
}

function MapClickHandler({
                             onSelectCoordinates,
                         }: {
    onSelectCoordinates?: (coordinates: Coordinates) => void;
}) {
    useMapEvents({
        click: (event) => {
            onSelectCoordinates?.({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });

    return null;
}

export function RestaurantMap({
                                  name,
                                  address,
                                  coordinates,
                                  deliveryArea,
                                  onSelectCoordinates,
                              }: RestaurantMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    const deliveryAreaPositions = useMemo(
        () => deliveryAreaToPositions(deliveryArea),
        [deliveryArea],
    );

    if (!apiKey) {
        return (
            <div className="flex h-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                Не задан NEXT_PUBLIC_YANDEX_MAPS_API_KEY
            </div>
        );
    }

    const position: [number, number] = [
        coordinates.latitude,
        coordinates.longitude,
    ];

    return (
        <div
            className={`relative h-full w-full overflow-hidden ${onSelectCoordinates ? "cursor-crosshair" : ""}`}
            title={onSelectCoordinates ? "Выберите точку доставки на карте" : undefined}
        >
            <MapContainer
                center={position}
                zoom={15}
                minZoom={3}
                maxZoom={19}
                attributionControl={false}
                scrollWheelZoom
                className="h-full w-full"
            >
                <TileLayer
                    url={`https://tiles.api-maps.yandex.ru/v1/tiles/?projection=web_mercator&x={x}&y={y}&z={z}&lang=ru_RU&l=map&apikey=${apiKey}`}
                />

                {deliveryAreaPositions.length > 0 && (
                    <>
                        <Polygon
                            positions={deliveryAreaPositions}
                            pathOptions={{
                                color: "#ECAC18",
                                fillColor: "#ECAC18",
                                fillOpacity: 0.15,
                                opacity: 0.9,
                                weight: 2,
                            }}
                        />
                        <DeliveryAreaBounds positions={deliveryAreaPositions}/>
                    </>
                )}
                {!deliveryAreaPositions.length && <MapCenterSync coordinates={coordinates}/>}
                {onSelectCoordinates && (
                    <MapClickHandler onSelectCoordinates={onSelectCoordinates}/>
                )}

                <Marker position={position} icon={restaurantIcon}>
                    <Popup>
                        <div className="space-y-1">
                            <div className="font-medium">{name}</div>
                            <div className="text-sm">{address}</div>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
            <a
                href={YANDEX_MAPS_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 left-2 z-[1000] rounded-[4px] bg-background/90 px-2 py-1 text-[11px] font-semibold leading-none text-text/72 shadow-sm transition duration-300 hover:text-primary"
            >
                Условия использования Яндекс Карт
            </a>
        </div>
    );
}

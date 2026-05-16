"use client";

import {useEffect} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";

type Coordinates = {
    latitude: number;
    longitude: number;
};

type RestaurantMapProps = {
    name: string;
    address: string;
    coordinates: Coordinates;
    onSelectCoordinates?: (coordinates: Coordinates) => void;
};

const restaurantIcon = new L.Icon({
    iconUrl: "/map/restaurant-marker.svg",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
});

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
                                  onSelectCoordinates,
                              }: RestaurantMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

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
            className={`h-full w-full overflow-hidden ${onSelectCoordinates ? "cursor-crosshair" : ""}`}
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

                <MapCenterSync coordinates={coordinates}/>
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
        </div>
    );
}

import { useState } from "react";

type Coordinates = {
    latitude: number;
    longitude: number;
};

export function useGeolocation() {
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const locate = (onSuccess: (coordinates: Coordinates) => void) => {
        if (isLocating) return;

        if (!navigator.geolocation) {
            setLocationError("Ваш браузер не поддерживает определение местоположения.");
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onSuccess({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setIsLocating(false);
            },
            (error) => {
                let message = "Не удалось определить местоположение. Попробуйте еще раз.";

                if (error.code === error.PERMISSION_DENIED) {
                    message = "Разрешите доступ к геолокации, чтобы мы могли определить ваш адрес.";
                }

                if (error.code === error.POSITION_UNAVAILABLE) {
                    message = "Местоположение сейчас недоступно. Проверьте GPS или интернет.";
                }

                if (error.code === error.TIMEOUT) {
                    message = "Определение местоположения заняло слишком много времени.";
                }

                setLocationError(message);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return {
        locate,
        isLocating,
        locationError,
        clearLocationError: () => setLocationError(null),
    };
}
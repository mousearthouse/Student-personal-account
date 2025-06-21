import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

interface GeoMapProps {
  address: string;
}

const GeoMap = ({ address }: GeoMapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YANDEX_API_KEY}&format=json&geocode=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        const posString = data.response.GeoObjectCollection.featureMember?.[0]?.GeoObject?.Point?.pos;
        if (posString) {
          const [lon, lat] = posString.split(' ').map(Number);
          setCoordinates([lat, lon]);
        } else {
          console.warn('Координаты не найдены');
        }
      } catch (error) {
        console.error('Ошибка при получении координат:', error);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_API_KEY }}>
      <Map
        defaultState={{ center: coordinates || [55.76, 37.64], zoom: 16 }}
        state={coordinates ? { center: coordinates, zoom: 16 } : undefined}
        width="100%"
        height="400px"
      >
        {coordinates && <Placemark geometry={coordinates} />}
      </Map>
    </YMaps>
  );
};

export default GeoMap;
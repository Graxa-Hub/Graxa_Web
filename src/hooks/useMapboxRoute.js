// src/hooks/useMapboxRoute.js
import { useState, useCallback } from 'react';
import { getCoordinates } from '../utils/endereco/geoUtils';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapboxRoute() {
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processarCoordenadas = useCallback(async (local) => {
    if (typeof local === 'object' && local.lat && local.lon) {
      return { lat: local.lat, lon: local.lon };
    }
    
    const endereco = typeof local === 'string' ? local : local?.endereco || local?.logradouro;
    return await getCoordinates(endereco);
  }, []);

  const calcularRota = useCallback(async (origem, destino) => {
    if (!origem || !destino) return null;

    setLoading(true);
    setError(null);

    try {
      const coordsOrigem = await processarCoordenadas(origem);
      const coordsDestino = await processarCoordenadas(destino);

      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordsOrigem.lon},${coordsOrigem.lat};${coordsDestino.lon},${coordsDestino.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error("Nenhuma rota encontrada");
      }

      const route = data.routes[0];
      const info = {
        coordsOrigem,
        coordsDestino,
        route,
        distanceKm: (route.distance / 1000).toFixed(1),
        durationMin: Math.round(route.duration / 60),
      };

      setRouteInfo(info);
      return info;

    } catch (err) {
      console.error("Erro ao calcular rota:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [processarCoordenadas]);

  const limparRota = useCallback(() => {
    setRouteInfo(null);
    setError(null);
  }, []);

  return {
    routeInfo,
    loading,
    error,
    calcularRota,
    limparRota
  };
}
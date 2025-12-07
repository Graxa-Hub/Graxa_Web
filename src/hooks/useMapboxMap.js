// src/hooks/useMapboxMap.js
import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapboxMap({ center, zoom = 12 }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center || [-46.6333, -23.5505],
      zoom: zoom
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  const adicionarRota = useCallback((routeInfo) => {
    const map = mapRef.current;
    if (!map || !routeInfo) return;

    map.on('load', () => {
      // Remover rota anterior se existir
      if (map.getLayer('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }

      // Adicionar nova rota
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeInfo.route.geometry
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 5
        }
      });

      // Marcadores
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([routeInfo.coordsOrigem.lon, routeInfo.coordsOrigem.lat])
        .setPopup(new mapboxgl.Popup().setText('Origem'))
        .addTo(map);

      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([routeInfo.coordsDestino.lon, routeInfo.coordsDestino.lat])
        .setPopup(new mapboxgl.Popup().setText('Destino'))
        .addTo(map);

      // Ajustar zoom
      const bounds = new mapboxgl.LngLatBounds();
      routeInfo.route.geometry.coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
    });
  }, []);

  const adicionarMarcador = useCallback((coords, cor = '#ef4444') => {
    const map = mapRef.current;
    if (!map || !coords) return;

    new mapboxgl.Marker({ color: cor })
      .setLngLat([coords.lon || coords[0], coords.lat || coords[1]])
      .addTo(map);
  }, []);

  return {
    mapContainerRef,
    mapRef,
    adicionarRota,
    adicionarMarcador
  };
}
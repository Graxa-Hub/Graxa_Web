// src/utils/endereco/apiRestaurantes.js
import { getCoordinates, calculateDistance } from "./geoUtils";

// 🔑 SEU TOKEN MAPBOX
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2FicmllbHNvdXNhLXNwdGVjaCIsImEiOiJjbWZ5N2ZzaGwwaHp2MmpwemFtczJib3YzIn0.opNfyOXGWBuKl1R4iJiSOQ";

/**
 * Resolve a origem (CEP, endereço ou coords) em coordenadas reais.
 */
async function resolverOrigem(origem) {
  if (origem && origem.lat && origem.lon) {
    return origem;
  }
  return await getCoordinates(origem);
}

/**
 * Busca os restaurantes mais próximos usando o Mapbox SearchBox API
 */
export async function buscarRestaurantes(origem, limit = 3) {
  try {
    const origemResolvida = await resolverOrigem(origem);

    const url = `https://api.mapbox.com/search/searchbox/v1/category/restaurant?proximity=${origemResolvida.lon},${origemResolvida.lat}&limit=${limit}&access_token=${MAPBOX_TOKEN}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      return [];
    }

    return data.features.map((rest) => {
      const nome =
        rest.properties.name || rest.text || "Restaurante sem nome";

      const endereco =
        rest.properties.address ||
        rest.properties.place_formatted ||
        rest.place_name ||
        "Endereço não disponível";

      const lat = rest.geometry.coordinates[1];
      const lon = rest.geometry.coordinates[0];

      // Distância calculada pelo Mapbox (em metros)
      const metros = rest.properties.distance ?? null;

      const distanciaKm = metros
        ? Number((metros / 1000).toFixed(1))
        : Number(
            calculateDistance(
              origemResolvida.lat,
              origemResolvida.lon,
              lat,
              lon
            ).toFixed(1)
          );

      return {
        nome,
        endereco,
        lat,
        lon,
        distanciaKm
      };
    });
  } catch (err) {
    console.error("Erro buscarRestaurantes:", err);

    // Fallback caso Mapbox falhe
    return [
      {
        nome: "Restaurante Local",
        endereco: "Endereço indisponível",
        distanciaKm: 1.2
      }
    ];
  }
}

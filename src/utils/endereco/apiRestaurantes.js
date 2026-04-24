// src/utils/endereco/apiRestaurantes.js
import { calculateDistance } from "./geoUtils";

/**
 * Busca restaurantes próximos usando a Overpass API (OpenStreetMap).
 * Gratuita, sem necessidade de API key.
 *
 * @param {Object} origem - Coordenadas { lat, lon } do local de referência (ex: local do show)
 * @param {number} limit - Número máximo de restaurantes a retornar
 * @param {number} raioMetros - Raio de busca em metros (default: 2000m = 2km)
 */
export async function buscarRestaurantes(origem, limit = 5, raioMetros = 2000) {
  try {
    if (!origem || !origem.lat || !origem.lon) {
      console.warn("🍽️ Coordenadas inválidas para busca de restaurantes.");
      return [];
    }

    console.log(
      `🍽️ Buscando restaurantes num raio de ${raioMetros}m de lat=${origem.lat}, lon=${origem.lon}`
    );

    // Query Overpass: busca TODOS os restaurants no raio
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="restaurant"](around:${raioMetros},${origem.lat},${origem.lon});
        way["amenity"="restaurant"](around:${raioMetros},${origem.lat},${origem.lon});
      );
      out center body;
    `;

    const url = "https://overpass-api.de/api/interpreter";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!res.ok) {
      throw new Error(`Overpass API retornou status ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("json")) {
      const text = await res.text();
      console.warn("🍽️ Resposta não-JSON:", text.substring(0, 200));
      throw new Error("Overpass retornou resposta não-JSON");
    }

    const data = await res.json();

    console.log(
      `🍽️ Overpass retornou ${data.elements?.length || 0} elementos`
    );

    if (!data.elements || data.elements.length === 0) {
      if (raioMetros < 5000) {
        console.log("🍽️ Expandindo busca para 5km...");
        return buscarRestaurantes(origem, limit, 5000);
      }
      return [];
    }

    const restaurantes = data.elements
      .map((el) => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;

        if (!lat || !lon) return null;

        const nome = el.tags?.name || el.tags?.["name:pt"] || null;
        if (!nome) return null;

        const culinaria = el.tags?.cuisine || "";

        // Monta endereço APENAS a partir das tags OSM (dados confiáveis)
        const rua = el.tags?.["addr:street"] || "";
        const numero = el.tags?.["addr:housenumber"] || "";
        const bairro =
          el.tags?.["addr:suburb"] ||
          el.tags?.["addr:neighbourhood"] ||
          "";
        const cidade = el.tags?.["addr:city"] || "";

        const partesEndereco = [
          rua && numero ? `${rua}, ${numero}` : rua || "",
          bairro,
          cidade,
        ].filter(Boolean);

        const endereco = partesEndereco.join(" - ") || "";

        const distanciaKm = Number(
          calculateDistance(origem.lat, origem.lon, lat, lon).toFixed(1)
        );

        // Link direto para o Google Maps com as coordenadas
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

        return {
          nome,
          culinaria,
          endereco,
          lat,
          lon,
          distanciaKm,
          googleMapsUrl,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distanciaKm - b.distanciaKm)
      .slice(0, limit);

    console.log("🍽️ Restaurantes mais próximos:", restaurantes);
    return restaurantes;
  } catch (err) {
    console.error("❌ Erro buscarRestaurantes:", err);
    return [];
  }
}

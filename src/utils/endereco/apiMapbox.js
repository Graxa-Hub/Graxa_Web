// src/utils/endereco/apiMapbox.js

const MAPBOX_TOKEN = "pk.eyJ1IjoiZ2FicmllbHNvdXNhLXNwdGVjaCIsImEiOiJjbWZ5N2ZzaGwwaHp2MmpwemFtczJib3YzIn0.opNfyOXGWBuKl1R4iJiSOQ";

export async function buscarEnderecoLivre(endereco) {
  const texto =
    typeof endereco === "string"
      ? endereco.trim()
      : endereco?.enderecoCompleto ||
        endereco?.logradouro ||
        endereco?.localidade ||
        "";

  if (!texto || texto.length < 3) {
    throw new Error("Endereço muito curto.");
  }

  // Força Mapbox a entender que é Brasil
  const query = `${texto}, Brasil`;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&limit=1&language=pt`;

  const response = await fetch(url);
  const data = await response.json();

  // SE NÃO ACHOU → NÃO QUEBRA
  if (!data.features || data.features.length === 0) {
    return {
      sucesso: false,
      erro: "Endereço não encontrado",
    };
  }

  const f = data.features[0];

  return {
    sucesso: true,
    enderecoCompleto: f.place_name,
    cidade: f.context?.find((c) => c.id.startsWith("place"))?.text || "",
    uf: f.context?.find((c) => c.id.startsWith("region"))?.short_code?.replace("BR-", "") || "",
    enderecoParaBusca: query,
    coords: {
      lat: f.center[1],
      lon: f.center[0],
    },
  };
}


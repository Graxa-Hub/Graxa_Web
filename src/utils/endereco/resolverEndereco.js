import { buscarCep, isCep } from "./apiViaCep";
import { buscarEnderecoLivre } from "./apiMapbox";
import { getCoordinates } from "./geoUtils";

export async function resolverEndereco(input = "") {
  const texto = input.trim();

  try {
    let base;

    if (isCep(texto)) {
      base = await buscarCep(texto);

      // CEP não tem coordenadas → precisa do Mapbox
      const coords = await getCoordinates(base.enderecoParaBusca);
      base.coords = coords;

    } else {
      base = await buscarEnderecoLivre(texto);

      // Endereço livre pode ou não ter coords
      if (!base.sucesso) {
        throw new Error("Endereço não encontrado pelo Mapbox.");
      }

      // SE coords JÁ vieram → não chama getCoordinates de novo
      if (!base.coords) {
        const coords = await getCoordinates(base.enderecoCompleto);
        base.coords = coords;
      }
    }

    return {
      sucesso: true,
      ...base,
    };

  } catch (err) {
    console.error("Erro resolverEndereco():", err);
    return {
      sucesso: false,
      erro: err.message || "Não foi possível resolver o endereço",
    };
  }
}

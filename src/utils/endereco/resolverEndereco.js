import { buscarCep, isCep } from "./apiViaCep";
import { buscarEnderecoLivre } from "./apiMapbox";
import { getCoordinates } from "./geoUtils";

function montarQueryDeObjeto(endereco) {
  const partes = [];
  if (endereco.logradouro) partes.push(endereco.logradouro);
  if (endereco.numero) partes.push(endereco.numero);
  if (endereco.bairro) partes.push(endereco.bairro);
  if (endereco.cidade) partes.push(endereco.cidade);
  if (endereco.estado) partes.push(endereco.estado);
  return partes.join(", ");
}

export async function resolverEndereco(input = "") {
  const isObjeto = typeof input === "object" && input !== null;

  try {
    let base;

    // 1. Tentativa via CEP
    const cepCandidate = isObjeto ? (input.cep || "") : input;
    if (isCep(cepCandidate)) {
      base = await buscarCep(cepCandidate);

      const queryCoords = isObjeto && (input.cidade || input.estado)
        ? `${base.logradouro || ""}, ${input.cidade || base.cidade}, ${input.estado || base.uf}, Brasil`.replace(/^,\s*/, "")
        : base.enderecoParaBusca;

      const coords = await getCoordinates(queryCoords);
      base.coords = coords;
      return { sucesso: true, ...base };
    }

    // 2. Busca por texto livre com query rica
    let query;
    if (isObjeto) {
      query = montarQueryDeObjeto(input);
    } else {
      query = String(input).trim();
    }

    if (!query || query.length < 3) {
      throw new Error("Endereço muito curto ou inválido.");
    }

    base = await buscarEnderecoLivre(query);

    // 3. Fallback: só cidade + estado
    if (!base.sucesso && isObjeto && (input.cidade || input.estado)) {
      const queryFallback = [input.cidade, input.estado].filter(Boolean).join(" - ");
      base = await buscarEnderecoLivre(queryFallback);
    }

    if (!base.sucesso) {
      throw new Error(
        base.erro || "Endereço não encontrado. Tente incluir cidade e estado."
      );
    }

    if (!base.coords) {
      const coords = await getCoordinates(base.enderecoCompleto);
      base.coords = coords;
    }

    return { sucesso: true, ...base };

  } catch (err) {
    console.error("Erro resolverEndereco():", err);
    return {
      sucesso: false,
      erro: err.message || "Não foi possível resolver o endereço",
    };
  }
}

import React, { useState } from "react";
import { resolverEndereco } from "../../utils/endereco/resolverEndereco";
import { buscarAeroportoMaisProximo } from "../../utils/endereco/apiAeroporto";
import { buscarRestaurantes } from "../../utils/endereco/apiRestaurantes";

const Etapa3Local = ({ localShow, setLocalShow }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleBuscarLocal = async () => {
    if (!localShow.endereco || localShow.endereco.length < 3) {
      setErro("Digite um endereço ou CEP válido.");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      // 1) Resolver (CEP ou Endereço)
      const resolved = await resolverEndereco(localShow.endereco);
      if (!resolved.sucesso) {
        setErro(resolved.erro);
        setLoading(false);
        return;
      }

      // 2) Aeroporto mais próximo
      const aeroporto = await buscarAeroportoMaisProximo(resolved.coords);

      // 3) Restaurantes próximos (top 3)
      const restaurantes = await buscarRestaurantes(resolved.coords);

      // 4) Atualizar estado do local do show
      setLocalShow({
      ...localShow,
      endereco: resolved.enderecoCompleto,
      cidade: resolved.cidade,
      uf: resolved.uf,
      coordsLocal: resolved.coords,
      aeroportoProximo: aeroporto.aeroporto,  
      restaurantesProximos: restaurantes,
    });

    } catch (e) {
      console.error(e);
      setErro("Erro ao buscar dados do local.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Local do Evento</h2>

      <div className="bg-white shadow p-6 rounded-lg space-y-4">

        {/* ENDEREÇO */}
        <div>
          <label className="text-sm">CEP ou Endereço Completo</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            placeholder="Ex: 09320770 ou Av. Paulista, São Paulo"
            value={localShow.endereco || ""}
            onChange={(e) =>
              setLocalShow({ ...localShow, endereco: e.target.value })
            }
          />
        </div>

        {erro && (
          <p className="text-red-500 text-sm mt-2">{erro}</p>
        )}

        <button
          onClick={handleBuscarLocal}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Buscando..." : "Confirmar Local"}
        </button>

        {/* RESULTADOS */}
        {localShow.coordsLocal && (
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="font-semibold mb-3">Informações encontradas</h3>

            <p><strong>Cidade:</strong> {localShow.cidade}</p>
            <p><strong>UF:</strong> {localShow.uf}</p>

            <p className="mt-4 font-semibold">Aeroporto mais próximo:</p>
            <p>{localShow.aeroportoProximo?.nome}</p>
            <p>{localShow.aeroportoProximo?.distanciaKm} km</p>

            <p className="mt-4 font-semibold">Restaurantes próximos:</p>
            <ul className="list-disc ml-6 text-sm">
              {localShow.restaurantesProximos?.map((r, i) => (
                <li key={i}>
                  {r.nome} — {r.distanciaKm} km
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Etapa3Local;

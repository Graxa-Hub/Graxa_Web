import React, { useEffect, useState } from "react";
import { useLocais } from "../../hooks/useLocais";
import { resolverEndereco } from "../../utils/endereco/resolverEndereco";
import { buscarAeroportoMaisProximo } from "../../utils/endereco/apiAeroporto";
import { buscarRestaurantes } from "../../utils/endereco/apiRestaurantes";
import { LocalCombobox } from "./LocalCombobox"; // ✅ Importa o componente

const Etapa3Local = ({ localInicial }) => {
  const { locais, listarLocais } = useLocais();
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Carrega locais ao montar
  useEffect(() => {
    listarLocais();
  }, [listarLocais]);

  // Seleciona automaticamente o local do show se vier preenchido
  useEffect(() => {
    if (localInicial && localInicial.id) {
      setLocalSelecionado(localInicial);
    } else if (!localSelecionado && locais.length > 0) {
      setLocalSelecionado(locais[0]);
    }
  }, [localInicial, locais]);

  // Atualiza local selecionado ao mudar ComboBox
  const handleChange = (selectedId) => {
    const selected = locais.find((l) => l.id === selectedId);
    setLocalSelecionado(selected || null);
    setErro("");
  };

  // Adiciona novo local à lista e seleciona
  const handleNovoLocal = (novoLocal) => {
    locais.push(novoLocal);
    setLocalSelecionado(novoLocal);
  };

  // Busca aeroporto/restaurantes próximos automaticamente ao mudar localSelecionado
  useEffect(() => {
    const buscarDadosLocal = async () => {
      if (!localSelecionado?.endereco?.cep && !localSelecionado?.endereco?.logradouro) {
        setErro("Digite um endereço ou CEP válido.");
        return;
      }

      setErro("");
      setLoading(true);

      try {
        // 1) Resolver endereço
        const enderecoBusca = localSelecionado.endereco.cep || localSelecionado.endereco.logradouro;
        const resolved = await resolverEndereco(enderecoBusca);
        if (!resolved.sucesso) {
          setErro(resolved.erro);
          setLoading(false);
          return;
        }

        // 2) Aeroporto mais próximo
        const aeroporto = await buscarAeroportoMaisProximo(resolved.coords);

        // 3) Restaurantes próximos
        const restaurantes = await buscarRestaurantes(resolved.coords);

        // 4) Atualiza local selecionado com infos extras
        setLocalSelecionado((prev) => ({
          ...prev,
          coordsLocal: resolved.coords,
          cidade: resolved.cidade,
          uf: resolved.uf,
          aeroportoProximo: aeroporto.aeroporto,
          restaurantesProximos: restaurantes,
        }));
      } catch (e) {
        console.error(e);
        setErro("Erro ao buscar dados do local.");
      }

      setLoading(false);
    };

    if (localSelecionado) {
      buscarDadosLocal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSelecionado?.id]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800">Local do Evento</h2>

      {/* ComboBox para selecionar local */}
      <LocalCombobox
        locais={locais}
        value={localSelecionado?.id || ""}
        onChange={handleChange}
        onNovoLocal={handleNovoLocal}
      />

      {/* Card com dados do local selecionado */}
      {localSelecionado && (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-100 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {localSelecionado.nome}
          </h3>
          <div className="text-gray-700 text-sm mb-1">
            <strong>Endereço:</strong>{" "}
            {localSelecionado.endereco?.logradouro}, {localSelecionado.endereco?.numero} -{" "}
            {localSelecionado.endereco?.bairro}
          </div>
          <div className="text-gray-700 text-sm mb-1">
            <strong>Cidade:</strong> {localSelecionado.endereco?.cidade} /{" "}
            {localSelecionado.endereco?.estado}
          </div>
          <div className="text-gray-700 text-sm mb-1">
            <strong>CEP:</strong> {localSelecionado.endereco?.cep}
          </div>
          <div className="text-gray-700 text-sm mb-1">
            <strong>Capacidade:</strong> {localSelecionado.capacidade}
          </div>

          {loading && (
            <p className="text-green-600 text-sm mt-2">Buscando informações...</p>
          )}
          {erro && (
            <p className="text-red-500 text-sm mt-2">{erro}</p>
          )}

          {/* RESULTADOS */}
          {localSelecionado.coordsLocal && (
            <div className="bg-gray-50 p-4 rounded-xl mt-6 border border-gray-200">
              <h3 className="font-bold mb-3 text-gray-700">Informações encontradas</h3>
              <p className="text-gray-600"><strong>Cidade:</strong> {localSelecionado.cidade}</p>
              <p className="text-gray-600"><strong>UF:</strong> {localSelecionado.uf}</p>
              <p className="mt-4 font-bold text-gray-700">Aeroporto mais próximo:</p>
              <p className="text-gray-600">{localSelecionado.aeroportoProximo?.nome}</p>
              <p className="text-gray-600">{localSelecionado.aeroportoProximo?.distanciaKm} km</p>
              <p className="mt-4 font-bold text-gray-700">Restaurantes próximos:</p>
              <ul className="list-disc ml-6 text-sm text-gray-600">
                {localSelecionado.restaurantesProximos?.map((r, i) => (
                  <li key={i}>
                    {r.nome} — {r.distanciaKm} km
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Etapa3Local;
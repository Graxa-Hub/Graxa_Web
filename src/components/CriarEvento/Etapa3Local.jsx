import React, { useEffect, useState } from "react";
import { useLocais } from "../../hooks/useLocais";
import { resolverEndereco } from "../../utils/endereco/resolverEndereco";
import { buscarAeroportoMaisProximo } from "../../utils/endereco/apiAeroporto";
import { buscarRestaurantes } from "../../utils/endereco/apiRestaurantes";
import { LocalCombobox } from "./LocalCombobox";
import { useLocalSelecionado } from "../../context/LocalSelecionadoContext";

const Etapa3Local = ({ localInicial, setLocalShow }) => {
  const { locais, listarLocais } = useLocais();
  const { localSelecionado, setLocalSelecionado } = useLocalSelecionado();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Carrega lista de locais
  useEffect(() => {
    listarLocais();
  }, [listarLocais]);

  // Sempre que o localSelecionado mudar → Atualiza CriarEvento
  useEffect(() => {
    if (localSelecionado) {
      setLocalShow(localSelecionado);
    }
  }, [localSelecionado, setLocalShow]);

  // Inicializa local baseado no que veio do backend
  useEffect(() => {
    if (!localSelecionado && localInicial && locais.length > 0) {

      const localDoShow = locais.find((l) => l.id === localInicial.id);

      if (localDoShow) {
        setLocalSelecionado(localDoShow);
      } else {
        // Normaliza formato do backend → usado no combobox
        setLocalSelecionado({
          ...localInicial,
          endereco: localInicial.endereco || {},
        });
      }

    } else if (!localSelecionado && locais.length > 0) {
      setLocalSelecionado(locais[0]);
    }
  }, [localInicial, locais, localSelecionado, setLocalSelecionado]);

  // Busca informações para o local (CEP, aeroporto, restaurantes)
  useEffect(() => {
    async function buscarDadosLocal() {
      if (!localSelecionado?.endereco?.cep &&
          !localSelecionado?.endereco?.logradouro) {
        setErro("Digite um endereço ou CEP válido.");
        return;
      }

      setErro("");
      setLoading(true);

      try {
        const enderecoBusca = localSelecionado.endereco.cep ||
                              localSelecionado.endereco.logradouro;

        const resolved = await resolverEndereco(enderecoBusca);

        if (!resolved.sucesso) {
          setErro(resolved.erro);
          setLoading(false);
          return;
        }

        const aeroporto = await buscarAeroportoMaisProximo(resolved.coords);
        const restaurantes = await buscarRestaurantes(resolved.coords);

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
    }

    if (localSelecionado?.id) {
      buscarDadosLocal();
    }
  }, [localSelecionado?.id]);

  const handleChange = (selectedId) => {
    const local = locais.find((l) => l.id === selectedId);
    setLocalSelecionado(local || null);
    setErro("");
  };

  const handleNovoLocal = (novoLocal) => {
    locais.push(novoLocal);
    setLocalSelecionado(novoLocal);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800">Local do Evento</h2>

      <LocalCombobox
        locais={locais}
        value={localSelecionado?.id || ""}
        onChange={handleChange}
        onNovoLocal={handleNovoLocal}
      />

      {localSelecionado && (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-100 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {localSelecionado.nome}
          </h3>

          <div className="text-gray-700 text-sm mb-1">
            <strong>Endereço:</strong>{" "}
            {localSelecionado.endereco?.logradouro},{" "}
            {localSelecionado.endereco?.numero} -{" "}
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
            <p className="text-green-600 text-sm mt-2">
              Buscando informações...
            </p>
          )}

          {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}

          {localSelecionado.coordsLocal && (
            <div className="bg-gray-50 p-4 rounded-xl mt-6 border border-gray-200">
              <h3 className="font-bold mb-3 text-gray-700">
                Informações encontradas
              </h3>

              <p className="text-gray-600">
                <strong>Cidade:</strong> {localSelecionado.cidade}
              </p>

              <p className="text-gray-600">
                <strong>UF:</strong> {localSelecionado.uf}
              </p>

              <p className="mt-4 font-bold text-gray-700">
                Aeroporto mais próximo:
              </p>

              <p className="text-gray-600">
                {localSelecionado.aeroportoProximo?.nome}
              </p>

              <p className="text-gray-600">
                {localSelecionado.aeroportoProximo?.distanciaKm} km
              </p>

              <p className="mt-4 font-bold text-gray-700">
                Restaurantes próximos:
              </p>

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
import React, { useEffect, useState } from "react";
import { MapPin, Plane, UtensilsCrossed, Building2, Info } from "lucide-react";
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

  // Carrega lista de locais (uma vez)
  useEffect(() => {
    listarLocais();
  }, []); // ❌ REMOVEU listarLocais da dependency

  // Sempre que o localSelecionado mudar → Atualiza CriarEvento
  useEffect(() => {
    if (localSelecionado) {
      setLocalShow(localSelecionado);
    }
  }, [localSelecionado, setLocalShow]);

  // Inicializa local baseado no que veio do backend
  useEffect(() => {
    if (locais.length === 0) return;

    // ✅ VERIFICAÇÃO CORRIGIDA: se localInicial tem ID (não é vazio)
    if (localInicial?.id && !localSelecionado) {
      const localDoShow = locais.find((l) => l.id === localInicial.id);

      if (localDoShow) {
        setLocalSelecionado(localDoShow);
      } else {
        setLocalSelecionado({
          ...localInicial,
          endereco: localInicial.endereco || {},
        });
      }
    } else if (!localSelecionado && locais.length > 0) {
      // Se nenhum localInicial válido, seleciona o primeiro
      setLocalSelecionado(locais[0]);
    }
  }, [localInicial, locais, localSelecionado, setLocalSelecionado]); // ✅ ADICIONOU localSelecionado aqui

  // Busca informações para o local
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
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Local do Evento
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Selecione ou cadastre o local onde o evento acontecerá
        </p>
      </div>

      {/* Combobox de Seleção */}
      <LocalCombobox
        locais={locais}
        value={localSelecionado?.id || ""}
        onChange={handleChange}
        onNovoLocal={handleNovoLocal}
      />

      {/* Card de Detalhes do Local */}
      {localSelecionado && (
        <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header do Card */}
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {localSelecionado.nome}
            </h3>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6 space-y-4">
            {/* Endereço */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Endereço</p>
                <p className="text-sm text-gray-600">
                  {localSelecionado.endereco?.logradouro}, {localSelecionado.endereco?.numero}
                  {localSelecionado.endereco?.complemento && ` - ${localSelecionado.endereco.complemento}`}
                </p>
                <p className="text-sm text-gray-600">
                  {localSelecionado.endereco?.bairro} - {localSelecionado.endereco?.cidade}/{localSelecionado.endereco?.estado}
                </p>
                <p className="text-sm text-gray-500">CEP: {localSelecionado.endereco?.cep}</p>
              </div>
            </div>

            {/* Capacidade */}
            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
              <Info className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Capacidade</p>
                <p className="text-lg font-bold text-blue-600">{localSelecionado.capacidade} pessoas</p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Buscando informações adicionais...</p>
              </div>
            )}

            {/* Error State */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            {/* Informações Adicionais */}
            {localSelecionado.coordsLocal && (
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 space-y-4 mt-4">
                <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Informações Adicionais
                </h4>

                {/* Localização */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Cidade</p>
                    <p className="text-sm text-gray-800 font-medium">{localSelecionado.cidade}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Estado</p>
                    <p className="text-sm text-gray-800 font-medium">{localSelecionado.uf}</p>
                  </div>
                </div>

                {/* Aeroporto Próximo */}
                {localSelecionado.aeroportoProximo && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <p className="font-semibold text-gray-800">Aeroporto Mais Próximo</p>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {localSelecionado.aeroportoProximo.nome}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Distância: <span className="font-semibold text-blue-600">{localSelecionado.aeroportoProximo.distanciaKm} km</span>
                    </p>
                  </div>
                )}

                {/* Restaurantes Próximos */}
                {localSelecionado.restaurantesProximos?.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      <p className="font-semibold text-gray-800">Restaurantes Próximos</p>
                    </div>
                    <ul className="space-y-2">
                      {localSelecionado.restaurantesProximos.map((r, i) => (
                        <li key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700 font-medium">{r.nome}</span>
                          <span className="text-xs text-orange-600 font-semibold">{r.distanciaKm} km</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Etapa3Local;
import React, { useEffect, useState } from "react";
import { MapPin, Plane, UtensilsCrossed, Building2, Info } from "lucide-react";
import { useParams } from "react-router-dom";
import { useLocais } from "../../../../hooks/useLocais";
import { useShows } from "../../../../hooks/useShows";
import { useViagens } from "../../../../hooks/useViagens";
import { resolverEndereco } from "../../../../utils/endereco/resolverEndereco";
import { buscarAeroportoMaisProximo } from "../../../../utils/endereco/apiAeroporto";
import { buscarRestaurantes } from "../../../../utils/endereco/apiRestaurantes";
import { LocalCombobox } from "./LocalCombobox";
import { useLocalSelecionado } from "../../../../context/LocalSelecionadoContext";
import { useToast } from "../../../../hooks/useToast";
import { cn, sectionHeader, sectionSubtitle, sectionTitle, surfaceCard, surfaceCardMuted } from "./uiStyles";

const Etapa3Local = ({ localInicial, setLocalShow }) => {
  const { locais, listarLocais } = useLocais();
  const { localSelecionado, setLocalSelecionado } = useLocalSelecionado();
  const { buscarShow, atualizarShow } = useShows();
  const { buscarViagem, atualizarViagem } = useViagens();
  const { tipoEvento, eventoId } = useParams();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [eventoAtual, setEventoAtual] = useState(null);

  // Carrega lista de locais (uma vez)
  useEffect(() => {
    listarLocais();
  }, [listarLocais]);

  // Carrega dados do evento
  useEffect(() => {
    const carregarEvento = async () => {
      if (!eventoId || !tipoEvento) return;

      try {
        if (tipoEvento === "show") {
          const show = await buscarShow(eventoId);
          setEventoAtual(show);
        } else if (tipoEvento === "viagem") {
          const viagem = await buscarViagem(eventoId);
          setEventoAtual(viagem);
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
      }
    };

    carregarEvento();
  }, [eventoId, tipoEvento, buscarShow, buscarViagem]);

  // Sempre que o localSelecionado mudar → Atualiza CriarEvento
  useEffect(() => {
    if (localSelecionado) {
      setLocalShow(localSelecionado);
    }
  }, [localSelecionado, setLocalShow]);

  // Inicializa local baseado no que veio do backend
  useEffect(() => {
    if (locais.length === 0) return;

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
      setLocalSelecionado(locais[0]);
    }
  }, [localInicial, locais, localSelecionado, setLocalSelecionado]);

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
  }, [localSelecionado?.id, setLocalSelecionado]);

  const handleChange = async (selectedId) => {
    const local = locais.find((l) => l.id === Number(selectedId));
    
    if (!local) {
      setErro("Local não encontrado");
      return;
    }

    setLocalSelecionado(local);
    setErro("");

    // Atualizar no banco imediatamente
    if (eventoId && eventoAtual) {
      try {
        setLoading(true);

        const payload = {
          nomeEvento: eventoAtual.nomeEvento,
          dataInicio: eventoAtual.dataInicio,
          dataFim: eventoAtual.dataFim,
          descricao: eventoAtual.descricao || "",
          localId: Number(local.id),
        };

        if (tipoEvento === "show") {
          payload.turneId = eventoAtual.turne?.id || null;
          payload.responsavelId = eventoAtual.responsavelEvento?.id;
          await atualizarShow(eventoId, payload);
        } else if (tipoEvento === "viagem") {
          await atualizarViagem(eventoId, payload);
        }

        showSuccess("Local atualizado com sucesso!");
        setEventoAtual(prev => ({ ...prev, local }));
      } catch (error) {
        console.error("Erro ao atualizar local:", error);
        showError("Erro ao atualizar o local do evento");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNovoLocal = async (novoLocal) => {
    // Recarrega a lista atualizada
    await listarLocais();
    setLocalSelecionado(novoLocal);

    // Atualiza no banco se já existe um evento
    if (eventoId && eventoAtual) {
      try {
        setLoading(true);

        const payload = {
          nomeEvento: eventoAtual.nomeEvento,
          dataInicio: eventoAtual.dataInicio,
          dataFim: eventoAtual.dataFim,
          descricao: eventoAtual.descricao || "",
          localId: Number(novoLocal.id),
        };

        if (tipoEvento === "show") {
          payload.turneId = eventoAtual.turne?.id || null;
          payload.responsavelId = eventoAtual.responsavelEvento?.id;
          await atualizarShow(eventoId, payload);
        } else if (tipoEvento === "viagem") {
          await atualizarViagem(eventoId, payload);
        }

        showSuccess("Novo local criado e vinculado ao evento!");
        setEventoAtual(prev => ({ ...prev, local: novoLocal }));
      } catch (error) {
        console.error("Erro ao vincular novo local:", error);
        showError("Local criado, mas erro ao vincular ao evento");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className={sectionHeader}>
        <h2 className={cn(sectionTitle, "flex items-center gap-3")}>
          <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-600"><MapPin className="h-5 w-5" /></span>
          Local do Evento
        </h2>
        <p className={sectionSubtitle}>
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
        <div className={cn(surfaceCard, "overflow-hidden")}>
          {/* Header do Card */}
          <div className="border-b border-slate-200 bg-slate-950 px-6 py-5">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
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
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <Info className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Capacidade</p>
                <p className="text-lg font-semibold text-emerald-600">{localSelecionado.capacidade} pessoas</p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Processando...</p>
              </div>
            )}

            {/* Error State */}
            {erro && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {erro}
              </div>
            )}

            {/* Informações Adicionais */}
            {localSelecionado.coordsLocal && (
              <div className={cn(surfaceCardMuted, "mt-4 space-y-4 p-5")}>
                <h4 className="flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-semibold text-slate-900">
                  <Info className="h-5 w-5 text-emerald-600" />
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
                  <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="h-5 w-5 text-sky-600" />
                      <p className="font-semibold text-gray-800">Aeroporto Mais Próximo</p>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      {localSelecionado.aeroportoProximo.nome}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Distância: <span className="font-semibold text-sky-600">{localSelecionado.aeroportoProximo.distanciaKm} km</span>
                    </p>
                  </div>
                )}

                {/* Restaurantes Próximos */}
                {localSelecionado.restaurantesProximos?.length > 0 && (
                  <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      <p className="font-semibold text-gray-800">Restaurantes Próximos</p>
                    </div>
                    <ul className="space-y-2">
                      {localSelecionado.restaurantesProximos.map((r, i) => (
                        <li key={i} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm">
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
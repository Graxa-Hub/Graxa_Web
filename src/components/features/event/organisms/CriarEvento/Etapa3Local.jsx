import React, { useEffect, useState } from "react";
import { MapPin, Plane, UtensilsCrossed, Building2, Info } from "lucide-react";
import { useParams } from "react-router-dom";
import { useLocais } from "../../../../../hooks/useLocais";
import { useShows } from "../../../../../hooks/useShows";
import { useViagens } from "../../../../../hooks/useViagens";
import { resolverEndereco } from "../../../../../utils/endereco/resolverEndereco";
import { buscarAeroportoMaisProximo } from "../../../../../utils/endereco/apiAeroporto";
import { buscarRestaurantes } from "../../../../../utils/endereco/apiRestaurantes";
import { LocalCombobox } from "./LocalCombobox";
import { useLocalSelecionado } from "../../../../../context/LocalSelecionadoContext";
import { useToast } from "../../../../../hooks/useToast";

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
      if (
        !localSelecionado?.endereco?.cep &&
        !localSelecionado?.endereco?.logradouro
      ) {
        setErro("Digite um endereço ou CEP válido.");
        return;
      }

      setErro("");
      setLoading(true);

      try {
        const enderecoBusca =
          localSelecionado.endereco.cep || localSelecionado.endereco.logradouro;

        const resolved = await resolverEndereco(enderecoBusca);

        if (!resolved.sucesso) {
          setErro(resolved.erro);
          setLoading(false);
          return;
        }

        const aeroporto = await buscarAeroportoMaisProximo(resolved.coords);
        const restaurantes = await buscarRestaurantes(resolved.coords, 5);
        console.log("🍽️ Restaurantes encontrados:", restaurantes);

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
        setEventoAtual((prev) => ({ ...prev, local }));
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
        setEventoAtual((prev) => ({ ...prev, local: novoLocal }));
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
      <div className="border-b border-[var(--border)] pb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[var(--info)]" />
          Local do Evento
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
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
        <div className="bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
          {/* Header do Card */}
          <div className="bg-[var(--surface-hover)] px-6 py-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {localSelecionado.nome}
            </h3>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6 space-y-4">
            {/* Endereço */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--info)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Endereço
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {localSelecionado.endereco?.logradouro},{" "}
                  {localSelecionado.endereco?.numero}
                  {localSelecionado.endereco?.complemento &&
                    ` - ${localSelecionado.endereco.complemento}`}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {localSelecionado.endereco?.bairro} -{" "}
                  {localSelecionado.endereco?.cidade}/
                  {localSelecionado.endereco?.estado}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  CEP: {localSelecionado.endereco?.cep}
                </p>
              </div>
            </div>

            {/* Capacidade */}
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-[var(--radius-md)]">
              <Info className="w-5 h-5 text-[var(--info)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Capacidade
                </p>
                <p className="text-lg font-bold text-[var(--info)]">
                  {localSelecionado.capacidade} pessoas
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center gap-2 text-[var(--info)] bg-[var(--surface)] p-3 rounded-[var(--radius-md)]">
                <div className="w-4 h-4 border-2 border-[var(--info)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Processando...</p>
              </div>
            )}

            {/* Error State */}
            {erro && (
              <div className="bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] px-4 py-3 rounded-[var(--radius-md)] text-sm">
                {erro}
              </div>
            )}

            {/* Informações Adicionais */}
            {localSelecionado.coordsLocal && (
              <div className="bg-[var(--surface)] p-5 rounded-[var(--radius-lg)] border border-[var(--border)] space-y-4 mt-4">
                <h4 className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2 border-b border-[var(--border)] pb-2">
                  <Info className="w-5 h-5 text-[var(--info)]" />
                  Informações Adicionais
                </h4>

                {/* Localização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                      Cidade
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      {localSelecionado.cidade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                      Estado
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      {localSelecionado.uf}
                    </p>
                  </div>
                </div>

                {/* Aeroporto Próximo */}
                {localSelecionado.aeroportoProximo && (
                  <div className="bg-[var(--surface-elevated)] p-4 rounded-[var(--radius-md)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-[var(--info)]" />
                      <p className="font-semibold text-[var(--text-primary)]">
                        Aeroporto Mais Próximo
                      </p>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] font-medium">
                      {localSelecionado.aeroportoProximo.nome}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Distância:{" "}
                      <span className="font-semibold text-[var(--info)]">
                        {localSelecionado.aeroportoProximo.distanciaKm} km
                      </span>
                    </p>
                  </div>
                )}

                {/* Restaurantes Próximos */}
                {localSelecionado.restaurantesProximos?.length > 0 && (
                  <div className="bg-[var(--surface-elevated)] p-4 rounded-[var(--radius-md)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <UtensilsCrossed className="w-5 h-5 text-[var(--warning)]" />
                      <p className="font-semibold text-[var(--text-primary)]">
                        Restaurantes Próximos
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {localSelecionado.restaurantesProximos.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm bg-[var(--surface)] p-2 rounded"
                        >
                          <span className="text-[var(--text-secondary)] font-medium">
                            {r.nome}
                          </span>
                          <span className="text-xs text-[var(--warning)] font-semibold">
                            {r.distanciaKm} km
                          </span>
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

      {/* Card de Restaurantes Próximos */}
      {localSelecionado && (
        <div className="bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--surface-hover)] px-6 py-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[var(--warning)]" />
              Restaurantes Próximos
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Restaurantes encontrados próximos ao local do evento
            </p>
          </div>

          {/* Lista */}
          <div className="p-6">
            {localSelecionado.restaurantesProximos?.length > 0 ? (
              <ul className="space-y-3">
                {localSelecionado.restaurantesProximos.slice(0, 5).map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-[var(--surface)] p-3 rounded-[var(--radius-md)] border border-[var(--border)] hover:border-[var(--warning)] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-lg flex-shrink-0">🍽️</span>
                      <div className="min-w-0">
                        <p className="text-sm text-[var(--text-primary)] font-medium truncate flex items-center gap-2">
                          {r.nome}
                          {r.culinaria && (
                            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--surface-hover)] px-2 py-0.5 rounded-full font-normal">
                              {r.culinaria}
                            </span>
                          )}
                        </p>
                        {r.endereco ? (
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            📍 {r.endereco}
                          </p>
                        ) : (
                          <a
                            href={r.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--info)] hover:underline"
                          >
                            📍 Ver localização no mapa
                          </a>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[var(--warning)] bg-[var(--surface-hover)] px-3 py-1 rounded-full whitespace-nowrap ml-2 flex-shrink-0">
                      {r.distanciaKm} km
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">
                {loading ? "Buscando restaurantes próximos..." : "Nenhum restaurante encontrado para este local."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Etapa3Local;

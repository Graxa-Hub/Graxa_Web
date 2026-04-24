import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../templates/Layout";
import Stepper from "../features/event/organisms/CriarEvento/Stepper";
import Etapa1Funcoes from "../features/event/organisms/CriarEvento/Etapa1Funcoes";
import Etapa2Logistica from "../features/event/organisms/CriarEvento/Etapa2Logistica";
import Etapa3Local from "../features/event/organisms/CriarEvento/Etapa3Local";
import Etapa4Agenda from "../features/event/organisms/CriarEvento/Etapa4Agenda";
import Etapa5Extras from "../features/event/organisms/CriarEvento/Etapa5Extras";
import { useShows } from "../../hooks/useShows";
import { useViagens } from "../../hooks/useViagens";
import SidebarDireita from "../features/event/organisms/CriarEvento/SidebarDireita";
import { LocalSelecionadoProvider } from "../../context/LocalSelecionadoContext";
import VisualizarAlocacoes from "../features/event/organisms/CriarEvento/VisualizarAlocacoes";
import { ConfirmModal } from "../molecules/ConfirmModal";
import { agendaEventoService } from "../../services/agendaEventoService";
import { useColaboradores } from "../../hooks/useColaboradores";
import { useToast } from "../../hooks/useToast";
import { logisticaService } from "../../services/logisticaService";
import {
  agruparHoteis,
  agruparVoos,
  agruparTransportes,
} from "../../utils/logistica/logisticaUtils";
import { useExtrasEvento } from "../../hooks/useExtrasEvento";
import useAlocacao from "../../hooks/useAlocacao";

export const CriarEvento = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [localShow, setLocalShow] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [transports, setTransports] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [extras, setExtras] = useState({});
  const { tipoEvento, eventoId } = useParams();
  const { buscarShow, atualizarShow } = useShows();
  const { buscarViagem, atualizarViagem } = useViagens();
  const [evento, setEvento] = useState(null);
  const showId = eventoId ? Number(eventoId) : null;
  const [hoteisRaw, setHoteisRaw] = useState([]);
  const [voosRaw, setVoosRaw] = useState([]);
  const [transportesRaw, setTransportesRaw] = useState([]);
  const { colaboradores: todosColaboradores, listarColaboradores } =
    useColaboradores();
  const {
    extras: extrasDB,
    listar: listarExtras,
    salvar: salvarExtras,
  } = useExtrasEvento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();
  const { listarPorShow } = useAlocacao();

  // Helper para normalizar/formatar datas para envio (ISO)
  const padDateForApi = (val) => {
    if (!val) return null;
    // se já contém segundos (ex: 2025-12-07T12:00:00) deixa
    return val.length === 16 ? `${val}:00` : val;
  };

  useEffect(() => {
    if (!showId) return;
    listarExtras(showId);
  }, [showId, listarExtras]);

  // Carrega alocações existentes no mount para popular a sidebar em todas as etapas
  useEffect(() => {
    async function carregarAlocacoesParaSidebar() {
      if (!showId) return;
      try {
        const alocacoes = await listarPorShow(Number(showId));
        const alocacoesPorTipo = {};
        const rolesComAlocacao = new Set();

        // Agrupar por colaborador e pegar apenas a mais recente
        const alocsMapPorColaborador = {};
        alocacoes.forEach((alocacao) => {
          const colabId = alocacao.colaborador?.id;
          if (!colabId) return;
          if (!alocsMapPorColaborador[colabId]) {
            alocsMapPorColaborador[colabId] = alocacao;
          } else {
            const dataAtual = new Date(alocacao.dataHoraCriacao);
            const dataSalva = new Date(alocsMapPorColaborador[colabId].dataHoraCriacao);
            if (dataAtual > dataSalva) {
              alocsMapPorColaborador[colabId] = alocacao;
            }
          }
        });

        // Processar apenas as alocações mais recentes
        Object.values(alocsMapPorColaborador).forEach((alocacao) => {
          const statusUpper = alocacao.status?.toUpperCase();
          if (statusUpper === "CANCELADO" || statusUpper === "RECUSADO") return;

          const colaborador = alocacao.colaborador;
          if (colaborador) {
            const tipoUsuario = colaborador.tipoUsuario;
            if (!alocacoesPorTipo[tipoUsuario]) {
              alocacoesPorTipo[tipoUsuario] = [];
            }
            if (statusUpper === "PENDENTE" || statusUpper === "ACEITO") {
              alocacoesPorTipo[tipoUsuario].push(colaborador.id);
              rolesComAlocacao.add(tipoUsuario);
            }
          }
        });

        setAssignments(alocacoesPorTipo);
        setSelectedRoles((prev) => {
          const merged = new Set([...prev, ...rolesComAlocacao]);
          return Array.from(merged);
        });
      } catch (err) {
        console.error("[CriarEvento] Erro ao carregar alocações para sidebar:", err);
      }
    }

    carregarAlocacoesParaSidebar();
  }, [showId, listarPorShow]);

  // sempre sincroniza o extras local com o retorno do hook
  const { toasts, showSuccess, showError, showWarning, showInfo } = useToast();
  useEffect(() => {
    if (extrasDB) {
      setExtras(extrasDB);
    }
  }, [extrasDB]);

  // Carrega agenda existente do backend (para tipoEvento === "show")
  useEffect(() => {
    async function loadAgenda() {
      try {
        if (!eventoId || tipoEvento !== "show") return;

        const itens = await agendaEventoService.listarPorShow(eventoId);

        const normalizados = (itens || []).map((item) => ({
          // Mantém id (se houver) para update/remover posteriores
          id: item.id,
          ...item,
          // Garante enum em MAIÚSCULAS
          tipo: item.tipo ? String(item.tipo).toUpperCase() : "TECNICO",
          // Normaliza para format accepted pelo input datetime-local (YYYY-MM-DDTHH:mm)
          dataHoraInicio: item.dataHoraInicio
            ? String(item.dataHoraInicio).substring(0, 16)
            : "",
          dataHoraFim: item.dataHoraFim
            ? String(item.dataHoraFim).substring(0, 16)
            : "",
          origem: item.origem || "",
          destino: item.destino || "",
        }));

        setAgenda(normalizados);
      } catch (err) {
        console.error("Erro ao carregar agenda:", err);
        showError("Falha ao carregar agenda. Veja o console para detalhes.");
      }
    }

    loadAgenda();
  }, [eventoId, tipoEvento, showError]);

  // Carrega logística (hotéis / voos / transportes)
  useEffect(() => {
    const loadLogistica = async () => {
      try {
        if (!showId) return;

        const hoteis = await logisticaService.listarHoteis(showId);
        const voos = await logisticaService.listarVoos(showId);
        const transportes = await logisticaService.listarTransportes(showId);

        console.log("RAW LOGÍSTICA:", {
          hoteisRaw: hoteis,
          voosRaw: voos,
          transportesRaw: transportes,
        });

        setHoteisRaw(hoteis || []);
        setVoosRaw(voos || []);
        setTransportesRaw(transportes || []);

        // AJUSTE: mapeia os campos obrigatórios para garantir que sempre existam
        const mappedHotels = (hoteis || []).map((hotel) => ({
          ...hotel,
          nome: hotel.nome || hotel.nomeHotel || "Sem nome",
          hospedes:
            hotel.hospedes && hotel.hospedes.length > 0
              ? hotel.hospedes
              : hotel.colaboradorId
                ? [hotel.colaboradorId]
                : [],
        }));

        const mappedFlights = (voos || []).map((voo) => ({
          ...voo,
          cia: voo.cia || voo.ciaAerea || "Sem cia",
          numero: voo.numero || voo.codigoVoo || "Sem número",
          passageiros:
            voo.passageiros && voo.passageiros.length > 0
              ? voo.passageiros
              : voo.colaboradorId
                ? [voo.colaboradorId]
                : [],
        }));

        const mappedTransports = (transportes || []).map((transporte) => ({
          ...transporte,
          tipo: transporte.tipo || "Sem tipo",
          passageiros:
            transporte.passageiros && transporte.passageiros.length > 0
              ? transporte.passageiros
              : transporte.colaboradorId
                ? [transporte.colaboradorId]
                : [],
        }));

        setHotels(mappedHotels);
        setFlights(mappedFlights);
        setTransports(mappedTransports);
      } catch (err) {
        console.error("❌ Erro carregando logística:", err);
        showError("Erro ao carregar logística. Veja o console para detalhes.");
      }
    };

    loadLogistica();
  }, [eventoId, tipoEvento, showId, showError]);

  useEffect(() => {
    listarColaboradores();
  }, [listarColaboradores]);

  useEffect(() => {
    async function fetchEvento() {
      if (!eventoId || !tipoEvento) return;

      if (tipoEvento === "show") {
        const show = await buscarShow(eventoId);
        setEvento(show);
        if (show?.local) setLocalShow(show.local);
      }

      if (tipoEvento === "viagem") {
        const viagem = await buscarViagem(eventoId);
        setEvento(viagem);
        if (viagem?.local) setLocalShow(viagem.local);
      }
    }

    fetchEvento();
  }, [tipoEvento, eventoId, buscarShow, buscarViagem]);

  // Adicione um estado para os colaboradores aceitos
  const [colaboradoresAceitos, setColaboradoresAceitos] = useState([]);

  // Atualize a lista de aceitos sempre que evento ou assignments mudar
  useEffect(() => {
    // Só atualiza lista de aceitos se estiver na etapa de logística
    const isEtapaLogistica =
      (tipoEvento === "show" && etapaAtual === 3) ||
      (tipoEvento === "viagem" && etapaAtual === 1);

    if (!isEtapaLogistica) return;

    let colaboradoresEvento = [];
    if (evento?.alocacoes?.length) {
      const alocacoesPorColab = {};
      evento.alocacoes.forEach((a) => {
        const colabId = a.colaborador?.id;
        if (!colabId) return;
        if (!alocacoesPorColab[colabId]) alocacoesPorColab[colabId] = [];
        alocacoesPorColab[colabId].push(a);
      });
      Object.values(alocacoesPorColab).forEach((alocacoes) => {
        const ultima = alocacoes.sort((a, b) => (b.id || 0) - (a.id || 0))[0];
        const statusUpper = ultima?.status?.toUpperCase?.();
        if (
          ultima &&
          typeof ultima.status === "string" &&
          (statusUpper === "ACEITO" || statusUpper === "PENDENTE") &&
          ultima.colaborador
        ) {
          colaboradoresEvento.push(ultima.colaborador);
        }
      });
    }
    const colaboradoresSelecionadosIds = [
      ...new Set(
        Object.values(assignments || {})
          .flat()
          .map((id) => Number(id))
          .filter(Boolean),
      ),
    ];
    setColaboradoresAceitos(
      colaboradoresEvento.filter((c) =>
        colaboradoresSelecionadosIds.includes(c.id),
      ),
    );
  }, [evento, assignments, etapaAtual, tipoEvento]);

  // ===== salvarEventoCompleto (atualizado com lógica de update/create para logística) =====
  const salvarEventoCompleto = async () => {
    if (!showId) {
      showError("Show inválido. Salve/abra o show antes de finalizar.");
      return;
    }

    try {
      showInfo("Iniciando salvamento...");

      // ===== 1. ATUALIZAR LOCAL DO SHOW (se mudou) =====
      if (localShow?.id && localShow.id !== evento?.local?.id) {
        console.log("🔄 Atualizando local do show...");
        const showPayload = {
          nomeEvento: evento.nomeEvento,
          dataInicio: evento.dataInicio,
          dataFim: evento.dataFim,
          descricao: evento.descricao || "",
          turneId: evento.turne?.id || null,
          localId: localShow.id,
          responsavelId: evento.responsavelEvento?.id,
        };

        await atualizarShow(showId, showPayload);
        showSuccess("Local do show atualizado!");
      }

      // ===== 2. SALVAR LOGÍSTICA E AGENDA =====
      const alocadosSet = new Set();
      Object.values(assignments || {}).forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((id) => alocadosSet.add(id));
      });

      if (alocadosSet.size === 0) {
        showWarning(
          "Nenhum colaborador selecionado. Apenas o local foi atualizado.",
        );
        return;
      }

      const promessas = [];

      // ------ HOTÉIS: para cada hotel agrupado, tratamos cada hóspede individualmente
      hotels.forEach((hotel) => {
        (hotel.hospedes || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          // ENCONTRA TODOS OS REGISTROS DO COLABORADOR PARA ESSE HOTEL
          const rawMatches = (hoteisRaw || []).filter(
            (hr) =>
              hr.colaboradorId === colabId &&
              String(hr.nomeHotel || "").trim() ===
              String(hotel.nome || "").trim() &&
              String(hr.endereco || "").trim() ===
              String(hotel.endereco || "").trim(),
          );

          // Usa coordsHotel se disponível, senão latitude/longitude do hotel
          const latitude = hotel.coordsHotel?.lat ?? hotel.latitude ?? null;
          const longitude = hotel.coordsHotel?.lon ?? hotel.longitude ?? null;

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            nomeHotel: hotel.nome || null,
            endereco: hotel.endereco || null,
            latitude,
            longitude,
            distanciaPalcoKm: hotel.distanciaPalcoKm
              ? Number(hotel.distanciaPalcoKm)
              : null,
            distanciaAeroportoKm: hotel.distanciaAeroportoKm
              ? Number(hotel.distanciaAeroportoKm)
              : null,
            checkin: hotel.checkin ? padDateForApi(hotel.checkin) : null,
            checkout: hotel.checkout ? padDateForApi(hotel.checkout) : null,
          };

          if (rawMatches.length > 0) {
            // ATUALIZA TODOS OS REGISTROS ENCONTRADOS
            rawMatches.forEach((rawMatch) => {
              promessas.push(
                logisticaService.atualizarHotelEvento(rawMatch.id, dto),
              );
            });
          } else {
            // CRIA NOVO REGISTRO PARA ESSE COLABORADOR
            promessas.push(logisticaService.criarHotelEvento(dto));
          }
        });
      });

      // ------ TRANSPORTES
      transports.forEach((t) => {
        (t.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const rawMatch = (transportesRaw || []).find(
            (tr) =>
              tr.colaboradorId === colabId &&
              String(tr.tipo || "").trim() === String(t.tipo || "").trim() &&
              (tr.saida ? tr.saida.substring(0, 16) : "") ===
              (t.saida ? t.saida.substring(0, 16) : ""),
          );

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            tipo: t.tipo || null,
            saida: t.saida
              ? new Date(padDateForApi(t.saida)).toISOString()
              : null,
            destino: t.destino || null,
            motorista: t.responsavel || null,
            observacao: t.observacao || null,
          };

          if (rawMatch && rawMatch.id) {
            promessas.push(
              logisticaService.atualizarTransporteEvento(rawMatch.id, dto),
            );
          } else {
            promessas.push(logisticaService.criarTransporteEvento(dto));
          }
        });
      });

      // ===== AGENDA (mantive seu comportamento: atualiza se tiver id, cria se não)
      agenda.forEach((item, index) => {
        const padDate = (val) => {
          if (!val) return null;
          return val.length === 16 ? `${val}:00` : val;
        };

        const dto = {
          showId: Number(showId),
          titulo: item.titulo || "Evento",
          descricao: item.descricao || null,
          tipo: item.tipo ? String(item.tipo).toUpperCase() : "TECNICO",
          origem: item.origem || null,
          destino: item.destino || null,
          dataHoraInicio: padDate(item.dataHoraInicio),
          dataHoraFim: padDate(item.dataHoraFim),
          ordem: index + 1,
        };

        if (item.id) {
          promessas.push(agendaEventoService.atualizar(item.id, dto));
        } else {
          promessas.push(agendaEventoService.criar(dto));
        }
      });

      // EXECUTAR promessas
      if (promessas.length > 0) {
        await Promise.all(promessas);

        // Recarregar logística e agenda para sincronizar IDs e estado
        const hoteis = await logisticaService.listarHoteis(showId);
        const voos = await logisticaService.listarVoos(showId);
        const transportes = await logisticaService.listarTransportes(showId);

        setHoteisRaw(hoteis || []);
        setVoosRaw(voos || []);
        setTransportesRaw(transportes || []);

        setHotels(agruparHoteis(hoteis || []));
        setFlights(agruparVoos(voos || []));
        setTransports(agruparTransportes(transportes || []));

        // recarregar agenda (para pegar novos ids)
        const itensAtualizados =
          await agendaEventoService.listarPorShow(showId);
        const normalizados = itensAtualizados.map((item) => ({
          ...item,
          tipo: item.tipo?.toUpperCase(),
          dataHoraInicio: item.dataHoraInicio?.substring(0, 16),
          dataHoraFim: item.dataHoraFim?.substring(0, 16),
          origem: item.origem || "",
          destino: item.destino || "",
        }));
        setAgenda(normalizados);

        showSuccess("Logística e agenda salvas com sucesso!");
      } else {
        showInfo("Nenhuma logística ou agenda para salvar.");
      }

      try {
        await salvarExtras({
          showId,
          obs: extras?.obs || "",
          contatos: extras?.contatos || "",
        });

        showSuccess("Extras salvos com sucesso!");
      } catch (err) {
        console.error("Erro ao salvar extras:", err);
        showError("Erro ao salvar extras.");
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      showError("Erro ao salvar. Veja o console para detalhes.");
    }
  };

  const salvarLogisticaSeparado = async () => {
    if (!showId) {
      showError("Abra/Salve o evento antes de salvar logística.");
      return;
    }
    try {
      showInfo("Salvando logística...");

      const alocadosSet = new Set();
      Object.values(assignments || {}).forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((id) => alocadosSet.add(id));
      });

      if (alocadosSet.size === 0) {
        showWarning(
          "Nenhum colaborador selecionado. Selecione alocações antes de salvar logística.",
        );
        return;
      }

      const promessas = [];

      hotels.forEach((hotel) => {
        (hotel.hospedes || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const rawMatches = (hoteisRaw || []).filter(
            (hr) =>
              hr.colaboradorId === colabId &&
              String(hr.nomeHotel || "").trim() ===
              String(hotel.nome || "").trim() &&
              String(hr.endereco || "").trim() ===
              String(hotel.endereco || "").trim(),
          );

          const latitude = hotel.coordsHotel?.lat ?? hotel.latitude ?? null;
          const longitude = hotel.coordsHotel?.lon ?? hotel.longitude ?? null;

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            nomeHotel: hotel.nome || null,
            endereco: hotel.endereco || null,
            latitude,
            longitude,
            distanciaPalcoKm: hotel.distanciaPalcoKm
              ? Number(hotel.distanciaPalcoKm)
              : null,
            distanciaAeroportoKm: hotel.distanciaAeroportoKm
              ? Number(hotel.distanciaAeroportoKm)
              : null,
            checkin: hotel.checkin ? padDateForApi(hotel.checkin) : null,
            checkout: hotel.checkout ? padDateForApi(hotel.checkout) : null,
          };

          if (rawMatches.length > 0) {
            rawMatches.forEach((rawMatch) => {
              promessas.push(
                logisticaService.atualizarHotelEvento(rawMatch.id, dto),
              );
            });
          } else {
            promessas.push(logisticaService.criarHotelEvento(dto));
          }
        });
      });

      // VOOS
      flights.forEach((flight) => {
        (flight.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const rawMatches = (voosRaw || []).filter(
            (vr) =>
              vr.colaboradorId === colabId &&
              String(vr.ciaAerea || "").trim() ===
              String(flight.cia || "").trim() &&
              String(vr.codigoVoo || "").trim() ===
              String(flight.numero || "").trim() &&
              (vr.partida ? vr.partida.substring(0, 16) : "") ===
              (flight.saida ? flight.saida.substring(0, 16) : ""),
          );

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            ciaAerea: flight.cia || null,
            codigoVoo: flight.numero || null,
            origem: flight.origem || null,
            destino: flight.destino || null,
            partida: flight.saida
              ? new Date(padDateForApi(flight.saida)).toISOString()
              : null,
            chegada: flight.chegada
              ? new Date(padDateForApi(flight.chegada)).toISOString()
              : null,
          };

          if (rawMatches.length > 0) {
            rawMatches.forEach((rawMatch) => {
              promessas.push(
                logisticaService.atualizarVooEvento(rawMatch.id, dto),
              );
            });
          } else {
            promessas.push(logisticaService.criarVooEvento(dto));
          }
        });
      });

      // TRANSPORTES
      transports.forEach((t) => {
        (t.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const rawMatches = (transportesRaw || []).filter(
            (tr) =>
              tr.colaboradorId === colabId &&
              String(tr.tipo || "").trim() === String(t.tipo || "").trim() &&
              (tr.saida ? tr.saida.substring(0, 16) : "") ===
              (t.saida ? t.saida.substring(0, 16) : ""),
          );

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            tipo: t.tipo || null,
            saida: t.saida
              ? new Date(padDateForApi(t.saida)).toISOString()
              : null,
            destino: t.destino || null,
            motorista: t.responsavel || null,
            observacao: t.observacao || null,
          };

          if (rawMatches.length > 0) {
            rawMatches.forEach((rawMatch) => {
              promessas.push(
                logisticaService.atualizarTransporteEvento(rawMatch.id, dto),
              );
            });
          } else {
            promessas.push(logisticaService.criarTransporteEvento(dto));
          }
        });
      });

      if (promessas.length > 0) {
        await Promise.all(promessas);

        // Recarrega logística para sincronizar IDs
        const hoteis = await logisticaService.listarHoteis(showId);
        const voos = await logisticaService.listarVoos(showId);
        const transportes = await logisticaService.listarTransportes(showId);

        setHoteisRaw(hoteis || []);
        setVoosRaw(voos || []);
        setTransportesRaw(transportes || []);

        setHotels(agruparHoteis(hoteis || []));
        setFlights(agruparVoos(voos || []));
        setTransports(agruparTransportes(transportes || []));

        showSuccess("Logística salva com sucesso!");
      } else {
        showInfo("Nada para salvar em logística.");
      }
    } catch (err) {
      console.error("Erro ao salvar logística:", err);
      showError("Erro ao salvar logística. Veja console para detalhes.");
    }
  };

  /* ===== salvarAgendaSeparado ===== */
  const salvarAgendaSeparado = async () => {
    if (!showId) {
      showError("Abra/Salve o evento antes de salvar agenda.");
      return;
    }

    try {
      showInfo("Salvando agenda...");

      const promessas = [];

      const padDate = (val) => {
        if (!val) return null;
        return val.length === 16 ? `${val}:00` : val;
      };

      agenda.forEach((item) => {
        const dto = {
          showId: Number(showId),
          titulo: item.titulo || "Evento",
          descricao: item.descricao || null,
          tipo: item.tipo ? String(item.tipo).toUpperCase() : "TECNICO",
          origem: item.origem || null,
          destino: item.destino || null,
          dataHoraInicio: padDate(item.dataHoraInicio),
          dataHoraFim: padDate(item.dataHoraFim),
          ordem: 0,
        };

        if (item.id) {
          promessas.push(agendaEventoService.atualizar(item.id, dto));
        } else {
          promessas.push(agendaEventoService.criar(dto));
        }
      });

      if (promessas.length > 0) {
        await Promise.all(promessas);

        // recarregar agenda (pegar IDs)
        const itensAtualizados =
          await agendaEventoService.listarPorShow(showId);
        const normalizados = (itensAtualizados || []).map((item) => ({
          ...item,
          tipo: item.tipo?.toUpperCase(),
          dataHoraInicio: item.dataHoraInicio?.substring(0, 16),
          dataHoraFim: item.dataHoraFim?.substring(0, 16),
          origem: item.origem || "",
          destino: item.destino || "",
        }));
        setAgenda(normalizados);

        showSuccess("Agenda salva com sucesso!");
      } else {
        showInfo("Nenhum item de agenda para salvar.");
      }
    } catch (err) {
      console.error("Erro ao salvar agenda:", err);
      showError("Erro ao salvar agenda.");
    }
  };

  /* ===== salvarExtrasSeparado ===== */
  const salvarExtrasSeparado = async () => {
    if (!showId) {
      showError("Abra/Salve o evento antes de salvar extras.");
      return;
    }

    try {
      await salvarExtras({
        showId,
        obs: extras?.obs || "",
        contatos: extras?.contatos || "",
      });
      showSuccess("Extras salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar extras:", err);
      showError("Erro ao salvar extras.");
    }
  };

  // Função helper para calcular colaboradores aceitos
  function getColaboradoresAceitos() {
    let colaboradoresEvento = [];
    if (evento?.alocacoes?.length) {
      const alocacoesPorColab = {};
      evento.alocacoes.forEach((a) => {
        const colabId = a.colaborador?.id;
        if (!colabId) return;
        if (!alocacoesPorColab[colabId]) alocacoesPorColab[colabId] = [];
        alocacoesPorColab[colabId].push(a);
      });
      Object.values(alocacoesPorColab).forEach((alocacoes) => {
        const ultima = alocacoes.sort((a, b) => (b.id || 0) - (a.id || 0))[0];
        const statusUpper = ultima?.status?.toUpperCase?.();
        if (
          ultima &&
          typeof ultima.status === "string" &&
          (statusUpper === "ACEITO" || statusUpper === "PENDENTE") &&
          ultima.colaborador
        ) {
          colaboradoresEvento.push(ultima.colaborador);
        }
      });
    }
    const colaboradoresSelecionadosIds = [
      ...new Set(
        Object.values(assignments || {})
          .flat()
          .map((id) => Number(id))
          .filter(Boolean),
      ),
    ];
    return colaboradoresEvento.filter((c) =>
      colaboradoresSelecionadosIds.includes(c.id),
    );
  }

  // ===== RENDERIZAÇÃO =====
  const renderEtapa = () => {
    if (tipoEvento === "viagem") {
      switch (etapaAtual) {
        case 1:
          return (
            <Etapa2Logistica
              hotels={hotels}
              flights={flights}
              transports={transports}
              hoteisRaw={hoteisRaw}
              voosRaw={voosRaw}
              transportesRaw={transportesRaw}
              localShow={localShow}
              colaboradores={getColaboradoresAceitos()}
              setHotels={setHotels}
              setFlights={setFlights}
              setTransports={setTransports}
              showId={showId}
              onSave={salvarLogisticaSeparado}
            />
          );
        case 2:
          return (
            <Etapa4Agenda
              agenda={agenda}
              setAgenda={setAgenda}
              showId={showId}
              onSave={salvarAgendaSeparado}
            />
          );
        case 3:
          return (
            <Etapa5Extras
              extras={extras}
              setExtras={setExtras}
              showId={showId}
              onSave={salvarExtrasSeparado}
            />
          );
        default:
          return null;
      }
    }

    // Fluxo SHOW
    switch (etapaAtual) {
      case 1:
        return (
          <Etapa3Local localInicial={localShow} setLocalShow={setLocalShow} />
        );

      case 2:
        return (
          <>
            {showId && (
              <div className="mb-12 border-b pb-8">
                <VisualizarAlocacoes showId={showId} />
              </div>
            )}

            <Etapa1Funcoes
              selectedRoles={selectedRoles}
              setSelectedRoles={setSelectedRoles}
              assignments={assignments}
              setAssignments={setAssignments}
              showId={showId}
            />
          </>
        );

      case 3:
        return (
          <Etapa2Logistica
            hotels={hotels}
            flights={flights}
            transports={transports}
            hoteisRaw={hoteisRaw}
            voosRaw={voosRaw}
            transportesRaw={transportesRaw}
            localShow={localShow}
            colaboradores={getColaboradoresAceitos()}
            setHotels={setHotels}
            setFlights={setFlights}
            setTransports={setTransports}
            showId={showId}
            onSave={salvarLogisticaSeparado}
          />
        );

      case 4:
        return (
          <Etapa4Agenda
            agenda={agenda}
            setAgenda={setAgenda}
            showId={showId}
            onSave={salvarAgendaSeparado}
          />
        );

      case 5:
        return (
          <Etapa5Extras
            extras={extras}
            setExtras={setExtras}
            showId={showId}
            onSave={salvarExtrasSeparado}
          />
        );

      default:
        return null;
    }
  };

  const etapasViagem = [
    { label: "Logística" },
    { label: "Agenda" },
    { label: "Extras" },
  ];

  const etapasShow = [
    { label: "Local do Evento" },
    { label: "Funções e Equipe" },
    { label: "Logística" },
    { label: "Agenda" },
    { label: "Extras" },
  ];

  const [showSidebarDireita, setShowSidebarDireita] = useState(true);

  const handleAbrirVisaoEvento = () => {
    if (!showId) {
      showWarning("Salve/abra o evento antes de ir para a Visão do Evento.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmarVisaoEvento = () => {
    setModalLoading(true);
    setIsModalOpen(false);
    navigate(`/visao-evento/show/${showId}`);
  };

  const handleCancelarVisaoEvento = () => {
    setIsModalOpen(false);
    setModalLoading(false);
  };

  return (
    <LocalSelecionadoProvider>
      <Layout showHeader={false} showNotifications={false}>
        <div className="flex flex-1 min-h-0 relative overflow-x-hidden">
          <div className="flex-1 px-8 py-6 overflow-y-auto">
            <Stepper
              etapaAtual={etapaAtual}
              setEtapaAtual={setEtapaAtual}
              etapas={tipoEvento === "viagem" ? etapasViagem : etapasShow}
              onEtapaAnterior={
                etapaAtual > 1 ? () => setEtapaAtual(etapaAtual - 1) : undefined
              }
              onProximaEtapa={
                etapaAtual < (tipoEvento === "viagem" ? 3 : 5)
                  ? () => setEtapaAtual(etapaAtual + 1)
                  : undefined
              }
              onVisaoEvento={handleAbrirVisaoEvento}
            />

            <div className="mt-8">{renderEtapa()}</div>
          </div>

          {/* SIDEBAR OVERLAY (RESUMO RÁPIDO) */}
          <div
            className={`fixed top-5 right-0 max-h-screen z-40 transition-transform duration-300 ease-in-out flex items-start ${showSidebarDireita ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {/* BOTÃO TOGGLE (HANDLE) - FIXO NA BORDA DA GAVETA */}
            <button
              onClick={() => setShowSidebarDireita(!showSidebarDireita)}
              className="absolute -left-7 top-1/2 -translate-y-1/2 bg-[var(--surface-elevated)] border border-[var(--border)] shadow-[var(--shadow-card)] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[var(--surface)] hover:scale-110 active:scale-95 transition-all duration-300 group z-50"
              title={showSidebarDireita ? "Esconder Resumo" : "Mostrar Resumo"}
            >
              <div
                className={`transition-transform duration-300 ${showSidebarDireita ? "rotate-0" : "rotate-180"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </button>

            {/* CONTEÚDO DA GAVETA */}
            <div className="w-80 max-h-[calc(100vh-2rem)] bg-[var(--surface-elevated)] border-l border-[var(--border)] shadow-[var(--shadow-card)] rounded-[var(--radius-sm)] overflow-y-auto">
              <SidebarDireita
                etapaAtual={etapaAtual}
                localShow={localShow}
                selectedRoles={selectedRoles}
                assignments={assignments}
                hotels={hotels}
                flights={flights}
                transports={transports}
                agenda={agenda}
                extras={extras}
              />
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={handleCancelarVisaoEvento}
          onConfirm={handleConfirmarVisaoEvento}
          title="Ir para Visão do Evento?"
          message="Você realmente deseja sair desta etapa agora? Verifique se as informações importantes já foram salvas."
          confirmText="Sim, ir para Visão"
          cancelText="Continuar aqui"
          type="warning"
          confirmVariant="danger"
          loading={modalLoading}
        />
      </Layout>
    </LocalSelecionadoProvider>
  );
};

export default CriarEvento;

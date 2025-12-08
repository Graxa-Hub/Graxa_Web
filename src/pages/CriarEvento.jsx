import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import Stepper from "../components/CriarEvento/Stepper";
import Etapa1Funcoes from "../components/CriarEvento/Etapa1Funcoes";
import Etapa2Logistica from "../components/CriarEvento/Etapa2Logistica";
import Etapa3Local from "../components/CriarEvento/Etapa3Local";
import Etapa4Agenda from "../components/CriarEvento/Etapa4Agenda";
import Etapa5Extras from "../components/CriarEvento/Etapa5Extras";
import { useShows } from "../hooks/useShows";
import { useViagens } from "../hooks/useViagens";
import SidebarDireita from "../components/CriarEvento/SidebarDireita";
import { LocalSelecionadoProvider } from "../context/LocalSelecionadoContext";
import VisualizarAlocacoes from "../components/CriarEvento/VisualizarAlocacoes";
import { agendaEventoService } from "../services/agendaEventoService";
import { useColaboradores } from "../hooks/useColaboradores";
import { useToast } from "../hooks/useToast";
import { logisticaService } from "../services/logisticaService";
import { agruparHoteis, agruparVoos, agruparTransportes } from "../utils/logistica/logisticaUtils";
import { useExtrasEvento } from "../hooks/useExtrasEvento";
import { ConfirmModal } from "../components/UI/ConfirmModal";




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
  const { colaboradores: todosColaboradores, listarColaboradores } = useColaboradores();
  const { toasts, showSuccess, showError, showWarning, showInfo } = useToast();
  const { extras: extrasDB, listar: listarExtras, salvar: salvarExtras } = useExtrasEvento();
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ modalLoading, setModalLoading ] = useState(false);
  const navigate = useNavigate();


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

  // sempre sincroniza o extras local com o retorno do hook
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

        const normalizados = (itens || []).map(item => ({
          // Mantém id (se houver) para update/remover posteriores
          id: item.id,
          ...item,
          // Garante enum em MAIÚSCULAS
          tipo: item.tipo ? String(item.tipo).toUpperCase() : "TECNICO",
          // Normaliza para format accepted pelo input datetime-local (YYYY-MM-DDTHH:mm)
          dataHoraInicio: item.dataHoraInicio ? String(item.dataHoraInicio).substring(0, 16) : "",
          dataHoraFim: item.dataHoraFim ? String(item.dataHoraFim).substring(0, 16) : "",
          origem: item.origem || "",
          destino: item.destino || ""
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

        console.log("RAW LOGÍSTICA:", { hoteisRaw: hoteis, voosRaw: voos, transportesRaw: transportes });

        // Guardar raw para decidir updates depois
        setHoteisRaw(hoteis || []);
        setVoosRaw(voos || []);
        setTransportesRaw(transportes || []);

        // Agrupar (as funções de agrupar esperam o formato do backend DTO)
        const hoteisAgrupados = agruparHoteis(hoteis || []);
        const voosAgrupados = agruparVoos(voos || []);
        const transportesAgrupados = agruparTransportes(transportes || []);

        console.log("AGRUPADOS:", { hoteisAgrupados, voosAgrupados, transportesAgrupados });

        // Atualiza states usados na UI
        setHotels(hoteisAgrupados);
        setFlights(voosAgrupados);
        setTransports(transportesAgrupados);
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

  const colaboradoresSelecionadosIds = [
    ...new Set(
      Object.values(assignments || {})
        .flat()
        .map((id) => Number(id))
        .filter(Boolean)
    )
  ];

  // Lista real de colaboradores retornados pelo backend no evento
  const colaboradoresEvento = evento?.alocacoes?.map(a => a.colaborador) || [];

  // Filtrar colaboradores que foram selecionados na Etapa 2
  const todosAlocados = colaboradoresEvento.filter((c) =>
    colaboradoresSelecionadosIds.includes(c.id)
  );

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
          responsavelId: evento.responsavelEvento?.id
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
        showWarning("Nenhum colaborador selecionado. Apenas o local foi atualizado.");
        return;
      }

      const promessas = [];

      // ------ HOTÉIS: para cada hotel agrupado, tratamos cada hóspede individualmente
      hotels.forEach((hotel) => {
        (hotel.hospedes || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          // procurar raw correspondente (mesmo colaborador e mesmo nome/endereco) para decidir update/create
          const rawMatch = (hoteisRaw || []).find(hr =>
            hr.colaboradorId === colabId &&
            // comparamos nome + endereco para ter mais certeza do match
            String(hr.nomeHotel || "").trim() === String(hotel.nome || "").trim() &&
            String(hr.endereco || "").trim() === String(hotel.endereco || "").trim()
          );

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            nomeHotel: hotel.nome || null,
            endereco: hotel.endereco || null,
            latitude: hotel.latitude ?? null,
            longitude: hotel.longitude ?? null,
            distanciaPalcoKm: hotel.distanciaPalcoKm ? Number(hotel.distanciaPalcoKm) : null,
            distanciaAeroportoKm: hotel.distanciaAeroportoKm ? Number(hotel.distanciaAeroportoKm) : null,
            checkin: hotel.checkin ? padDateForApi(hotel.checkin) : null,
            checkout: hotel.checkout ? padDateForApi(hotel.checkout) : null
          };

          if (rawMatch && rawMatch.id) {
            // atualizar item existente
            promessas.push(logisticaService.atualizarHotelEvento(rawMatch.id, dto));
          } else {
            // criar novo registro para esse colaborador
            promessas.push(logisticaService.criarHotelEvento(dto));
          }
        });
      });

      // ------ VOOS
      flights.forEach((flight) => {
        (flight.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          // match por colaborador + cia + codigo + partida
          const rawMatch = (voosRaw || []).find(vr =>
            vr.colaboradorId === colabId &&
            String(vr.ciaAerea || "").trim() === String(flight.cia || "").trim() &&
            String(vr.codigoVoo || "").trim() === String(flight.numero || "").trim() &&
            (vr.partida ? vr.partida.substring(0,16) : "") === (flight.saida ? flight.saida.substring(0,16) : "")
          );

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            ciaAerea: flight.cia || null,
            codigoVoo: flight.numero || null,
            origem: flight.origem || null,
            destino: flight.destino || null,
            partida: flight.saida ? new Date(padDateForApi(flight.saida)).toISOString() : null,
            chegada: flight.chegada ? new Date(padDateForApi(flight.chegada)).toISOString() : null
          };

          if (rawMatch && rawMatch.id) {
            promessas.push(logisticaService.atualizarVooEvento(rawMatch.id, dto));
          } else {
            promessas.push(logisticaService.criarVooEvento(dto));
          }
        });
      });

      // ------ TRANSPORTES
      transports.forEach((t) => {
        (t.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const rawMatch = (transportesRaw || []).find(tr =>
            tr.colaboradorId === colabId &&
            String(tr.tipo || "").trim() === String(t.tipo || "").trim() &&
            (tr.saida ? tr.saida.substring(0,16) : "") === (t.saida ? t.saida.substring(0,16) : "")
          );

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            tipo: t.tipo || null,
            saida: t.saida ? new Date(padDateForApi(t.saida)).toISOString() : null,
            destino: t.destino || null,
            motorista: t.responsavel || null,
            observacao: t.observacao || null
          };

          if (rawMatch && rawMatch.id) {
            promessas.push(logisticaService.atualizarTransporteEvento(rawMatch.id, dto));
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
          ordem: index + 1
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
        const itensAtualizados = await agendaEventoService.listarPorShow(showId);
        const normalizados = itensAtualizados.map(item => ({
          ...item,
          tipo: item.tipo?.toUpperCase(),
          dataHoraInicio: item.dataHoraInicio?.substring(0, 16),
          dataHoraFim: item.dataHoraFim?.substring(0, 16),
          origem: item.origem || "",
          destino: item.destino || ""
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
          contatos: extras?.contatos || ""
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
      showWarning("Nenhum colaborador selecionado. Selecione alocações antes de salvar logística.");
      return;
    }

    const promessas = [];

    hotels.forEach((hotel) => {
      (hotel.hospedes || []).forEach((colabId) => {
        if (!alocadosSet.has(colabId)) return;

        const rawMatch = (hoteisRaw || []).find(hr =>
          hr.colaboradorId === colabId &&
          String(hr.nomeHotel || "").trim() === String(hotel.nome || "").trim() &&
          String(hr.endereco || "").trim() === String(hotel.endereco || "").trim()
        );

        const dto = {
          showId: Number(showId),
          colaboradorId: Number(colabId),
          nomeHotel: hotel.nome || null,
          endereco: hotel.endereco || null,
          latitude: hotel.latitude ?? null,
          longitude: hotel.longitude ?? null,
          distanciaPalcoKm: hotel.distanciaPalcoKm ? Number(hotel.distanciaPalcoKm) : null,
          distanciaAeroportoKm: hotel.distanciaAeroportoKm ? Number(hotel.distanciaAeroportoKm) : null,
          checkin: hotel.checkin ? padDateForApi(hotel.checkin) : null,
          checkout: hotel.checkout ? padDateForApi(hotel.checkout) : null
        };

        if (rawMatch && rawMatch.id) {
          promessas.push(logisticaService.atualizarHotelEvento(rawMatch.id, dto));
        } else {
          promessas.push(logisticaService.criarHotelEvento(dto));
        }
      });
    });

    // VOOS
    flights.forEach((flight) => {
      (flight.passageiros || []).forEach((colabId) => {
        if (!alocadosSet.has(colabId)) return;

        const rawMatch = (voosRaw || []).find(vr =>
          vr.colaboradorId === colabId &&
          String(vr.ciaAerea || "").trim() === String(flight.cia || "").trim() &&
          String(vr.codigoVoo || "").trim() === String(flight.numero || "").trim() &&
          (vr.partida ? vr.partida.substring(0,16) : "") === (flight.saida ? flight.saida.substring(0,16) : "")
        );

        const dto = {
          showId: Number(showId),
          colaboradorId: Number(colabId),
          ciaAerea: flight.cia || null,
          codigoVoo: flight.numero || null,
          origem: flight.origem || null,
          destino: flight.destino || null,
          partida: flight.saida ? new Date(padDateForApi(flight.saida)).toISOString() : null,
          chegada: flight.chegada ? new Date(padDateForApi(flight.chegada)).toISOString() : null
        };

        if (rawMatch && rawMatch.id) {
          promessas.push(logisticaService.atualizarVooEvento(rawMatch.id, dto));
        } else {
          promessas.push(logisticaService.criarVooEvento(dto));
        }
      });
    });

    // TRANSPORTES
    transports.forEach((t) => {
      (t.passageiros || []).forEach((colabId) => {
        if (!alocadosSet.has(colabId)) return;

        const rawMatch = (transportesRaw || []).find(tr =>
          tr.colaboradorId === colabId &&
          String(tr.tipo || "").trim() === String(t.tipo || "").trim() &&
          (tr.saida ? tr.saida.substring(0,16) : "") === (t.saida ? t.saida.substring(0,16) : "")
        );

        const dto = {
          showId: Number(showId),
          colaboradorId: Number(colabId),
          tipo: t.tipo || null,
          saida: t.saida ? new Date(padDateForApi(t.saida)).toISOString() : null,
          destino: t.destino || null,
          motorista: t.responsavel || null,
          observacao: t.observacao || null
        };

        if (rawMatch && rawMatch.id) {
          promessas.push(logisticaService.atualizarTransporteEvento(rawMatch.id, dto));
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
        ordem: 0
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
      const itensAtualizados = await agendaEventoService.listarPorShow(showId);
      const normalizados = (itensAtualizados || []).map(item => ({
        ...item,
        tipo: item.tipo?.toUpperCase(),
        dataHoraInicio: item.dataHoraInicio?.substring(0, 16),
        dataHoraFim: item.dataHoraFim?.substring(0, 16),
        origem: item.origem || "",
        destino: item.destino || ""
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
      contatos: extras?.contatos || ""
    });
    showSuccess("Extras salvos com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar extras:", err);
    showError("Erro ao salvar extras.");
  }
};

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
              colaboradores={todosAlocados}
              setHotels={setHotels}
              setFlights={setFlights}
              setTransports={setTransports}
              showId={showId}
              onSave={salvarLogisticaSeparado}
            />
          );
        case 2:
          return <Etapa4Agenda
                  agenda={agenda}
                  setAgenda={setAgenda}
                  showId={showId}
                  onSave={salvarAgendaSeparado}
                />;
        case 3:
          return <Etapa5Extras
                  extras={extras}
                  setExtras={setExtras}
                  showId={showId}
                  onSave={salvarExtrasSeparado}
                />
        default:
          return null;
      }
    }

    // Fluxo SHOW
    switch (etapaAtual) {
      case 1:
        return (
          <Etapa3Local
            localInicial={localShow}
            setLocalShow={setLocalShow}
          />
        );

      case 2:
        return (
          <>
            <Etapa1Funcoes
              selectedRoles={selectedRoles}
              setSelectedRoles={setSelectedRoles}
              assignments={assignments}
              setAssignments={setAssignments}
              showId={showId}
            />

            {showId && (
              <div className="mt-12 border-t pt-8">
                <VisualizarAlocacoes showId={showId} />
              </div>
            )}
          </>
        );

      case 3:
        if (!localShow?.coordsLocal) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
              ⚠️ Finalize o Local do Evento antes de continuar.
            </div>
          );
        }

        return (
          <Etapa2Logistica
            hotels={hotels}
            flights={flights}
            transports={transports}

            hoteisRaw={hoteisRaw}
            voosRaw={voosRaw}
            transportesRaw={transportesRaw}

            localShow={localShow}
            colaboradores={todosAlocados}
            setHotels={setHotels}
            setFlights={setFlights}
            setTransports={setTransports}

            showId={showId}
            onSave={salvarLogisticaSeparado}
          />
        );

      case 4:
        return <Etapa4Agenda 
                agenda={agenda} 
                setAgenda={setAgenda}
                showId={showId}
                onSave={salvarAgendaSeparado} />;

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

  return (
    <LocalSelecionadoProvider>
      <Layout>
        <Sidebar />

        <div className="flex w-full h-screen bg-gray-50/50">
          <div className="flex-1 p-10 overflow-y-auto">
            <Stepper
              etapaAtual={etapaAtual}
              setEtapaAtual={setEtapaAtual}
              etapas={tipoEvento === "viagem" ? etapasViagem : etapasShow}
            />

            <div className="mt-8">{renderEtapa()}</div>

            <div className="flex justify-end mt-10 gap-4 border-t pt-6 border-gray-200">
              {/* BOTÃO VOLTAR */}
              {etapaAtual > 1 && (
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setEtapaAtual(etapaAtual - 1)}
                >
                  Voltar
                </button>
              )}

              {/* BOTÃO PRÓXIMA — só aparece se NÃO for a última etapa */}
              {etapaAtual < (tipoEvento === "viagem" ? 3 : 5) && (
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => setEtapaAtual(etapaAtual + 1)}
                >
                  Próxima Etapa
                </button>
              )}

              {/* 👉 REMOVIDO o botão Finalizar Evento */}
            </div>
          </div>

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
      </Layout>
    </LocalSelecionadoProvider>
  );
};

export default CriarEvento;

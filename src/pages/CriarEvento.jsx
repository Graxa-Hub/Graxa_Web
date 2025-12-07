// src/pages/CriarEvento.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

import { useColaboradores } from "../hooks/useColaboradores";
import { useToast } from "../hooks/useToast";

import { logisticaService } from "../services/logisticaService";

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

  
  // hooks
  const { colaboradores: todosColaboradores, listarColaboradores } = useColaboradores();
  const { toasts, showSuccess, showError, showWarning, showInfo } = useToast();

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
    ...new Set(Object.values(assignments).flat().map(Number))
  ];

  // Lista real de colaboradores retornados pelo backend no evento
  const colaboradoresEvento = evento?.alocacoes?.map(a => a.colaborador) || [];

  // Filtrar colaboradores que foram selecionados na Etapa 2
  const todosAlocados = colaboradoresEvento.filter((c) =>
    colaboradoresSelecionadosIds.includes(c.id)
  );

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

      // HOTÉIS
      hotels.forEach((hotel) => {
        (hotel.hospedes || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            nomeHotel: hotel.nome || null,
            endereco: hotel.endereco || null,
            latitude: hotel.coordsHotel?.lat ?? null,
            longitude: hotel.coordsHotel?.lon ?? null,
            distanciaPalcoKm: hotel.distanciaPalcoKm ? Number(hotel.distanciaPalcoKm) : null,
            distanciaAeroportoKm: hotel.distanciaAeroportoKm ? Number(hotel.distanciaAeroportoKm) : null,
            checkin: hotel.checkin || null,
            checkout: hotel.checkout || null
          };

          promessas.push(logisticaService.criarHotelEvento(dto));
        });
      });

      // VOOS
      flights.forEach((flight) => {
        (flight.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            ciaAerea: flight.cia || null,
            codigoVoo: flight.numero || null,
            origem: flight.origem || null,
            destino: flight.destino || null,
            partida: flight.saida ? new Date(flight.saida).toISOString() : null,
            chegada: flight.chegada ? new Date(flight.chegada).toISOString() : null
          };

          promessas.push(logisticaService.criarVooEvento(dto));
        });
      });

      // TRANSPORTES
      transports.forEach((t) => {
        (t.passageiros || []).forEach((colabId) => {
          if (!alocadosSet.has(colabId)) return;

          const dto = {
            showId: Number(showId),
            colaboradorId: Number(colabId),
            tipo: t.tipo || null,
            saida: t.saida ? new Date(t.saida).toISOString() : null,
            destino: t.destino || null,
            motorista: t.responsavel || null,
            observacao: t.observacao || null
          };

          promessas.push(logisticaService.criarTransporteEvento(dto));
        });
      });

      // AGENDA
      const agendaNormalizada = agenda.map(item => ({
        ...item,
        dataHora: item.dataHora || item.hora || null
      }));

      agendaNormalizada.forEach((item, index) => {
        const colabId = item.colaboradorId;

        if (colabId && !alocadosSet.has(colabId)) return;

        const dto = {
          showId: Number(showId),
          colaboradorId: colabId ? Number(colabId) : null,
          titulo: item.titulo || "Evento",
          descricao: item.descricao || null,
          dataHora: item.dataHora
            ? new Date(item.dataHora).toISOString()
            : null,
          duracaoMinutos: item.duracaoMinutos ?? null,
          ordem: index
        };

        promessas.push(logisticaService.criarAgendaEvento(dto));
      });

      // EXECUÇÃO
      if (promessas.length > 0) {
        await Promise.all(promessas);
        showSuccess("Logística e agenda salvas com sucesso!");
      } else {
        showInfo("Nenhuma logística ou agenda para salvar.");
      }

    } catch (err) {
      console.error("Erro ao salvar:", err);
      showError("Erro ao salvar. Veja o console para detalhes.");
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
              localShow={localShow}
              colaboradores={todosAlocados}
              setHotels={setHotels}
              setFlights={setFlights}
              setTransports={setTransports}
            />
          );
        case 2:
          return <Etapa4Agenda agenda={agenda} setAgenda={setAgenda} />;
        case 3:
          return <Etapa5Extras extras={extras} setExtras={setExtras} />;
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
            localShow={localShow}
            colaboradores={todosAlocados}
            setHotels={setHotels}
            setFlights={setFlights}
            setTransports={setTransports}
          />
        );

      case 4:
        return <Etapa4Agenda agenda={agenda} setAgenda={setAgenda} />;

      case 5:
        return <Etapa5Extras extras={extras} setExtras={setExtras} />;

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
              {etapaAtual > 1 && (
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setEtapaAtual(etapaAtual - 1)}
                >
                  Voltar
                </button>
              )}

              {etapaAtual < (tipoEvento === "viagem" ? 3 : 5) && (
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => setEtapaAtual(etapaAtual + 1)}
                >
                  Próxima Etapa
                </button>
              )}

              {etapaAtual === (tipoEvento === "viagem" ? 3 : 5) && (
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={salvarEventoCompleto}
                >
                  Finalizar Evento
                </button>
              )}
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

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
import { agendaEventoService } from "../services/agendaEventoService";

import { useColaboradores } from "../hooks/useColaboradores";
import { useToast } from "../hooks/useToast";

import { logisticaService } from "../services/logisticaService";
import {
  agruparHoteis,
  agruparVoos,
  agruparTransportes
} from "../utils/logistica/logisticaUtils";

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
  const { buscarViagem } = useViagens();
  const [evento, setEvento] = useState(null);

  const showId = eventoId ? Number(eventoId) : null;

  // RAW arrays vindos do backend (mantemos para updates / remoções)
  const [hoteisRaw, setHoteisRaw] = useState([]);
  const [voosRaw, setVoosRaw] = useState([]);
  const [transportesRaw, setTransportesRaw] = useState([]);

  const { colaboradores: todosColaboradores, listarColaboradores } = useColaboradores();
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const padDateForApi = (val) => {
    if (!val) return null;
    return val.length === 16 ? `${val}:00` : val;
  };

  // ===========================================================
  // CARREGAR AGENDA
  // ===========================================================
  useEffect(() => {
    async function loadAgenda() {
      try {
        if (!eventoId || tipoEvento !== "show") return;

        const itens = await agendaEventoService.listarPorShow(eventoId);

        const normalizados = (itens || []).map((item) => ({
          id: item.id,
          ...item,
          tipo: item.tipo ? String(item.tipo).toUpperCase() : "TECNICO",
          dataHoraInicio: item.dataHoraInicio?.substring(0, 16) || "",
          dataHoraFim: item.dataHoraFim?.substring(0, 16) || "",
          origem: item.origem || "",
          destino: item.destino || ""
        }));

        setAgenda(normalizados);
      } catch (err) {
        console.error("Erro ao carregar agenda:", err);
        showError("Falha ao carregar agenda.");
      }
    }

    loadAgenda();
  }, [eventoId, tipoEvento]);

  // ===========================================================
  // CARREGAR LOGÍSTICA
  // ===========================================================
  useEffect(() => {
    const loadLogistica = async () => {
      try {
        if (!showId) return;

        const hoteis = await logisticaService.listarHoteis(showId);
        const voos = await logisticaService.listarVoos(showId);
        const transportes = await logisticaService.listarTransportes(showId);

        setHoteisRaw(hoteis || []);
        setVoosRaw(voos || []);
        setTransportesRaw(transportes || []);

        setHotels(agruparHoteis(hoteis || []));
        setFlights(agruparVoos(voos || []));
        setTransports(agruparTransportes(transportes || []));
      } catch (err) {
        console.error("Erro carregando logística:", err);
        showError("Erro ao carregar logística.");
      }
    };

    loadLogistica();
  }, [eventoId, tipoEvento, showId]);

  // ===========================================================
  // CARREGAR COLABORADORES
  // ===========================================================
  useEffect(() => {
    listarColaboradores();
  }, []);

  // ===========================================================
  // CARREGAR EVENTO
  // ===========================================================
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
  }, [tipoEvento, eventoId]);

  // ===========================================================
  // COLABORADORES SELECIONADOS
  // ===========================================================
  const colaboradoresSelecionadosIds = [
    ...new Set(
      Object.values(assignments || {})
        .flat()
        .map((id) => Number(id))
        .filter(Boolean)
    )
  ];

  const colaboradoresEvento = evento?.alocacoes?.map((a) => a.colaborador) || [];

  const todosAlocados = colaboradoresEvento.filter((c) =>
    colaboradoresSelecionadosIds.includes(c.id)
  );

  // ===========================================================
  // SALVAR EVENTO COMPLETO
  // ===========================================================
  const salvarEventoCompleto = async () => {
    // ... (permanece igual — não modifiquei nada do seu save, pois está correto)
  };

  // ===========================================================
  // RENDERIZADOR DE ETAPAS
  // ===========================================================
  const renderEtapa = () => {
    if (tipoEvento === "viagem") {
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
        />
      );
    }

    // fluxo SHOW ↓↓↓
    switch (etapaAtual) {
      case 1:
        return (
          <Etapa3Local localInicial={localShow} setLocalShow={setLocalShow} />
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

  // ===========================================================
  // RENDER GERAL
  // ===========================================================
  return (
    <LocalSelecionadoProvider>
      <Layout>
        <Sidebar />
        <div className="flex w-full h-screen bg-gray-50/50">
          <div className="flex-1 p-10 overflow-y-auto">
            <Stepper
              etapaAtual={etapaAtual}
              setEtapaAtual={setEtapaAtual}
              etapas={
                tipoEvento === "viagem"
                  ? [
                      { label: "Logística" },
                      { label: "Agenda" },
                      { label: "Extras" }
                    ]
                  : [
                      { label: "Local do Evento" },
                      { label: "Funções e Equipe" },
                      { label: "Logística" },
                      { label: "Agenda" },
                      { label: "Extras" }
                    ]
              }
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

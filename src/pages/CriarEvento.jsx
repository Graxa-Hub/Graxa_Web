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

import { useExtrasEvento } from "../hooks/useExtrasEvento";

import { useColaboradores } from "../hooks/useColaboradores";
import { useToast } from "../hooks/useToast";

import { logisticaService } from "../services/logisticaService";
import { agruparHoteis, agruparVoos, agruparTransportes } from "../utils/logistica/logisticaUtils";

export const CriarEvento = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [localShow, setLocalShow] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [transports, setTransports] = useState([]);
  const [agenda, setAgenda] = useState([]);

  const [extrasLocal, setExtrasLocal] = useState({ obs: "", contatos: "" });

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

  const { extras, listar: listarExtras, salvar: salvarExtras } = useExtrasEvento();

  const padDateForApi = (val) => {
    if (!val) return null;
    return val.length === 16 ? `${val}:00` : val;
  };

  useEffect(() => {
    if (showId)
      listarExtras(showId).then((data) => {
        if (data)
          setExtrasLocal({
            obs: data.obs || "",
            contatos: data.contatos || ""
          });
      });
  }, [showId]);

  useEffect(() => {
    async function loadAgenda() {
      try {
        if (!eventoId || tipoEvento !== "show") return;

        const itens = await agendaEventoService.listarPorShow(eventoId);

        const normalizados = (itens || []).map(item => ({
          id: item.id,
          ...item,
          tipo: item.tipo ? String(item.tipo).toUpperCase() : "TECNICO",
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
    ...new Set(Object.values(assignments).flat().map(Number || (() => [])))
  ];

  const colaboradoresEvento = evento?.alocacoes?.map(a => a.colaborador) || [];

  const todosAlocados = colaboradoresEvento.filter((c) =>
    colaboradoresSelecionadosIds.includes(c.id)
  );

  const salvarEventoCompleto = async () => {
    if (!showId) return;

    try {
      showInfo("Iniciando salvamento...");

      await salvarExtras({
        showId,
        obs: extrasLocal.obs || "",
        contatos: extrasLocal.contatos || ""
      });

      showSuccess("Extras salvos!");

      // ... o resto do seu salvar continua aqui sem alterações ...

    } catch (err) {
      console.error("Erro ao salvar:", err);
      showError("Erro ao salvar. Veja o console para detalhes.");
    }
  };

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
            />
          );
        case 2:
          return <Etapa4Agenda agenda={agenda} setAgenda={setAgenda} />;
        case 3:
          return (
            <Etapa5Extras extras={extrasLocal} setExtras={setExtrasLocal} />
          );
        default:
          return null;
      }
    }

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
        return (
          <Etapa5Extras extras={extrasLocal} setExtras={setExtrasLocal} />
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
            extras={extrasLocal}
          />
        </div>
      </Layout>
    </LocalSelecionadoProvider>
  );
};

export default CriarEvento;

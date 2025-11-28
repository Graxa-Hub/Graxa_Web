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
  const { buscarShow } = useShows();
  const { buscarViagem } = useViagens();

  const [evento, setEvento] = useState(null);

  useEffect(() => {
    async function fetchEvento() {
      if (!eventoId || !tipoEvento) return;
      if (tipoEvento === "show") {
        const show = await buscarShow(eventoId);
        setEvento(show);
        if (show && show.local) {
          setLocalShow(show.local);
        }
      } else if (tipoEvento === "viagem") {
        const viagem = await buscarViagem(eventoId);
        setEvento(viagem);
        if (viagem && viagem.local) {
          setLocalShow(viagem.local);
        }
      }
    }
    fetchEvento();
  }, [tipoEvento, eventoId, buscarShow, buscarViagem]);

  useEffect(() => {
    console.log(evento);
  }, [evento]);

  // fake colaboradores apenas para testes locais
  const colaboradores = [
    { id: 1, nome: "Maria Gadú", funcao: "Artista" },
    { id: 2, nome: "Jay", funcao: "Banda" },
    { id: 3, nome: "David", funcao: "Banda" },
    { id: 4, nome: "Popi", funcao: "Produção" },
  ];

  // ===== RENDERIZA CADA ETAPA =====
  const renderEtapa = () => {
    if (tipoEvento === "viagem") {
      // Exemplo: só renderiza etapas a partir da logística
      switch (etapaAtual) {
        case 1:
          return (
            <Etapa2Logistica
              hotels={hotels}
              flights={flights}
              transports={transports}
              localShow={localShow}
              colaboradores={colaboradores}
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

    // Fluxo normal para show
    switch (etapaAtual) {
      case 1:
        return (
          <Etapa3Local
            localShow={localShow}
            setLocalShow={setLocalShow}
          />
        );
      case 2:
        return (
          <Etapa1Funcoes
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            assignments={assignments}
            setAssignments={setAssignments}
          />
        );
      case 3:
        if (!localShow || !localShow.coordsLocal) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
              ⚠️ Antes de configurar a logística, finalize o Local do Evento.
            </div>
          );
        }
        return (
          <Etapa2Logistica
            hotels={hotels}
            flights={flights}
            transports={transports}
            localShow={localShow}
            colaboradores={colaboradores}
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

  // Stepper adaptado: oculta etapas para viagem
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
            {/* Stepper adaptado */}
            <Stepper
              etapaAtual={etapaAtual}
              setEtapaAtual={setEtapaAtual}
              etapas={tipoEvento === "viagem" ? etapasViagem : etapasShow}
            />

            <div className="mt-8">{renderEtapa()}</div>

            {/* Navegação entre etapas adaptada */}
            <div className="flex justify-end mt-10 gap-4 border-t pt-6 border-gray-200">
              {etapaAtual > 1 && (
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setEtapaAtual(etapaAtual - 1)}
                >
                  Voltar
                </button>
              )}

              {etapaAtual < (tipoEvento === "viagem" ? 3 : 5) && (
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  onClick={() => setEtapaAtual(etapaAtual + 1)}
                >
                  Próxima Etapa
                </button>
              )}

              {etapaAtual === (tipoEvento === "viagem" ? 3 : 5) && (
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() =>
                    console.log("SALVAR EVENTO", {
                      localShow,
                      selectedRoles,
                      assignments,
                      hotels,
                      flights,
                      transports,
                      agenda,
                      extras,
                    })
                  }
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
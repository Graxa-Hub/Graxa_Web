import React, { useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";

import Stepper from "../components/CriarEvento/Stepper";
import Etapa1Funcoes from "../components/CriarEvento/Etapa1Funcoes";
import Etapa2Logistica from "../components/CriarEvento/Etapa2Logistica";
import Etapa3Local from "../components/CriarEvento/Etapa3Local";
import Etapa4Agenda from "../components/CriarEvento/Etapa4Agenda";
import Etapa5Extras from "../components/CriarEvento/Etapa5Extras";

import SidebarDireita from "../components/CriarEvento/SidebarDireita";

export const CriarEvento = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);

  // ===== DADOS GLOBAIS DO EVENTO =====
  const [localShow, setLocalShow] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);

  // cada função -> colaborador escolhido
  const [assignments, setAssignments] = useState({});

  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [transports, setTransports] = useState([]);

  const [agenda, setAgenda] = useState([]);
  const [extras, setExtras] = useState({});

  // fake colaboradores apenas para testes locais
  const colaboradores = [
    { id: 1, nome: "Maria Gadú", funcao: "Artista" },
    { id: 2, nome: "Jay", funcao: "Banda" },
    { id: 3, nome: "David", funcao: "Banda" },
    { id: 4, nome: "Popi", funcao: "Produção" },
  ];

  // ===== RENDERIZA CADA ETAPA =====
  const renderEtapa = () => {
    switch (etapaAtual) {

      // 1 — LOCAL DO EVENTO
      case 1:
        return (
          <Etapa3Local
            localShow={localShow}
            setLocalShow={setLocalShow}
          />
        );

      // 2 — FUNÇÕES + EQUIPE
      case 2:
        return (
          <Etapa1Funcoes
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            assignments={assignments}
            setAssignments={setAssignments}
          />
        );

      // 3 — LOGÍSTICA
      case 3:
        if (!localShow || !localShow.coordsLocal) {
          return (
            <div className="p-6 bg-yellow-100 text-yellow-800 rounded border">
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

      // 4 — AGENDA
      case 4:
        return <Etapa4Agenda agenda={agenda} setAgenda={setAgenda} />;

      // 5 — EXTRAS
      case 5:
        return <Etapa5Extras extras={extras} setExtras={setExtras} />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      <Sidebar />

      <div className="flex w-full h-screen bg-gray-50">

        {/* ===== CONTEÚDO PRINCIPAL ===== */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* Stepper */}
          <Stepper etapaAtual={etapaAtual} setEtapaAtual={setEtapaAtual} />

          <div className="mt-10">
            {renderEtapa()}
          </div>

          {/* ===== NAVEGAÇÃO ENTRE ETAPAS ===== */}
          <div className="flex justify-end mt-10 gap-4">

            {etapaAtual > 1 && (
              <button
                className="px-5 py-2 bg-gray-300 rounded-lg"
                onClick={() => setEtapaAtual(etapaAtual - 1)}
              >
                Voltar
              </button>
            )}

            {etapaAtual < 5 && (
              <button
                className="px-5 py-2 bg-green-600 text-white rounded-lg"
                onClick={() => setEtapaAtual(etapaAtual + 1)}
              >
                Próxima Etapa
              </button>
            )}

            {etapaAtual === 5 && (
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => console.log("SALVAR EVENTO", {
                  localShow,
                  selectedRoles,
                  assignments,
                  hotels,
                  flights,
                  transports,
                  agenda,
                  extras
                })}
              >
                Finalizar Evento
              </button>
            )}
          </div>
        </div>

        {/* ===== SIDEBAR DIREITA (RESUMO DINÂMICO) ===== */}
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
  );
};

export default CriarEvento;

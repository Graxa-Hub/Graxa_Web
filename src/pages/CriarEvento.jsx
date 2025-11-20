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

  // Dados compartilhados entre etapas
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [transports, setTransports] = useState([]);
  const [localShow, setLocalShow] = useState({});
  const [agenda, setAgenda] = useState([]);
  const [extras, setExtras] = useState({});

  const colaboradores = [
    { id: 1, nome: "Maria Gadú", funcao: "Artista" },
    { id: 2, nome: "Jay", funcao: "Banda" },
    { id: 3, nome: "David", funcao: "Banda" },
    { id: 4, nome: "Popi", funcao: "Produção" }
  ];

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <Etapa1Funcoes
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />
        );
      case 2:
        return (
          <Etapa2Logistica
            hotels={hotels}
            flights={flights}
            transports={transports}
            setHotels={setHotels}
            setFlights={setFlights}
            setTransports={setTransports}
            colaboradores={colaboradores}
          />
        );
      case 3:
        return (
          <Etapa3Local
            localShow={localShow}
            setLocalShow={setLocalShow}
          />
        );
      case 4:
        return (
          <Etapa4Agenda
            agenda={agenda}
            setAgenda={setAgenda}
          />
        );
      case 5:
        return (
          <Etapa5Extras
            extras={extras}
            setExtras={setExtras}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Sidebar />

      <div className="flex w-full h-screen bg-gray-50">
        
        <div className="flex-1 p-8 overflow-y-auto">
          <Stepper etapaAtual={etapaAtual} setEtapaAtual={setEtapaAtual} />

          <div className="mt-10">{renderEtapa()}</div>

          <div className="flex justify-end mt-10 gap-4">
            {etapaAtual > 1 && (
              <button
                className="px-5 py-2 rounded-lg bg-gray-300"
                onClick={() => setEtapaAtual(etapaAtual - 1)}
              >
                Voltar
              </button>
            )}

            {etapaAtual < 5 && (
              <button
                className="px-5 py-2 rounded-lg bg-green-600 text-white"
                onClick={() => setEtapaAtual(etapaAtual + 1)}
              >
                Próxima Etapa
              </button>
            )}

            {etapaAtual === 5 && (
              <button
                className="px-5 py-2 rounded-lg bg-blue-600 text-white"
                onClick={() => console.log("SALVAR EVENTO")}
              >
                Finalizar Evento
              </button>
            )}
          </div>
        </div>

        <SidebarDireita etapaAtual={etapaAtual} />
      </div>
    </Layout>
  );
};

export default CriarEvento;

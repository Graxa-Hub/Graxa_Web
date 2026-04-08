import React, { useState } from "react";
import { Layout } from "../components/templates/Layout";
import { Sidebar } from "../components/organisms/Sidebar";
import FlightCard from "../features/Evento/components/CriarEvento/cards/FlightCard";
import TransporteCard from "../features/Evento/components/CriarEvento/cards/TransporteCard";
import SidebarDireita from "../features/Evento/components/CriarEvento/SidebarLogistica";

export const CriarLogistica = () => {
  const [flights, setFlights] = useState([]);
  const [transports, setTransports] = useState([]);

  const [assignments, setAssignments] = useState({});
  const colab = [
    { id: 101, nome: "Dinho Luz", tipoUsuario: "tecnico_luz" },
    { id: 102, nome: "Tata Som", tipoUsuario: "tecnico_som" },
    { id: 103, nome: "Joana Road", tipoUsuario: "roadie" },
    { id: 104, nome: "Paco Manager", tipoUsuario: "produtor_estrada" },
    { id: 105, nome: "Luiz Monitor", tipoUsuario: "tecnico_monitor" },
    { id: 106, nome: "Ana Gadú Tour", tipoUsuario: "produtor_estrada" },
  ];

  const addFlight = () =>
    setFlights([
      ...flights,
      {
        id: Date.now(),
        cia: "",
        numero: "",
        passageiros: [],
        origem: "",
        destino: "",
      },
    ]);

  const addTransporte = () =>
    setTransports([
      ...transports,
      {
        id: Date.now(),
        tipo: "",
        saida: "",
        chegada: "",
        responsavel: "",
        passageiros: [],
        observacao: "",
      },
    ]);

  const removeFlight = (id) => setFlights(flights.filter((f) => f.id !== id));
  const removeTransporte = (id) =>
    setTransports(transports.filter((t) => t.id !== id));

  // seleção de equipe dentro da sidebar
  const toggleAssignment = (role, id) => {
    setAssignments((prev) => {
      const atual = prev[role] || [];
      const jaTem = atual.includes(id);
      return {
        ...prev,
        [role]: jaTem ? atual.filter((i) => i !== id) : [...atual, id],
      };
    });
  };

  return (
    <Layout>
      <Sidebar />

      <div className="flex w-full h-screen bg-[var(--bg)]">
        {/* ===== CONTEÚDO PRINCIPAL (LOGÍSTICA) ===== */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-md)] shadow space-y-8">
            {/* HEADER */}
            <div className="border-b border-[var(--border)] pb-3">
              <h2 className="panel-title">
                Logística da Viagem
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Configure voos e transporte da equipe.
              </p>
            </div>

            {/* VOOS */}
            <section>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Voos da Equipe</h3>
                <button
                  onClick={addFlight}
                  className="px-4 py-2 bg-[var(--surface-elevated)] text-white rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)]"
                >
                  + Adicionar Voo
                </button>
              </div>

              <div className="mt-4 space-y-6">
                {flights.map((f, i) => (
                  <FlightCard
                    key={f.id}
                    flight={f}
                    colaboradores={colab}
                    onChange={(u) => {
                      const l = [...flights];
                      l[i] = u;
                      setFlights(l);
                    }}
                    onRemove={() => removeFlight(f.id)}
                  />
                ))}
                {flights.length === 0 && (
                  <p className="text-sm text-[var(--text-muted)] italic">
                    Nenhum voo adicionado ainda.
                  </p>
                )}
              </div>
            </section>

            {/* TRANSPORTES */}
            <section>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Transportes</h3>
                <button
                  onClick={addTransporte}
                  className="px-4 py-2 bg-[var(--surface-elevated)] text-white rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)]"
                >
                  + Adicionar Transporte
                </button>
              </div>

              <div className="mt-4 space-y-6">
                {transports.map((t, i) => (
                  <TransporteCard
                    key={t.id}
                    transporte={t}
                    colaboradores={colab}
                    onChange={(u) => {
                      const l = [...transports];
                      l[i] = u;
                      setTransports(l);
                    }}
                    onRemove={() => removeTransporte(t.id)}
                  />
                ))}
                {transports.length === 0 && (
                  <p className="text-sm text-[var(--text-muted)] italic">
                    Nenhum transporte adicionado ainda.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <aside className="w-80">
          <SidebarDireita
            etapaAtual={1}
            flights={flights}
            transports={transports}
            agenda={[]}
            extras={{}}
            colaboradores={colab}
            toggleAssignment={toggleAssignment}
          />
        </aside>
      </div>
    </Layout>
  );
};

export default CriarLogistica;

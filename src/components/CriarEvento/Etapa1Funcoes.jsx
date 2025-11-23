import React, { useState } from "react";
import { Settings, Camera, Volume2, Guitar, ChevronDown } from "lucide-react";

// === Funções da etapa ===
const ROLES = [
  {
    id: "produtor_estrada",
    title: "Produtor de Estrada",
    icon: Settings,
    description: "Responsável pela organização da turnê",
  },
  {
    id: "tecnico_luz",
    title: "Técnico de Luz",
    icon: Camera,
    description: "Responsável pela iluminação do show",
  },
  {
    id: "tecnico_som",
    title: "Técnico de Som",
    icon: Volume2,
    description: "Responsável pelo áudio e som ao vivo",
  },
  {
    id: "roadie",
    title: "Roadie",
    icon: Guitar,
    description: "Auxilia no transporte e montagem dos equipamentos",
  },
];

// === COLABORADORES FAKE ===
const MOCK_COLABS = [
  { id: 1, nome: "Gabriel Souza", tipoUsuario: "produtor_estrada" },
  { id: 2, nome: "Carla Monteiro", tipoUsuario: "produtor_estrada" },
  { id: 3, nome: "Daniel Sena", tipoUsuario: "tecnico_luz" },
  { id: 4, nome: "Maria Oliveira", tipoUsuario: "tecnico_luz" },
  { id: 5, nome: "Leandro Robotino", tipoUsuario: "tecnico_som" },
  { id: 6, nome: "Thiago Moreira", tipoUsuario: "tecnico_som" },
  { id: 7, nome: "Bruno Araújo", tipoUsuario: "roadie" },
  { id: 8, nome: "Carlos Santos", tipoUsuario: "roadie" },
];

const Etapa1Funcoes = ({
  selectedRoles,
  setSelectedRoles,
  assignments,
  setAssignments,
}) => {
  const [activeRole, setActiveRole] = useState(null);

  // Selecionar/deselecionar função ao clicar
  const toggleRole = (roleId) => {
    const isSelected = selectedRoles.includes(roleId);

    if (isSelected) {
      // remove função
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
      const clone = { ...assignments };
      delete clone[roleId];
      setAssignments(clone);
      if (activeRole === roleId) setActiveRole(null);
    } else {
      // adiciona função
      setSelectedRoles([...selectedRoles, roleId]);
      setActiveRole(roleId);
    }
  };

  // Selecionar colaborador dentro de uma função
  const toggleColaborador = (roleId, colabId) => {
    const list = assignments[roleId] || [];
    const newList = list.includes(colabId)
      ? list.filter((x) => x !== colabId)
      : [...list, colabId];

    setAssignments({
      ...assignments,
      [roleId]: newList,
    });
  };

  return (
    <div className="space-y-6">

      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-900">Equipe e Funções</h2>
      <p className="text-gray-600 mb-8">
        Selecione as funções do evento e escolha quem fará parte de cada área.
      </p>

      <div className="flex flex-col space-y-4">

        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRoles.includes(role.id);
          const isOpen = activeRole === role.id;

          // colaboradores para esta função
          const lista = MOCK_COLABS.filter(
            (c) => c.tipoUsuario === role.id
          );
          const selecionados = assignments[role.id] || [];

          return (
            <div
              key={role.id}
              className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden transition-all hover:shadow-lg"
            >
              {/* HEADER DO CARD */}
              <button
                onClick={() => toggleRole(role.id)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected ? "bg-green-50" : "bg-gray-50"
                  }`}>
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? "text-green-600" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-500">{role.description}</p>

                    {selecionados.length > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {selecionados.length} selecionado(s)
                      </p>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* LISTA DE COLABORADORES */}
              {isOpen && (
                <div
                  className="px-4 pb-4 space-y-2"
                  style={{ animation: "fadeIn .25s ease" }}
                >
                  {lista.length === 0 && (
                    <p className="text-gray-500 text-sm p-2">
                      Nenhum colaborador para esta função.
                    </p>
                  )}

                  {lista.map((c) => {
                    const marcado = selecionados.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleColaborador(role.id, c.id)}
                        className={`w-full p-3 rounded-lg border flex justify-between items-center transition-colors ${
                          marcado
                            ? "bg-green-50 border-green-400 hover:bg-green-100"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-gray-700">{c.nome}</p>
                          <p className="text-xs text-gray-400">
                            {c.tipoUsuario}
                          </p>
                        </div>

                        {marcado && (
                          <span className="text-green-600 text-lg font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Etapa1Funcoes;
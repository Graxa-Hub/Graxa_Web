import React, { useState, useMemo } from "react";
import { Settings, Camera, Volume2, Guitar, ChevronDown } from "lucide-react";

// Mapeamento das funções que aparecem na tela
// id precisa bater com "tipoUsuario" retornado pelo backend no futuro
const ROLES = [
  {
    id: "produtor_estrada",
    title: "Produtor de estrada",
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
    title: "Técnico de som",
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

const Etapa1Funcoes = ({
  selectedRoles,
  setSelectedRoles,
  colaboradores = [],
}) => {
  // Função atualmente "aberta" na interface (para listar equipe)
  const [activeRole, setActiveRole] = useState(null);

  // Estado local: quem está vinculado a cada função
  // Exemplo: { produtor_estrada: [4], tecnico_luz: [5] }
  const [assignments, setAssignments] = useState({});

  // Alternar seleção da função (só para marcar/desmarcar como usada no evento)
  const toggleRole = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
      // opcional: também limpar pessoas atribuídas quando desmarca função
      setAssignments((prev) => {
        const clone = { ...prev };
        delete clone[roleId];
        return clone;
      });
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
    setActiveRole(roleId); // ao clicar, abre painel da função
  };

  // Alternar um colaborador dentro de uma função
  const toggleColaboradorNaFuncao = (roleId, colaboradorId) => {
    setAssignments((prev) => {
      const atual = prev[roleId] || [];
      const jaTem = atual.includes(colaboradorId);

      let novo;
      if (jaTem) {
        novo = atual.filter((id) => id !== colaboradorId);
      } else {
        novo = [...atual, colaboradorId];
      }

      return {
        ...prev,
        [roleId]: novo,
      };
    });
  };

  // Colaboradores filtrados pela função ativa
  const colaboradoresDaFuncaoAtiva = useMemo(() => {
    if (!activeRole) return [];
    return colaboradores.filter((c) => c.tipoUsuario === activeRole);
  }, [activeRole, colaboradores]);

  const RoleCard = ({ role }) => {
    const Icon = role.icon;
    const selected = selectedRoles.includes(role.id);
    const countSelecionados = assignments[role.id]?.length || 0;

    return (
      <div
        onClick={() => toggleRole(role.id)}
        className={`bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer border transition-all ${
          selected ? "border-green-600" : "border-transparent"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            selected ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              selected ? "text-green-600" : "text-gray-600"
            }`}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{role.title}</h3>
          <p className="text-sm text-gray-600">{role.description}</p>

          {countSelecionados > 0 && (
            <p className="text-xs text-green-700 mt-1">
              {countSelecionados} pessoa(s) atribuída(s)
            </p>
          )}
        </div>

        <ChevronDown
          className={`text-gray-400 transition-transform ${
            activeRole === role.id ? "rotate-180" : ""
          }`}
        />
      </div>
    );
  };

  return (
    <div className="flex gap-8">
      {/* Coluna esquerda: Funções */}
      <div className="flex-1 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Seleção de Funções e Equipe
        </h2>

        <p className="text-gray-600 mb-4">
          Escolha as funções necessárias para este evento e atribua pessoas da
          equipe a cada função.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROLES.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>

      {/* Coluna direita: Equipe para a função ativa */}
      <aside className="w-80 bg-white rounded-lg shadow p-5">
        {!activeRole && (
          <div className="text-sm text-gray-500">
            Selecione uma função ao lado para ver os colaboradores disponíveis.
          </div>
        )}

        {activeRole && (
          <>
            <h3 className="font-semibold text-gray-800 mb-2">
              Equipe para:{" "}
              {
                ROLES.find((r) => r.id === activeRole)?.title
              }
            </h3>

            {colaboradoresDaFuncaoAtiva.length === 0 && (
              <p className="text-sm text-gray-500">
                Nenhum colaborador cadastrado com este tipo de usuário ainda.
              </p>
            )}

            <div className="space-y-2 mt-3 max-h-[380px] overflow-y-auto">
              {colaboradoresDaFuncaoAtiva.map((colab) => {
                const selecionadosDaRole = assignments[activeRole] || [];
                const marcado = selecionadosDaRole.includes(colab.id);

                return (
                  <button
                    key={colab.id}
                    type="button"
                    onClick={() =>
                      toggleColaboradorNaFuncao(activeRole, colab.id)
                    }
                    className={`w-full flex items-center justify-between p-2 rounded border text-left text-sm ${
                      marcado
                        ? "bg-green-50 border-green-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {colab.nome}
                      </p>
                      <p className="text-xs text-gray-500">
                        {colab.tipoUsuario}
                      </p>
                    </div>
                    {marcado && (
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default Etapa1Funcoes;

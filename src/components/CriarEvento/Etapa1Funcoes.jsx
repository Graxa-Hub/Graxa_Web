import React, { useState, useEffect } from "react";
import { Settings, Camera, Volume2, Guitar, User, ChevronDown, X, UserPlus } from "lucide-react";
import { TIPOS_USUARIO } from "../../constants/tipoUsuario";
import { useColaboradores } from "../../hooks/useColaboradores";

// Mapeamento de ícones por tipo (adicione mais conforme necessário)
const ICONS_MAP = {
  produtorEstrada: Settings,
  tecnicoSom: Volume2,
  tecnicoLuz: Camera,
  road: Guitar,
  artista: User,
  // ...adicione outros tipos se quiser ícones específicos
};

// Gerar roles dinamicamente
const ROLES = TIPOS_USUARIO.map((tipo) => ({
  id: tipo.value,
  title: tipo.label,
  icon: ICONS_MAP[tipo.value] || User, // Ícone padrão se não houver
  description: `Função: ${tipo.label}`,
}));

const Etapa1Funcoes = ({
  selectedRoles,
  setSelectedRoles,
  assignments,
  setAssignments,
}) => {
  const [activeRole, setActiveRole] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [alocando, setAlocando] = useState(false);

  // Hook para colaboradores
  const { colaboradores, loading, error, listarColaboradores } = useColaboradores();

  useEffect(() => {
    listarColaboradores();
  }, [listarColaboradores]);

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

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return "N/A";
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleAlocarUsuarios = async () => {
    // Validação: verificar se há funções selecionadas
    if (selectedRoles.length === 0) {
      alert("Selecione pelo menos uma função antes de alocar usuários.");
      return;
    }

    // Validação: verificar se há colaboradores selecionados
    const totalSelecionados = Object.values(assignments).reduce(
      (acc, arr) => acc + arr.length,
      0
    );

    if (totalSelecionados === 0) {
      alert("Selecione pelo menos um colaborador antes de alocar.");
      return;
    }

    setAlocando(true);

    try {
      // Preparar dados de alocação
      const alocacoes = [];
      
      Object.entries(assignments).forEach(([funcao, colaboradoresIds]) => {
        colaboradoresIds.forEach((colabId) => {
          const colaborador = colaboradores.find(c => c.id === colabId);
          if (colaborador) {
            alocacoes.push({
              colaboradorId: colabId,
              funcao: funcao,
              nomeColaborador: colaborador.nome,
            });
          }
        });
      });

      console.log("Alocações preparadas:", alocacoes);

      // TODO: Aqui você pode fazer a chamada para o backend
      // await alocacaoService.criarAlocacoes(eventoId, alocacoes);

      alert(`✅ ${totalSelecionados} colaborador(es) alocado(s) com sucesso!`);

      // Pode limpar ou manter as seleções conforme necessário
      // setSelectedRoles([]);
      // setAssignments({});

    } catch (error) {
      console.error("Erro ao alocar usuários:", error);
      alert("❌ Erro ao alocar usuários. Tente novamente.");
    } finally {
      setAlocando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipe e Funções</h2>
          <p className="text-gray-600 mt-1">
            Selecione as funções do evento e escolha quem fará parte de cada área.
          </p>
        </div>

        {/* BOTÃO DE ALOCAR */}
        <button
          onClick={handleAlocarUsuarios}
          disabled={alocando || selectedRoles.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedRoles.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
          }`}
        >
          <UserPlus className="w-5 h-5" />
          {alocando ? "Alocando..." : "Alocar Usuários"}
        </button>
      </div>

      {loading && <p className="text-gray-500">Carregando colaboradores...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      {/* Resumo de Seleção */}
      {selectedRoles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>
              {Object.values(assignments).reduce((acc, arr) => acc + arr.length, 0)}
            </strong>{" "}
            colaborador(es) selecionado(s) em{" "}
            <strong>{selectedRoles.length}</strong> função(ões)
          </p>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRoles.includes(role.id);
          const isOpen = activeRole === role.id;

          // colaboradores para esta função
          const lista = colaboradores.filter(
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
                      <div
                        key={c.id}
                        className={`w-full p-3 rounded-lg border flex justify-between items-center transition-colors ${
                          marcado
                            ? "bg-green-50 border-green-400 hover:bg-green-100"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Foto do colaborador */}
                          <img
                            src={c.fotoUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto'}
                            alt={c.nome}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-700">{c.nome}</p>
                            <p className="text-xs text-gray-400 uppercase">
                              {TIPOS_USUARIO.find(t => t.value === c.tipoUsuario)?.label || c.tipoUsuario}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Botão de detalhes */}
                          <button
                            type="button"
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalDetalhes(c);
                            }}
                          >
                            Detalhes
                          </button>
                          
                          {/* Botão de seleção */}
                          <button
                            onClick={() => toggleColaborador(role.id, c.id)}
                            className={`px-3 py-1 rounded transition-colors ${
                              marcado
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {marcado ? "✓ Selecionado" : "Selecionar"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL DE DETALHES */}
      {modalDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Detalhes do Colaborador</h3>
              <button
                onClick={() => setModalDetalhes(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <img
                src={modalDetalhes.fotoUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto'}
                alt={modalDetalhes.nome}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
                }}
              />
              <h4 className="text-2xl font-bold text-gray-800">{modalDetalhes.nome}</h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">CPF:</span>
                <span className="text-gray-800 font-semibold">
                  {modalDetalhes.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Idade:</span>
                <span className="text-gray-800 font-semibold">
                  {calcularIdade(modalDetalhes.dataNascimento)} anos
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Função:</span>
                <span className="text-gray-800 font-semibold uppercase">
                  {TIPOS_USUARIO.find(t => t.value === modalDetalhes.tipoUsuario)?.label || modalDetalhes.tipoUsuario}
                </span>
              </div>
            </div>

            <button
              onClick={() => setModalDetalhes(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Etapa1Funcoes;
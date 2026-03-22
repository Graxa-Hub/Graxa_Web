import React, { useState, useEffect } from "react";
import { Settings, Camera, Volume2, Guitar, User, ChevronDown, UserPlus, CheckCircle } from "lucide-react";
import { TIPOS_USUARIO } from "../../../../constants/tipoUsuario";
import { useColaboradores } from "../../../../hooks/useColaboradores";
import useAlocacao from "../../../../hooks/useAlocacao";
import { useToast } from "../../../../hooks/useToast";
import { Modal } from "../../../../components/ModalEventos/Modal";
import { ToastContainer } from "../../../../components/organisms/ToastContainer";
import { ConfirmModal } from "../../../../components/molecules/ConfirmModal";
import { buttonStyles, cn, sectionSubtitle, sectionTitle, surfaceCard } from "./uiStyles";

// Mapeamento de ícones por tipo
const ICONS_MAP = {
  produtorEstrada: Settings,
  tecnicoSom: Volume2,
  tecnicoLuz: Camera,
  road: Guitar,
  artista: User,
};

// Gerar roles dinamicamente
const ROLES = TIPOS_USUARIO.map((tipo) => ({
  id: tipo.value,
  title: tipo.label,
  icon: ICONS_MAP[tipo.value] || User,
  description: `Função: ${tipo.label}`,
}));

const Etapa1Funcoes = ({
  selectedRoles,
  setSelectedRoles,
  assignments,
  setAssignments,
  showId,
}) => {
  const [activeRole, setActiveRole] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [alocacoesCarregadas, setAlocacoesCarregadas] = useState(false);
  const [alocacoesSalvas, setAlocacoesSalvas] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);

  const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast();

  const { colaboradores, loading, error, listarColaboradores } = useColaboradores();
  const { criarAlocacao, listarPorShow, loading: loadingAlocacao, error: errorAlocacao } = useAlocacao();
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    listarColaboradores();
  }, [listarColaboradores]);

  // Auto-selecionar roles que possuam colaboradores cadastrados
  // para que os acordeões apareçam automaticamente
  useEffect(() => {
    if (colaboradores.length > 0) {
      const rolesComColaboradores = [
        ...new Set(
          colaboradores.map((c) => c.tipoUsuario).filter(Boolean)
        ),
      ];
      setSelectedRoles((prev) => {
        const merged = new Set([...prev, ...rolesComColaboradores]);
        return Array.from(merged);
      });
    }
  }, [colaboradores]);

  useEffect(() => {
    async function carregarAlocacoes() {
      if (!showId || alocacoesCarregadas) return;

      try {
        const alocacoes = await listarPorShow(Number(showId));

        const alocacoesPorTipo = {};
        const rolesComAlocacao = new Set();
        const colaboradoresJaSalvos = {};

        // Agrupar por colaborador e pegar apenas a mais recente
        const alocsMapPorColaborador = {};

        alocacoes.forEach(alocacao => {
          const colabId = alocacao.colaborador?.id;

          if (!colabId) return;

          if (!alocsMapPorColaborador[colabId]) {
            alocsMapPorColaborador[colabId] = alocacao;
          } else {
            // Comparar datas e manter a mais recente
            const dataAtual = new Date(alocacao.dataHoraCriacao);
            const dataSalva = new Date(alocsMapPorColaborador[colabId].dataHoraCriacao);

            if (dataAtual > dataSalva) {
              alocsMapPorColaborador[colabId] = alocacao;
            }
          }
        });

        // Processar apenas as alocações mais recentes
        Object.values(alocsMapPorColaborador).forEach(alocacao => {
          // Converter status para maiúsculo para comparar
          const statusUpper = alocacao.status?.toUpperCase();

          // Ignorar alocações canceladas ou recusadas
          if (statusUpper === 'CANCELADO' || statusUpper === 'RECUSADO') {
            return;
          }

          const colaborador = alocacao.colaborador;
          if (colaborador) {
            const tipoUsuario = colaborador.tipoUsuario;

            if (!alocacoesPorTipo[tipoUsuario]) {
              alocacoesPorTipo[tipoUsuario] = [];
              colaboradoresJaSalvos[tipoUsuario] = [];
            }

            // Só salvar se ainda está PENDENTE ou ACEITO
            if (statusUpper === 'PENDENTE' || statusUpper === 'ACEITO') {
              alocacoesPorTipo[tipoUsuario].push(colaborador.id);
              colaboradoresJaSalvos[tipoUsuario].push(colaborador.id);
              rolesComAlocacao.add(tipoUsuario);
            }
          }
        });

        setAssignments(alocacoesPorTipo);
        setSelectedRoles((prev) => {
          const merged = new Set([...prev, ...rolesComAlocacao]);
          return Array.from(merged);
        });
        setAlocacoesSalvas(colaboradoresJaSalvos);
        setAlocacoesCarregadas(true);

      } catch (error) {
        console.error('[Etapa1Funcoes] Erro ao carregar alocações:', error);
        showError('Erro ao carregar alocações existentes. Tente novamente.');
      }
    }

    carregarAlocacoes();
  }, [showId, listarPorShow, alocacoesCarregadas, showError]);

  const FUNCOES_PRINCIPAIS = ["preProdutor", "produtorEstrada", "produtor", "tecnicoSom"];


  const rolesFiltradas = ROLES.filter(role => {
    if (!searchTerm) {
      return FUNCOES_PRINCIPAIS.includes(role.id);
    }

    return role.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleAccordion = (roleId) => {
    setActiveRole(activeRole === roleId ? null : roleId);
  };

  const toggleColaborador = (roleId, colabId) => {
    const colaboradoresJaSalvos = alocacoesSalvas[roleId] || [];
    const jaSalvoNoBanco = colaboradoresJaSalvos.includes(colabId);

    if (jaSalvoNoBanco) {
      const colaborador = colaboradores.find(c => c.id === colabId);

      // ✅ NOVO: Modal de confirmação em vez de alert
      setConfirmModal({
        type: 'warning',
        title: 'Colaborador já alocado',
        message: `${colaborador?.nome || 'Este colaborador'} já foi alocado e não pode ser removido pela lista. Use a página de alocações para gerenciar.`,
        confirmText: 'Entendi',
        showCancel: false,
        onConfirm: () => setConfirmModal(null)
      });
      return;
    }

    const list = assignments[roleId] || [];
    const newList = list.includes(colabId)
      ? list.filter((x) => x !== colabId)
      : [...list, colabId];

    setAssignments({
      ...assignments,
      [roleId]: newList,
    });

    if (!selectedRoles.includes(roleId)) {
      setSelectedRoles([...selectedRoles, roleId]);
    }

    if (newList.length === 0) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    }
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
    const showIdNumber = Number(showId);

    console.log('[Etapa1Funcoes] Iniciando alocação:', {
      showId,
      showIdNumber,
      isValidNumber: !isNaN(showIdNumber) && showIdNumber > 0
    });

    // Validações com toast
    if (!showId || isNaN(showIdNumber) || showIdNumber <= 0) {
      showError('ID do show inválido. Salve o evento primeiro.');
      return;
    }

    if (selectedRoles.length === 0) {
      showWarning('Selecione pelo menos uma função antes de alocar usuários.');
      return;
    }

    const colaboradoresParaAlocar = [];
    Object.entries(assignments).forEach(([roleId, colabIds]) => {
      const jaSalvos = alocacoesSalvas[roleId] || [];
      const novosColaboradores = colabIds.filter(id => !jaSalvos.includes(id));
      colaboradoresParaAlocar.push(...novosColaboradores);
    });

    if (colaboradoresParaAlocar.length === 0) {
      showInfo('Todos os colaboradores selecionados já foram alocados.');
      return;
    }

    //  Modal de confirmação antes de alocar
    setConfirmModal({
      type: 'info',
      title: 'Confirmar Alocação',
      message: `Confirma a alocação de ${colaboradoresParaAlocar.length} colaborador(es) para este evento?`,
      confirmText: 'Sim, alocar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmModal(null);
        await executarAlocacao(showIdNumber, colaboradoresParaAlocar);
      },
      onCancel: () => setConfirmModal(null)
    });
  };

  // Executa alocação
  const executarAlocacao = async (showIdNumber, colaboradoresParaAlocar) => {
    try {
      console.log('[Etapa1Funcoes] Novos colaboradores a alocar:', colaboradoresParaAlocar);

      // Cria uma alocação por vez para cada colaborador
      const promessas = colaboradoresParaAlocar.map(colaboradorId =>
        criarAlocacao(showIdNumber, colaboradorId)
      );

      const resultados = await Promise.all(promessas);

      console.log('[Etapa1Funcoes] Alocações criadas com sucesso:', resultados);

      // Atualizar alocacoesSalvas com os colaboradores que acabaram de ser alocados
      const novasAlocacoesSalvas = { ...alocacoesSalvas };

      resultados.forEach(alocacao => {
        const tipoUsuario = alocacao.colaborador?.tipoUsuario;
        const colabId = alocacao.colaborador?.id;

        if (tipoUsuario && colabId) {
          if (!novasAlocacoesSalvas[tipoUsuario]) {
            novasAlocacoesSalvas[tipoUsuario] = [];
          }

          //  Adicionar se não existe
          if (!novasAlocacoesSalvas[tipoUsuario].includes(colabId)) {
            novasAlocacoesSalvas[tipoUsuario].push(colabId);
          }
        }
      });

      setAlocacoesSalvas(novasAlocacoesSalvas);

      // Remover dos assignments (para limpar a seleção visual)
      const novasAssignments = { ...assignments };
      Object.keys(novasAssignments).forEach(roleId => {
        novasAssignments[roleId] = novasAssignments[roleId].filter(
          colabId => !colaboradoresParaAlocar.includes(colabId)
        );
      });
      setAssignments(novasAssignments);

      showSuccess(
        `${colaboradoresParaAlocar.length} colaborador(es) alocado(s) com sucesso!`,
        'Alocação Concluída'
      );

    } catch (error) {
      console.error('[Etapa1Funcoes] Erro ao alocar usuários:', error);

      const errorMsg = error.response?.data?.message
        || error.response?.data?.mensagem
        || error.message
        || 'Erro desconhecido';

      showError(
        `Erro ao alocar usuários: ${errorMsg}`,
        'Falha na Alocação'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={sectionTitle}>Equipe e Funções</h2>
          <p className={sectionSubtitle}>
            Selecione as funções do evento e escolha quem fará parte de cada área.
          </p>
        </div>

        <button
          onClick={handleAlocarUsuarios}
          disabled={loadingAlocacao || selectedRoles.length === 0 || !showId}
          className={cn("flex items-center gap-2", selectedRoles.length === 0 || !showId ? buttonStyles.secondary : buttonStyles.accent)}
        >
          <UserPlus className="w-5 h-5" />
          {loadingAlocacao ? "Alocando..." : "Alocar Usuários"}
        </button>
      </div>

      {loading && <p className="text-gray-500">Carregando colaboradores...</p>}
      {error && showError(error)}
      {errorAlocacao && showError(errorAlocacao)}

      {selectedRoles.length > 0 && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-sm text-sky-800">
            <strong>
              {Object.values(assignments).reduce((acc, arr) => acc + arr.length, 0)}
            </strong>{" "}
            colaborador(es) selecionado(s) em{" "}
            <strong>{selectedRoles.length}</strong> função(ões)
          </p>
        </div>
      )}

      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Buscar função..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400"
        />
        {searchTerm.length > 0 && (
          <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] z-50">
            {rolesFiltradas.length === 0 ? (
              <p className="p-3 text-sm text-slate-500">Nenhuma função encontrada.</p>
            ) : (
              rolesFiltradas.map((role) => {
                const jaSelecionado = selectedRoles.includes(role.id);

                return (
                  <button
                    key={role.id}
                    className="flex w-full items-center justify-between p-3 text-left transition hover:bg-slate-50"
                    disabled={jaSelecionado}
                    onClick={() => {
                      if (!jaSelecionado) {
                        setSelectedRoles([...selectedRoles, role.id]);
                      }
                      setSearchTerm(""); // limpa busca
                    }}
                  >
                    <span className="font-medium text-slate-700">{role.title}</span>

                    {jaSelecionado && (
                      <span className="text-sm font-semibold text-emerald-600">
                        Selecionado
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        {ROLES.filter(role => selectedRoles.includes(role.id)).map((role) => {
          const Icon = role.icon;
          const selecionados = assignments[role.id] || [];
          const isSelected = selecionados.length > 0;
          const isOpen = activeRole === role.id;

          const lista = colaboradores.filter(
            (c) => c.tipoUsuario === role.id
          );

          return (
            <div
              key={role.id}
              className={cn(surfaceCard, "overflow-hidden transition-all hover:-translate-y-0.5")}
            >
              <button
                onClick={() => toggleAccordion(role.id)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? "bg-emerald-50" : "bg-slate-100"
                    }`}>
                    <Icon
                      className={`w-6 h-6 ${isSelected ? "text-emerald-600" : "text-slate-500"
                        }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {role.title}
                    </h3>
                    <p className="text-sm text-slate-500">{role.description}</p>

                    {selecionados.length > 0 && (
                      <p className="mt-1 text-xs font-medium text-emerald-600">
                        {selecionados.length} selecionado(s)
                      </p>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isOpen && (
                <div
                  className="px-4 pb-4 space-y-2"
                  style={{ animation: "fadeIn .25s ease" }}
                >
                  {lista.length === 0 && (
                    <p className="p-2 text-sm text-slate-500">
                      Nenhum colaborador para esta função.
                    </p>
                  )}

                  {lista.map((c) => {
                    const marcado = selecionados.includes(c.id);
                    const jaSalvo = (alocacoesSalvas[role.id] || []).includes(c.id);

                    return (
                      <div
                        key={c.id}
                        className={`w-full p-3 rounded-lg border flex justify-between items-center transition-colors ${marcado
                          ? jaSalvo
                            ? "bg-sky-50 border-sky-300"
                            : "bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.fotoUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto'}
                            alt={c.nome}
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
                            }}
                          />
                          <div>
                            <p className="font-medium text-slate-700">{c.nome}</p>
                            <p className="text-xs uppercase text-slate-400">
                              {TIPOS_USUARIO.find(t => t.value === c.tipoUsuario)?.label || c.tipoUsuario}
                            </p>
                            {jaSalvo && (
                              <p className="text-xs font-medium text-sky-600">
                                ✓ Já alocado
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-700 transition hover:bg-sky-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalDetalhes(c);
                            }}
                          >
                            Detalhes
                          </button>

                          <button
                            onClick={() => toggleColaborador(role.id, c.id)}
                            disabled={jaSalvo}
                            className={`px-3 py-1 rounded transition-colors ${jaSalvo
                              ? "bg-slate-900 text-white cursor-not-allowed opacity-75"
                              : marcado
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                          >
                            {jaSalvo ? "✓ Alocado" : marcado ? "✓ Selecionado" : "Selecionar"}
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
      <Modal
        isOpen={modalDetalhes !== null}
        onClose={() => setModalDetalhes(null)}
        title="Detalhes do Colaborador"
        showNavigation={false}
        showFooter={false}
      >
        {modalDetalhes && (
          <div className="flex flex-col items-center gap-6">
            <img
              src={modalDetalhes.fotoUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto'}
              alt={modalDetalhes.nome}
              className="h-32 w-32 rounded-full border-4 border-emerald-100 object-cover"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
              }}
            />
            <h4 className="text-2xl font-semibold text-slate-900">{modalDetalhes.nome}</h4>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-medium text-slate-500">CPF:</span>
                <span className="font-semibold text-slate-900">
                  {modalDetalhes.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-medium text-slate-500">Idade:</span>
                <span className="font-semibold text-slate-900">
                  {calcularIdade(modalDetalhes.dataNascimento)} anos
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-medium text-slate-500">Função:</span>
                <span className="font-semibold uppercase text-slate-900">
                  {TIPOS_USUARIO.find(t => t.value === modalDetalhes.tipoUsuario)?.label || modalDetalhes.tipoUsuario}
                </span>
              </div>
            </div>

            <button
              onClick={() => setModalDetalhes(null)}
              className={cn(buttonStyles.primary, "mt-4 w-full")}
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmModal && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          type={confirmModal.type}
          loading={loadingAlocacao}
        />
      )}

      {/* CONTAINER DE TOASTS */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
        position="top-right"
      />
    </div>
  );
};

export default Etapa1Funcoes;
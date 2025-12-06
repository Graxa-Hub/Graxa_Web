import React, { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  RefreshCw,
  Filter,
  Trash2
} from "lucide-react";
import { useAlocacao } from "../../hooks/useAlocacao";
import { useToast } from "../../hooks/useToast";
import { useNotificacoes } from "../../hooks/useNotificacoes"; // ✅ IMPORTAR
import { TIPOS_USUARIO } from "../../constants/tipoUsuario";
import { ConfirmModal } from "../UI/ConfirmModal";
import { ToastContainer } from "../UI/ToastContainer";

const STATUS_CONFIG = {
  ACEITO: {
    label: "Aceitas",
    icon: CheckCircle,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    badgeColor: "bg-green-100"
  },
  PENDENTE: {
    label: "Pendentes",
    icon: Clock,
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    badgeColor: "bg-yellow-100"
  },
  RECUSADO: {
    label: "Recusadas",
    icon: XCircle,
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    badgeColor: "bg-red-100"
  },
  CANCELADO: {
    label: "Canceladas",
    icon: XCircle,
    color: "gray",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    textColor: "text-gray-700",
    badgeColor: "bg-gray-100"
  }
};

const VisualizarAlocacoes = ({ showId }) => {
  const [alocacoes, setAlocacoes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [cancelando, setCancelando] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { listarPorShow, responderAlocacao, loading, error } = useAlocacao();
  
  // ✅ USAR HOOK - criarNotificacao agora está disponível
  const { criarNotificacao } = useNotificacoes();

  const carregarAlocacoes = useCallback(async () => {
    if (!showId) return;
    
    try {
      const dados = await listarPorShow(showId);
      console.log('📊 Alocações carregadas:', dados.length);
      setAlocacoes(dados || []);
    } catch (err) {
      console.error('Erro ao carregar alocações:', err);
    }
  }, [showId, listarPorShow]);

  useEffect(() => {
    carregarAlocacoes();
  }, [carregarAlocacoes]);

  useEffect(() => {
    if (error) {
      showError('Erro ao processar solicitação. Tente novamente.');
    }
  }, [error, showError]);

  const handleCancelarAlocacao = useCallback((alocacao) => {
    setConfirmModal({
      type: 'error',
      title: 'Cancelar Alocação',
      message: `Tem certeza que deseja cancelar a alocação de ${alocacao.colaborador?.nome || 'este colaborador'}?\n\n⚠️ IMPORTANTE:\n• O status mudará para "CANCELADO"\n• O colaborador será notificado automaticamente\n• Esta ação não pode ser desfeita`,
      confirmText: 'Sim, cancelar',
      cancelText: 'Não, manter',
      alocacao: alocacao,
      onConfirm: () => confirmarCancelamento(alocacao),
      onCancel: () => setConfirmModal(null)
    });
  }, []);

  // ✅ FUNÇÃO para criar notificação de cancelamento
  const criarNotificacaoCancelamento = useCallback(async (alocacao) => {
    try {
      const nomeShow = alocacao.show?.nomeEvento || 'evento';
      const mensagem = `Sua participação no show "${nomeShow}" foi cancelada pela produção. Entre em contato caso tenha dúvidas sobre este cancelamento.`;
      
      console.log('📧 Enviando notificação de cancelamento para:', alocacao.colaborador?.nome);
      
      // ✅ USAR criarNotificacao do hook
      await criarNotificacao(
        alocacao.colaborador.id,
        mensagem,
        'ALOCACAO_CANCELADA'
      );
      
      console.log('✅ Notificação enviada com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error);
      // Não falha o cancelamento por causa da notificação
    }
  }, [criarNotificacao]);

  const confirmarCancelamento = useCallback(async (alocacao) => {
    setCancelando(alocacao.id);
    setConfirmModal(null);
    
    try {
      // ✅ 1. CANCELAR a alocação
      await responderAlocacao(alocacao.id, 'CANCELADO');
      console.log('✅ Alocação cancelada:', alocacao.id);
      
      // ✅ 2. ENVIAR NOTIFICAÇÃO para o colaborador
      if (alocacao.colaborador?.id) {
        await criarNotificacaoCancelamento(alocacao);
      }
      
      // ✅ 3. RECARREGAR alocações
      await carregarAlocacoes();
      
      showSuccess(
        `Alocação de ${alocacao.colaborador?.nome || 'colaborador'} foi cancelada! Uma notificação foi enviada automaticamente.`,
        'Alocação Cancelada ✅'
      );
    } catch (err) {
      console.error('❌ Erro ao cancelar alocação:', err);
      
      let errorMsg = 'Erro desconhecido';
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      showError(
        `Falha ao cancelar alocação: ${errorMsg}`,
        'Erro no Cancelamento'
      );
    } finally {
      setCancelando(null);
    }
  }, [responderAlocacao, carregarAlocacoes, showSuccess, showError, criarNotificacaoCancelamento]);

  const normalizarStatus = (status) => {
    if (!status) return "PENDENTE";
    return status.toString().trim().toUpperCase();
  };

  const agruparPorStatus = () => {
    const grupos = {
      ACEITO: [],
      PENDENTE: [],
      RECUSADO: [],
      CANCELADO: []
    };

    alocacoes.forEach(alocacao => {
      const statusNormalizado = normalizarStatus(alocacao.status);
      
      if (grupos[statusNormalizado]) {
        grupos[statusNormalizado].push(alocacao);
      } else {
        console.warn(`Status desconhecido: "${alocacao.status}" - colocando em PENDENTE`);
        grupos.PENDENTE.push(alocacao);
      }
    });

    return grupos;
  };

  const alocacoesAgrupadas = agruparPorStatus();
  
  const alocacoesFiltradas = filtroStatus === "TODOS" 
    ? alocacoes 
    : alocacoes.filter(a => normalizarStatus(a.status) === filtroStatus);

  const formatarData = (dataString) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <p className="text-yellow-800 font-medium">
          Salve o evento primeiro para visualizar as alocações
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alocações do Evento</h2>
          <p className="text-gray-600 mt-1">
            Visualize e gerencie o status de todas as alocações ({alocacoes.length} total)
          </p>
        </div>

        <button
          onClick={carregarAlocacoes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const Icon = config.icon;
          const count = alocacoesAgrupadas[status]?.length || 0;

          return (
            <div
              key={status}
              className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg ${
                filtroStatus === status ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              onClick={() => setFiltroStatus(filtroStatus === status ? "TODOS" : status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${config.textColor}`}>
                    {config.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {count}
                  </p>
                </div>
                <div className={`${config.badgeColor} p-3 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${config.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtro ativo */}
      {filtroStatus !== "TODOS" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Exibindo apenas: {STATUS_CONFIG[filtroStatus].label} ({alocacoesFiltradas.length})
            </span>
          </div>
          <button
            onClick={() => setFiltroStatus("TODOS")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpar filtro
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600 mt-2">Carregando alocações...</p>
        </div>
      )}

      {/* Lista de alocações */}
      {!loading && alocacoesFiltradas.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            {filtroStatus === "TODOS" 
              ? "Nenhuma alocação encontrada" 
              : `Nenhuma alocação ${STATUS_CONFIG[filtroStatus].label.toLowerCase()}`}
          </p>
        </div>
      )}

      {!loading && alocacoesFiltradas.length > 0 && (
        <div className="space-y-3">
          {alocacoesFiltradas.map((alocacao) => {
            const statusNormalizado = normalizarStatus(alocacao.status);
            const config = STATUS_CONFIG[statusNormalizado] || STATUS_CONFIG.PENDENTE;
            const Icon = config.icon;
            const podeSerCancelada = statusNormalizado === 'PENDENTE' || statusNormalizado === 'ACEITO';

            return (
              <div
                key={alocacao.id}
                className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={alocacao.colaborador?.fotoUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto'}
                      alt={alocacao.colaborador?.nome || 'Colaborador'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
                      }}
                    />

                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {alocacao.colaborador?.nome || 'Nome não disponível'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {alocacao.colaborador?.tipoUsuario 
                          ? TIPOS_USUARIO.find(t => t.value === alocacao.colaborador.tipoUsuario)?.label || alocacao.colaborador.tipoUsuario
                          : 'Função não definida'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Criado em: {formatarData(alocacao.dataHoraCriacao)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {alocacao.dataHoraResposta && (
                      <div className="text-right text-xs text-gray-600">
                        <p>Respondido em:</p>
                        <p className="font-medium">{formatarData(alocacao.dataHoraResposta)}</p>
                      </div>
                    )}

                    <div className={`${config.badgeColor} px-4 py-2 rounded-lg flex items-center gap-2`}>
                      <Icon className={`w-5 h-5 ${config.textColor}`} />
                      <span className={`font-semibold ${config.textColor}`}>
                        {config.label}
                      </span>
                    </div>

                    {podeSerCancelada && (
                      <button
                        onClick={() => handleCancelarAlocacao(alocacao)}
                        disabled={cancelando === alocacao.id}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Cancelar alocação"
                      >
                        {cancelando === alocacao.id ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
          loading={cancelando !== null}
        />
      )}

      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
        position="top-right"
      />
    </div>
  );
};

export default VisualizarAlocacoes;
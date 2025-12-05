import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  X, 
  Music, 
  Star,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAlocacao } from '../../hooks/useAlocacao';
import { useToast } from '../../hooks/useToast';
import { ConfirmModal } from '../UI/ConfirmModal';
import { ToastContainer } from '../UI/ToastContainer';
import { obterFuncao, obterIcone, obterCategoria } from '../../utils/tipoUsuarioUtils';

export function AlocacaoModal({ isOpen, onClose, notificacao, onResponse }) {
  const { responderAlocacao, loading: loadingResponse } = useAlocacao();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, tipo: null });
  
  // ✅ Hook de toast
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const alocacao = notificacao?.alocacao;
  const show = alocacao?.show;
  const colaborador = alocacao?.colaborador;
  const local = show?.local;

  const formatarData = (data) => {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarDataCurta = (data) => {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obterCorStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'aceito':
      case 'aceita':
      case 'confirmada':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'recusado':
      case 'recusada':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'cancelado':
      case 'cancelada':
        return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'pendente':
      default:
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    }
  };

  const formatarEndereco = (endereco) => {
    if (!endereco) return '';
    const { logradouro, numero, bairro, cidade, estado, cep } = endereco;
    return `${logradouro}, ${numero} - ${bairro}, ${cidade}/${estado} - CEP: ${cep}`;
  };

  const handleAccept = () => {
    setConfirmModal({ isOpen: true, tipo: 'aceitar' });
  };

  const handleReject = () => {
    setConfirmModal({ isOpen: true, tipo: 'recusar' });
  };

  const handleConfirm = async () => {
  const aceitar = confirmModal.tipo === 'aceitar';
  
  try {
    const status = aceitar ? 'ACEITO' : 'RECUSADO';
    await responderAlocacao(alocacao.id, status);
    
    // ✅ NOVO: Atualizar estado local da alocação com novo status
    const alocacaoAtualizada = {
      ...alocacao,
      status: status.toLowerCase(),
      dataHoraResposta: new Date().toISOString()
    };
    
    setConfirmModal({ isOpen: false, tipo: null });
    
    showSuccess(
      aceitar 
        ? `Convite aceito com sucesso! Você confirmou participação no show "${show?.nomeEvento || 'show'}".`
        : `Convite recusado. Obrigado por responder.`,
      aceitar ? 'Convite Aceito!' : 'Convite Recusado'
    );
    
    // ✅ Chamar callback para recarregar notificações no componente pai
    // Passar a alocação atualizada
    setTimeout(() => {
      onResponse(aceitar, alocacaoAtualizada);
      onClose();
    }, 500);
    
  } catch (error) {
    console.error('❌ Erro ao responder alocação:', error);
    
    let errorMsg = 'Erro desconhecido';
    
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
      if (errorMsg.includes('Invalid boolean value')) {
        errorMsg = 'Erro de validação no servidor. Tente novamente.';
      } else if (errorMsg.includes('Alocação não encontrada')) {
        errorMsg = 'Esta alocação não foi encontrada. A página será atualizada.';
      }
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    showError(
      `Erro ao responder alocação: ${errorMsg}`,
      'Falha na Resposta'
    );
  }
};

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-2"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden z-3">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Convite para Show
                  </h2>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <span>{obterIcone(colaborador?.tipoUsuario)}</span>
                    {obterFuncao(colaborador?.tipoUsuario)}
                    <span className="text-blue-200 text-xs">
                      • {obterCategoria(colaborador?.tipoUsuario)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Mensagem */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900 font-medium text-sm leading-relaxed">
                      {notificacao.mensagem}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card do Show */}
              {show ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Header do Show */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {show.nomeEvento}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do Show */}
                  <div className="p-6 space-y-4">
                    {/* Data e Hora */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg mt-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Data do Show</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatarData(show.dataInicio)}
                        </p>
                        {show.dataFim && show.dataFim !== show.dataInicio && (
                          <p className="text-xs text-gray-500 mt-1">
                            Término: {formatarDataCurta(show.dataFim)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Local */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg mt-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Local</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {local?.nome || 'Local não informado'}
                        </p>
                        {local?.endereco && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatarEndereco(local.endereco)}
                          </p>
                        )}
                        {local?.capacidade && (
                          <p className="text-xs text-gray-400 mt-1">
                            Capacidade: {local.capacidade.toLocaleString()} pessoas
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sua Função */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg mt-1">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Sua Função</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 gap-2">
                            <span>{obterIcone(colaborador?.tipoUsuario)}</span>
                            {obterFuncao(colaborador?.tipoUsuario)}
                          </span>
                        </div>
                        {colaborador?.nome && (
                          <p className="text-xs text-gray-500 mt-2">
                            Colaborador: {colaborador.nome}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status da Alocação */}
                    {alocacao?.status && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg mt-1">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Status</p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${obterCorStatus(alocacao.status)}`}>
                              {alocacao.status.toUpperCase()}
                            </span>
                          </div>
                          {alocacao.dataHoraCriacao && (
                            <p className="text-xs text-gray-500 mt-1">
                              Criado em: {formatarDataCurta(alocacao.dataHoraCriacao)}
                            </p>
                          )}
                          {alocacao.dataHoraResposta && (
                            <p className="text-xs text-gray-500">
                              Respondido em: {formatarDataCurta(alocacao.dataHoraResposta)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Descrição */}
                    {show.descricao && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-3">Sobre o Show</h4>
                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                          {show.descricao}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-900 font-medium text-sm">
                        Detalhes do show não disponíveis no momento.
                      </p>
                      {colaborador?.tipoUsuario && (
                        <p className="text-yellow-700 text-xs mt-1 flex items-center gap-1">
                          Sua função: 
                          <span className="font-medium flex items-center gap-1">
                            {obterIcone(colaborador.tipoUsuario)} {obterFuncao(colaborador.tipoUsuario)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Informações importantes */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-yellow-100 rounded-full mt-1">
                    <Info className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">⚠️ Importante:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Ao aceitar, você se compromete a comparecer no horário</li>
                      <li>• Chegue 30 minutos antes do início</li>
                      <li>• Em caso de imprevistos, comunique a produção</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Metadados da notificação */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    {notificacao.tipo?.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>
                    Recebido em {formatarDataCurta(notificacao.dataHoraCriacao)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer com botões - APENAS para status PENDENTE */}
          {alocacao?.status?.toLowerCase() === 'pendente' && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={loadingResponse}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  {loadingResponse ? 'Processando...' : 'Recusar'}
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loadingResponse}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  {loadingResponse ? 'Processando...' : 'Aceitar'}
                </button>
              </div>
            </div>
          )}

          {/* Status já respondido */}
          {alocacao?.status && alocacao.status.toLowerCase() !== 'pendente' && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {(() => {
                    const status = alocacao.status.toLowerCase();
                    if (status === 'aceito' || status === 'aceita' || status === 'confirmada') {
                      return '✅ Você já aceitou este convite';
                    } else if (status === 'cancelado' || status === 'cancelada') {
                      return '🚫 Esta alocação foi cancelada pela produção';
                    } else {
                      return '❌ Você recusou este convite';
                    }
                  })()}
                </p>
                {alocacao.dataHoraResposta && (
                  <p className="text-xs text-gray-400 mt-1">
                    {alocacao.status.toLowerCase() === 'cancelado' || alocacao.status.toLowerCase() === 'cancelada'
                      ? `Cancelado em: ${formatarDataCurta(alocacao.dataHoraResposta)}`
                      : `Respondido em: ${formatarDataCurta(alocacao.dataHoraResposta)}`
                    }
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, tipo: null })}
        onConfirm={handleConfirm}
        title={confirmModal.tipo === 'aceitar' ? '✅ Aceitar Convite' : '❌ Recusar Convite'}
        message={
          confirmModal.tipo === 'aceitar'
            ? `Confirma sua participação no show "${show?.nomeEvento || 'show'}"? Você se compromete a comparecer no horário estabelecido.`
            : `Tem certeza que deseja recusar o convite para "${show?.nomeEvento || 'show'}"? Esta ação não pode ser desfeita.`
        }
        confirmText={confirmModal.tipo === 'aceitar' ? 'Sim, aceitar!' : 'Sim, recusar'}
        cancelText="Cancelar"
        type={confirmModal.tipo === 'aceitar' ? 'success' : 'error'}
        loading={loadingResponse}
      />

      {/* ✅ Container de toasts */}
      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
        position="top-right"
      />
    </>
  );
}
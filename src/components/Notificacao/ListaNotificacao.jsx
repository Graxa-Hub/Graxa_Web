import React from "react";
import { Bell, Check, Clock, ChevronRight, XCircle, AlertTriangle } from "lucide-react";

export const ListaNotificacao = ({
  notificacaoLista = [],
  onMarkAsRead,
  onNotificationClick,
}) => {
  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";

    try {
      let data;

      if (dataString instanceof Date) {
        data = dataString;
      } else if (typeof dataString === "string") {
        data = new Date(dataString.replace(/\[.*\]/, ""));
      } else if (typeof dataString === "number") {
        data = new Date(dataString);
      } else {
        return "Formato inválido";
      }

      if (isNaN(data.getTime())) {
        return "Data inválida";
      }

      // ✅ Melhor formatação de tempo relativo
      const agora = new Date();
      const diffMs = agora - data;
      const diffMinutos = Math.floor(diffMs / (1000 * 60));
      const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutos < 1) {
        return "Agora mesmo";
      } else if (diffMinutos < 60) {
        return `${diffMinutos}m atrás`;
      } else if (diffHoras < 24) {
        return `${diffHoras}h atrás`;
      } else if (diffDias < 7) {
        return `${diffDias}d atrás`;
      } else {
        return data.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      return "Erro na data";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "alocacao":
      case "alocacao_show":
      case "convite_alocacao":
        return "bg-[var(--surface-hover)] text-blue-800 border-[var(--border)]";
      case "alocacao_cancelada":  // ✅ NOVO TIPO
        return "bg-[var(--surface-hover)] text-[var(--accent)] border-[var(--border)]";
      case "show":
        return "bg-[var(--surface-hover)] text-green-800 border-green-200";
      case "urgente":
        return "bg-[var(--surface-hover)] text-[var(--accent)] border-[var(--border)]";
      case "teste":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--border)]";
    }
  };

  const isNotificationClickable = (notificacao) => {
    return notificacao.tipo?.toLowerCase().includes("alocacao");
  };

  // ✅ FUNÇÃO para renderizar notificação de cancelamento
  const renderCancelamentoContent = (notificacao) => {
    const alocacao = notificacao?.alocacao;
    const show = alocacao?.show;

    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 mt-2">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-[var(--surface-hover)] rounded-full mt-1">
            <XCircle className="w-4 h-4 text-[var(--accent)]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-red-900 text-sm mb-2">
              🚫 Participação Cancelada
            </h4>
            
            {show && (
              <div className="space-y-1 mb-3">
                <div className="text-xs text-[var(--accent)]">
                  <strong>Show:</strong> {show.nomeEvento}
                </div>
                <div className="text-xs text-[var(--accent)]">
                  <strong>Data:</strong> {formatarData(show.dataInicio)}
                </div>
                {show.local?.nome && (
                  <div className="text-xs text-[var(--accent)]">
                    <strong>Local:</strong> {show.local.nome}
                  </div>
                )}
              </div>
            )}

            {/* ✅ Informações importantes */}
            <div className="bg-[var(--surface-hover)]/50 border border-red-300 rounded p-2 mb-2">
              <div className="flex items-start gap-1">
                <AlertTriangle className="w-3 h-3 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <div className="text-xs text-[var(--accent)]">
                  <p className="font-medium mb-1">⚠️ O que fazer:</p>
                  <ul className="space-y-0.5 text-xs">
                    <li>• Você não precisa comparecer</li>
                    <li>• Verifique seu calendário</li>
                    <li>• Contate a produção se tiver dúvidas</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--accent)]">
              💬 Dúvidas? Entre em contato com a produção
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Melhor organização por data
  const organizarPorData = (notificacoes) => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    return notificacoes.reduce((grupos, notificacao) => {
      const data = new Date(notificacao.dataHoraCriacao);
      let grupo;

      if (data.toDateString() === hoje.toDateString()) {
        grupo = "Hoje";
      } else if (data.toDateString() === ontem.toDateString()) {
        grupo = "Ontem";
      } else {
        grupo = data.toLocaleDateString("pt-BR");
      }

      if (!grupos[grupo]) {
        grupos[grupo] = [];
      }
      grupos[grupo].push(notificacao);
      return grupos;
    }, {});
  };

  if (notificacaoLista.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Bell size={48} className="text-[var(--text-muted)] mb-3" />
        <p className="text-[var(--text-muted)] text-sm text-center">
          Nenhuma notificação encontrada
        </p>
        <p className="text-[var(--text-muted)] text-xs text-center mt-1">
          Você será notificado sobre alocações e atualizações
        </p>
      </div>
    );
  }

  const gruposNotificacoes = organizarPorData(notificacaoLista);

  return (
    <div className="flex-1">
      {Object.entries(gruposNotificacoes).map(([grupo, notificacoes]) => (
        <div key={grupo}>
          {/* ✅ Header do grupo de data */}
          <div className="bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide border-b border-[var(--border)]">
            {grupo}
          </div>
          
          {/* ✅ Lista de notificações do grupo */}
          <ul className="divide-y divide-gray-100">
            {notificacoes.map((notificacao) => {
              const isClickable = isNotificationClickable(notificacao);
              const isCancelamento = notificacao.tipo?.toLowerCase() === 'alocacao_cancelada';

              return (
                <li
                  key={notificacao.id}
                  className={`relative p-4 transition-all duration-200 ${
                    !notificacao.lida
                      ? isCancelamento 
                        ? "bg-[var(--surface)]/50 border-l-4 border-l-red-400"
                        : "bg-[var(--surface)]/50 border-l-4 border-l-blue-400"
                      : ""
                  } ${
                    isClickable && !isCancelamento
                      ? "hover:bg-[var(--surface-hover)] cursor-pointer hover:"
                      : isCancelamento
                      ? "hover:bg-[var(--surface)]"
                      : "hover:bg-[var(--surface)]"
                  }`}
                  onClick={() => {
                    // ✅ CANCELAMENTO não é clicável, mas marca como lida
                    if (isCancelamento) {
                      if (!notificacao.lida && onMarkAsRead) {
                        onMarkAsRead(notificacao.id);
                      }
                    } else if (isClickable) {
                      onNotificationClick?.(notificacao);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* ✅ Badge do tipo melhorado */}
                      {notificacao.tipo && (
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getTipoColor(
                              notificacao.tipo
                            )}`}
                          >
                            {(() => {
                              const tipo = notificacao.tipo.replace("_", " ").toUpperCase();
                              if (tipo === 'ALOCACAO CANCELADA') {
                                return '🚫 CANCELADO';
                              }
                              return tipo;
                            })()}
                          </span>
                          
                          {/* ✅ Indicador de nova notificação */}
                          {!notificacao.lida && (
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                              isCancelamento ? 'text-[var(--accent)]' : 'text-[var(--info)]'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                isCancelamento ? 'bg-[var(--surface)]0' : 'bg-[var(--surface)]0'
                              }`}></span>
                              {isCancelamento ? 'Importante' : 'Nova'}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className={`text-sm mb-2 ${
                            !notificacao.lida 
                              ? "font-medium text-[var(--text-primary)]" 
                              : "text-[var(--text-secondary)]"
                          }`}>
                            {notificacao.mensagem}
                          </p>

                          {/* ✅ CONTEÚDO ESPECÍFICO PARA CANCELAMENTO */}
                          {isCancelamento && renderCancelamentoContent(notificacao)}

                          {/* ✅ Call to action melhorado */}
                          {isClickable && !isCancelamento && (
                            <div className="flex items-center gap-1 text-xs text-[var(--info)] font-medium mb-2">
                              {notificacao.lida
                                ? "Ver detalhes"
                                : "Clique para responder"}
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          )}

                          {/* ✅ Timestamp melhorado */}
                          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Clock className="w-3 h-3" />
                            <span>{formatarData(notificacao.dataHoraCriacao)}</span>
                          </div>

                          {notificacao.colaborador?.nome && (
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              Para: {notificacao.colaborador.nome}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ✅ Botão de marcar como lida melhorado */}
                    {!notificacao.lida && onMarkAsRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notificacao.id);
                        }}
                        className={`p-2 rounded-full transition-colors group ${
                          isCancelamento 
                            ? 'text-[var(--accent)] hover:bg-[var(--surface-hover)]' 
                            : 'text-[var(--info)] hover:bg-[var(--surface-hover)]'
                        }`}
                        title="Marcar como lida"
                      >
                        <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* ✅ Indicador visual de clicável - APENAS para convites */}
                  {isClickable && !isCancelamento && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

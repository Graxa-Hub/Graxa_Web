import { Input } from "../ModalEventos/Input";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

// Função para formatar CPF com máscara
const formatarCPF = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
  if (apenasNumeros.length <= 3) return apenasNumeros;
  if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
};

export function IntegranteFormStep({
  draft,
  errors,
  handleIntegranteChange,
  adicionarIntegrante,
  removerIntegrante,
}) {
  const [showAddMultiple, setShowAddMultiple] = useState(false);
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(1);

  const adicionarMultiplos = () => {
    for (let i = 0; i < quantidadeAdicionar; i++) {
      adicionarIntegrante();
    }
    setQuantidadeAdicionar(1);
    setShowAddMultiple(false);
  };

  const handleCPFChange = (index, valor) => {
    const formatado = formatarCPF(valor);
    handleIntegranteChange(index, "cpf", formatado);
  };

  return (
    <div className="space-y-4 overflow-visible">
      {errors.integrantes && (
        <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--accent)]">
          {errors.integrantes}
        </div>
      )}
      <div className="bg-[var(--surface-elevated)] py-3 px-2 border-b border-[var(--border)] flex items-center justify-between gap-2 -mx-4 px-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Integrantes da Banda
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {draft.integrantes.length} integrante{draft.integrantes.length !== 1 ? "s" : ""} adicionado{draft.integrantes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={adicionarIntegrante}
            className="px-3 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Adicionar 1
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMultiple(!showAddMultiple)}
              className="px-3 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Vários
            </button>
            {showAddMultiple && (
              <div className="absolute top-full right-0 mt-1 bg-[var(--surface-card)] border border-[var(--border)] rounded-lg shadow-lg p-3 z-50 min-w-max">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Quantos integrantes?
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={quantidadeAdicionar}
                    onChange={(e) => setQuantidadeAdicionar(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border border-[var(--border)] rounded text-sm text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={adicionarMultiplos}
                    className="px-3 py-1 bg-[var(--accent)] text-white text-sm rounded hover:opacity-90 transition-opacity"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de integrantes */}
      {draft.integrantes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--surface-hover)]">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
            Nenhum integrante adicionado
          </p>
          <p className="text-xs text-[var(--text-muted)] text-center mb-4">
            Adicione os membros da banda clicando em um dos botões acima
          </p>
          <button
            type="button"
            onClick={adicionarIntegrante}
            className="px-3 py-2 text-xs font-medium bg-[var(--accent)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Primeiro Integrante
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {draft.integrantes.map((integrante, i) => (
            <div
              key={i}
              className="p-4 border border-[var(--border)] rounded-lg bg-[var(--surface-card)] space-y-3 hover:border-[var(--accent)] transition-colors relative group"
            >
              {/* Header da card */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-secondary)]">
                      Integrante
                    </p>
                    {integrante.id && (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Cadastrado
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removerIntegrante(i)}
                  className="p-1.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 rounded-[var(--radius-sm)] transition-colors flex-shrink-0"
                  title="Remover integrante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Campos de entrada */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">
                    Nome *
                  </label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={integrante.nome}
                    onChange={(e) =>
                      handleIntegranteChange(i, "nome", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">
                    CPF *
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={integrante.cpf}
                    onChange={(e) => handleCPFChange(i, e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-sm)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dica de rodapé */}
      {draft.integrantes.length > 0 && (
        <div className="text-xs text-[var(--text-muted)] bg-[var(--surface-hover)] p-3 rounded-lg border border-[var(--border)]">
          💡 <strong>Dica:</strong> Preencha nome e CPF de todos os integrantes. Você pode adicionar, editar ou remover membros a qualquer momento.
        </div>
      )}
    </div>
  );
}

import { Input } from "../../../../components/ModalEventos/Input";
import { Trash2 } from "lucide-react";

export function IntegranteFormStep({ draft, errors, handleIntegranteChange, adicionarIntegrante, removerIntegrante }) {
    return (
        <div className="space-y-4">
            {errors.integrantes && (
                <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--accent)]">
                    {errors.integrantes}
                </div>
            )}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                    Integrantes ({draft.integrantes.length})
                </h3>
                <button
                    type="button"
                    onClick={adicionarIntegrante}
                    className="px-3 py-3 text-md bg-[var(--surface)]0 text-white rounded-[var(--radius-md)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                    + Adicionar Integrante
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.integrantes.map((integrante, i) => (
                    <div
                        key={i}
                        className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)] space-y-3 relative"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                                Integrante {i + 1}
                                {integrante.id && (
                                    <span className="ml-2 text-xs text-[var(--success)]">
                                        (Cadastrado)
                                    </span>
                                )}
                            </h4>
                            <button
                                type="button"
                                onClick={() => removerIntegrante(i)}
                                className="text-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                                title="Remover integrante"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <Input
                            label="Nome"
                            placeholder="Nome completo"
                            value={integrante.nome}
                            onChange={(e) =>
                                handleIntegranteChange(i, "nome", e.target.value)
                            }
                        />
                        <Input
                            label="CPF"
                            placeholder="000.000.000-00"
                            value={integrante.cpf}
                            onChange={(e) =>
                                handleIntegranteChange(i, "cpf", e.target.value)
                            }
                        />
                    </div>
                ))}
            </div>
            {draft.integrantes.length === 0 && (
                <div className="text-center py-8 text-[var(--text-muted)]">
                    <p>Nenhum integrante adicionado.</p>
                    <p className="text-sm">
                        Clique em "Adicionar Integrante" para começar.
                    </p>
                </div>
            )}
        </div>
    );
}
import { Input } from "../../../../components/ModalEventos/Input";
import { Trash2 } from "lucide-react";

export function IntegranteFormStep({ draft, errors, handleIntegranteChange, adicionarIntegrante, removerIntegrante }) {
    return (
        <div className="space-y-4">
            {errors.integrantes && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {errors.integrantes}
                </div>
            )}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                    Integrantes ({draft.integrantes.length})
                </h3>
                <button
                    type="button"
                    onClick={adicionarIntegrante}
                    className="px-3 py-3 text-md bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    + Adicionar Integrante
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.integrantes.map((integrante, i) => (
                    <div
                        key={i}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3 relative"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                                Integrante {i + 1}
                                {integrante.id && (
                                    <span className="ml-2 text-xs text-green-600">
                                        (Cadastrado)
                                    </span>
                                )}
                            </h4>
                            <button
                                type="button"
                                onClick={() => removerIntegrante(i)}
                                className="text-red-500 hover:text-red-700 transition-colors"
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
                <div className="text-center py-8 text-gray-500">
                    <p>Nenhum integrante adicionado.</p>
                    <p className="text-sm">
                        Clique em "Adicionar Integrante" para começar.
                    </p>
                </div>
            )}
        </div>
    );
}
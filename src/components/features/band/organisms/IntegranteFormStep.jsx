import { Input } from "../ModalEventos/Input";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

export function IntegranteFormStep({ draft, errors, handleIntegranteChange, adicionarIntegrante, removerIntegrante }) {
    const [showAddMultiple, setShowAddMultiple] = useState(false);
    const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(1);

    const adicionarMultiplos = () => {
        for (let i = 0; i < quantidadeAdicionar; i++) {
            adicionarIntegrante();
        }
        setQuantidadeAdicionar(1);
        setShowAddMultiple(false);
    };

    return (
        <div className="space-y-4">
            {errors.integrantes && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {errors.integrantes}
                </div>
            )}
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-gray-700">
                    Integrantes ({draft.integrantes.length})
                </h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={adicionarIntegrante}
                        className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> 1 Integrante
                    </button>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowAddMultiple(!showAddMultiple)}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Vários
                        </button>
                        {showAddMultiple && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-max">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantos integrantes?
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={quantidadeAdicionar}
                                        onChange={(e) => setQuantidadeAdicionar(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={adicionarMultiplos}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
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
                        Clique em "1 Integrante" ou "Vários" para começar.
                    </p>
                </div>
            )}
        </div>
    );
}
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
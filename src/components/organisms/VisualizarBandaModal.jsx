import React from "react";
import { Modal } from "../ModalEventos/Modal";
import { Users, Music, User, Mail } from "lucide-react";

export function VisualizarBandaModal({ banda, onClose }) {
    if (!banda) return null;

    const integrantes = Array.isArray(banda.integrantes) ? banda.integrantes : [];

    return (
        <Modal
            isOpen={!!banda}
            onClose={onClose}
            title={`${banda.nome}`}
            showFooter={false}
            size="md"
        >
            <div className="space-y-6">
                {/* Imagem e Info Principal */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {banda.imagemUrl && (
                        <div className="w-full md:w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--surface-hover)] border border-[var(--border)] shadow-sm">
                            <img
                                src={banda.imagemUrl}
                                alt={banda.nome}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-1 space-y-3">
                        {/* Gênero - Badge */}
                        {banda.genero && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-full">
                                <Music className="w-4 h-4 text-[var(--accent)]" />
                                <span className="text-sm font-medium text-[var(--accent)]">{banda.genero}</span>
                            </div>
                        )}

                        {/* Representante */}
                        {banda.representante && (
                            <div className="flex items-start gap-3 p-3 bg-[var(--surface-hover)] rounded-lg border border-[var(--border)]">
                                <User className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Representante</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{banda.representante.nome || "N/A"}</p>
                                    {banda.representante.email && (
                                        <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--text-secondary)]">
                                            <Mail className="w-3.5 h-3.5" />
                                            {banda.representante.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Total de Integrantes */}
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-5 h-5 text-[var(--accent)]" />
                            <span className="font-medium text-[var(--text-secondary)]">
                                {integrantes.length} <span className="text-[var(--text-muted)]">membro{integrantes.length !== 1 ? "s" : ""}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Descrição */}
                {banda.descricao && (
                    <div>
                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Descrição</p>
                        <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--surface-hover)] p-3 rounded-lg border border-[var(--border)]">{banda.descricao}</p>
                    </div>
                )}

                {/* Lista de Integrantes */}
                {integrantes.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">Membros da Banda</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {integrantes.map((int, index) => (
                                <div 
                                    key={int.id || int.nome} 
                                    className="p-3 bg-[var(--surface-card)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
                                >
                                    <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">{int.nome}</p>
                                            {int.cpf && <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">{int.cpf}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

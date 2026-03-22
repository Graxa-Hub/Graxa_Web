import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning',
    loading = false
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'error': return <XCircle className="w-10 h-10 text-[var(--accent)]" />;
            case 'success': return <CheckCircle className="w-10 h-10 text-[var(--success)]" />;
            case 'info': return <Info className="w-10 h-10 text-[var(--info)]" />;
            default: return <AlertTriangle className="w-10 h-10 text-[var(--warning)]" />;
        }
    };

    return (
        <div className="confirm-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-md surface-card p-6 text-center">
                <div className="mx-auto mb-3 w-fit">{getIcon()}</div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-5">{message}</p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-10 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 h-10 rounded-[var(--radius-sm)] border border-[var(--border-hover)] bg-[var(--surface-hover)] text-[var(--text-primary)] hover:bg-[#383838]"
                    >
                        {loading ? 'Processando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

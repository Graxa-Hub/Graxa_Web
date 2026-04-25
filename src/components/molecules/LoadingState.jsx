import React from 'react';
export const LoadingState = ({ message = 'Carregando...' }) => (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 border-2 border-[var(--border-hover)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--text-muted)] text-sm">{message}</p>
    </div>
);

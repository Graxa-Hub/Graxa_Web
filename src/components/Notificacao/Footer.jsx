export const Footer = ({ onViewAll }) => (
    <div className="p-3 border-t border-[var(--border)]">
        <button onClick={onViewAll} className="w-full text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium py-2 hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)] transition-colors">
            Ver todas as notificações
        </button>
    </div>
);

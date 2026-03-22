import { X } from "lucide-react";
export const Header = ({ onClose }) => (
    <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Notificações</h2>
        <button onClick={onClose} className="p-1 hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)] transition-colors">
            <X size={18} className="text-[var(--text-muted)]" />
        </button>
    </div>
);

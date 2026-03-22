import { X } from "lucide-react";
export const Header = ({ title, currentStep, totalSteps, onClose }) => (
    <div className="flex justify-between items-center p-5 border-b border-[var(--border)]">
        <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h2>
            {totalSteps > 1 && (
                <div className="flex gap-1.5">
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full transition-colors" style={{ background: i < currentStep ? 'var(--accent)' : i === currentStep - 1 ? 'var(--accent)' : 'var(--border-strong)' }} />
                    ))}
                </div>
            )}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X className="w-4 h-4" />
        </button>
    </div>
);

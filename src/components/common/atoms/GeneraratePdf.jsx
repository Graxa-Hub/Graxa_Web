import { FileDown } from "lucide-react";
export const GeneratePdf = ({ onClick, disabled, title, label }) => (
    <button onClick={onClick} disabled={disabled} title={title} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
        background: disabled ? 'var(--surface-hover)' : 'rgba(92,158,110,0.18)',
        border: '1px solid', borderColor: disabled ? 'var(--border)' : 'rgba(92,158,110,0.35)',
        borderRadius: 'var(--radius-sm)', color: disabled ? 'var(--text-muted)' : 'var(--success)',
        fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1, transition: 'filter 0.12s'
    }}>
        <FileDown size={15} />{label}
    </button>
);

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
export const Toast = ({ isOpen, onClose, type = 'info', title, message, duration = 5000 }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            if (duration > 0) { const t = setTimeout(() => handleClose(), duration); return () => clearTimeout(t); }
        }
    }, [isOpen, duration]);
    const handleClose = () => { setVisible(false); setTimeout(() => onClose?.(), 200); };
    if (!isOpen) return null;
    const icons = { success: <CheckCircle className="w-5 h-5 text-[var(--success)]" />, error: <XCircle className="w-5 h-5 text-[var(--accent)]" />, warning: <AlertTriangle className="w-5 h-5 text-[var(--warning)]" /> };
    return (
        <div className={`toast transition-all duration-200 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'}`}>
            <div className="toast__icon">{icons[type] || <Info className="w-5 h-5 text-[var(--info)]" />}</div>
            <div className="flex-1 min-w-0">
                {title && <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{title}</h4>}
                <p className="toast__message">{message}</p>
            </div>
            <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="w-4 h-4" /></button>
        </div>
    );
};

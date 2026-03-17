import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({
    isOpen,
    onClose,
    type = 'info',
    title,
    message,
    duration = 5000
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);

            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);

                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose && onClose();
        }, 300);
    };

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-[var(--success)]" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-[var(--accent)]" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-[var(--warning)]" />;
            case 'info':
            default:
                return <Info className="w-6 h-6 text-sky-600" />;
        }
    };

    return (
        <>
            <div
                className={`max-w-sm w-full transition-all duration-300 transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
            >
                <div className="border rounded-xl shadow-2xl p-4 bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--text-secondary)]">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon()}
                        </div>

                        <div className="flex-1 min-w-0">
                            {title && (
                                <h4 className="font-semibold text-sm mb-1 text-[var(--text-primary)]">
                                    {title}
                                </h4>
                            )}

                            <p className="text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-[var(--surface-muted)] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {duration > 0 && (
                        <div className="mt-3 bg-black/10 rounded-full h-1 overflow-hidden">
                            <div
                                className="h-full bg-current opacity-30 rounded-full transition-all ease-linear"
                                style={{
                                    animation: `toast-progress ${duration}ms linear forwards`
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes toast-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
            }} />
        </>
    );
};

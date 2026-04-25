import React from 'react';
export const StageCard = ({ step, title, description }) => (
    <div className="surface-card p-6 mb-4 max-w-md">
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-secondary)] font-semibold flex-shrink-0 border border-[var(--border)]">
                {step}
            </div>
            <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>
        </div>
    </div>
);

import React from 'react';
export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        {Icon && <Icon size={48} className="text-[var(--text-muted)]" />}
        {title && <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>}
        {description && <p className="text-[var(--text-muted)] max-w-md text-sm">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
    </div>
);

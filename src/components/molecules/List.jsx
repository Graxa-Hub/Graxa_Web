import React from 'react';
import { MoreVertical } from 'lucide-react';

export const List = ({ 
    title, 
    description, 
    image, 
    isSelected, 
    onClick, 
    onOptions,
    onToggleMenu,
    isMenuOpen,
    menuItems
}) => {
    // Se usar o novo padrão com menuItems
    if (menuItems !== undefined) {
        return (
            <div 
                onClick={() => !isMenuOpen && onClick?.()} 
                className={`flex items-center w-full gap-4 p-4 surface-card hover:border-[var(--border-hover)] transition-all duration-200 cursor-pointer relative ${isSelected ? 'border-[var(--accent)] border-2' : ''}`}
            >
                <div className="w-16 h-16 rounded-[var(--radius-sm)] overflow-hidden flex-shrink-0 bg-[var(--surface-hover)]">
                    {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[var(--border)]" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                        <h3 className="font-semibold text-[var(--text-primary)] truncate text-sm">{title}</h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{description}</p>
                </div>
                <div className="relative flex-shrink-0">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleMenu?.(); }} 
                        className="p-2 hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)]"
                    >
                        <MoreVertical className="w-5 h-5 text-[var(--text-muted)]" />
                    </button>
                    {isMenuOpen && menuItems}
                </div>
            </div>
        );
    }

    // Padrão antigo
    return (
        <div onClick={onClick} className={`flex items-center w-full gap-4 p-4 surface-card hover:border-[var(--border-hover)] transition-all duration-200 cursor-pointer ${isSelected ? 'border-[var(--accent)] border-2' : ''}`}>
            <div className="w-16 h-16 rounded-[var(--radius-sm)] overflow-hidden flex-shrink-0 bg-[var(--surface-hover)]">
                {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[var(--border)]" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                    <h3 className="font-semibold text-[var(--text-primary)] truncate text-sm">{title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{description}</p>
            </div>
            {onOptions && (
                <button onClick={e => { e.stopPropagation(); onOptions(e); }} className="p-2 hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)]">
                    <MoreVertical className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
            )}
        </div>
    );
};

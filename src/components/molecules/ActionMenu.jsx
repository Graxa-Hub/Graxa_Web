import React from "react";
export const ActionMenu = ({ actions = [], className = "" }) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className={`cursor-pointer absolute right-0 gap-1 surface-card flex flex-col justify-center items-center py-1 min-w-[180px] z-10 ${className}`}
  >
    {actions.map((action, i) => (
      <button
        key={i}
        onClick={action.onClick}
        className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
      >
        {action.icon && <action.icon size={14} />}
        {action.label}
      </button>
    ))}
  </div>
);

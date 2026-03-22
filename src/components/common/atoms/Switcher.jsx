import React from "react";
import { Sun } from "lucide-react";

export const Switcher = ({ activeView, onViewChange }) => {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--border)',
            width: 40, height: 192, borderRadius: 'var(--radius-lg)',
            padding: 4, position: 'relative', cursor: 'pointer', userSelect: 'none',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}>
            <div style={{
                position: 'absolute', width: 32, height: 88,
                background: 'var(--surface-elevated)', border: '1px solid var(--border-hover)',
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)',
                transition: 'transform 0.3s ease',
                transform: activeView === "weather" ? 'translateY(92px)' : 'translateY(0)'
            }} />
            <button onClick={() => onViewChange("progress")} style={{
                zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', background: 'transparent', border: 'none',
                color: activeView === "progress" ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'color 0.2s'
            }}>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>%</span>
            </button>
            <button onClick={() => onViewChange("weather")} style={{
                zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', background: 'transparent', border: 'none',
                color: activeView === "weather" ? 'var(--warning)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'color 0.2s'
            }}>
                <Sun size={20} strokeWidth={activeView === "weather" ? 2.5 : 2} />
            </button>
        </div>
    );
};

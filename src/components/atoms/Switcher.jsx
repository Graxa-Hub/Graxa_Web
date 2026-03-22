import React from "react";
import { Sun } from "lucide-react";

export const Switcher = ({ activeView, onViewChange }) => {
  return (
    <div className="flex flex-col items-center bg-[var(--surface)] border border-[var(--border)] w-10 h-48 rounded-[var(--radius-md)] p-1 relative shadow-[var(--shadow-soft)] cursor-pointer select-none">
      <div
        className={`absolute w-8 h-[88px] bg-[var(--surface-hover)] border border-[var(--border)] rounded-[var(--radius-sm)] transition-all duration-300 ease-in-out transform ${activeView === "weather" ? "translate-y-[92px]" : "translate-y-0"}`}
      />

      <button
        onClick={() => onViewChange("progress")}
        className={`z-10 flex-1 flex items-center justify-center w-full transition-colors duration-300 ${activeView === "progress" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}
      >
        <span className="text-xl font-bold font-mono">%</span>
      </button>

      <button
        onClick={() => onViewChange("weather")}
        className={`z-10 flex-1 flex items-center justify-center w-full transition-colors duration-300 ${activeView === "weather" ? "text-[var(--warning)]" : "text-[var(--text-muted)]"}`}
      >
        <Sun size={22} strokeWidth={activeView === "weather" ? 2.5 : 2} />
      </button>
    </div>
  );
};

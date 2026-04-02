import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <label
      className="nav-item w-full justify-between cursor-pointer"
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <span className="flex items-center gap-2">
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
        <span>Tema</span>
      </span>

      <input
        type="checkbox"
        className="sr-only"
        checked={isDark}
        onChange={toggleTheme}
        role="switch"
        aria-label="Alternar tema"
        aria-checked={isDark}
      />

      <span
        className={`relative inline-flex h-5 w-10 rounded-full border transition-colors ${
          isDark
            ? "bg-[var(--surface-elevated)] border-white"
            : "bg-[var(--surface-elevated)] border-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-transform ${
            isDark ? "bg-white translate-x-5" : "bg-gray-400 translate-x-0.5"
          }`}
        />
      </span>
    </label>
  );
};

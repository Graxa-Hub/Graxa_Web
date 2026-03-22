import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all flex items-center justify-center"
      title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-label="Alternar tema"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

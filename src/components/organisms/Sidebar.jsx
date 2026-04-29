import { useAuth } from "../../context/AuthContext";
import { SidebarHeader } from "../molecules/SidebarHeader";
import { NavigationList } from "../molecules/NavigationList";
import { FooterActions } from "../molecules/FooterActions";
import { ThemeToggle } from "../molecules/ThemeToggle";
import { X } from "lucide-react";

export const Sidebar = ({ onClose }) => {
    const { usuario } = useAuth();

    return (
        <aside className="sidebar-panel flex flex-col h-screen flex-shrink-0 relative">
            {onClose && (
                <button 
                    onClick={onClose}
                    className="lg:hidden absolute top-4 right-4 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
                >
                    <X size={20} />
                </button>
            )}
            <SidebarHeader usuario={usuario} />

            <nav className="flex flex-col flex-1 mt-4">
                <NavigationList />

                <div className="mt-auto">
                    <div className="pb-2">
                        <ThemeToggle />
                    </div>
                    <FooterActions />
                </div>
            </nav>
        </aside>
    );
};

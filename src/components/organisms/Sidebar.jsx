import { useAuth } from "../../context/AuthContext";
import { SidebarHeader } from "../molecules/SidebarHeader";
import { NavigationList } from "../molecules/NavigationList";
import { FooterActions } from "../molecules/FooterActions";

export const Sidebar = () => {
    const { usuario } = useAuth();

    return (
        <aside className="flex flex-col w-72 h-screen flex-shrink-0 p-4 z-10 border-r border-[var(--border)] bg-[var(--surface-elevated)] shadow-[2px_0_20px_0_rgba(35,33,30,0.08)]">
            <SidebarHeader usuario={usuario} />

            <nav className="flex flex-col flex-1 justify-between mt-4">
                <NavigationList />
                <FooterActions />
            </nav>
        </aside>
    );
};

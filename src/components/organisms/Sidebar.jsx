import { useAuth } from "../../context/AuthContext";
import { SidebarHeader } from "../molecules/SidebarHeader";
import { NavigationList } from "../molecules/NavigationList";
import { FooterActions } from "../molecules/FooterActions";
import { ThemeToggle } from "../molecules/ThemeToggle";

export const Sidebar = () => {
    const { usuario } = useAuth();

    return (
        <aside className="sidebar-panel flex flex-col h-screen flex-shrink-0">
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

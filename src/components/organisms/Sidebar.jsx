import { useAuth } from "../../context/AuthContext";
import { SidebarHeader } from "../molecules/SidebarHeader";
import { NavigationList } from "../molecules/NavigationList";
import { FooterActions } from "../molecules/FooterActions";

export const Sidebar = () => {
    const { usuario } = useAuth();

    return (
        <aside className="sidebar-panel flex flex-col h-screen flex-shrink-0">
            <SidebarHeader usuario={usuario} />

            <nav className="flex flex-col flex-1 justify-between mt-4">
                <NavigationList />
                <FooterActions />
            </nav>
        </aside>
    );
};

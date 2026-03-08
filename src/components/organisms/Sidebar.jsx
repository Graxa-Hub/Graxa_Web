import { useAuth } from "../../context/AuthContext";
import { SidebarHeader } from "../molecules/SidebarHeader";
import { NavigationList } from "../molecules/NavigationList";
import { FooterActions } from "../molecules/FooterActions";

export const Sidebar = () => {
    const { usuario, logout } = useAuth();

    return (
        <>
            <aside className="flex flex-col w-72 h-screen flex-shrink-0 shadow-[2px_0_20px_0_rgba(0,0,0,0.25)] p-4 bg-white z-10">
                <SidebarHeader usuario={usuario} />

                <nav className="flex flex-col flex-1 justify-between mt-4">
                    <NavigationList />
                    <FooterActions />
                </nav>
            </aside>
        </>
    );
};

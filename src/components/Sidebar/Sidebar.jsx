import { useAuth } from "../../context/AuthContext";
import { Header } from "./Header";
import { NavigationList } from "./NavigationList";
import { FooterActions } from "./FooterActions";

export const Sidebar = () => {
  const { usuario, logout } = useAuth();

  return (
    <>
      <aside className="flex flex-col w-65 h-screen shadow-[2px_0_20px_0_rgba(0,0,0,0.25)] p-4">
        <Header usuario={usuario} />

        <nav className="flex flex-col flex-1 justify-between mt-4">
          <NavigationList />
          <FooterActions />
        </nav>
      </aside>
    </>
  );
};

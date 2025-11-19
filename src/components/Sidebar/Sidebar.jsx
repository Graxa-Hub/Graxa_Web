import React from "react";
import {
  Calendar,
  ChartLine,
  HelpCircleIcon,
  Inbox,
  LogOut,
  Settings,
  MicVocal,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Header } from "./Header";
import { UpperButton } from "./UpperButton";

export const Sidebar = () => {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <aside className="flex flex-col w-65 h-screen shadow-[2px_0_20px_0_rgba(0,0,0,0.25)] p-4">
        {/* Cabeçalho */}
        <Header usuario={usuario} />

        {/* Botões Navbar */}
        {(() => {
          const mainNav = [
            { id: 1, to: "/calendario", label: "Calendário", icon: ChartLine },
            { id: 2, to: "/artista", label: "Artista", icon: MicVocal },
            { id: 3, to: "/agenda", label: "Agenda", icon: Calendar },
            { id: 4, to: "/turne", label: "Turne", icon: Inbox },
            {
              id: 5,
              to: "/adicionando-usuario",
              label: "Users",
              icon: Settings,
            },
          ];
          const footerNav = [
            {
              to: "/help",
              label: "Help",
              icon: HelpCircleIcon,
              hoverClass: "hover:bg-gray-100",
            },
            {
              to: "/logout",
              label: "Log Out",
              icon: LogOut,
              hoverClass: "hover:bg-red-100 hover:text-red-500",
            },
          ];

          return (
            // Englobar toda a nav button
            <nav className="flex flex-col flex-1 justify-between mt-4">
              {/* Os botões que ficam em cima */}
              <ul className="flex flex-col gap-2">
                {mainNav.map(({ id, to, label, icon: Icon }) => (
                  // Componetizei isso aqui
                  <UpperButton key={id} to={to} label={label} Icon={Icon} />
                ))}
              </ul>

              <ul className="flex flex-col">
                {/* Os botões que ficam em baixo */}
                {footerNav.map(({ to, label, icon: Icon, hoverClass }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `${
                          isActive ? "bg-blue-300/50 font-semibold    " : ""
                        } flex px-2 py-3 rounded gap-3 ${hoverClass}`
                      }
                    >
                      <Icon />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })()}
      </aside>
    </>
  );
};

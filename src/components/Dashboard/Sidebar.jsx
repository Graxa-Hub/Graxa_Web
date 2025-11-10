import React from "react";
import {
  Calendar,
  ChartLine,
  HelpCircleIcon,
  Inbox,
  LogOut,
  Settings,
  User,
  MicVocal,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
        <header className="flex gap-3 py-5 border-b border-neutral-300">
          {/* Foto de perfil */}
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-200 text-white">
            <User />
          </div>

          {/* Informações do usuário */}
          <div>
            {usuario ? (
              <>
                <h2 className="text-blue-700">{usuario.nome || "Usuário"}</h2>
                <p className="text-sm uppercase">
                  {usuario.tipoUsuario || "Usuário"}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-gray-500">Não logado</h2>
                <p className="text-sm text-gray-400">Faça seu login</p>
              </>
            )}
          </div>
        </header>

        {/* Botões Navbar */}
        {(() => {
          const mainNav = [
            { to: "/dashboard", label: "Calendário", icon: ChartLine },
            { to: "/artista", label: "Artista", icon: MicVocal },
            { to: "/schedule", label: "Agenda", icon: Calendar },
            { to: "/turne", label: "Turne", icon: Inbox },
            { to: "/adicionando-usuario", label: "Users", icon: Settings },
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
            <nav className="flex flex-col flex-1 justify-between mt-4">
              <ul className="flex flex-col gap-2">
                {mainNav.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `${
                          isActive ? "bg-blue-300/50 font-semibold    " : ""
                        } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
                      }
                    >
                      <Icon />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-col">
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

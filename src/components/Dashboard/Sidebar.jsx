import React, { useState } from "react";
import {
  Calendar,
  ChartLine,
  HelpCircleIcon,
  Inbox,
  LogOut,
  Settings,
  User,
  MicVocal,
  MapPin,
  Users
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = () => {
  const { usuario, logout } = useAuth();
  const [avancadoOpen, setAvancadoOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const mainNav = [
    { to: "/calendario", label: "Calendário", icon: ChartLine },
    { to: "/artista", label: "Artista", icon: MicVocal },
    { to: "/agenda", label: "Agenda", icon: Calendar },
    { to: "/turne", label: "Turne", icon: Inbox },
    { to: "/adicionando-usuario", label: "Users", icon: Settings },
    {
      label: "Avançado",
      icon: Settings,
      children: [
        { to: "/locais", label: "Locais", icon: MapPin },
        { to: "/representantes", label: "Representantes", icon: Users },
      ],
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

        <nav className="flex flex-col flex-1 justify-between mt-4">
          <ul className="flex flex-col gap-2">
            {mainNav.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <button
                    className={`flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30 w-full items-center`}
                    onClick={() => setAvancadoOpen((v) => !v)}
                    type="button"
                  >
                    <item.icon />
                    {item.label}
                    <span className="ml-auto">{avancadoOpen ? "▲" : "▼"}</span>
                  </button>
                  {avancadoOpen && (
                    <ul className="ml-6 flex flex-col gap-1 mt-1">
                      {item.children.map((sub) => (
                        <li key={sub.to}>
                          <NavLink
                            to={sub.to}
                            className={({ isActive }) =>
                              `${
                                isActive ? "bg-blue-300/50 font-semibold" : ""
                              } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30 items-center`
                            }
                          >
                            <sub.icon />
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${
                        isActive ? "bg-blue-300/50 font-semibold" : ""
                      } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30 items-center`
                    }
                  >
                    <item.icon />
                    {item.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          <ul className="flex flex-col">
            {footerNav.map(({ to, label, icon: Icon, hoverClass }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${
                      isActive ? "bg-blue-300/50 font-semibold" : ""
                    } flex px-2 py-3 rounded gap-3 ${hoverClass} items-center`
                  }
                >
                  <Icon />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

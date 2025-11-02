import React from "react";
import {
  Calendar,
  ChartLine,
  HelpCircleIcon,
  Inbox,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
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
            <h2 className="text-blue-700">Michelle Marcelino</h2>
            <p className="text-sm uppercase">Produtora</p>
          </div>
        </header>

        {/* Botões Navbar */}
        {(() => {
          const mainNav = [
            { to: "/dashboard", label: "Dashboard", icon: ChartLine },
            { to: "/orders", label: "MyOrders", icon: Inbox },
            { to: "/schedule", label: "Schedule", icon: Calendar },
            { to: "/turne", label: "Turne", icon: Calendar },
            { to: "/settings", label: "Settings", icon: Settings },
          ];
          const footerNav = [
            { to: "/help", label: "Help", icon: HelpCircleIcon, hoverClass: "hover:bg-gray-100" },
            { to: "/logout", label: "Log Out", icon: LogOut, hoverClass: "hover:bg-red-100 hover:text-red-500" },
          ];
          return (
            <nav className="flex flex-col flex-1 justify-between mt-4">
              <ul className="flex flex-col gap-2">
                {mainNav.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `${isActive ? "bg-blue-300/50 font-semibold    " : ""} flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
                      }
                    >
                      <Icon />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Botões no final da Navbar */}
              <ul className="flex flex-col">
                {footerNav.map(({ to, label, icon: Icon, hoverClass }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `${isActive ? "bg-blue-300/50 font-semibold    " : ""} flex px-2 py-3 rounded gap-3 ${hoverClass}`
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

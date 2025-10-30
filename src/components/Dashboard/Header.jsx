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

export const Header = () => {
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
        <nav className="flex flex-col flex-1 justify-between mt-4">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-blue-300/50 font-semibold    " : ""
                  } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
                }
              >
                <ChartLine />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-blue-300/50 font-semibold    " : ""
                  } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
                }
              >
                <Inbox />
                MyOrders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-blue-300/50 font-semibold    " : ""
                  } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
                }
              >
                <Calendar />
                Schedule
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-blue-300/50 font-semibold    " : ""
                  } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
                }
              >
                <Settings />
                Settings
              </NavLink>
            </li>
          </ul>

          {/* Botão no final da Navbar */}
          <ul className="flex flex-col">
            <li>
              <NavLink className="flex px-2 py-3 rounded gap-3 hover:bg-gray-100">
                <HelpCircleIcon />
                Help
              </NavLink>
            </li>
            <li>
              <NavLink className="flex px-2 py-4 rounded gap-3 hover:bg-red-100 hover:text-red-500">
                <LogOut />
                Log Out
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

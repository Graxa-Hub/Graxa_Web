import { NavLink } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";

const footerNav = [
  {
    to: "/configuracao",
    label: "Configurar User",
    icon: Settings,
    hoverClass: "hover:bg-gray-100",
  },
  {
    to: "/logout",
    label: "Log Out",
    icon: LogOut,
    hoverClass: "hover:bg-red-100 hover:text-red-500",
  },
];

const handleLogout = () => {
  logout();
  window.location.href = "/login";
};

export const FooterButton = () => {
  return (
    <ul className="flex flex-col">
      {/* Os botões que ficam em baixo */}
      {footerNav.map(({ to, label, icon: Icon, hoverClass }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-300/50 font-semibold" : ""
              } flex px-2 py-3 rounded gap-3 ${hoverClass}`
            }
          >
            <Icon />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

import { NavLink } from "react-router-dom";
import { Calendar, Spotlight, MicVocal, Users, Search } from "lucide-react";

const mainNav = [
  { id: 2, to: "/artista", label: "Bandas", icon: MicVocal },
  { id: 3, to: "/turne", label: "Turnes", icon: Spotlight },
  { id: 1, to: "/calendario", label: "Calendário", icon: Calendar }
];

export const UpperButton = () => {
  return (
    <ul className="flex flex-col gap-2">
      {mainNav.map(({ id, to, label, icon: Icon }) => (
        // Componetizei isso aqui
        <li key={id}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-300/50 font-semibold" : ""
              } flex px-2 py-3 rounded gap-3 hover:bg-blue-200/30`
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

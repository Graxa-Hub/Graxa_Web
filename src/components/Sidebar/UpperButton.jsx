import { NavLink } from "react-router-dom";

export const UpperButton = ({ to, label, Icon }) => {
  return (
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
  );
};

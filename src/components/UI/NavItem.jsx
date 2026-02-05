import { NavLink } from "react-router-dom";

export const NavItem = ({ to, label, icon: Icon, hoverClass = "hover:bg-blue-200/30" }) => {
    return (
        <li>
            <NavLink to={to}
                className={({ isActive }) =>
                    `${isActive ? "bg-blue-300/50 font-semibold" : ""
                    } flex px-2 py-3 rounded gap-3 ${hoverClass}`
                }
            >
                <Icon />
                {label}
            </NavLink>
        </li>
    )
}
import { NavLink } from "react-router-dom";
export const NavItem = ({ to, label, icon: Icon }) => (
    <li>
        <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}>
            <Icon size={16} /><span>{label}</span>
        </NavLink>
    </li>
);

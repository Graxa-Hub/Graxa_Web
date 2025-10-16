import React from "react";
import { NavLink } from "react-router-dom";
import { MdSpaceDashboard, MdStadium } from "react-icons/md";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";

export const Navbar = () => {
  return (
    <nav className="md:w-[6ch] w-full md:h-fit h-[8ch] py-4 rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-neutral-200/10 border-2 border-neutral-200/15">
      <ul className="list-none flex items-center md:flex-col flex-row gap-4">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-12 h-12 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all duration-300 ${
                isActive
                  ? "bg-neutral-300/30 text-white ring-2 ring-white/20"
                  : "hover:bg-neutral-300/20 text-neutral-100 hover:text-neutral-200"
              }`
            }
          >
            <MdSpaceDashboard />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/local"
            className={({ isActive }) =>
              `w-12 h-12 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all duration-300 ${
                isActive
                  ? "bg-neutral-300/30 text-white ring-2 ring-white/20"
                  : "hover:bg-neutral-300/20 text-neutral-100 hover:text-neutral-200"
              }`
            }
          >
            <FaCalendarAlt />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shows"
            className={({ isActive }) =>
              `w-12 h-12 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all duration-300 ${
                isActive
                  ? "bg-neutral-300/30 text-white ring-2 ring-white/20"
                  : "hover:bg-neutral-300/20 text-neutral-100 hover:text-neutral-200"
              }`
            }
          >
            <MdStadium />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/grupo"
            className={({ isActive }) =>
              `w-12 h-12 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all duration-300 ${
                isActive
                  ? "bg-neutral-300/30 text-white ring-2 ring-white/20"
                  : "hover:bg-neutral-300/20 text-neutral-100 hover:text-neutral-200"
              }`
            }
          >
            <FaUsers />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

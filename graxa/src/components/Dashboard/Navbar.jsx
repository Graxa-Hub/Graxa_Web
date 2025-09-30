import React from "react";
import { Link } from "react-router-dom";
import { MdSpaceDashboard, MdVideoCall } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

export const Navbar = () => {
  return (
    <nav className="md:w-[6ch] w-full md:h-fit h-[8ch] py-4 rounded-full flex flex-col items-center justify-center backdrop-blur-md bg-neutral-200/10 border-2 border-neutral-200/15">
      <ul className="list-none flex items-center md:flex-col flex-row gap-4">
        <li>
          <Link
            to=""
            className="w-12 h-12 rounded-full bg-neutral-300/20 flex items-center justify-center text-lg text-neutral-100 hover:text-neutral-200 hover:scale-110 transition-all duration-300"
          >
            <MdSpaceDashboard />
          </Link>
        </li>
        <li>
          <Link
            to=""
            className="w-12 h-12 rounded-full hover:bg-neutral-300/20 flex items-center justify-center text-lg text-neutral-100 hover:text-neutral-200 hover:scale-110 transition-all duration-300"
          >
            <FaCalendarAlt />
          </Link>
        </li>
        <li>
          <Link
            to=""
            className="w-12 h-12 rounded-full hover:bg-neutral-300/20 flex items-center justify-center text-lg text-neutral-100 hover:text-neutral-200 hover:scale-110 transition-all duration-300"
          >
            <IoMdSettings />
          </Link>
        </li>
        <li>
          <Link
            to=""
            className="w-12 h-12 rounded-full hover:bg-neutral-300/20 flex items-center justify-center text-lg text-neutral-100 hover:text-neutral-200 hover:scale-110 transition-all duration-300"
          >
            <MdVideoCall />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

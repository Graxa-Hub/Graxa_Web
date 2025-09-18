import {
  Orbit,
  User,
  User2,
  User2Icon,
  UserCheck2,
  UserRound,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const NavButton = () => {
  return (
    <div className="w-full h-15 flex justify-between items-center bg-gray-300 px-5">
      {/* Logo */}
      <div className="p-3 bg-white rounded-full rounded-br-lg">
        <Orbit></Orbit>
      </div>

      {/* NavButtons  */}
      <div className="px-6 py-2 bg-gray-500 rounded-full border border-white">
        <li className="flex flex-row justify-evenly items-center list-none gap-10 text-gray-100">
          <Link to={"#home"}>Home</Link>
          <Link>Sobre Nós</Link>
          <Link>Serviço</Link>
          <Link>Valores</Link>
          <Link>Contato</Link>
          <Link className="px-8 py-1 bg-orange-500 rounded-full">Demo</Link>
        </li>
      </div>

      {/* Login */}
      <Link to={"/login"} className="p-3 bg-white rounded-full">
        <UserRound className="" />
      </Link>
    </div>
  );
};

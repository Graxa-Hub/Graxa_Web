import React from "react";
import { Link } from "react-router-dom";
import {
  TbBell,
  TbBellBolt,
  TbDeviceAirpods,
  TbSearch,
  TbUser,
} from "react-icons/tb";

export const SecondaryNav = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b border-neutral-200/20 pb-2">
      {/* Logo Section */}
      <div className="text-xl text-neutral-50 flex items-center gap-x-2">
        <TbDeviceAirpods className="text-2xl" />
        <span className="text-2xl font-normal">Admin</span>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-neutral-950/20 p-1 flex items-center justify-center cursor-pointer ease-in-out duration-300 text-lg text-neutral-100">
          <TbSearch className="text-2xl" />
        </div>
      </div>

      <div className="flex items-center gap-x-5">
        {/* Notification Section */}
        <div className="w-10 h-10 rounded-full bg-neutral-950/20 p-1 flex items-center justify-center cursor-pointer ease-in-out duration-300 text-lg text-neutral-100">
          <TbBell className="text-2xl" />
        </div>
        {/* Profile Section */}
        <div className="w-10 h-10 rounded-full bg-neutral-950/20 p-1 flex items-center justify-center cursor-pointer ease-in-out duration-300 text-lg text-neutral-100">
          <TbUser className="text-2xl" />
        </div>
      </div>
    </nav>
  );
};

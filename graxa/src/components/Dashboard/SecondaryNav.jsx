import React from "react";
import { Link } from "react-router-dom";
import { TbBell, TbBellBolt, TbDeviceAirpods, TbUser } from "react-icons/tb";

export const SecondaryNav = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b border-neutral-200/20 pb-2">
      {/* Logo Section */}
      <Link
        to="/"
        className="text-xl text-neutral-50 flex items-center gap-x-2"
      >
        <TbDeviceAirpods />
        <span className="text-lg font-normal">Admin</span>
      </Link>

      <div className="flex items-center gap-x-5">
        {/* Notification Section */}
        <div className="w-8 h-8 rounded-full bg-neutral-950/20 p-1 flex items-center justify-center cursor-pointer ease-in-out duration-300 text-lg text-neutral-100">
          <TbBell className="text-xl" />
        </div>
        {/* Profile Section */}
        <div className="w-8 h-8 rounded-full bg-neutral-950/20 p-1 flex items-center justify-center cursor-pointer ease-in-out duration-300 text-lg text-neutral-100">
          <TbUser className="text-xl" />
        </div>
      </div>
    </nav>
  );
};

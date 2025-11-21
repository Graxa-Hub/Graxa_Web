import { Bell } from "lucide-react";
import React from "react";

export const IconeNotificao = ({ handleOpen, unreadCount }) => {
  return (
    <div className="relative">
      <div
        onClick={handleOpen}
        className="flex items-center justify-center p-2 bg-white rounded-full cursor-pointer hover:bg-neutral-200 hover:scale-110 transition-all"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

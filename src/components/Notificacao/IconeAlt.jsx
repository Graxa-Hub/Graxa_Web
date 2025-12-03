import React from "react";
import { Bell } from "lucide-react";

export const IconeNotificao = ({ 
  handleOpen, 
  unreadCount = 0, 
  loading = false
}) => {
  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          unreadCount > 0
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        title={`${unreadCount} notificação${unreadCount !== 1 ? 'ões' : ''} não lida${unreadCount !== 1 ? 's' : ''}`}
      >
        <Bell className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
        
        {/* ✅ Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* ✅ Loading spinner sobreposto */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

import React from "react";
import { Bell } from "lucide-react";

export const IconeNotificao = ({
  handleOpen,
  unreadCount = 0,
  loading = false,
}) => {
  return (
    <div className="relative flex items-center">
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-[var(--radius-md)] flex items-center justify-center ${
          unreadCount > 0
            ? "text-[var(--info)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        }`}
        title={`${unreadCount} notificação${
          unreadCount !== 1 ? "ões" : ""
        } não lida${unreadCount !== 1 ? "s" : ""}`}
      >
        <Bell className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} />

        {/* ✅ Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] border border-[var(--btn-danger-border)] text-xs font-medium rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
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

import React from "react";

export const Layout = ({
  children,
  padding = "",
  columns = 2,
  className = "",
}) => {
  const colsClass = columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";
  const maxWidthClass = columns === 1 ? "max-w-xl" : "max-w-4xl";

  return (
    <div className={`w-full min-h-screen ${padding} flex justify-center items-center px-4 bg-[var(--bg)]`}>
      <div className={`w-full ${maxWidthClass} grid ${colsClass} auth-panel overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
};

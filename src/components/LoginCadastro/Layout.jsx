import React from "react";

export const Layout = ({
  children,
  padding = "",
  columns = 2,
  className = "",
}) => {
  const colsClass =
    columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";
  const maxWidthClass = columns === 1 ? "max-w-xl" : "max-w-4xl";

  return (
    <div
      className={`w-full min-h-screen ${padding} flex justify-center items-center px-4 bg-[radial-gradient(circle_at_top_right,#f0e8de_0%,#ddd3c8_50%,#cfc3b6_100%)]`}
    >
      <div
        className={`w-full ${maxWidthClass} grid ${colsClass} auth-panel overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

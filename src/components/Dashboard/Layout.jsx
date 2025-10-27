import React from "react";

export const Layout = ({ children, className }) => {
  return (
    <div
      className={`relative flex-1 backdrop-blue bg-neutral-200/15 rounded-xl border-2 border-neutral-200/25 p-4 ${className}`}
    >
      {children}
    </div>
  );
};

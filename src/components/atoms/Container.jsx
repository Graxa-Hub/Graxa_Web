import React from "react";

export const Container = ({ children, className = "overflow-auto" }) => {
  return (
    <div className={`flex-1 w-full flex flex-col ${className}`}>{children}</div>
  );
};

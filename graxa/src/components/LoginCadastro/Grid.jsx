import React from "react";

export const Grid = ({ children, backgroundColor, borderRadius }) => {
  return (
    <div
      className={`w-full h-full grid-background ${backgroundColor} ${borderRadius}`}
    >
      {children}
    </div>
  );
};

import React from "react";

export const LoginGrid = ({ children, backgroundColor }) => {
  return (
    <div
      className="w-full h-full grid-background rounded-tl-lg rounded-bl-lg"
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      {children}
    </div>
  );
};

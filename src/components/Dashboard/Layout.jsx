import { User } from "lucide-react";
import React from "react";

export const Layout = ({ children }) => {
  return (
    <div className="max-h-screen min-h-screen overflow-hidden flex ">
      {children}
    </div>
  );
};

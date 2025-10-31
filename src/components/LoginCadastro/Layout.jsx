import React from "react";

export const Layout = ({ children, padding = "" }) => {
  return (
    <div
      className={`w-full min-h-screen ${padding} flex justify-center items-center bg-gradient-to-b from-gray-800 to-gray-600 `}
    >
      {/* parent holds the rounded corners so inner panels don't need per-corner classes */}
      <div className="w-full max-w-4xl mx-4 sm:mx-20 grid grid-cols-1 sm:grid-cols-2 shadow-md rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

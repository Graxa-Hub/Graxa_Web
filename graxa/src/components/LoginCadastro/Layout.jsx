import React from "react";

export const Layout = ({ children, backgroundImage, padding = "" }) => {
  return (
    <div
      className={`w-full min-h-screen ${padding} flex justify-center items-center bg-gray-600 bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="w-full mx-20 grid grid-cols-2 shadow-md">
        {/*  */}
        {children}
      </div>
    </div>
  );
};

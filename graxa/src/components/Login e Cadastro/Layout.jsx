import React from "react";

export const Layout = ({ children, backgroundImage }) => {
  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-gray-600 bg-cover bg-center bg-no-repeat"
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

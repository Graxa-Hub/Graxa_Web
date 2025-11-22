import React from "react";

export const ModalBox = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="bg-white rounded-md px-8 py-6 shadow-lg w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
};

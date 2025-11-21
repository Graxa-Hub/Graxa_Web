import React from "react";

export const ModalBox = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-full w-full bg-green-100">
      <div className="bg-white rounded-sm px-5 py-3 shadow-lg">{children}</div>
    </div>
  );
};

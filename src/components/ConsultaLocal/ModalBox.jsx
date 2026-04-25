import React from "react";

export const ModalBox = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-full w-full p-4">
      <div className="modal-panel w-full max-w-2xl px-8 py-6">
        {children}
      </div>
    </div>
  );
};

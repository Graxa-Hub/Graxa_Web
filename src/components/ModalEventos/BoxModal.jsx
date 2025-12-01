import React from "react";

export const BoxModal = ({ children }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl min-h-80 h-fit relative overflow-x-hidden min-w-100 w-fit max-w-200">
        {children}
      </div>
    </div>
  );
};

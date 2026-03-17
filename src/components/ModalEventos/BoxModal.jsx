import React from "react";

export const BoxModal = ({ children, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="modal-panel overflow-x-hidden w-fit min-w-[420px] max-w-[800px]">
        {children}
      </div>
    </div>
  );
};

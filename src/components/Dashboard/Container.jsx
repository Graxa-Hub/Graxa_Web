import React from "react";

export const Container = ({ children }) => {
  return (
    <div className="flex-1 w-full rounded-lg overflow-auto min-h-0 ">
      <div className="flex h-full justify-between cols cols-2 sm:cols-1 gap-3">
        {children}
      </div>
    </div>
  );
};

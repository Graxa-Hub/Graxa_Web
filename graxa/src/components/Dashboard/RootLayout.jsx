import React from "react";

export const RootLayout = ({ children }) => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden lg:p-10 md:p-7 sm:p-3 p-2">
      {children}
    </main>
  );
};

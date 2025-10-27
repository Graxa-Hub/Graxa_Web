import React from "react";

export const RootLayout = ({ children }) => {
  return (
    <main className="w-full max-h-screen h-screen flex flex-col items-center justify-center relative overflow-hidden lg:p-10 md:p-7 p-3">
      {children}
    </main>
  );
};

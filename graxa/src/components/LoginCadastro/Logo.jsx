import React from "react";

export const Logo = ({ textColor }) => {
  return (
    <p
      className={`w-full text-end font-bold text-orange-500 text-xl text-${textColor}`}
    >
      Graxa
    </p>
  );
};

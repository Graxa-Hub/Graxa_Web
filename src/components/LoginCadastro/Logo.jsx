import React from "react";

const COLOR_CLASS = {
  white: "text-white",
  black: "text-black",
  orange: "text-orange-500",
  purple: "text-purple-950",
};

export const Logo = ({ textColor }) => {
  const colorClass = COLOR_CLASS[textColor] ?? COLOR_CLASS.black;

  return (
    <p className={`w-full text-end font-bold text-xl ${colorClass}`}>Graxa</p>
  );
};
